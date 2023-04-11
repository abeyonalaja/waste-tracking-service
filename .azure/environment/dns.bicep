@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
@description('CSC environment code.')
param env string = 'SND'

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

@description('IP address to associate with the Apex domain')
param apexIpAddress string

var regionCode = {
  northeurope: 'neu', westeurope: 'weu', uksouth: 'uks', ukwest: 'ukw'
}[primaryRegion]

var dnsZoneName = 'wts-${regionCode}be-${toLower(env)}.azure.defra.cloud'

resource dnsZone 'Microsoft.Network/dnsZones@2018-05-01' = {
  name: dnsZoneName
  location: 'global'

  tags: union(defaultTags, { Name: dnsZoneName })

  resource record 'A' = {
    name: '@'
    properties: {
      ARecords: [ { ipv4Address: apexIpAddress } ]
      TTL: 60
    }
  }
}
