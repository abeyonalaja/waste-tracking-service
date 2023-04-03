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
param vmAdminUsername string = 'azadmin'

@description('''
  Reference to subnets in which to deploy _ado_ resources'.
''')
param adoSubnet object = {
  id: null
}

@description('Tagging baseline applied to all resources.')
param defaultTags object = {}

var role = 'HUB'

var instance0 = {
  northeurope: 1, westeurope: 201, uksouth: 401, ukwest: 601
}[primaryRegion]

var keyVaultName = join(
  [ env, svc, role, 'KV', envNum, padLeft(instance0, 3, '0') ], ''
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

var vmssName = join(
  [ env, svc, role, 'SS', envNum, padLeft(instance0, 3, '0') ], ''
)

resource vmss 'Microsoft.Compute/virtualMachineScaleSets@2022-11-01' = {
  name: vmssName
  location: primaryRegion

  sku: {
    name: 'Standard_D2_v3'
    capacity: 0
  }

  properties: {
    overprovision: false

    virtualMachineProfile: {
      storageProfile: {
        imageReference: {
          publisher: 'Canonical'
          offer: '0001-com-ubuntu-server-jammy'
          sku: '22_04-lts'
          version: 'latest'
        }

        osDisk: {
          caching: 'ReadOnly'
          createOption: 'FromImage'
        }
      }

      osProfile: {
        computerNamePrefix: vmssName
        adminUsername: vmAdminUsername
        linuxConfiguration: {
          ssh: {
            publicKeys: [
              {
                keyData: loadTextContent('./id_rsa.pub')
                path: '/home/${vmAdminUsername}/.ssh/authorized_keys'
              }
            ]
          }
        }
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
                      id: adoSubnet.id
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

  resource script 'extensions' = {
    name: 'CustomScript'

    properties: {
      publisher: 'Microsoft.Azure.Extensions'
      type: 'CustomScript'
      typeHandlerVersion: '2.1'

      settings: any({
        script: loadFileAsBase64('./script.sh')
      })
    }
  }

  tags: union(defaultTags, { Name: vmssName })
}
