import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import multer from 'multer';
import { User } from '../../libs/user';
import {
  createBatch,
  getBatch,
  finalizeBatch,
} from './uk-waste-movements-bulk-submission.backend';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../../libs/errors';

const upload = multer();

export default class UkwmBulkSubmissionPlugin {
  constructor(private server: Application, private prefix: string) {}

  async register(): Promise<void> {
    this.server.post(this.prefix, upload.any(), async (req, res) => {
      if (!req.files) {
        return res.status(400).send('No files were uploaded.');
      }

      const inputs = (req.files as Express.Multer.File[]).map(
        (file: Express.Multer.File) => ({
          type: file.mimetype,
          data: file.buffer,
        })
      );

      const user = req.user as User;
      try {
        const batch = await createBatch(user.credentials.accountId, inputs);
        return res.status(201).json(batch);
      } catch (err) {
        if (err instanceof BadRequestError || err instanceof Error) {
          return err;
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/:id`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getBatch({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetBulkSubmissionResponse);
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

    this.server.post(`${this.prefix}/:id/finalize`, async (req, res) => {
      const user = req.user as User;
      try {
        return res.status(201).json(
          (await finalizeBatch({
            id: req.params.id,
            accountId: user.credentials.accountId,
          })) as undefined
        );
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
  }
}
