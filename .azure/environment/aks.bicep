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
param subnet object = {
  id: null
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
        vnetSubnetID: subnet.id
      }
      {
        name: 'user'
        count: 2
        vmSize: 'Standard_DS3_v2'
        osType: 'Linux'
        mode: 'User'
        vnetSubnetID: subnet.id
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
