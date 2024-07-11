import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import { validateCreatePaymentRequest } from './payment.validation';
import {
  createPayment,
  setPayment,
  getPayment,
  cancelPayment,
} from './payment.backend';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
} from '../../lib/errors';
import { User } from '../../lib/user';

export default class FeedbackPlugin {
  constructor(
    private server: Application,
    private prefix: string,
  ) {}

  async register(): Promise<void> {
    this.server.post(this.prefix, async (req, res) => {
      if (!validateCreatePaymentRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.CreatePaymentRequest;
      const user = req.user as User;

      try {
        return res
          .status(201)
          .jsonp(
            (await createPayment(
              user.credentials.accountId,
              request,
            )) as dto.CreatePaymentResponse,
          );
      } catch (error) {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ message: error.message });
        }
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.put(`${this.prefix}/:id`, async (req, res) => {
      const user = req.user as User;
      try {
        return res.json(
          (await setPayment({
            id: req.params.id,
            accountId: user.credentials.accountId,
          })) as dto.SetPaymentResponse,
        );
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json({ message: err.message });
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}`, async (req, res) => {
      const user = req.user as User;
      try {
        return res.json(
          (await getPayment(
            user.credentials.accountId,
          )) as dto.GetPaymentResponse,
        );
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json({ message: err.message });
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    // Added to mock Gov.UK Pay cancel by service scenario
    this.server.post(`${this.prefix}/:paymentId/cancel`, async (req, res) => {
      const user = req.user as User;

      try {
        return res
          .status(204)
          .jsonp(
            await cancelPayment(
              req.params.paymentId,
              user.credentials.accountId,
            ),
          );
      } catch (error) {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json({ message: error.message });
        }
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
