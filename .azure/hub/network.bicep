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

@description('CIDR prefixes for the created virtual network and its subnet.')
param addressSpace object = {
  virtualNetwork: null
  subnets: {
    gateway: null
    endpoints: null
    ado: null
    bastion: null
  }
}

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var virtualNetworkName = join(
  [ env, svc, role, 'VN', envNum, padLeft(instance0, 3, '0') ], ''
)
var gatewaySubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'GAT', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)
var endpointSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'END', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)
var adoSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'ADO', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2022-07-01' = {
  name: virtualNetworkName
  location: primaryRegion

  properties: {
    addressSpace: {
      addressPrefixes: [ addressSpace.virtualNetwork ]
    }

    subnets: [
      {
        name: gatewaySubnetName
        properties: {
          addressPrefix: addressSpace.subnets.gateway
          networkSecurityGroup: {
            id: gatewayNsg.id
          }
        }
      }
      {
        name: endpointSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.endpoints
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: adoSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.ado
        }
      }
      {
        name: 'AzureBastionSubnet'
        properties: {
          addressPrefix: addressSpace.subnets.bastion
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: virtualNetworkName })
}

var gatewayNsgName = join(
  [ env, svc, 'GAT', 'SG', envNum, padLeft(instance0, 3, '0') ], ''
)

resource gatewayNsg 'Microsoft.Network/networkSecurityGroups@2022-07-01' = {
  name: gatewayNsgName
  location: primaryRegion

  properties: {
    securityRules: [
      {
        name: 'Inbound_GatewayManager'
        properties: {
          access: 'Allow'
          direction: 'Inbound'
          protocol: '*'
          priority: 2000

          sourcePortRange: '*'
          destinationPortRange: '65200-65535'
          sourceAddressPrefix: 'GatewayManager'
          destinationAddressPrefix: '*'

          description: 'Azure infrastructure communication'
        }
      }
      {
        name: 'Inbound_AzureLoadBalancer'
        properties: {
          access: 'Allow'
          direction: 'Inbound'
          protocol: '*'
          priority: 2010

          sourcePortRange: '*'
          destinationPortRange: '*'
          sourceAddressPrefix: 'AzureLoadBalancer'
          destinationAddressPrefix: '*'

          description: 'Azure Infrastructure Load Balancer'
        }
      }
      {
        name: 'Inbound_Internet'
        properties: {
          access: 'Deny'
          direction: 'Inbound'
          protocol: '*'
          priority: 2020

          sourcePortRange: '*'
          destinationPortRange: '*'
          sourceAddressPrefix: 'Internet'
          destinationAddressPrefix: '*'

          description: 'No gateway listeners associated with public IP'
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: gatewayNsgName })
}

@description('References to created subnets.')
output subnets object = {
  gateway: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == gatewaySubnetName
    ))!.id
  }
  endpoints: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == endpointSubnetName
    ))!.id
  }
  ado: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == adoSubnetName
    ))!.id
  }
  bastion: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == 'AzureBastionSubnet'
    ))!.id
  }
}

@description('Reference to created virtual network.')
output virtualNetwork object = {
  id: virtualNetwork.id
  name: virtualNetwork.name
}
