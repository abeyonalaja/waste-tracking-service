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

@minValue(-1)
@maxValue(2147483647)
@description('Time to Live for data in analytical store. (-1 no expiry)')
param analyticalStoreTTL int = -1

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
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Local'
      }
    }

    enableAnalyticalStorage: true
  }

  tags: union(defaultTags, { Name: cosmosDBAccountName })

  resource annexViiDatabase 'sqlDatabases' = {
    name: 'annex-vii'

    properties: {
      resource: {
        id: 'annex-vii'
      }
      options: {
        throughput: 400
      }
    }

    tags: union(defaultTags, { Name: 'annex-vii' })

    resource cosmosDBContainer1 'containers' = {
      name: 'drafts'

      properties: {
        resource: {
          id: 'drafts'

          analyticalStorageTtl: analyticalStoreTTL

          partitionKey: {
            paths: [
              '/value/accountId'
            ]
            kind: 'Hash'
            version: 2
          }

        }
      }

      tags: union(defaultTags, { Name: 'drafts' })
    }

    resource cosmosDBContainer2 'containers' = {
      name: 'submissions'

      properties: {
        resource: {
          id: 'submissions'

          analyticalStorageTtl: analyticalStoreTTL

          partitionKey: {
            paths: [
              '/value/accountId'
            ]
            kind: 'Hash'
            version: 2
          }

        }
      }

      tags: union(defaultTags, { Name: 'submissions' })
    }

  }

  resource wasteTrackingDatabase 'sqlDatabases' = {
    name: 'waste-tracking'

    properties: {
      resource: {
        id: 'waste-tracking'
      }
      options: {
        throughput: 400
      }
    }

    tags: union(defaultTags, { Name: 'annex-vii' })

    resource cosmosDBContainer1 'containers' = {
      name: 'reference-data'

      properties: {
        resource: {
          id: 'reference-data'

          analyticalStorageTtl: analyticalStoreTTL

          partitionKey: {
            paths: [
              '/type'
            ]
            kind: 'Hash'
            version: 2
          }

          uniqueKeyPolicy: {
            uniqueKeys: [
              {
                paths: [
                  '/code'
                ]
              }
            ]
          }
        }
      }

      tags: union(defaultTags, { Name: 'reference-data' })
    }

    resource cosmosDBContainer2 'containers' = {
      name: 'feedback'

      properties: {
        resource: {
          id: 'feedback'

          analyticalStorageTtl: analyticalStoreTTL

          partitionKey: {
            paths: [
              '/id'
            ]
            kind: 'Hash'
            version: 2
          }

        }
      }

      tags: union(defaultTags, { Name: 'feedback' })
    }

  }
}

var cosmosDBPrivateEndpointNameSql = join(
  [ env, svc, 'COS', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource cosmosDBPrivateEndpointSql 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: cosmosDBPrivateEndpointNameSql
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

  tags: union(defaultTags, { Name: cosmosDBPrivateEndpointNameSql })
}

@description('''
  FQDNs that are required in private DNS setup for Private Endpoint to work
  correctly.
''')
output requiredPrivateDnsEntries object = toObject(
  cosmosDBPrivateEndpointSql.properties.customDnsConfigs,
  config => config.fqdn,
  config => config.ipAddresses
)
