@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('CSC environment code.')
param env string = 'SND'

@minLength(3)
@maxLength(3)
@description('CSC service code.')
param svc string = 'WTS'

@minValue(1)
@maxValue(9)
@description('CSC environment number.')
param envNum int = 1

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'
var acrTaskrole = 'CRT'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var containerRegistryName = join(
  [ env, svc, role, 'CR', envNum, padLeft(instance0, 3, '0') ], ''
)

var containerRegistryTaskManagedIdentityName = join(
  [ env, svc, acrTaskrole, 'MI', envNum, padLeft(instance0, 3, '0') ],
  ''
)

resource containerRegistryTaskManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: containerRegistryTaskManagedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: containerRegistryTaskManagedIdentityName })
}

var readerRoleId = 'acdd72a7-3385-48ef-bd42-f606fba81ae7'
resource readerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistryTaskManagedIdentity.id, containerRegistryTaskManagedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', readerRoleId))
  scope: containerRegistryTaskManagedIdentity
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', readerRoleId)
    principalId: containerRegistryTaskManagedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

var acrImportCustomRoleId = 'aef04f37-f320-49fe-8cbc-174729411900'
/* Execute once
resource acrImportCustomRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' = {
  name: guid(acrImportCustomRoleId)
  properties: {
    assignableScopes: [
      subscription().id
    ]
    description: 'Can import images to registry'
    permissions: [
      {
        actions: [
          'Microsoft.ContainerRegistry/registries/push/write'
          'Microsoft.ContainerRegistry/registries/pull/read'
          'Microsoft.ContainerRegistry/registries/read'
          'Microsoft.ContainerRegistry/registries/importImage/action'
        ]
      }
    ]
    roleName: 'DEFRA Custom Role - AcrImport'
    type: 'CustomRole'
  }
}
*/

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' existing = {
  name: containerRegistryName
}

resource acrImportCustomRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistry.id, containerRegistryTaskManagedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', acrImportCustomRoleId))
  scope: containerRegistry
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', acrImportCustomRoleId)
    principalId: containerRegistryTaskManagedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

@description('References to created Images Import ACR task identity.')
output identities object = {
  acrTask: {
    id: containerRegistryTaskManagedIdentity.id
    principalId: containerRegistryTaskManagedIdentity.properties.principalId
  }
}
