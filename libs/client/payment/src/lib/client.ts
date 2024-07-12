import { DaprClient, HttpMethod } from '@dapr/dapr';
import {
  CancelPaymentRequest,
  CancelPaymentResponse,
  CreatePaymentRequest,
  CreatePaymentResponse,
  GetPaymentRequest,
  GetPaymentResponse,
  SetPaymentRequest,
  SetPaymentResponse,
  createPayment,
  getPayment,
  setPayment,
  cancelPayment,
} from '@wts/api/payment';

export class DaprPaymentClient {
  constructor(
    private daprClient: DaprClient,
    private paymentAppId: string,
  ) {}

  async createPayment(
    req: CreatePaymentRequest,
  ): Promise<CreatePaymentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.paymentAppId,
      createPayment.name,
      HttpMethod.POST,
      req,
    )) as CreatePaymentResponse;
  }

  async setPayment(req: SetPaymentRequest): Promise<SetPaymentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.paymentAppId,
      setPayment.name,
      HttpMethod.POST,
      req,
    )) as SetPaymentResponse;
  }

  async getPayment(req: GetPaymentRequest): Promise<GetPaymentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.paymentAppId,
      getPayment.name,
      HttpMethod.POST,
      req,
    )) as GetPaymentResponse;
  }

  async cancelPayment(
    req: CancelPaymentRequest,
  ): Promise<CancelPaymentResponse> {
    return (await this.daprClient.invoker.invoke(
      this.paymentAppId,
      cancelPayment.name,
      HttpMethod.POST,
      req,
    )) as CancelPaymentResponse;
  }
}
