# Install script for setting up cluster and related packages onto a management Windows machine
$WtsResourceGroupName = "SNDWTSAKSRG1401" # here enter the resources group name of your aks cluster
$AksName = "SNDWTSSPKKS1401" # here enter the name of your kubernetes resource

# az cli download: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli#install-or-update
# $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; Remove-Item .\AzureCLI.msi

# curl download: https://linuxhint.com/install-use-curl-windows/
# kubectl and kubelogin: az aks install-cli
# helm download: https://github.com/helm/helm/releases

az login
az feature register --namespace "Microsoft.ContainerService" --name "EnableWorkloadIdentityPreview"

az aks get-credentials -n $AksName -g $WtsResourceGroupName

kubectl get nodes
# It will prompt you to do the device code flow through the browser

$NginxNamespace = "nginx"
$NginxReleaseName = "nginx-ingress"
$NginxHelmRepoName = "nginx-stable"
$NginxHelmRepoUrl = "https://helm.nginx.com/stable/"
$NginxHelmChartName = "nginx-stable/nginx-ingress"
$NginxValuesFileName = "./values-nginx.yaml"

helm repo add $NginxHelmRepoName $NginxHelmRepoUrl
helm repo update
helm install $NginxReleaseName $NginxHelmChartName `
    --create-namespace `
    -n $NginxNamespace `
    -f $NginxValuesFileName 

# Wait for ALB Internal IP address to propagate onto the NGINX <EXTERNAL-IP> fields

$WorkloadFilePath = "demo.yaml"
kubectl apply -f $WorkloadFilePath

# Update App Gw to use the internal IP address of the ALB
# Update backendsettings with:
# - Override with specific domain name
# and
# - mysub.mydomain.com
