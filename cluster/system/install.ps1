# Install script for setting up cluster and related packages onto a management Windows machine

# az cli download: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows?tabs=azure-cli#install-or-update
# $ProgressPreference = 'SilentlyContinue'; Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi; Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'; Remove-Item .\AzureCLI.msi

# curl download: https://linuxhint.com/install-use-curl-windows/
# kubectl and kubelogin: az aks install-cli
# helm download: https://github.com/helm/helm/releases

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
$NginxValuesFileName = "./values-nginx.yaml"

helm repo add $NginxHelmRepoName $NginxHelmRepoUrl
helm repo update
helm install $NginxReleaseName $NginxHelmChartName `
    --create-namespace `
    -n $NginxNamespace `
    -f $NginxValuesFileName 

# Wait for ALB Internal/External IP address to propagate onto the NGINX Ingress Controller svc loadBalancer <EXTERNAL-IP> field
