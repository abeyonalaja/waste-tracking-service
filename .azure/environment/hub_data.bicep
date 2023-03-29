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
