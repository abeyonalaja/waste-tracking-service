# https://github.com/diagrid-labs/dapr-on-aks
# Example would also work if redis and app with dapr component are in different k8s namespaces

$AppNamespace = "dapr-demo"
$RedisReleaseName = "redis"
$RedisHelmRepoName = "bitnami"
$RedisHelmRepoUrl = "https://charts.bitnami.com/bitnami"
$RedisHelmChartName = "bitnami/redis"
# To test AKS dapr extension installation with redis Helm chart as statestore
helm repo add $RedisHelmRepoName $RedisHelmRepoUrl
helm repo update
helm install $RedisReleaseName $RedisHelmChartName `
    --create-namespace `
    -n $AppNamespace

$DaprComponentManifest = "./components/statestore.yaml"
$DaprAppManfiest = "./dapr-demo.yaml"
kubectl apply -f $DaprComponentManifest
kubectl apply -f $DaprAppManfiest

