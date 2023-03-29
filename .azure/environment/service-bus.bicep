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

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'ENV'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var serviceBusName = join(
  [ env, svc, role, 'SB', envNum, padLeft(instance0, 3, '0') ], ''
)

resource serviceBus 'Microsoft.ServiceBus/namespaces@2021-11-01' = {
  name: serviceBusName
  location: primaryRegion

  sku: {
    name: 'Premium'
    tier: 'Premium'
    capacity: 1
  }

  properties: {
    disableLocalAuth: true
  }

  tags: union(defaultTags, { Name: serviceBusName })
}

var serviceBusPrivateEndpointName = join(
  [ env, svc, 'SBS', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource serviceBusPrivateEndpoint 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: serviceBusPrivateEndpointName
  location: primaryRegion

  properties: {
    subnet: {
      id: subnet.id
    }

    privateLinkServiceConnections: [
      {
        name: serviceBus.name
        properties: {
          privateLinkServiceId: serviceBus.id
          groupIds: [ 'namespace' ]
        }
      }
    ]

  }

  tags: union(defaultTags, { Name: serviceBusPrivateEndpointName })
}
