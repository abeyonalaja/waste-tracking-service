import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  createDraft,
  getDraftProducerAddressDetails,
  getDraftProducerContactDetail,
  getDrafts,
  setDraftProducerAddressDetails,
  getDraft,
  setDraftProducerContactDetail,
  setDraftWasteSource,
  getDraftWasteSource,
  getDraftWasteCollectionAddressDetails,
  setDraftWasteCollectionAddressDetails,
  createDraftSicCode,
  getDraftSicCodes,
} from './uk-waste-movements-submission.backend';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
  NotFoundError,
} from '../../lib/errors';
import { isValid } from 'date-fns';
import { User } from '../../lib/user';
import {
  validateCreateDraftRequest,
  validateSetDraftProducerAddressRequest,
  validateSetPartialDraftProducerAddressRequest,
  validateSetDraftProducerContactRequest,
  validateSetPartialDraftProducerContactRequest,
  validateSetDraftWasteSource,
  validateSetDraftWasteCollectionAddressRequest,
  validateSetPartialDraftWasteCollectionAddressRequest,
  validateCreateDraftSicCodeRequest,
} from './uk-waste-movements-submission.validation';

export default class UkwmSubmissionPlugin {
  constructor(
    private server: Application,
    private prefix: string,
  ) {}

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
            Number(dateArr[0]),
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
          req.query.wasteMovementId?.toString(),
        );

        return res.json(value as dto.UkwmGetDraftsResult);
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
        const user = req.user as User;
        const value = await getDraft({
          id: req.params.id,
          accountId: user.credentials.accountId,
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

    this.server.post(`${this.prefix}/drafts`, async (req, res) => {
      try {
        if (!validateCreateDraftRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const user = req.user as User;
        const result = await createDraft(
          req.body.reference,
          user.credentials.accountId,
        );

        return res.status(201).json(result);
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err);
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(
      `${this.prefix}/drafts/:id/producer-address`,
      async (req, res) => {
        try {
          const user = req.user as User;
          const value = await getDraftProducerAddressDetails({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(
            value as dto.UkwmGetDraftProducerAddressDetailsResponse,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.put(
      `${this.prefix}/drafts/:id/producer-address`,
      async (req, res) => {
        const saveAsDraftStr = req.query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const saveAsDraft: boolean = saveAsDraftStr === 'true';

        if (!saveAsDraft) {
          if (!validateSetDraftProducerAddressRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        } else {
          if (!validateSetPartialDraftProducerAddressRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        }
        const request =
          req.body as dto.UkwmSetDraftProducerAddressDetailsRequest;
        const user = req.user as User;
        try {
          await setDraftProducerAddressDetails(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
            saveAsDraft,
          );
          return res.json(
            request as dto.UkwmSetDraftProducerAddressDetailsRequest,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err);
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.get(
      `${this.prefix}/drafts/:id/producer-contact`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getDraftProducerContactDetail({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(
            value as dto.UkwmGetDraftProducerContactDetailResponse,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.put(
      `${this.prefix}/drafts/:id/producer-contact`,
      async (req, res) => {
        const saveAsDraftStr = req.query['saveAsDraft'] as string | undefined;
        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
        const saveAsDraft: boolean = saveAsDraftStr.toLowerCase() === 'true';
        if (!saveAsDraft) {
          if (!validateSetDraftProducerContactRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        } else {
          if (!validateSetPartialDraftProducerContactRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        }
        const request =
          req.body as dto.UkwmSetDraftProducerContactDetailRequest;
        const user = req.user as User;
        try {
          await setDraftProducerContactDetail(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
            saveAsDraft,
          );
          return res.json(
            request as dto.UkwmSetDraftProducerContactDetailRequest,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err);
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.get(
      `${this.prefix}/drafts/:id/waste-source`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getDraftWasteSource({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.UkwmGetDraftWasteSourceResponse);
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.put(
      `${this.prefix}/drafts/:id/waste-source`,
      async (req, res) => {
        if (!validateSetDraftWasteSource(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
        const request = req.body as dto.UkwmSetDraftWasteSourceRequest;
        const user = req.user as User;
        try {
          await setDraftWasteSource({
            id: req.params.id,
            accountId: user.credentials.accountId,
            wasteSource: request.wasteSource,
          });
          return res.json(request);
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err);
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.get(
      `${this.prefix}/drafts/:id/waste-collection-address`,
      async (req, res) => {
        try {
          const user = req.user as User;
          const value = await getDraftWasteCollectionAddressDetails({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(
            value as dto.UkwmGetDraftWasteCollectionAddressDetailsResponse,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json({ message: err.message });
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.put(
      `${this.prefix}/drafts/:id/waste-collection-address`,
      async (req, res) => {
        const saveAsDraftStr = req.query['saveAsDraft'] as string | undefined;

        if (
          !saveAsDraftStr ||
          !['true', 'false'].includes(saveAsDraftStr.toLowerCase())
        ) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const saveAsDraft: boolean = saveAsDraftStr === 'true';

        if (!saveAsDraft) {
          if (!validateSetDraftWasteCollectionAddressRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        } else {
          if (!validateSetPartialDraftWasteCollectionAddressRequest(req.body)) {
            return res.status(400).jsonp(new BadRequestError('Bad Request'));
          }
        }
        const request =
          req.body as dto.UkwmSetDraftWasteCollectionAddressDetailsRequest;
        const user = req.user as User;
        try {
          await setDraftWasteCollectionAddressDetails(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
            saveAsDraft,
          );
          return res.json(
            request as dto.UkwmSetDraftWasteCollectionAddressDetailsRequest,
          );
        } catch (err) {
          if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err);
          }
          console.log('Unknown error', { error: err });
          return res
            .status(500)
            .jsonp(
              new InternalServerError('An internal server error occurred'),
            );
        }
      },
    );

    this.server.get(`${this.prefix}/drafts/:id/sic-code`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getDraftSicCodes({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.UkwmGetDraftSicCodesResponse);
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

    this.server.post(`${this.prefix}/drafts/:id/sic-code`, async (req, res) => {
      try {
        if (!validateCreateDraftSicCodeRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
        const request = req.body as dto.UkwmCreateDraftSicCodeRequest;
        const user = req.user as User;
        const result = await createDraftSicCode({
          id: req.params.id,
          accountId: user.credentials.accountId,
          sicCode: request.sicCode,
        });
        return res.status(201).json(result);
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err);
        }
        console.log('Unknown error', { error: err });
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });
  }
}
