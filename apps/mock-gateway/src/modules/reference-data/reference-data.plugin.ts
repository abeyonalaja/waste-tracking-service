import { Application } from 'express';
import { DB } from '../../db';
import {
  listCountries,
  listDisposalCodes,
  listEWCCodes,
  listRecoveryCodes,
  listWasteCodes,
  listHazardousCodes,
  listPops,
} from './reference-data.backend';
import { InternalServerError } from '../../libs/errors';

export default class ReferenceDataPlugin {
  constructor(
    private server: Application,
    private prefix: string,
    private db: DB
  ) {}

  async register(): Promise<void> {
    this.server.get(`${this.prefix}/waste-codes`, async (req, res) => {
      try {
        res.jsonp(await listWasteCodes(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/ewc-codes`, async (req, res) => {
      try {
        res.jsonp(await listEWCCodes(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/countries`, async (req, res) => {
      try {
        res.jsonp(await listCountries(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/recovery-codes`, async (req, res) => {
      try {
        res.jsonp(await listRecoveryCodes(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/disposal-codes`, async (req, res) => {
      try {
        res.jsonp(await listDisposalCodes(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/hazardous-codes`, async (req, res) => {
      try {
        res.jsonp(await listHazardousCodes(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });

    this.server.get(`${this.prefix}/pops`, async (req, res) => {
      try {
        res.jsonp(await listPops(this.db));
      } catch (error) {
        console.log('Unknown error', { error: error });
        return res
          .status(500)
          .jsonp(new InternalServerError(`An internal server error occurred`));
      }
    });
  }
}
