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

var role = 'ENV'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var logAnalyticsWorkspaceName = join(
  [ env, svc, role, 'LA', envNum, padLeft(instance0, 3, '0') ], ''
)

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: primaryRegion

  tags: union(defaultTags, { Name: logAnalyticsWorkspaceName })
}

var applicationInsightsName = join(
  [ env, svc, role, 'AI', envNum, padLeft(instance0, 3, '0') ], ''
)

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: applicationInsightsName
  location: primaryRegion

  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }

  tags: union(defaultTags, { Name: applicationInsightsName })
}

@description('Reference to created Log Analytics Worspace resource.')
output logAnalyticsWorkspace object = {
  id: logAnalyticsWorkspace.id
  name: logAnalyticsWorkspace.name
}

@description('Reference to created Application Insights resource.')
output applicationInsights object = {
  id: applicationInsights.id
  name: applicationInsights.name
}
