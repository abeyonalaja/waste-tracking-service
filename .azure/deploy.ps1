$DefraTenantId = "c9d74090-b4e6-4b04-981d-e6757a160812"
az login --tenant $DefraTenantId

az feature register --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

$FirewallRgName = "SNDWTSFRWRG1401"
$WtsRgName = "SNDWTSAKSRG1401"
# Create resource group if not exists
az group create `
    --name $WtsRgName `
    --location uksouth

# Cannot create the AAD Group
# Will need an object Id to supply Cluster Admin group
$SshPrivateKeyFilePath = "$env:USERPROFILE/.ssh/aks"
$SshPublicKeyFilePath = "$SshPrivateKeyFilePath.pub"
$SshKeyFileUsername = "azureuser"
$SshKeyFilePassword = "DefraWts1!"
New-Item $SshPrivateKeyFilePath
# To generate the SSH key
ssh-keygen `
    -m PEM `
    -t rsa `
    -b 4096 `
    -C $SshKeyFileUsername `
    -f $SshPrivateKeyFilePath `
    -N $SshKeyFilePassword

$SshPublicKey = Get-Content -Path $SshPublicKeyFilePath -Raw

$FirewallPublicIpName = "SNDWTSFRWIP1401"
$FwPublicIp=$(az network public-ip show -g $FirewallRgName -n $FirewallPublicIpName --query "ipAddress" -o tsv)

$LocalMachineIp = ""

$WtsInfraDeploymentName = "SNDWTSINFLY1401"
az deployment group create `
    --name $WtsInfraDeploymentName `
    --resource-group $WtsRgName `
    --template-file ".\main.bicep" `
    --parameters ".\main.params.json" `
    --parameters linuxAdminUsername=$SshKeyFileUsername `
    --parameters sshRsaPublicKeyValue=$SshPublicKey `
    --debug