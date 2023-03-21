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

var role = 'CDB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var cosmosDBAccountName = join(
  [ env, svc, role, 'ACC', envNum, padLeft(instance0, 3, '0') ], ''
)

var cosmosDBPrivateEndpointName = join(
  [ env, svc, role, 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

var cosmosDBName = join(
  [ env, svc, role, 'SQL', envNum, padLeft(instance0, 3, '0') ], ''
)

var cosmosDBContainerName = join(
  [ env, svc, role, 'CON', envNum, padLeft(instance0, 3, '0') ], ''
)

resource cosmosDBAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {

  name: toLower(cosmosDBAccountName)

  location: primaryRegion

  identity: {
    type: 'SystemAssigned'
  }

  kind:'GlobalDocumentDB'

  properties: {

    enableFreeTier: true

    databaseAccountOfferType: 'Standard'

    locations: [
      {
        locationName: primaryRegion
      }
    ]
    
    backupPolicy: {
      type: 'Continuous'
    }

    publicNetworkAccess: 'Disabled'

  }

  tags: union(defaultTags, { Name: cosmosDBAccountName })

}

resource cosmosDBPrivateEndpoint 'Microsoft.Network/privateEndpoints@2021-08-01' = {

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
          groupIds: [
            'Sql'
          ]
        }
      }
    ]

  }

  tags: union(defaultTags, { Name: cosmosDBPrivateEndpointName })

}

resource cosmosDBDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  
  parent: cosmosDBAccount

  name: cosmosDBName
  
  properties: {
    
    resource: {
      id: cosmosDBName
    }

  }

  tags: union(defaultTags, { Name: cosmosDBName })

}

resource cosmosDBContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  
  parent: cosmosDBDatabase
  
  name: cosmosDBContainerName
  
  properties: {
    
    resource: {
      
      id: cosmosDBContainerName

      partitionKey: {
        paths: [
          '/id'
        ]
        kind: 'Hash'
      }
  
    }
 
      options: {
        throughput: 1000
    }

  }

  tags: union(defaultTags, { Name: cosmosDBContainerName })

}
