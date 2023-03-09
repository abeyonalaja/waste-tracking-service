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

@description('Reference to existing subnet for Private Endpoints.')
param subnet object = {
  id: null
}

@description('References to existing Private DNS Zones.')
param privateDnsZones object = {
  'privatelink.azurecr.io': { id: null }
  'privatelink.monitor.azure.com': { id: null }
  'privatelink.oms.opinsights.azure.com': { id: null }
  'privatelink.ods.opinsights.azure.com': { id: null }
  'privatelink.agentsvc.azure-automation.net': { id: null }
  #disable-next-line no-hardcoded-env-urls
  'privatelink.blob.core.windows.net': { id: null }
}

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var containerRegistryName = join(
  [ env, svc, role, 'CR', 2, padLeft(instance0, 3, '0') ], ''
)

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' = {
  name: containerRegistryName
  location: primaryRegion

  sku: {
    name: 'Premium'
  }

  tags: union(defaultTags, { Name: containerRegistryName })
}

var logAnalyticsWorkspaceName = join(
  [ env, svc, role, 'LA', envNum, padLeft(instance0, 3, '0') ], ''
)

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: primaryRegion

  tags: union(defaultTags, { Name: logAnalyticsWorkspaceName })
}

var containerRegistryEndpointName = join(
  [ env, svc, 'ACR', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource containerRegistryEndpont 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: containerRegistryEndpointName
  location: primaryRegion

  properties: {
    subnet: {
      id: subnet.id
    }

    privateLinkServiceConnections: [
      {
        name: containerRegistry.name
        properties: {
          privateLinkServiceId: containerRegistry.id
          groupIds: [ 'registry' ]
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: containerRegistryEndpointName })

  resource dnsZoneGroup 'privateDnsZoneGroups' = {
    name: containerRegistry.name

    properties: {
      privateDnsZoneConfigs: [
        {
          name: 'privatelink.azurecr.io'
          properties: {
            privateDnsZoneId: privateDnsZones['privatelink.azurecr.io'].id
          }
        }
      ]
    }
  }
}

var monitorPrivateLinkScopeName = join(
  [ env, svc, role, 'LS', envNum, padLeft(instance0, 3, '0') ], ''
)

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

  resource logAnalyticsResource 'scopedResources' = {
    name: logAnalyticsWorkspace.name
    properties: {
      linkedResourceId: logAnalyticsWorkspace.id
    }
  }
}

var amplsEndpointName = join(
  [ env, svc, 'PLS', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource amplsEndpoint 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: amplsEndpointName
  location: primaryRegion

  dependsOn: [
    containerRegistryEndpont
  ]

  properties: {
    subnet: {
      id: subnet.id
    }

    privateLinkServiceConnections: [
      {
        name: monitorPrivateLinkScope.name
        properties: {
          privateLinkServiceId: monitorPrivateLinkScope.id
          groupIds: [ 'azuremonitor' ]
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: amplsEndpointName })

  resource dnsZoneGroup 'privateDnsZoneGroups' = {
    name: monitorPrivateLinkScope.name

    properties: {
      privateDnsZoneConfigs: [
        {
          name: 'privatelink.monitor.azure.com'
          properties: {
            privateDnsZoneId: privateDnsZones['privatelink.monitor.azure.com'].id
          }
        }
        {
          name: 'privatelink.oms.opinsights.azure.com'
          properties: {
            privateDnsZoneId: privateDnsZones['privatelink.oms.opinsights.azure.com'].id
          }
        }
        {
          name: 'privatelink.ods.opinsights.azure.com'
          properties: {
            privateDnsZoneId: privateDnsZones['privatelink.ods.opinsights.azure.com'].id
          }
        }
        {
          name: 'privatelink.agentsvc.azure-automation.net'
          properties: {
            privateDnsZoneId: privateDnsZones['privatelink.agentsvc.azure-automation.net'].id
          }
        }
        {
          #disable-next-line no-hardcoded-env-urls
          name: 'privatelink.blob.core.windows.net'
          properties: {
            #disable-next-line no-hardcoded-env-urls
            privateDnsZoneId: privateDnsZones['privatelink.blob.core.windows.net'].id
          }
        }
      ]
    }
  }
}
