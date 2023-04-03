@description('''
  Reference to existing Virtual Networks that will be linked to the supplied
  Private DNS zones.
''')
param virtualNetwork object = {
  id: null
  name: null
}

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
@description('Primary Azure region for all deployed resources.')
param primaryRegion string = 'uksouth'

resource privatelink_azurecr_io 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.azurecr.io'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_monitor_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.monitor.azure.com'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_oms_opinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.oms.opinsights.azure.com'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_ods_opinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.ods.opinsights.azure.com'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_agentsvc_azure__automation_net 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.agentsvc.azure-automation.net'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_blob_core_windows_net 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  #disable-next-line no-hardcoded-env-urls
  name: 'privatelink.blob.core.windows.net'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_applicationinsights_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.applicationinsights.azure.com'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_primaryregion_azmk8s_io 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.${primaryRegion}.azmk8s.io'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_vaultcore_azure_net 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.vaultcore.azure.net'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_servicebus_windows_net 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.servicebus.windows.net'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}

resource privatelink_documents_azure_com 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  name: 'privatelink.documents.azure.com'

  resource virtualNetworkLink 'virtualNetworkLinks' = {
    name: virtualNetwork.name
    location: 'global'
    properties: {
      registrationEnabled: false
      virtualNetwork: {
        id: virtualNetwork.id
      }
    }
  }
}
