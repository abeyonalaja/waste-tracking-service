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
    data: null
    ado: null
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

var dataSubnetName = join(
  [
    virtualNetworkName
    join([ env, svc, 'DAT', 'SN', envNum, padLeft(instance0, 3, '0') ], '')
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
        name: dataSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.data
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: adoSubnetName
        properties: {
          addressPrefix: addressSpace.subnets.ado
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: virtualNetworkName })
}

@description('References to created subnets.')
output subnets object = {
  data: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == dataSubnetName
    ))!.id
  }
  ado: {
    id: first(filter(
      virtualNetwork.properties.subnets,
      subnet => subnet.name == adoSubnetName
    ))!.id
  }
}

@description('Reference to created virtual network.')
output virtualNetwork object = {
  id: virtualNetwork.id
  name: virtualNetwork.name
}
