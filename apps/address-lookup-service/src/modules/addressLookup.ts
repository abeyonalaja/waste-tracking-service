import https from 'https';
import axios from 'axios';
import { Logger } from 'winston';
import { getSecret } from './secretManager';
import { DaprClient } from '@dapr/dapr';

export interface AddressInfo {
  Address: {
    AddressLine: string;
    SubBuildingName: string;
    BuildingName: string;
    Street: string;
    Town: string;
    County: string;
    Postcode: string;
    Country: string;
  };
}

export async function findAddressByPostcode(
  postcode: string,
  daprClient: DaprClient,
  logger: Logger
): Promise<AddressInfo[] | undefined> {
  //Get secret from dapr state/secret store
  const secret: Buffer | undefined = await getSecret(daprClient, logger);
  const options = {
    httpsAgent: new https.Agent({
      pfx: secret,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    //Set the environment
    const URL = process.env.BOOMI_ADDRESS_LOOKUP_ENDPOINT;
    if (URL === undefined) {
      throw new Error('URL config is not set');
    }
    //Address lookup
    const response = await axios.get(
      `${URL}postcodes?postcode=${postcode}`,
      options
    );
    if (response.data.results === undefined) {
      return undefined;
    }
    return response.data.results;
  } catch (error: any) {
    logger.error('Error during address lookup:', error);
  }
}
