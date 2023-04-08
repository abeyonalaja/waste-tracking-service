@description('''
  Reference to Log Analytics Workspace to associate with externally defined
  Azure Monitor Private Link Scope.
''')
param logAnalyticsWorkspace object = {
  id: null
  name: null
}

@description('''
  Reference to existing Application Insights instance to associate with
  externally defined Azure Monitor Private Link Scope.
''')
param applicationInsights object = {
  id: null
  name: null
}

@description('Reference to existing Azure Monitor Private Link Scope.')
param monitorPrivateLinkScope object = {
  name: null
}

@description('Reference to hub Azure Container Registry.')
param acr object = {
  name: null
}

@description('Reference to existing user-assigned managed identites.')
param identities object = {
  kubelet: {
    id: null
    principalId: null
  }
}

resource existingAmpls 'microsoft.insights/privateLinkScopes@2021-07-01-preview' existing = {
  name: monitorPrivateLinkScope.name

  resource logAnalyticsScopedResource 'scopedResources' = {
    name: logAnalyticsWorkspace.name
    properties: {
      linkedResourceId: logAnalyticsWorkspace.id
    }
  }

  resource applicationInsightsScopedResource 'scopedResources' = {
    name: applicationInsights.name
    properties: {
      linkedResourceId: applicationInsights.id
    }
  }
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' existing = {
  name: acr.Name
}

var acrPullRoleId = '7f951dda-4ed3-4680-a7ca-43fe172d538d'
resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(containerRegistry.id, identities.kubelet.id, resourceId('Microsoft.Authorization/roleDefinitions', acrPullRoleId))
  scope: containerRegistry
  properties: {
    principalId: identities.kubelet.principalId
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', acrPullRoleId)
    principalType: 'ServicePrincipal'
  }
}
