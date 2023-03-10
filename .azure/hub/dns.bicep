@description('''
  References to existing Virtual Networks that will be lined to all created
  Private DNS Zone Groups. For example:

  ```bicep
  [{
    id: virtualNetwork.id
    name: virtualNetwork.name
  }]
  ```
''')
param virtualNetworks array = [
  {
    id: null
    name: null
  }
]

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

// TODO: Link DNS zone with spoke to allow access to ACR through private endpoint
resource privatelink_azurecr_io 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.azurecr.io'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.azurecr.io'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_monitor_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.monitor.azure.com'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.monitor.azure.com'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_oms_opinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.oms.opinsights.azure.com'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.oms.opinsights.azure.com'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_ods_opinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.ods.opinsights.azure.com'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.ods.opinsights.azure.com'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_agentsvc_azure__automation_net 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.agentsvc.azure-automation.net'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.agentsvc.azure-automation.net'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_blob_core_windows_net 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  #disable-next-line no-hardcoded-env-urls
  name: 'privatelink.blob.core.windows.net'
  location: 'global'

  tags: union(
    defaultTags,
    {
      #disable-next-line no-hardcoded-env-urls
      Name: 'privatelink.blob.core.windows.net'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

resource privatelink_applicationinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.applicationinsights.azure.com'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.applicationinsights.azure.com'
      Location: 'global'
    }
  )

  resource virtualNetworkLink 'virtualNetworkLinks' = [for item in virtualNetworks: {
    name: item.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: item.id
      }
    }
  }]
}

@description('References to created Private DNS Zones.')
output privateZones object = {
  'privatelink.azurecr.io': { id: privatelink_azurecr_io.id }
  'privatelink.monitor.azure.com': { id: privatelink_monitor_azure_com.id }
  'privatelink.oms.opinsights.azure.com': { id: privatelink_oms_opinsights_azure_com.id }
  'privatelink.ods.opinsights.azure.com': { id: privatelink_ods_opinsights_azure_com.id }
  'privatelink.agentsvc.azure-automation.net': { id: privatelink_agentsvc_azure__automation_net.id }
  #disable-next-line no-hardcoded-env-urls
  'privatelink.blob.core.windows.net': { id: privatelink_blob_core_windows_net.id }
  'privatelink.applicationinsights.azure.com': { id: privatelink_applicationinsights_azure_com.id }
}
