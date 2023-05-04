import { DaprClient } from '@dapr/dapr';
import { Logger } from 'winston';
import { getSecret } from './secretManager';

jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  }),
}));

describe('getSecret', () => {
  let mockDaprClient: jest.Mocked<DaprClient>;
  let mockLogger: Logger;

  beforeEach(() => {
    mockDaprClient = {
      secret: {
        get: jest.fn(),
      },
    } as unknown as jest.Mocked<DaprClient>;

    mockLogger = {
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
    } as unknown as Logger;

    jest.clearAllMocks();
  });

  it('gets the secret from the secret store if it is not cached', async () => {
    const mockSecret = { boomi_client_cert_secret: 'my-secret' };
    const mockSecretValue = Buffer.from('"my-secret"', 'base64');
    (mockDaprClient.secret.get as jest.Mock).mockResolvedValueOnce(mockSecret);

    const result = await getSecret(mockDaprClient, mockLogger);

    expect(mockDaprClient.secret.get).toHaveBeenCalledWith(
      process.env.SECRET_STORE_NAME,
      'boomi_client_cert_secret'
    );
    expect(result).toEqual(mockSecretValue);
  });
});
