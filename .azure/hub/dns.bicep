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

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

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

resource privatelink_primaryregion_azmk8s_io 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.${primaryRegion}.azmk8s.io'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.${primaryRegion}.azmk8s.io'
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

resource privatelink_vaultcore_azure_net 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.vaultcore.azure.net'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.vaultcore.azure.net'
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

resource privatelink_servicebus_windows_net 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.servicebus.windows.net'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.servicebus.windows.net'
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

resource privatelink_documents_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: 'privatelink.documents.azure.com'
  location: 'global'

  tags: union(
    defaultTags,
    {
      Name: 'privatelink.documents.azure.com'
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
  'privatelink.${primaryRegion}.azmk8s.io': { id: privatelink_primaryregion_azmk8s_io.id }
  'privatelink.vaultcore.azure.net': { id: privatelink_vaultcore_azure_net.id }
  'privatelink.servicebus.windows.net': { id: privatelink_servicebus_windows_net.id }
  'privatelink.documents.azure.com': { id: privatelink_documents_azure_com.id }
}
