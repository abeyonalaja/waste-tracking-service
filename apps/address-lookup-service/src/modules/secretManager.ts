import { DaprClient } from '@dapr/dapr';
import { Logger } from 'winston';

interface Secret {
  boomi_client_cert_secret?: string;
}
const secretCache = new Map<string, Buffer>();
const dapr_secret_store = process.env.SECRET_STORE_NAME;
const secret_name = 'boomi_client_cert_secret';

export async function getSecret(
  daprClient: DaprClient,
  logger: Logger
): Promise<Buffer | undefined> {
  try {
    //Check secret store/name config
    if (secret_name === undefined || dapr_secret_store === undefined) {
      throw new Error('Secret name or secret store configuration is not set');
    }

    // Check for secret in the cache
    const cachedSecretValue = secretCache.get(secret_name);
    if (cachedSecretValue) {
      return cachedSecretValue;
    }

    //Get secret from secret store
    const secret: Secret = await daprClient.secret.get(
      dapr_secret_store,
      secret_name
    );
    if (secret === undefined) {
      throw new Error('Unable to get a secret from the secret store');
    }
    const secretValue = Buffer.from(
      JSON.stringify(secret.boomi_client_cert_secret),
      'base64'
    );

    // Store the secret value in the cache
    secretCache.set(secret_name, secretValue);
    return secretValue;
  } catch (error) {
    logger.error('Error during secret retrieval:', error);
  }
}
