@description('Reference to remote Virtual Network to peer.')
param remoteVirtualNetwork object = {
  id: null
  name: null
}

@description('Reference to existing Virtual Network.')
param virtualNetwork object = {
  name: null
}

resource existingVirtualNetwork 'Microsoft.Network/virtualNetworks@2022-09-01' existing = {
  name: virtualNetwork.name

  resource peering 'virtualNetworkPeerings' = {
    name: remoteVirtualNetwork.name
    properties: {
      remoteVirtualNetwork: {
        id: remoteVirtualNetwork.id
      }
    }
  }
}
