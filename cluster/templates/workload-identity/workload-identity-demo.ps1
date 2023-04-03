# https://learn.microsoft.com/en-us/azure/aks/learn/tutorial-kubernetes-workload-identity
$WtsResourceGroupName = "SNDWTSAKSRG2401"
$AksName = "SNDWTSSPKKS2401"

$UserAssignedIdentityName = "workload-identity-demo"
$ServiceAccountName = "workload-identity-sa"
$ServiceAccountNamespace = "workload-identity-demo"
$FederatedIdentityName = "federated-identity-demo"
$KeyVaultName = "key-vault1-demo"
$KeyVaultSecretName = "workload-identity-secret"

$WorkloadIdentitySaManifest = "./workload-identity-sa.yaml"
$WorkloadIdentityAppManifest = "./workload-identity-demo.yaml"

az identity create  `
    --name $UserAssignedIdentityName `
    --resource-group $WtsResourceGroupName

# Used in the Service Account manifest
$UserAssignedIdentityClientId = $(az identity show --resource-group $WtsResourceGroupName --name $UserAssignedIdentityName --query 'clientId' -o tsv)

kubectl create ns $ServiceAccountNamespace
kubectl apply -f $WorkloadIdentitySaManifest

$AksOidcIssuer = $(az aks show -n $AksName -g $WtsResourceGroupName --query "oidcIssuerProfile.issuerUrl" -o tsv)
az identity federated-credential create `
    --name $FederatedIdentityName `
    --identity-name $UserAssignedIdentityName `
    --resource-group $WtsResourceGroupName `
    --issuer $AksOidcIssuer `
    --subject system:serviceaccount:"${ServiceAccountNamespace}":"${ServiceAccountName}" `
    --audience api://AzureADTokenExchange

az keyvault create `
    --resource-group $WtsResourceGroupName `
    --name $KeyVaultName 

az keyvault secret set `
    --vault-name $KeyVaultName `
    --name $KeyVaultSecretName `
    --value 'Hello!'

# Cannot change key vault to use RBAC permission model
# Details: action=Microsoft.Authorization/roleAssignments/write; 
$UserAssignedIdentityObjectId = $(az identity show --resource-group $WtsResourceGroupName --name $UserAssignedIdentityName --query 'principalId' -o tsv)
az keyvault set-policy `
    --name $KeyVaultName `
    --secret-permissions get `
    --object-id $UserAssignedIdentityObjectId
    
# Used as env vars in the demo pod
$KeyVaultUrl = $(az keyvault show -g $WtsResourceGroupName -n $KeyVaultName --query properties.vaultUri -o tsv)
# Ensure your application pods using workload identity have added the following label [azure.workload.identity/use: "true"] to your running pods/deployments, 
# otherwise the pods will fail once restarted.

kubectl apply -f $WorkloadIdentityAppManifest
