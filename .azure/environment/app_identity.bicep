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

@description('Reference to existing application resources.')
param applicationResources object = {
  aks: {
    issuer: null
  }
  keyVault: { 
    name: null
  }
}

@description('Reference to existing address microservice service account namespace.')
param addressServiceAccountNamespace string = 'address'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var addressRole = 'ADR'

var addressServiceAccountName = 'address'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var addressManagedIdentityName = join(
  [ env, svc, addressRole, 'MI', envNum, padLeft(instance0, 3, '0') ],
  ''
)

var addressManagedIdentityFederatedCredentialName = join(
  [
    addressManagedIdentityName
    join([ env, svc, addressRole, 'FI', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)

var addressManagedIdentityFederatedCredentialSubjectName = join(
  [ 'system', 'serviceaccount', addressServiceAccountNamespace, addressServiceAccountName ],
  ':'
)

resource addressManagedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: addressManagedIdentityName
  location: primaryRegion

  tags: union(defaultTags, { Name: addressManagedIdentityName })
}

resource addressManagedIdentityFederatedCredential 'Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials@2023-01-31' = {
  name: addressManagedIdentityFederatedCredentialName
  parent: addressManagedIdentity
  properties: {
    audiences: [
      'api://AzureADTokenExchange'
    ]
    issuer: applicationResources.aks.issuer
    subject: addressManagedIdentityFederatedCredentialSubjectName
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-11-01' existing = {
  name: applicationResources.keyVault.name
}

var readerRoleId = 'acdd72a7-3385-48ef-bd42-f606fba81ae7'
resource readerRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, addressManagedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', readerRoleId))
  scope: keyVault
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', readerRoleId)
    principalId: addressManagedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

var keyVaultSecretsUserRoleId = '4633458b-17de-408a-b874-0445c86b69e6'
resource keyVaultSecretsUserRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, addressManagedIdentity.id, resourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId))
  scope: keyVault
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleId)
    principalId: addressManagedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}
