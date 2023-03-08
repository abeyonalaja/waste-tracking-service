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

@description('Egress Firewall Private IP address used for hop IP address in the AKS subnet UDR.')
param firewallPrivateIp string = '10.0.8.4'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'SPK'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var virtualNetworkName = join(
  [ env, svc, role, 'VN', envNum, padLeft(instance0, 3, '0') ], ''
)
var ingressSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'ING', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)
var aksSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'AKS', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)
var dataSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'DAT', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
  ],
  '-'
)
var aksRouteTableName = join(
  [ 
    aksSubnetName
    join([ env, svc, 'AKS', 'RT', envNum, padLeft(instance0, 3, '0') ], '')
  ], 
  '-'
)
var aksRouteTableRouteName = join(
  [ 
    aksRouteTableName
    join([ env, svc, 'AKS', 'RO', envNum, padLeft(instance0, 3, '0') ], '') 
  ], 
  '-'
)

resource aksRouteTable 'Microsoft.Network/routeTables@2022-07-01' = {
  name: aksRouteTableName

  location: primaryRegion

  properties: {
    routes: [
      {
        name: aksRouteTableRouteName
        properties: {
          addressPrefix: '0.0.0.0/0'
          nextHopIpAddress: firewallPrivateIp
          nextHopType: 'VirtualAppliance'
        }
      }
    ]
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2022-07-01' = {
  name: virtualNetworkName
  location: primaryRegion

  properties: {
    addressSpace: {
      addressPrefixes: [ addressSpace.virtualNetwork ]
    }

    subnets: [
      {
        name: ingressSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.ingress
        }
      }
      {
        name: aksSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.aks
          privateEndpointNetworkPolicies: 'Disabled'
          routeTable: {
            id: resourceId(resourceGroup().name, aksRouteTable.type, aksRouteTable.name)
          }
        }
      }
      {
        name: dataSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.data
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: virtualNetworkName })
}

@description('References to created subnets.')
output subnets object = {
  ingress: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == ingressSubnetName
    ))!.id
  }
  aks: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == aksSubnetName
    ))!.id
  }
  data: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == dataSubnetName
    ))!.id
  }
}

@description('Reference to created virtual network.')
output virtualNetwork object = {
  id: virtualNetwork.id
  name: virtualNetwork.name
}
