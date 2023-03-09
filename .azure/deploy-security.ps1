$DefraTenantId = "c9d74090-b4e6-4b04-981d-e6757a160812"
az login --tenant $DefraTenantId

$FirewallRgName = "SNDWTSFRWRG1401"
# Create resource group if not exists
az group create `
    --name $FirewallRgName `
    --location uksouth

$FirewallDeploymentName = "SNDWTSFRWLY1401"
# Deploy
az deployment group create `
    --name $FirewallDeploymentName `
    --resource-group $FirewallRgName `
    --template-file ".\security\main.bicep" `
    --parameters ".\security\main.params.json" `
    --debug