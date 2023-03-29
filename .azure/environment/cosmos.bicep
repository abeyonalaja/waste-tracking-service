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

var cosmosDBAccountName = toLower(
  join([ env, svc, role, 'CO', envNum, padLeft(instance0, 3, '0') ], '')
)

resource cosmosDBAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: cosmosDBAccountName
  location: primaryRegion

  kind: 'GlobalDocumentDB'

  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: primaryRegion
      }
    ]

    backupPolicy: {
      type: 'Continuous'
    }
  }

  tags: union(defaultTags, { Name: cosmosDBAccountName })
}

var cosmosDBPrivateEndpointName = join(
  [ env, svc, 'COS', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource cosmosDBPrivateEndpoint 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: cosmosDBPrivateEndpointName
  location: primaryRegion

  properties: {
    subnet: {
      id: subnet.id
    }

    privateLinkServiceConnections: [
      {
        name: cosmosDBAccount.name
        properties: {
          privateLinkServiceId: cosmosDBAccount.id
          groupIds: [ 'Sql' ]
        }
      }
    ]

  }

  tags: union(defaultTags, { Name: cosmosDBPrivateEndpointName })
}
