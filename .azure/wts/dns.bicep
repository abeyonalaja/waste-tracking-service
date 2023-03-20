@description('Set the Hub VNet name')
param hubVirtualNetworkName string

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var privateDnsZoneName = 'privatelink.uksouth.azmk8s.io'

resource privatelink_uksouth_azmk8s_io 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: privateDnsZoneName
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: privateDnsZoneName
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: hubVirtualNetworkName
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id:resourceId(resourceGroup().name, 'Microsoft.Network/virtualNetworks', hubVirtualNetworkName)
      }
    }
  }
}

@description('References to created Private DNS Zones.')
output privateDnsZoneId string = privatelink_uksouth_azmk8s_io.id
