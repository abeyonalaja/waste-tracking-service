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

@description('Log Analytics workspace ID to associate with your Application Insights resource.')
param workspaceResourceId string = '/subscriptions/55e605bf-a6d4-430c-8996-328a4bcf665d/resourcegroups/SNDWTSAKSRG1401/providers/microsoft.operationalinsights/workspaces/SNDWTSHUBLA1401'

var role = 'AIN'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var appInsightsName = join(
  [ env, svc, role, 'WEB', envNum, padLeft(instance0, 3, '0') ], ''
)

var monitorPrivateLinkScopeName = join(
  [ env, svc, 'HUB', 'LS', envNum, padLeft(instance0, 3, '0') ], ''
)

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  
  name: appInsightsName
  
  location: primaryRegion

  kind: 'web'

  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: workspaceResourceId
    publicNetworkAccessForIngestion: 'Disabled'
    publicNetworkAccessForQuery: 'Disabled'
  }

  tags: union(defaultTags, { Name: appInsightsName })

}

resource monitorPrivateLinkScope 'microsoft.insights/privateLinkScopes@2021-07-01-preview' = {
  name: monitorPrivateLinkScopeName
  location: 'global'

  properties: {
    accessModeSettings: {
      ingestionAccessMode: 'PrivateOnly'
      queryAccessMode: 'Open'
    }
  }

  tags: union(
    defaultTags,
    { 
      Name: monitorPrivateLinkScopeName
      Location: 'global'
    }
  )

  resource appInsightsResource 'scopedResources' = {
    name: appInsights.name
    properties: {
      linkedResourceId: appInsights.id
    }
  }
}
