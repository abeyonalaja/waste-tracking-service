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

@description('Admin username assigned to created Virtual Machines.')
param adminUsername string = 'vmssadmin'

@description('''
  References to subnets in which to deploy _ado_ and _bastion_ resources'.
''')
param subnets object = {
  ado: {
    id: null
  }
  bastion: {
    id: null
  }
}

@secure()
@description('Admin password assigned to created Virtual Machines.')
param adminPassword string

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var bastionPublicIpName = join(
  [ env, svc, 'BAS', 'IP', envNum, padLeft(instance0, 3, '0') ], ''
)

resource bastionPublicIp 'Microsoft.Network/publicIPAddresses@2022-07-01' = {
  name: bastionPublicIpName
  location: primaryRegion

  sku: {
    name: 'Standard'
  }

  properties: {
    publicIPAllocationMethod: 'Static'
  }

  tags: union(defaultTags, { Name: bastionPublicIpName })
}

var bastionName = join(
  [ env, svc, role, 'BA', envNum, padLeft(instance0, 3, '0') ], ''
)

resource bastion 'Microsoft.Network/bastionHosts@2022-07-01' = {
  name: bastionName
  location: primaryRegion

  properties: {
    ipConfigurations: [
      {
        name: 'default'

        properties: {
          publicIPAddress: {
            id: bastionPublicIp.id
          }

          subnet: {
            id: subnets.bastion.id
          }
        }
      }
    ]
  }

  tags: union(defaultTags, { Name: bastionName })
}

var vmssName = join(
  [ env, svc, role, 'SS', envNum, padLeft(instance0, 3, '0') ], ''
)

resource vmss 'Microsoft.Compute/virtualMachineScaleSets@2022-11-01' = {
  name: vmssName
  location: primaryRegion

  sku: {
    name: 'Standard_A1_v2'
    capacity: 1
  }

  properties: {
    overprovision: false

    virtualMachineProfile: {

      storageProfile: {
        imageReference: {
          publisher: 'MicrosoftWindowsServer'
          offer: 'WindowsServer'
          sku: '2016-Datacenter'
          version: 'latest'
        }
      }

      osProfile: {
        computerNamePrefix: take(vmssName, 9)
        adminUsername: adminUsername
        adminPassword: adminPassword
      }

      networkProfile: {
        networkInterfaceConfigurations: [
          {
            name: 'default'
            properties: {
              primary: true
              ipConfigurations: [
                {
                  name: 'internal'
                  properties: {
                    primary: true
                    subnet: {
                      id: subnets.ado.id
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    }

    upgradePolicy: {
      mode: 'Automatic'
    }
  }

  tags: union(defaultTags, { Name: bastionName })
}
