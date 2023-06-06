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

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var containerRegistryName = join(
  [ env, svc, role, 'CR', envNum, padLeft(instance0, 3, '0') ], ''
)

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' = {
  name: containerRegistryName
  location: primaryRegion

  sku: {
    name: 'Premium'
  }

  tags: union(defaultTags, { Name: containerRegistryName })
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
}

@description('Reference to created Azure Container Registry.')
output containerRegistry object = {
  name: containerRegistry.name
  id: containerRegistry.id
}

@description('''
  FQDNs that are required in private DNS setup for Private Endpoint to work
  correctly.
''')
output requiredPrivateDnsEntries object = toObject(
  containerRegistryEndpont.properties.customDnsConfigs,
  config => config.fqdn,
  config => config.ipAddresses
)
