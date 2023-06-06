@description('Reference to hub Azure Container Registry.')
param containerRegistry object = {
  name: null
}

@description('Reference to existing user-assigned managed identites.')
param identities object = {
  kubelet: {
    id: null
    principalId: null
  }
}

resource existingContainerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' existing = {
  name: containerRegistry.name
}

var acrPullRoleId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'
resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(
    existingContainerRegistry.id,
    identities.kubelet.id,
    resourceId('Microsoft.Authorization/roleDefinitions', acrPullRoleId)
  )
  scope: existingContainerRegistry
  properties: {
    principalId: identities.kubelet.principalId
    roleDefinitionId: resourceId(
      'Microsoft.Authorization/roleDefinitions', acrPullRoleId
    )
    principalType: 'ServicePrincipal'
  }
}
