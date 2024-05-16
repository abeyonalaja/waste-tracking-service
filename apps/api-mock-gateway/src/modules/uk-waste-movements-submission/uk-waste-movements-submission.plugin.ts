import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  getDrafts,
  getUkwmSubmission,
} from './uk-waste-movements-submission.backend';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../../lib/errors';
import { isValid } from 'date-fns';

export default class UkwmSubmissionPlugin {
  constructor(private server: Application, private prefix: string) {}

  async register(): Promise<void> {
    this.server.get(`${this.prefix}/drafts`, async (req, res) => {
      try {
        const page = Number(req.query.page);
        if (!page || page <= 0) {
          return res.status(400).jsonp(new BadRequestError('Invalid page'));
        }
        const dateArr = req.query.collectionDate
          ?.toString()
          ?.replace(/-/g, '/')
          .split('/');
        let collectionDate: Date | undefined;

        if (dateArr?.length === 3) {
          collectionDate = new Date(
            Number(dateArr[2]),
            Number(dateArr[1]) - 1,
            Number(dateArr[0])
          );
          if (
            !isValid(collectionDate) ||
            !(collectionDate.getMonth() + 1 === Number(dateArr[1]))
          ) {
            return res
              .status(400)
              .jsonp(new BadRequestError('Invalid collection date'));
          }
        }

        const pageSize = Number(req.query.pageSize) || 15;

        const value = await getDrafts(
          page,
          pageSize,
          collectionDate,
          req.query.ewcCode?.toString(),
          req.query.producerName?.toString(),
          req.query.wasteMovementId?.toString()
        );
        return res.json(value as dto.GetUwkwmDraftsResponse);
      } catch (err) {
        if (err instanceof NotFoundError) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/drafts/:id`, async (req, res) => {
      try {
        const value = await getUkwmSubmission({
          id: req.params.id,
        });

        return res.json(value as dto.GetUkwmSubmissionResponse);
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
  }
}
