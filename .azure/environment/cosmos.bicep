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

@description('''
  Reference to Resource Group that contains existing Private DNS Zone Group
  resources; this module assumes that this resource group contains the zone
  _privatelink.documents.azure.com_.
''')
param privateDnsResourceGroup object = {
  name: null
  subscriptionId: null
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

    resource cosmosDBContainer 'containers' = {
      name: 'reference-data'

      properties: {
        resource: {
          id: 'reference-data'

          indexingPolicy: {
            indexingMode: 'consistent'
            automatic: true
            includedPaths: [
              {
                path: '/*'
              }
            ]
            excludedPaths: [
              {
                path: '/"_etag"/?'
              }
            ]
          }

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
  }
}

resource privatelink_documents_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  scope: resourceGroup(
    privateDnsResourceGroup.subscriptionId,
    privateDnsResourceGroup.name
  )
  name: 'privatelink.documents.azure.com'
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

  resource dnsZoneGroup 'privateDnsZoneGroups' = {
    name: cosmosDBAccount.name

    properties: {
      privateDnsZoneConfigs: [
        {
          name: 'privatelink.documents.azure.com'
          properties: {
            privateDnsZoneId: privatelink_documents_azure_com.id
          }
        }
      ]
    }
  }
}
