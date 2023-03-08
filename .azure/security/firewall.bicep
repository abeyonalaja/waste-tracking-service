@allowed([
  'APS', 'CAT', 'DEV', 'LOG', 'MST', 'OPS', 'PRD', 'PRE', 'SEC', 'SND', 'TST'
])
param env string = 'SND'

@minLength(3)
@maxLength(3)
param svc string = 'WTS'

@minValue(1)
@maxValue(9)
param envNum int = 1

@allowed([ 'northeurope', 'westeurope', 'uksouth', 'ukwest' ])
param primaryRegion string = 'uksouth'

param subnet object = {
  id: null
}

@description('Zone numbers e.g. 1,2,3.')
param availabilityZones array = []

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'SEC'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

// TODO: workload and infra Ip Groups

var firewallPolicyName = join([ env, svc, role, 'FP', envNum, padLeft(instance0, 3, '0') ], '')

resource firewallPolicy 'Microsoft.Network/firewallPolicies@2022-01-01'= {
  name: firewallPolicyName
  location: primaryRegion
  properties: {
    threatIntelMode: 'Alert'
  }

  tags: union(defaultTags, { Name: firewallPolicyName })
}

resource networkRuleCollectionGroup 'Microsoft.Network/firewallPolicies/ruleCollectionGroups@2022-01-01' = {
  parent: firewallPolicy
  name: 'DefaultNetworkRuleCollectionGroup'
  properties: {
    priority: 100
    ruleCollections: [
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        action: {
          type: 'Allow'
        }
        name: 'time'
        priority: 101
        rules: [
          {
            ruleType: 'NetworkRule'
            name: 'allow network'
            ipProtocols: [
              'UDP'
            ]
            // sourceIpGroups: [
            //   workloadIpGroup.id
            //   infraIpGroup.id
            // ]
            sourceAddresses: [
              '*'
            ] // ??
            destinationAddresses: [
              'ntp.ubuntu.com'
            ] // '*' ??
            destinationPorts: [
              '123'
            ]
            description: 'aks node time sync rule'
          }
        ]
      }
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        action: {
          type: 'Allow'
        }
        name: 'dns'
        priority: 102
        rules: [
          {
            ruleType: 'NetworkRule'
            name: 'allow network'
            ipProtocols: [
              'UDP'
            ]
            sourceAddresses: [
              '*'
            ]
            destinationAddresses: [
              '*'
            ]
            destinationPorts: [
              '53'
            ]
            description: 'aks node dns rule'
          }
        ]
      }
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        action: {
          type: 'Allow'
        }
        name: 'servicetags'
        priority: 110
        rules: [
          {
            ruleType: 'NetworkRule'
            name: 'allow network'
            // Can be broken down into UDP and TCP with respectively destination ports 1194 and 9000
            ipProtocols: [
              'Any'
            ]
            sourceAddresses: [
              '*'
            ]
            destinationAddresses: [
              'AzureContainerRegistry'
              'MicrosoftContainerRegistry'
              'AzureActiveDirectory'
              'AzureMonitor'
            ]
            destinationPorts: [
              '*'
            ]
            description: 'allow service tags'
          }
        ]
      }
    ]
  }
}

resource applicationRuleCollectionGroup 'Microsoft.Network/firewallPolicies/ruleCollectionGroups@2022-01-01' = {
  parent: firewallPolicy
  name: 'DefaultApplicationRuleCollectionGroup'
  dependsOn: [
    networkRuleCollectionGroup
  ]
  properties: {
    priority: 100
    ruleCollections: [
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        name: 'aksfwar'
        priority: 101
        action: {
          type: 'Allow'
        }
        rules: [
          {
            ruleType: 'ApplicationRule'
            name: 'fqdn'
            protocols: [
              {
                protocolType: 'Https'
                port: 443
              }
              {
                protocolType: 'Http'
                port: 80
              }
            ]
            fqdnTags: [
              'AzureKubernetesService'
            ]
            sourceAddresses: [
              '*'
            ] // ??
            // terminateTLS: false
            // sourceIpGroups: [
            //   workloadIpGroup.id
            //   infraIpGroup.id
            // ]
          }
        ]
      }
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        action: {
          type: 'Allow'
        }
        name: 'osupdates'
        priority: 102
        rules: [
          {
            ruleType: 'ApplicationRule'
            name: 'allow network'
            protocols: [
              {
                protocolType: 'Https'
                port: 443
              }
              {
                protocolType: 'Http'
                port: 80
              }
            ]
            targetFqdns: [
              'download.opensuse.org'
              'security.ubuntu.com'
              'packages.microsoft.com'
              'azure.archive.ubuntu.com'
              'changelogs.ubuntu.com'
              'snapcraft.io'
              'api.snapcraft.io'
              'motd.ubuntu.com'
            ]
            sourceAddresses: [
              '*'
            ] // ??
            // terminateTLS: false
            // sourceIpGroups: [
            //   workloadIpGroup.id
            //   infraIpGroup.id
            // ]
          }
        ]
      }
      {
        ruleCollectionType: 'FirewallPolicyFilterRuleCollection'
        action: {
          type: 'Allow'
        }
        name: 'dockerhub'
        priority: 110
        rules: [
          {
            ruleType: 'ApplicationRule'
            name: 'allow network'
            protocols: [
              {
                protocolType: 'Https'
                port: 443
              }
              {
                protocolType: 'Http'
                port: 80
              }
            ]
            targetFqdns: [
              'auth.docker.io'
              'registry-1.docker.io'
              'production.cloudflare.docker.com'
            ]
            sourceAddresses: [
              '*'
            ] // ??
            // terminateTLS: false
            // sourceIpGroups: [
            //   workloadIpGroup.id
            //   infraIpGroup.id
            // ]
          }
        ]
      }
    ]
  }
}

var firewallPublicIpName = join([ env, svc, 'FRW', 'IP', envNum, padLeft(instance0, 3, '0') ], '')

resource firewallPublicIp 'Microsoft.Network/publicIPAddresses@2022-07-01' = {
  name: firewallPublicIpName

  location: primaryRegion

  sku: {
    name: 'Standard'
  }

  properties: {
    publicIPAllocationMethod: 'Static'
  }

  tags: union(defaultTags, { Name: firewallPublicIpName })
}

var firewallName = join([ env, svc, role, 'FW', envNum, padLeft(instance0, 3, '0') ], '')

resource firewall 'Microsoft.Network/azureFirewalls@2021-03-01' = {
  name: firewallName
  location: primaryRegion
  zones: ((length(availabilityZones) == 0) ? null : availabilityZones)
  properties: {
    ipConfigurations: [
      {
        name: firewallName
        properties: {
          publicIPAddress: {
            id: firewallPublicIp.id
          }
          subnet: {
            id: subnet.id
          }
        }
      }
    ]
    firewallPolicy: {
      id: firewallPolicy.id
    }
  }

  tags: union(defaultTags, { Name: primaryRegion })
}
