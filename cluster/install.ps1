# Install script for setting up cluster and related packages onto a management Windows machine

# az cli download: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli#install-or-update
# $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; Remove-Item .\AzureCLI.msi

# curl download: https://linuxhint.com/install-use-curl-windows/
# kubectl and kubelogin: az aks install-cli
# helm download: https://github.com/helm/helm/releases

az login

$WtsResourceGroupName = "SNDWTSAKSRG2401"
$AksName = "SNDWTSSPKKS2401"
az aks get-credentials -n $AksName -g $WtsResourceGroupName

kubectl get nodes
# It will prompt you to do the device code flow through the browser

$NginxNamespace = "nginx-system"
# NGINX Inc IC:
# $NginxReleaseName = "nginx-ingress"
# $NginxHelmRepoName = "nginx-stable"
# $NginxHelmRepoUrl = "https://helm.nginx.com/stable/"
# $NginxHelmChartName = "nginx-stable/nginx-ingress"
# $NginxValuesFileName = "./values-nginx.yaml"
# Kubernetes NGINX IC
$NginxReleaseName = "ingress-nginx"
$NginxHelmRepoName = "ingress-nginx"
$NginxHelmRepoUrl = "https://kubernetes.github.io/ingress-nginx"
$NginxHelmChartName = "ingress-nginx/ingress-nginx"
$NginxValuesFileName = "./values-k8s-nginx.yaml"

helm repo add $NginxHelmRepoName $NginxHelmRepoUrl
helm repo update
helm install $NginxReleaseName $NginxHelmChartName `
    --create-namespace `
    -n $NginxNamespace `
    -f $NginxValuesFileName 

# Wait for ALB Internal/External IP address to propagate onto the NGINX Ingress Controller svc loadBalancer <EXTERNAL-IP> field

# This will ask Is Dapr already installed in the cluster? (y/N): N
az k8s-extension create --cluster-type managedClusters `
    --cluster-name $AksName `
    --resource-group $WtsResourceGroupName `
    --name dapr `
    --extension-type Microsoft.Dapr `
    --auto-upgrade-minor-version true `
    --configuration-settings "global.ha.enabled=true" `
    --configuration-settings "dapr_operator.replicaCount=2"

# To open the Dapr dashboard
dapr dashboard -k

# If cluster OIDC issuer is not enable since AKS creation
az aks update -g $WtsResourceGroupName -n $AksName --enable-oidc-issuer

# EnableWorkloadIdentityPreview feature has to be registered to Microsoft.ContainerService
az feature register --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

# Bicep template deployment does not require anything further
# --enable-workload-identity comes from az CLI aks-preview as of 29/03/2023
# az extension add --name aks-preview
# az aks update -g $WtsResourceGroupName -n $AksName --enable-workload-identity
# Use Helm chart if any issue with public preview (Helm chart is GA)
# https://azure.github.io/azure-workload-identity/docs/installation/mutating-admission-webhook.html

# For auto-updates, cluster can be upgraded, see property:
# autoUpgradeProfile: {
#     nodeOSUpgradeChannel: 'NodeImage'
#     upgradeChannel: 'stable'
#   }
$KuredNamespace = "kured-system"
$KuredReleaseName = "kured"
$KuredHelmRepoName = "kubereboot"
$KuredHelmRepoUrl = "https://kubereboot.github.io/charts"
$KuredHelmChartName = "kubereboot/kured"
$KuredValuesFileName = "./values-kured.yaml"

helm repo add $KuredHelmRepoName $KuredHelmRepoUrl
helm repo update
helm install $KuredReleaseName $KuredHelmChartName `
    --create-namespace `
    -n $KuredNamespace `
    -f $KuredValuesFileName 

