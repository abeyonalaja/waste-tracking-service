$APP_NAME = "waste-tracking-gateway"
$CHART_VERSION = "0.1.0" # has to be the same as the one specified in the 'version' field in Chart.yaml
$NAMESPACE = $APP_NAME
$ACR_NAME = "SNDWTSHUBCR3401"

$FOLDER_PATH = ".\$APP_NAME"
$VALUES_PATH = "$FOLDER_PATH\values.yaml"

$CHARTS_FOLDER_PATH = "$FOLDER_PATH\charts"
mkdir $CHARTS_FOLDER_PATH
helm package $FOLDER_PATH -d $CHARTS_FOLDER_PATH

$ACR_URL = "$ACR_NAME.azurecr.io"

# Preview:
$USER_NAME = "helmtoken"
$PASSWORD = $(az acr token create -n $USER_NAME `
                  -r $ACR_NAME `
                  --scope-map _repositories_admin `
                  --only-show-errors `
                  --query "credentials.passwords[0].value" -o tsv)

helm registry login $ACR_URL `
    --username $USER_NAME `
    --password $PASSWORD

$CHART_NAME = "$CHARTS_FOLDER_PATH\$APP_NAME-$CHART_VERSION.tgz"
$REPOSITORY_NAME = "oci://$ACR_URL/helm"
helm push $CHART_NAME $REPOSITORY_NAME

$REMOTE_REPOSITORY_NAME = "$REPOSITORY_NAME/$APP_NAME"
if ($APP_NAME -eq "annex-vii" -or $APP_NAME -eq "waste-tracking-gateway")
{
    $APPINSIGHTS_CONNECTION_STRING= Read-Host -Prompt "Enter your APPINSIGHTS_CONNECTION_STRING: "

    helm upgrade --install $APP_NAME $REMOTE_REPOSITORY_NAME `
    --version $CHART_VERSION `
    --create-namespace `
    -n $NAMESPACE `
    --set secret.env.APPINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONNECTION_STRING
}
else 
{
    helm upgrade --install $APP_NAME $REMOTE_REPOSITORY_NAME `
    --version $CHART_VERSION `
    --create-namespace `
    -n $NAMESPACE `
    --values $VALUES_PATH
}

helm get manifest $APP_NAME -n $NAMESPACE

rm -r -fo $CHARTS_FOLDER_PATH
