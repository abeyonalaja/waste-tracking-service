$APP_NAME = "waste-tracking-gateway"
$CHART_VERSION = "0.1.0" # has to be the same as the one specified in the 'version' field in Chart.yaml
$NAMESPACE = $APP_NAME
$ACR_NAME = "SNDWTSHUBCR3401"

$FOLDER_PATH = ".\$APP_NAME"

$CHARTS_FOLDER_PATH = "$FOLDER_PATH\charts"
mkdir $CHARTS_FOLDER_PATH
helm package $FOLDER_PATH -d $CHARTS_FOLDER_PATH

$ACR_URL = "$ACR_NAME.azurecr.io"

helm registry logout $ACR_URL

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

$APPINSIGHTS_CONNECTION_STRING = Read-Host -Prompt "Enter your APPINSIGHTS_CONNECTION_STRING"

if ($APP_NAME -eq "address")
{
    $MSI_CLIENT_ID = Read-Host -Prompt "Enter your MSI_CLIENT_ID"
    $MSI_TENANT_ID = Read-Host -Prompt "Enter your MSI_TENANT_ID"
    $ADDRESS_LOOKUP_URL = Read-Host -Prompt "Enter your ADDRESS_LOOKUP_URL"
    $KEY_VAULT_NAME = Read-Host -Prompt "Enter your KEY_VAULT_NAME"
    $KEY_VAULT_TENANT_ID = Read-Host -Prompt "Enter your KEY_VAULT_TENANT_ID"
    $CERT_FOLDER = '/mnt/secrets-store/'
    $CERT_NAME = 'boomi-api-tst-cert'

    helm upgrade --install $APP_NAME $REMOTE_REPOSITORY_NAME `
        --version $CHART_VERSION `
        --create-namespace `
        -n $NAMESPACE `
        --set secret.env.APPINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONNECTION_STRING `
        --set secret.env.ADDRESS_LOOKUP_URL=$ADDRESS_LOOKUP_URL `
        --set secret.env.CERT_FOLDER=$CERT_FOLDER `
        --set secret.env.CERT_NAME=$CERT_NAME `
        --set serviceAccount.annotations."azure\.workload\.identity/client-id"=$MSI_CLIENT_ID `
        --set serviceAccount.annotations."azure\.workload\.identity/tenant-id"=$MSI_TENANT_ID `
        --set secretProviderClass.clientId=$MSI_CLIENT_ID `
        --set secretProviderClass.keyVault.name=$KEY_VAULT_NAME `
        --set secretProviderClass.keyVault.tenantId=$KEY_VAULT_TENANT_ID `
        --set volume.mountPath=$CERT_FOLDER
}
else
{
    helm upgrade --install $APP_NAME $REMOTE_REPOSITORY_NAME `
        --version $CHART_VERSION `
        --create-namespace `
        -n $NAMESPACE `
        --set secret.env.APPINSIGHTS_CONNECTION_STRING=$APPINSIGHTS_CONNECTION_STRING
}

helm get manifest $APP_NAME -n $NAMESPACE

rm -r -fo $CHARTS_FOLDER_PATH
