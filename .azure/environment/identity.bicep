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

var role = 'AKS'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var managedIdentityName = join(
  [ env, svc, role, 'MI', envNum, padLeft(instance0, 3, '0') ],
  ''
) 

var kubeletManagedIdentityName = join(
  [ env, svc, 'KUB', 'MI', envNum, padLeft(instance0, 3, '0') ],
  ''
)

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: managedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: managedIdentityName })
}

var networkContributorRoleId = '4d97b98b-1d4f-4787-a291-c67834d212e7'
resource networkContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(resourceGroup().id, managedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', networkContributorRoleId))
  scope: resourceGroup()
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', networkContributorRoleId)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource kubeletManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: kubeletManagedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: kubeletManagedIdentityName })
}

var miOperatorRoleId = 'f1a07417-d97a-45cb-824c-7a7467783830'
resource miOperatorRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(kubeletManagedIdentity.id, managedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', miOperatorRoleId))
  scope: kubeletManagedIdentity
  properties: {
    principalId: managedIdentity.properties.principalId
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', miOperatorRoleId)
    principalType: 'ServicePrincipal'
  }
}

@description('References to created Cluster-releated managed identities.')
output identities object = {
  aks: {
    id: managedIdentity.id
    principalId: managedIdentity.properties.principalId
  }
  kubelet: {
    id: kubeletManagedIdentity.id
    principalId: kubeletManagedIdentity.properties.principalId
  }
}
