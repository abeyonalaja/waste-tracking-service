import { Application } from 'express';
import { DB } from '../../db';
import { listAddresses } from './address.backend';
import { BadRequestError, InternalServerError } from '../../lib/errors';

export default class AddressPlugin {
  constructor(
    private server: Application,
    private prefix: string,
    private db: DB
  ) {}

  async register(): Promise<void> {
    this.server.get(this.prefix, async (req, res) => {
      const postcode = req.query['postcode'] as string | undefined;
      if (!postcode) {
        return res
          .status(400)
          .json(new BadRequestError("Missing query parameter 'postcode'"));
      }
      const buildingNameOrNumber = req.query['buildingNameOrNumber'] as
        | string
        | undefined;

      try {
        res.jsonp(await listAddresses(this.db, postcode, buildingNameOrNumber));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
