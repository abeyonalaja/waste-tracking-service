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
  - _ingress_ - Recommend _/24_ prefix.
  - _aks_ - Recommended _/24_ prefix.
  - _data_ - Recommend _/24_ prefix.
''')
param addressSpace object = {
  virtualNetwork: null
  subnets: {
    ingress: null
    aks: null
    data: null
  }
}

@description('''
  The CSC tagging policy requires all resources to be tagged with a created
  date. A default value is provided but a value will have to be supplied in
  order to have idempotent deployments.
''')
param createdDate string = utcNow('yyyyMMdd')

@description('Firewall Private IP address for egress configuration.')
param firewallPrivateIp string

@description('Hub Vnet where the hub resources are confugured.')
param hubVirtualNetworkName string

@description('Security resource group where the Firewall Vnet is confugured.')
param securityResourceGroupName string

@description('Security Vnet where the Firewall is confugured.')
param securityVirtualNetworkName string

@description('''
  2023-03-07 Bicep doesn't support Azure AD Group creation
  https://github.com/Azure/bicep/issues/7724
  Pre-created Cluster Admin AAD Group Object Id.
''')
param clusterAdminGroupObjectId string

@description('AKS network configuration.')
param aksNetworkProfile object = {
  dnsServiceIP: '10.2.0.10'
  dockerBridgeCidr: '172.17.0.1/16'
  loadBalancerSku: 'Standard'
  networkPlugin: 'kubenet'
  networkPolicy: 'calico'
  outboundType: 'userDefinedRouting'
  serviceCidr: '10.2.0.0/24'
}

@description('AKS nodepool VMSS resource allocation and metadata.')
param aksAgentPoolProfiles object = {
  system: {
    name: 'nodepool1'
    count: null
    vmSize: null
    osDiskSizeGB: null
    osDiskType: 'Ephemeral'
    osType: 'Linux'
    osSKU: 'Ubuntu'
    minCount: null
    maxCount: null
    enableAutoScaling: null
    type: 'VirtualMachineScaleSets'
    mode: 'System'
    scaleSetPriority: 'Regular'
    maxPods: null
    availabilityZones: []
    maxSurge: null
    nodeTaints: []
  }
  user: {
    name: 'nodepool2'
    count: null
    vmSize: null
    osDiskSizeGB: null
    osDiskType: 'Ephemeral'
    osType: 'Linux'
    osSKU: 'Ubuntu'
    minCount: null
    maxCount: null
    enableAutoScaling: null
    type: 'VirtualMachineScaleSets'
    mode: 'User'
    scaleSetPriority: 'Regular'
    maxPods: null
    availabilityZones: []
    maxSurge: null
    nodeTaints: []
  }
}

@description('User name for the Linux Virtual Machines')
param linuxAdminUsername string

@description('SSH Public Key value for the Linux Virtual Machines')
param sshRsaPublicKeyValue string

@description('Kubernetes version to be installed on AKS.')
param kubernetesVersion string = '1.24.9'

@description('''
IP ranges authorized to contact the Kubernetes API server. 
Passing an empty array will result in no IP restrictions. 
If any are provided, remember to also provide the public IP of the egress Azure Firewall 
otherwise your nodes will not be able to talk to the API server (e.g. Flux).''')
param clusterAuthorizedIpRanges array = []

module tags '../util/tags.bicep' = {
  name: 'hub-tags'
  params: {
    environment: environment
    serviceCode: serviceCode
    createdDate: createdDate
    location: primaryRegion
  }
}

module network './network.bicep' = {
  name: 'wts-network'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    addressSpace: addressSpace
    firewallPrivateIp: firewallPrivateIp
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module wtsToHubVnetPeering './vnetPeering.bicep' = {
  name: 'peerWtsToHub'
  scope: resourceGroup()
  params: {
    localVirtualNetworkName: network.outputs.virtualNetwork.name
    remoteVirtualNetworkName: hubVirtualNetworkName
    remoteVirtualNetworkResourceGroupName: resourceGroup().name
    role: 'WTH'
  }
}

module hubToWtsVnetPeering './vnetPeering.bicep' = {
  name: 'peerHubToWts'
  scope: resourceGroup()
  params: {
    localVirtualNetworkName: hubVirtualNetworkName
    remoteVirtualNetworkName: network.outputs.virtualNetwork.name
    remoteVirtualNetworkResourceGroupName: resourceGroup().name
    role: 'HTW'
  }
}

module wtsToSecurityVnetPeering './vnetPeering.bicep' = {
  name: 'peerWtsToSecurity'
  scope: resourceGroup()
  params: {
    localVirtualNetworkName: network.outputs.virtualNetwork.name
    remoteVirtualNetworkName: securityVirtualNetworkName
    remoteVirtualNetworkResourceGroupName: securityResourceGroupName
    role: 'WTS'
  }
}

module securityToWtsVnetPeering './vnetPeering.bicep' = {
  name: 'peerSecurityToWts'
  scope: resourceGroup(securityResourceGroupName)
  params: {
    localVirtualNetworkName: securityVirtualNetworkName
    remoteVirtualNetworkName: network.outputs.virtualNetwork.name
    remoteVirtualNetworkResourceGroupName: resourceGroup().name
    role: 'STW'
  }
}

// For public cluster this is not needed:
module dns './dns.bicep' = {
  name: 'wts-dns'
  params: {
    hubVirtualNetworkName: hubVirtualNetworkName
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'NETWORK' })
  }
}

module identity './identity.bicep' = {
  name: 'wts-identity'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion
    clusterAdminGroupObjectId: clusterAdminGroupObjectId
    defaultTags: union(tags.outputs.defaultTags, { Tier: 'IDENTITY' })
  }
}

// module aks './aks.bicep' = {
module aks './aks-public.bicep' = {
  name: 'wts-aks'
  params: {
    env: environment
    svc: serviceCode
    envNum: environmentNumber
    primaryRegion: primaryRegion

    subnet: network.outputs.subnets.aks

    clusterAdminGroupObjectIds: identity.outputs.clusterAdminGroupObjectIds

    identities: {
      aks: {
        id: identity.outputs.identities.aks.id
      }
      kubelet: {
        id: identity.outputs.identities.kubelet.id
      }
    }

    // privateDnsZoneId: dns.outputs.privateDnsZoneId

    clusterAuthorizedIpRanges: clusterAuthorizedIpRanges

    aksNetworkProfile: aksNetworkProfile
    
    aksAgentPoolProfiles: aksAgentPoolProfiles
    
    linuxAdminUsername: linuxAdminUsername

    sshRsaPublicKeyValue: sshRsaPublicKeyValue
    
    kubernetesVersion: kubernetesVersion

    defaultTags: union(tags.outputs.defaultTags, { Tier: 'AKS' })
  }
}

