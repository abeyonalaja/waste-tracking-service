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

@description('''
  2023-03-07 Bicep doesn't support Azure AD Group creation
  https://github.com/Azure/bicep/issues/7724
  Pre-created Cluster Admin AAD Group Object Id.
''')
param clusterAdminGroupObjectId string

var role = 'SPK'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var aksName = join([ env, svc, role, 'KS', envNum, padLeft(instance0, 3, '0') ], '')

var managedIdentityName = join(
  [ 
    aksName
    join([ env, svc, role, 'MI', envNum, padLeft(instance0, 3, '0') ], '') 
  ], 
  '-'
)

var kubeletManagedIdentityName = join(
  [ 
    aksName
    join([ env, svc, role, 'KU', envNum, padLeft(instance0, 3, '0') ], '') 
  ], 
  '-'
)

// Network Contributor
var networkContributorRoleId = '4d97b98b-1d4f-4787-a291-c67834d212e7'

// Private DNS Zone Contributor
var dnsZoneContributorRoleId = 'b12aa53e-6015-4669-85d0-8515ebb3ae7f'

// Managed Identity Operator
var miOperatorRoleId = 'f1a07417-d97a-45cb-824c-7a7467783830'

// AcrPull
var acrPullRoleId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: managedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: managedIdentityName })
}

// For Vnet, attached Azure disk, static IP address, 
// route table which are outside the default worker node resource group, 
// you need to assign the Network Contributor role on custom resource group.
// Contributor role for Node resource group is automatically assigned
resource networkContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: networkContributorRoleId
}

resource networkContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: networkContributorRoleId
  scope: resourceGroup()
  properties: {
    roleDefinitionId: networkContributorRoleDefinition.id
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

var privateDnsZoneName = 'privatelink.uksouth.azmk8s.io'

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: privateDnsZoneName
}

resource dnsZoneContributorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: dnsZoneContributorRoleId
}

resource dnsZoneContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: dnsZoneContributorRoleId
  scope: privateDnsZone
  properties: {
    roleDefinitionId: dnsZoneContributorRoleDefinition.id
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// For user-assigned kubelet identity which is outside the default worker node resource group, 
// you need to assign the Managed Identity Operator on kubelet identity.
resource miOperatorRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: miOperatorRoleId
}

resource miOperatorRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: miOperatorRoleId
  scope: kubeletManagedIdentity
  properties: {
    principalId: managedIdentity.properties.principalId
    roleDefinitionId: miOperatorRoleDefinition.id
    principalType: 'ServicePrincipal'
  }
}

resource kubeletManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: kubeletManagedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: kubeletManagedIdentityName })
}

var containerRegistryName = join(
  [ env, svc, 'HUB', 'CR', envNum, padLeft(instance0, 3, '0') ], ''
)

resource acr 'Microsoft.ContainerRegistry/registries@2022-12-01' existing = {
  name: containerRegistryName
}

resource acrPullRoleDefinition 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: resourceGroup()
  name: acrPullRoleId
}

resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: acrPullRoleId
  scope: acr
  properties: {
    principalId: kubeletManagedIdentity.properties.principalId
    roleDefinitionId: acrPullRoleDefinition.id
    principalType: 'ServicePrincipal'
  }
}

@description('References to created Cluster-releated managed identities.')
output identities object = {
  aks: {
    id: managedIdentity.id
  }
  kubelet: {
    id: kubeletManagedIdentity.id
  }
}

@description('References to created Cluster Admin AAD Group.')
output clusterAdminGroupObjectIds array = [
  clusterAdminGroupObjectId
]
