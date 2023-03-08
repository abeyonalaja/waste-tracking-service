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

@description('Reference to existing gateway subnet.')
param subnet object = {
  id: null
}

@description('Frontend IP on which Application Gateway should listen.')
param privateIpAddress string

@description('Internal Load Balancer Private IP on which Application Gateway connects to the backend.')
param internalLbPrivateIp string

@description('Application host/domain name.')
param hostName string

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var publicIpName = join(
  [ env, svc, 'GAT', 'IP', envNum, padLeft(instance0, 3, '0') ], ''
)

resource publicIp 'Microsoft.Network/publicIPAddresses@2022-07-01' = {
  name: publicIpName
  location: primaryRegion

  sku: {
    name: 'Standard'
  }

  properties: {
    publicIPAllocationMethod: 'Static'
  }

  tags: union(defaultTags, { Name: publicIpName })
}

var applicationGatewayName = join(
  [ env, svc, role, 'VN', envNum, padLeft(instance0, 3, '0') ], ''
)

var backendHttpSettingsName = 'appGatewayBackendHttpSettings'
var backendPoolName = 'appGatewayBackendPool'

resource applicationGateway 'Microsoft.Network/applicationGateways@2022-07-01' = {
  name: applicationGatewayName
  location: primaryRegion

  properties: {
    sku: {
      name: 'WAF_v2'
      tier: 'WAF_v2'
      capacity: 1
    }

    gatewayIPConfigurations: [
      {
        name: 'default'
        properties: {
          subnet: {
            id: subnet.id
          }
        }
      }
    ]

    frontendIPConfigurations: [
      {
        name: 'private'
        properties: {
          privateIPAllocationMethod: 'Static'
          privateIPAddress: privateIpAddress
          subnet: {
            id: subnet.id
          }
        }
      }
      {
        name: 'public'
        properties: {
          publicIPAddress: {
            id: publicIp.id
          }
        }
      }
    ]

    frontendPorts: [
      {
        name: 'http'
        properties: {
          port: 80
        }
      }
    ]

    backendAddressPools: [
      {
        name: backendPoolName
        properties: {
          backendAddresses: [
            {
              ipAddress: internalLbPrivateIp
            }
          ]
        }
      }
    ]

    backendHttpSettingsCollection: [
      {
        name: backendHttpSettingsName
        properties: {
          pickHostNameFromBackendAddress: false
          hostName: hostName
          port: 80
          protocol: 'Http'
        }
      }
    ]

    httpListeners: [
      {
        name: 'http'
        properties: {
          frontendIPConfiguration: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/frontendIPConfigurations',
              applicationGatewayName,
              'private'
            )
          }
          frontendPort: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/frontendPorts',
              applicationGatewayName,
              'http'
            )
          }
          protocol: 'Http'
        }
      }
    ]

    requestRoutingRules: [
      {
        name: 'default'
        properties: {
          ruleType: 'Basic'
          priority: 10000
          httpListener: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/httpListeners',
              applicationGatewayName,
              'http'
            )
          }
          backendAddressPool: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendAddressPools',
              applicationGatewayName,
              backendPoolName
            )
          }
          backendHttpSettings: {
            id: resourceId(
              'Microsoft.Network/applicationGateways/backendHttpSettingsCollection',
              applicationGatewayName,
              backendHttpSettingsName
            )
          }
        }
      }
    ]

    webApplicationFirewallConfiguration: {
      enabled: true
      firewallMode: 'Prevention'
      ruleSetType: 'OWASP'
      ruleSetVersion: '3.2'
    }
  }

  tags: union(defaultTags, { Name: applicationGatewayName })
}
