import Boom from '@hapi/boom';
import { Logger } from 'winston';
import { paths } from '../lib/schema.v1';
import createClient from 'openapi-fetch';
import {
  CreatedPayment,
  PaymentFailureStatus,
  PaymentRecord,
  PaymentState,
  PaymentStateDict,
  PaymentStatusErrorCode,
} from '../model';

export interface ServiceChargeClient {
  createPayment(
    reference: string,
    returnUrl: string,
    description?: string,
    amount?: number,
  ): Promise<Omit<CreatedPayment, 'id'>>;
  getPayment(paymentId: string): Promise<Omit<PaymentRecord, 'id'>>;
  cancelPayment(paymentId: string): Promise<void>;
}

export default class GovUkPayServiceChargeClient
  implements ServiceChargeClient
{
  constructor(private logger: Logger) {}

  private readonly client = createClient<paths>({
    baseUrl: process.env['GOVUK_PAY_API_URL'],
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env['GOVUK_PAY_API_KEY']}`,
    },
  });

  async createPayment(
    reference: string,
    returnUrl: string,
    description = 'Annual waste tracking service charge',
    amount = 2000,
  ): Promise<Omit<CreatedPayment, 'id'>> {
    try {
      const { response, data, error } = await this.client.POST('/v1/payments', {
        body: {
          amount: amount,
          description: description,
          reference: reference,
          return_url: returnUrl,
        },
      });

      if (!response.ok) {
        if (error) {
          const boomErr = new Boom.Boom(`${error.code}: ${error.description}`, {
            statusCode: response.status,
          });
          this.logger.error('Gov.UK Pay API returned unsuccessful response', {
            error: boomErr.message,
          });
          throw boomErr;
        }

        throw new Boom.Boom(undefined, {
          statusCode: response.status,
        });
      }

      if (!data) {
        this.logger.error('Error receiving response data from Gov.UK Pay');
        throw Boom.internal();
      }

      return {
        amount: data.amount as number,
        description: data.description as string,
        reference: data.reference as string,
        paymentId: data.payment_id as string,
        createdDate: data.created_date as string,
        returnUrl: data.return_url as string,
        redirectUrl: data._links?.next_url?.href as string,
      };
    } catch (err) {
      this.logger.error('Gov.UK Pay API Unknown error', err);
      throw Boom.internal();
    }
  }

  async getPayment(paymentId: string): Promise<Omit<PaymentRecord, 'id'>> {
    try {
      const { response, data, error } = await this.client.GET(
        '/v1/payments/{paymentId}',
        {
          params: {
            path: { paymentId: paymentId },
          },
        },
      );

      if (!response.ok) {
        if (error) {
          const boomErr = new Boom.Boom(`${error.code}: ${error.description}`, {
            statusCode: response.status,
          });
          this.logger.error('Gov.UK Pay API returned unsuccessful response', {
            error: boomErr.message,
          });
          throw boomErr;
        }

        throw new Boom.Boom(undefined, {
          statusCode: response.status,
        });
      }

      if (!data) {
        throw Boom.notFound();
      }

      const paymentStatus = !data.state?.finished
        ? 'InProgress'
        : !data.state?.code
          ? 'Success'
          : PaymentStateDict[data.state?.code];

      const state: PaymentState =
        paymentStatus === 'Success'
          ? {
              status: paymentStatus,
              capturedDate: data.settlement_summary?.captured_date as string,
            }
          : paymentStatus === 'InProgress'
            ? {
                status: paymentStatus,
              }
            : {
                status: PaymentStateDict[
                  data.state?.code as string
                ] as PaymentFailureStatus,
                code: data.state?.code as PaymentStatusErrorCode,
              };

      return {
        amount: data.amount as number,
        description: data.description as string,
        reference: data.reference as string,
        paymentId: data.payment_id as string,
        state: state,
      };
    } catch (err) {
      this.logger.error('Gov.UK Pay API Unknown error', err);
      throw Boom.internal();
    }
  }

  async cancelPayment(paymentId: string): Promise<void> {
    try {
      const { response, data, error } = await this.client.POST(
        '/v1/payments/{paymentId}/cancel',
        {
          params: {
            path: { paymentId: paymentId },
          },
        },
      );
      console.log(response.status);
      console.log('Error: ############');
      console.log(error);

      if (!response.ok) {
        if (error) {
          const boomErr = new Boom.Boom(`${error.code}: ${error.description}`, {
            statusCode: response.status,
          });
          this.logger.error('Gov.UK Pay API returned unsuccessful response', {
            error: boomErr.message,
          });
          throw boomErr;
        }

        throw new Boom.Boom(undefined, {
          statusCode: response.status,
        });
      }

      if (!data) {
        this.logger.error('Error receiving response data from Gov.UK Pay');
        throw Boom.internal();
      }
    } catch (err) {
      this.logger.error('Gov.UK Pay API Unknown error', err);
      throw Boom.internal();
    }
  }
}
