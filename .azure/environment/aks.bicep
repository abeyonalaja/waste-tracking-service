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

@description('Reference to existing subnet for AKS cluster.')
param subnets object = {
  aks: {
    id: null
  }
  data: {
    id: null
  }
}

@description('''
  Reference to Resource Group that contains existing Private DNS Zone Group
  resources; this module assumes that this resource group contains the zone
  _privatelink.vaultcore.azure.net_.
''')
param privateDnsResourceGroup object = {
  name: null
  subscriptionId: null
}

@description('Admin username assigned to created Virtual Machines.')
param vmAdminUsername string = 'azadmin'

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'ENV'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var aksName = join(
  [ env, svc, role, 'KS', envNum, padLeft(instance0, 3, '0') ],
  ''
)

resource aks 'Microsoft.ContainerService/managedClusters@2022-11-02-preview' = {
  name: aksName
  location: primaryRegion

  identity: {
    type: 'SystemAssigned'
  }

  properties: {
    dnsPrefix: toLower(svc)

    agentPoolProfiles: [
      {
        name: 'system'
        count: 3
        vmSize: 'Standard_D2s_v3'
        osType: 'Linux'
        mode: 'System'
        vnetSubnetID: subnets.aks.id
      }
      {
        name: 'user'
        count: 2
        vmSize: 'Standard_DS3_v2'
        osType: 'Linux'
        mode: 'User'
        vnetSubnetID: subnets.aks.id
      }
    ]

    linuxProfile: {
      adminUsername: vmAdminUsername
      ssh: {
        publicKeys: [
          {
            keyData: loadTextContent('aks_rsa.pub')
          }
        ]
      }
    }

    nodeResourceGroup: aksName
  }

  tags: union(defaultTags, { Name: aksName })
}

var keyVaultName = join(
  [ env, svc, 'AKS', 'KV', envNum, padLeft(instance0, 3, '0') ], ''
)

resource keyVault 'Microsoft.KeyVault/vaults@2022-11-01' = {
  name: keyVaultName
  location: primaryRegion

  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }

    tenantId: subscription().tenantId
    enableRbacAuthorization: true
  }

  tags: union(defaultTags, { Name: keyVaultName })
}

resource privatelink_vaultcore_azure_net 'Microsoft.Network/privateDnsZones@2020-06-01' existing = {
  scope: resourceGroup(
    privateDnsResourceGroup.subscriptionId,
    privateDnsResourceGroup.name
  )
  name: 'privatelink.vaultcore.azure.net'
}

var keyVaultPrivateEndpointName = join(
  [ env, svc, 'KKV', 'PE', envNum, padLeft(instance0, 3, '0') ], ''
)

resource keyVaultPrivateEndpoint 'Microsoft.Network/privateEndpoints@2022-07-01' = {
  name: keyVaultPrivateEndpointName
  location: primaryRegion

  properties: {
    subnet: {
      id: subnets.data.id
    }

    privateLinkServiceConnections: [
      {
        name: keyVault.name
        properties: {
          privateLinkServiceId: keyVault.id
          groupIds: [ 'vault' ]
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: keyVaultPrivateEndpointName })

  resource dnsZoneGroup 'privateDnsZoneGroups' = {
    name: keyVault.name

    properties: {
      privateDnsZoneConfigs: [
        {
          name: 'privatelink.vaultcore.azure.net'
          properties: {
            privateDnsZoneId: privatelink_vaultcore_azure_net.id
          }
        }
      ]
    }
  }
}
