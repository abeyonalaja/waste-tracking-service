@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('''
  The environment that we are deploying into, according to the naming and
  standard, for example _SND_, _DEV_, _TST_ or _PRD_.
''')
param environment string = 'SND'

@minLength(3)
@maxLength(3)
@description('''
  Code that uniquely identifies the service, application or product that is
  assigned by the CSC WebOps team. The Waste Tracking Service is allocated
  _WTS_.
''')
param serviceCode string = 'WTS'

@minValue(1)
@maxValue(9)
@description('''
  The CSC resource naming convention defines an _environment number_ that is
  built into all resource names. This is to provide separate namespaces for
  example to distinct deployments of a development environment.

  Most of the time this value will be _1_.
''')
param environmentNumber int = 1

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('''
  CIDR prefixes for the created virtual network and its subnet. See the default
  parameters file for an example. Subnets are:
  - _aks_ - Recommended _/25_ prefix.
  - _data_ - Recommend _/26_ prefix.
''')
param addressSpace object = {
  virtualNetwork: null
  subnets: {
    aks: null
    data: null
  }
}

@description('''
  Reference to a Resource Group that contains all Private DNS Zones.
  
  This module assumes that this Resource Group contains at least the following
  Private DNS Zones:
   - privatelink.azurecr.io
   - privatelink.monitor.azure.com
   - privatelink.oms.opinsights.azure.com
   - privatelink.ods.opinsights.azure.com
   - privatelink.agentsvc.azure-automation.net
   - privatelink.applicationinsights.azure.com
   - privatelink.primaryRegion.azmk8s.io
   - privatelink.vaultcore.azure.net
   - privatelink.servicebus.windows.net
   - privatelink.documents.azure.com
''')
param privateDnsResourceGroup object = {
  name: null
  subscriptionId: null
}

@description('Reference to existing Azure Monitor Private Link Scope.')
param monitorPrivateLinkScope object = {
  name: null
  resourceGroupName: null
  subscriptionId: null
}

@description('Reference to hub Virtual Network for peering.')
param hubVirtualNetwork object = {
  id: null
  name: null
  resourceGroupName: null
  subscriptionId: null
}

@description('Reference to hub Azure Container Registry.')
param acr object = {
  name: null
  resourceGroupName: null
  subscriptionId: null
}

@description('''
  Pre-created Cluster Admin AAD Group Object Id(s).
''')
param clusterAdminGroupObjectIds array = []

@description('''
  The CSC tagging policy requires all resources to be tagged with a created
  date. A default value is provided but a value will have to be supplied in
  order to have idempotent deployments.
''')
param createdDate string = utcNow('yyyyMMdd')

module tags '../util/tags.bicep' = {
  name: 'env-tags'
  params: {
    environment: environment
    serviceCode: serviceCode
    createdDate: createdDate
    location: primaryRegion
  }
}

module network './network.bicep' = {
  name: 'env-network'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    addressSpace: addressSpace
    remoteVirtualNetworks: [
      {
        id: hubVirtualNetwork.id
        name: hubVirtualNetwork.name
      }
    ]
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module monitor './monitor.bicep' = {
  name: 'env-monitor'

  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'DATA' })
  }
}

module identity './identity.bicep' = {
  name: 'env-identity'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'IDENTITY' })
  }
}

module aks './aks.bicep' = {
  name: 'env-aks'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    subnets: network.outputs.subnets
    privateDnsResourceGroup: privateDnsResourceGroup
    clusterAdminGroupObjectIds: clusterAdminGroupObjectIds
    identities: {
      aks: {
        id: identity.outputs.identities.aks.id
      }
      kubelet: {
        id: identity.outputs.identities.kubelet.id
      }
    }
    logAnalyticsWorkspace: monitor.outputs.logAnalyticsWorkspace
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'APPLICATION' })
  }
}

module dns './dns.bicep' = {
  name: 'env-dns'
  params: {
    env: environment
    primaryRegion: primaryRegion
    apexIpAddress: '${take(addressSpace.subnets.aks, lastIndexOf(addressSpace.subnets.aks, '.'))}.4'
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module cosmos './cosmos.bicep' = {
  name: 'env-cosmos'

  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    subnet: network.outputs.subnets.data
    privateDnsResourceGroup: privateDnsResourceGroup
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'DATA' })
  }

  dependsOn: [ aks ]
}

module serviceBus './service-bus.bicep' = {
  name: 'env-servicebus'

  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    subnet: network.outputs.subnets.data
    privateDnsResourceGroup: privateDnsResourceGroup
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'DATA' })
  }

  dependsOn: [ cosmos ]
}

module hub_network './hub_network.bicep' = {
  name: 'env-hub-network'
  scope: resourceGroup(
    hubVirtualNetwork.subscriptionId,
    hubVirtualNetwork.resourceGroupName
  )

  params: {
    remoteVirtualNetwork: network.outputs.virtualNetwork
    virtualNetwork: {
      name: hubVirtualNetwork.name
    }
  }
}

module hub_dns './hub_dns.bicep' = {
  name: 'env-hub-dns'
  scope: resourceGroup(
    privateDnsResourceGroup.subscriptionId, privateDnsResourceGroup.name
  )

  params: {
    virtualNetwork: network.outputs.virtualNetwork
    identities: {
      aks: {
        id: identity.outputs.identities.aks.id
        principalId: identity.outputs.identities.aks.principalId
      }
    }
  }
}

module hub_data 'hub_data.bicep' = {
  name: 'env-hub-data'
  scope: resourceGroup(
    monitorPrivateLinkScope.subscriptionId,
    monitorPrivateLinkScope.resourceGroupName
  )

  params: {
    logAnalyticsWorkspace: monitor.outputs.logAnalyticsWorkspace
    applicationInsights: monitor.outputs.applicationInsights
    monitorPrivateLinkScope: {
      name: monitorPrivateLinkScope.name
    }
    acr: {
      name: acr.Name
    }
    identities: {
      kubelet: {
        id: identity.outputs.identities.kubelet.id
        principalId: identity.outputs.identities.kubelet.principalId
      }
    }
  }
}
