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

@description('Set the local VNet name')
param localVirtualNetworkName string

@description('Set the remote VNet name')
param remoteVirtualNetworkName string

@description('Sets the remote VNet Resource group')
param remoteVirtualNetworkResourceGroupName string

@description('Set the role in the Virtual Network Peering name')
param role string

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var virtualNetworkPeeringName = join( [ localVirtualNetworkName , join([ env, svc, role, 'VP', envNum, padLeft(instance0, 3, '0') ], '')], '-')

resource existingLocalVirtualNetworkName_peering_to_remote_vnet 'Microsoft.Network/virtualNetworks/virtualNetworkPeerings@2022-07-01' = {
  name: '${localVirtualNetworkName}/${virtualNetworkPeeringName}'
  properties: {
    allowVirtualNetworkAccess: true
    allowForwardedTraffic: false
    allowGatewayTransit: false
    useRemoteGateways: false
    remoteVirtualNetwork: {
      id: resourceId(remoteVirtualNetworkResourceGroupName, 'Microsoft.Network/virtualNetworks', remoteVirtualNetworkName)
    }
  }
}
