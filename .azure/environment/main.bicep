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

@description('Reference to hub Virtual Network for peering.')
param hubVirtualNetwork object = {
  id: null
  name: null
  resourceGroupName: null
  subscriptionId: null
}

@description('Reference to hub Azure Container Registry.')
param containerRegistry object = {
  name: null
  resourceGroupName: null
  subscriptionId: null
}

@description('Pre-created Cluster Admin AAD Group Object Id(s).')
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
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'OTHER' })
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

module cosmos './cosmos.bicep' = {
  name: 'env-cosmos'

  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    subnet: network.outputs.subnets.data
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
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'DATA' })
  }

  dependsOn: [ cosmos ]
}

module app_identity './app_identity.bicep' = {
  name: 'env-app-identity'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    
    applicationResources: {
      aks: {
        issuer: aks.outputs.applicationResources.aks.issuer
      }
      keyVault: {
        name: aks.outputs.applicationResources.keyVault.name
      }
    }
    
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'OTHER' })
  }
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

module hub_data 'hub_data.bicep' = {
  name: 'env-hub-data'
  scope: resourceGroup(
    containerRegistry.subscriptionId,
    containerRegistry.resourceGroupName
  )

  params: {
    containerRegistry: {
      name: containerRegistry.name
    }
    identities: {
      kubelet: {
        id: identity.outputs.identities.kubelet.id
        principalId: identity.outputs.identities.kubelet.principalId
      }
    }
  }
}

@description('''
  FQDNs that are required in private DNS setup for Private Endpoint to work
  correctly.
''')
output requiredPrivateDnsEntries object = union(
  aks.outputs.requiredPrivateDnsEntries,
  cosmos.outputs.requiredPrivateDnsEntries,
  serviceBus.outputs.requiredPrivateDnsEntries
)
