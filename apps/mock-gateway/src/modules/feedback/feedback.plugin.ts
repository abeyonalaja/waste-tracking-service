import { Application } from 'express';
import { validateSendFeedback } from './feedback.validation';
import { sendFeedback } from './feedback.backend';
import { BadRequestError, InternalServerError } from '../../libs/errors';

export default class FeedbackPlugin {
  constructor(private server: Application, private prefix: string) {}

  async register(): Promise<void> {
    this.server.post(this.prefix, async (req, res) => {
      if (!validateSendFeedback(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      try {
        res.jsonp(await sendFeedback());
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
