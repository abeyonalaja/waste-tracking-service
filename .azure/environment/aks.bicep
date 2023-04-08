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

@description('Reference to existing AAD Group for cluster Admin access.')
param clusterAdminGroupObjectIds array = []

@description('Reference to existing user-assigned managed identites.')
param identities object = {
  aks: {
    id: null
  }
  kubelet: {
    id: null
  }
}

@description('Reference to created Log Analytics Worspace resource.')
param logAnalyticsWorkspace object = {
  id: null
  name: null
}

@description('Admin username assigned to created Virtual Machines.')
param vmAdminUsername string = 'azadmin'

@description('Kubernetes version to be installed on AKS.')
param kubernetesVersion string = '1.24.10'

@description('AKS virtual machine size.')
param aksVmSize string = 'Standard_DS2_v2'

@description('AKS outbound traffic type.')
param aksOutboundType string = 'loadBalancer'

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

var loadBalancerPublicIpName = join(
  [ env, svc, 'ALB', 'IP', envNum, padLeft(instance0, 3, '0') ], ''
)

resource loadBalancerPublicIp 'Microsoft.Network/publicIPAddresses@2022-07-01' = {
  name: loadBalancerPublicIpName
  location: primaryRegion
  sku: {
    name: 'Standard'
  }
  properties: {
    publicIPAllocationMethod: 'Static'
  }
  tags: union(defaultTags, { Name: loadBalancerPublicIpName })
}

resource aks 'Microsoft.ContainerService/managedClusters@2023-01-02-preview' = {
  name: aksName
  location: primaryRegion
  tags: union(defaultTags, { Name: aksName })
  sku: {
    name: 'Basic'
    tier: 'Free'
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identities.aks.id}': {}
    }
  }
  properties: {
    aadProfile: {
      enableAzureRBAC: true
      managed: true
      adminGroupObjectIDs: clusterAdminGroupObjectIds
      tenantID: subscription().tenantId
    }
    addonProfiles: {
      omsagent: {
        config: {
          logAnalyticsWorkspaceResourceID: logAnalyticsWorkspace.id
        }
        enabled: true
      }
    }
    agentPoolProfiles: [
      {
        availabilityZones: [ '1', '2', '3' ]
        count: 3
        enableAutoScaling: true
        maxCount: 5
        maxPods: 110
        minCount: 3
        mode: 'System'
        name: 'nodepool1'
        nodeTaints: [ 'CriticalAddonsOnly=true:NoSchedule' ]
        osDiskSizeGB: 128
        osDiskType: 'Managed'
        osType: 'Linux'
        osSKU: 'Ubuntu'
        type: 'VirtualMachineScaleSets'
        vmSize: aksVmSize
        vnetSubnetID: subnets.aks.id
      }
      {
        availabilityZones: [ '1', '2', '3' ]
        count: 2
        enableAutoScaling: true
        maxCount: 5
        maxPods: 110
        minCount: 2
        mode: 'User'
        name: 'nodepool2'
        nodeTaints: []
        osDiskSizeGB: 128
        osDiskType: 'Managed'
        osType: 'Linux'
        osSKU: 'Ubuntu'
        type: 'VirtualMachineScaleSets'
        vmSize: aksVmSize
        vnetSubnetID: subnets.aks.id
      }
    ]
    apiServerAccessProfile: {
      enablePrivateCluster: false
    }
    autoScalerProfile: {
      'balance-similar-node-groups': 'false'
      'expander': 'random'
      'max-empty-bulk-delete': '10'
      'max-graceful-termination-sec': '600'
      'max-node-provision-time': '15m'
      'max-total-unready-percentage': '45'
      'new-pod-scale-up-delay': '0s'
      'ok-total-unready-count': '3'
      'scale-down-delay-after-add': '10m'
      'scale-down-delay-after-delete': '10s'
      'scale-down-delay-after-failure': '3m'
      'scale-down-unneeded-time': '10m'
      'scale-down-unready-time': '20m'
      'scale-down-utilization-threshold': '0.5'
      'scan-interval': '10s'
      'skip-nodes-with-local-storage': 'false'
      'skip-nodes-with-system-pods': 'true'
    }
    disableLocalAccounts: true
    dnsPrefix: toLower(svc)
    enableRBAC: true
    identityProfile: {
      kubeletidentity: {
        resourceId: identities.kubelet.id
      }
    }
    kubernetesVersion: kubernetesVersion
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
    networkProfile: {
      dnsServiceIP: '10.0.0.10'
      dockerBridgeCidr: '172.17.0.1/16'
      loadBalancerSku: 'Standard'
      networkPlugin: 'kubenet'
      networkPolicy: 'calico'
      outboundType: aksOutboundType
      serviceCidr: '10.0.0.0/16'
    }
    nodeResourceGroup: aksName
    oidcIssuerProfile: {
      enabled: true
    }
    securityProfile: {
      workloadIdentity: {
        enabled: true
      }
    }
  }
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
