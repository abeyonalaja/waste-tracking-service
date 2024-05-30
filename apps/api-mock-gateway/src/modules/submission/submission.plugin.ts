import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  validateCreateSubmissionRequest,
  validatePutWasteDescriptionRequest,
  validatePutReferenceRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validateCreateCarriersRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validatePutExitLocationRequest,
  validatePutTransitCountriesRequest,
  validateSetRecoveryFacilityDetailRequest,
  validateCreateRecoveryFacilityDetailRequest,
  validatePutSubmissionConfirmationRequest,
  validatePutSubmissionDeclarationRequest,
  validatePutSubmissionCancellationRequest,
  validatePutDraftCollectionDateRequest,
  validatePutDraftWasteQuantityRequest,
  validatePutSubmissionCollectionDateRequest,
  validatePutSubmissionWasteQuantityRequest,
} from './submission.validation';
import {
  getSubmissions,
  getSubmission,
  createSubmission,
  createSubmissionFromTemplate,
  deleteSubmission,
  cancelSubmission,
  getWasteDescription,
  setWasteDescription,
  getWasteQuantity,
  setWasteQuantity,
  getCustomerReference,
  setCustomerReference,
  getExporterDetail,
  setExporterDetail,
  getImporterDetail,
  setImporterDetail,
  getCollectionDate,
  setCollectionDate,
  listCarriers,
  createCarriers,
  getCarriers,
  setCarriers,
  deleteCarriers,
  getCollectionDetail,
  setCollectionDetail,
  getExitLocation,
  setExitLocation,
  getTransitCountries,
  setTransitCountries,
  listRecoveryFacilityDetail,
  createRecoveryFacilityDetail,
  getRecoveryFacilityDetail,
  setRecoveryFacilityDetail,
  deleteRecoveryFacilityDetail,
  getSubmissionConfirmation,
  updateSubmissionConfirmation,
  getSubmissionDeclaration,
  updateSubmissionDeclaration,
  getNumberOfSubmissions,
} from './submission.backend';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
} from '../../lib/errors';
import { User } from '../../lib/user';

export default class SubmissionPlugin {
  constructor(
    private server: Application,
    private prefix: string,
  ) {}

  async register(): Promise<void> {
    this.server.get(this.prefix, async (req, res) => {
      let order = req.query['order'] as string | undefined;
      if (!order) {
        order = 'ASC';
      }
      order = order.toUpperCase();
      if (order !== 'ASC' && order !== 'DESC') {
        return res
          .status(400)
          .jsonp(
            new BadRequestError("Incorrect value for query parameter 'order'"),
          );
      }

      const pageLimitStr = req.query['pageLimit'] as string | undefined;
      if (pageLimitStr && Number.isNaN(parseInt(pageLimitStr))) {
        return res
          .status(400)
          .jsonp(
            new BadRequestError(
              "Query parameter 'pageLimit' should be a number",
            ),
          );
      }

      const pageLimit = pageLimitStr ? parseInt(pageLimitStr) : undefined;

      const stateStr = req.query['state'] as string | undefined;
      let state: dto.SubmissionState['status'][] | undefined;
      if (stateStr) {
        state = stateStr
          .replace(/\s/g, '')
          .split(',')
          .map((i) => i as dto.SubmissionState['status']);
      }

      const token = req.query['paginationToken'] as string | undefined;
      const user = req.user as User;
      try {
        const value = await getSubmissions(
          user.credentials.accountId,
          { order },
          pageLimit,
          state,
          token,
        );
        return res.json(value as dto.GetSubmissionsResponse);
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

    this.server.get(`${this.prefix}/numberOfSubmissions`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getNumberOfSubmissions(user.credentials.accountId);
        return res.json(value as dto.GetNumberOfSubmissionsResponse);
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

    this.server.get(`${this.prefix}/:id`, async (req, res) => {
      const submittedStr = req.query['submitted'] as string | undefined;
      let submitted = false;
      if (submittedStr) {
        try {
          submitted = JSON.parse(submittedStr.toLowerCase());
        } catch (err) {
          return res
            .status(400)
            .send("Query parameter 'submitted' must be of type boolean");
        }
      }
      try {
        const user = req.user as User;
        const value = await getSubmission({
          id: req.params.id,
          accountId: user.credentials.accountId,
          submitted,
        });

        return res.json(value as dto.GetSubmissionResponse);
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
    this.server.post(this.prefix, async (req, res) => {
      if (!validateCreateSubmissionRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }
      const { reference } = req.body as unknown as dto.CreateSubmissionRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .jsonp(
            (await createSubmission(
              user.credentials.accountId,
              reference,
            )) as dto.CreateSubmissionResponse,
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

    this.server.post(`${this.prefix}/copy-template/:id`, async (req, res) => {
      if (!validateCreateSubmissionRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }
      const { reference } = req.body as unknown as dto.CreateSubmissionRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .jsonp(
            (await createSubmissionFromTemplate(
              req.params.id,
              user.credentials.accountId,
              reference,
            )) as dto.CreateSubmissionResponse,
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

    this.server.delete(`${this.prefix}/:id`, async (req, res) => {
      const user = req.user as User;
      try {
        return res.status(204).json(
          (await deleteSubmission({
            id: req.params.id,
            accountId: user.credentials.accountId,
          })) as undefined,
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

    this.server.put(`${this.prefix}/:id/cancel`, async (req, res) => {
      if (!validatePutSubmissionCancellationRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.PutSubmissionCancellationRequest;
      const user = req.user as User;
      try {
        await cancelSubmission(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
          },
          request,
        );
        return res.json(request as dto.PutSubmissionCancellationReponse);
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

    this.server.get(
      `${this.prefix}/:id/waste-description`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getWasteDescription({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.GetWasteDescriptionResponse);
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
      `${this.prefix}/:id/waste-description`,
      async (req, res) => {
        if (!validatePutWasteDescriptionRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.WasteDescription;
        const user = req.user as User;
        try {
          await setWasteDescription(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          );
          return res.json(request as dto.PutWasteDescriptionResponse);
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

    this.server.get(`${this.prefix}/:id/waste-quantity`, async (req, res) => {
      const submittedStr = req.query['submitted'] as string | undefined;
      let submitted = false;
      if (submittedStr) {
        try {
          submitted = JSON.parse(submittedStr.toLowerCase());
        } catch (err) {
          return res
            .status(400)
            .send("Query parameter 'submitted' must be of type boolean");
        }
      }
      const user = req.user as User;
      try {
        const value = await getWasteQuantity({
          id: req.params.id,
          accountId: user.credentials.accountId,
          submitted,
        });
        return res.json(value as dto.GetWasteQuantityResponse);
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

    this.server.put(`${this.prefix}/:id/waste-quantity`, async (req, res) => {
      const submittedStr = req.query['submitted'] as string | undefined;
      let submitted = false;
      if (submittedStr) {
        try {
          submitted = JSON.parse(submittedStr.toLowerCase());
        } catch (err) {
          return res
            .status(400)
            .send("Query parameter 'submitted' must be of type boolean");
        }
      }

      if (!submitted) {
        if (!validatePutDraftWasteQuantityRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
      } else {
        if (!validatePutSubmissionWasteQuantityRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
      }

      const request = req.body as dto.PutWasteQuantityRequest;
      const user = req.user as User;
      try {
        await setWasteQuantity(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
            submitted,
          },
          request,
        );
        return res.json(request as dto.PutWasteDescriptionRequest);
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

    this.server.get(`${this.prefix}/:id/reference`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getCustomerReference({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetReferenceResponse);
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

    this.server.put(`${this.prefix}/:id/reference`, async (req, res) => {
      if (!validatePutReferenceRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.PutReferenceRequest;
      const user = req.user as User;
      try {
        await setCustomerReference(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
          },
          request,
        );
        return res.json(request as dto.PutReferenceResponse);
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

    this.server.get(`${this.prefix}/:id/exporter-detail`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getExporterDetail({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetExporterDetailResponse);
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

    this.server.put(`${this.prefix}/:id/exporter-detail`, async (req, res) => {
      if (!validatePutExporterDetailRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.PutExporterDetailRequest;
      const user = req.user as User;
      try {
        await setExporterDetail(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
          },
          request,
        );
        return res.json(request as dto.PutExporterDetailResponse);
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

    this.server.get(`${this.prefix}/:id/importer-detail`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getImporterDetail({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetImporterDetailResponse);
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

    this.server.put(`${this.prefix}/:id/importer-detail`, async (req, res) => {
      if (!validatePutImporterDetailRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.PutImporterDetailRequest;
      const user = req.user as User;
      try {
        await setImporterDetail(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
          },
          request,
        );
        return res.json(request as dto.PutImporterDetailResponse);
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

    this.server.get(`${this.prefix}/:id/collection-date`, async (req, res) => {
      const submittedStr = req.query['submitted'] as string | undefined;
      let submitted = false;
      if (submittedStr) {
        try {
          submitted = JSON.parse(submittedStr.toLowerCase());
        } catch (err) {
          return res
            .status(400)
            .send("Query parameter 'submitted' must be of type boolean");
        }
      }
      const user = req.user as User;
      try {
        const value = await getCollectionDate({
          id: req.params.id,
          accountId: user.credentials.accountId,
          submitted,
        });
        return res.json(value as dto.GetCollectionDateResponse);
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

    this.server.put(`${this.prefix}/:id/collection-date`, async (req, res) => {
      const submittedStr = req.query['submitted'] as string | undefined;
      let submitted = false;
      if (submittedStr) {
        try {
          submitted = JSON.parse(submittedStr.toLowerCase());
        } catch (err) {
          return res
            .status(400)
            .send("Query parameter 'submitted' must be of type boolean");
        }
      }

      if (!submitted) {
        if (!validatePutDraftCollectionDateRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
      } else {
        if (!validatePutSubmissionCollectionDateRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }
      }

      const request = req.body as dto.PutCollectionDateRequest;
      const user = req.user as User;
      try {
        await setCollectionDate(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
            submitted,
          },
          request,
        );
        return res.json(request as dto.PutCollectionDateResponse);
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

    this.server.get(`${this.prefix}/:id/carriers`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await listCarriers({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.ListCarriersResponse);
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

    this.server.post(`${this.prefix}/:id/carriers`, async (req, res) => {
      if (!validateCreateCarriersRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.CreateCarriersRequest;
      const user = req.user as User;
      try {
        return res.status(201).json(
          (await createCarriers(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          )) as dto.CreateCarriersResponse,
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

    this.server.get(
      `${this.prefix}/:id/carriers/:carrierId`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = getCarriers(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            req.params.carrierId,
          );
          return res.json(value as unknown as dto.GetCarriersResponse);
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
      `${this.prefix}/:id/carriers/:carrierId`,
      async (req, res) => {
        if (!validateSetCarriersRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.SetCarriersRequest;
        if (request.status !== 'NotStarted') {
          for (const c of request.values) {
            if (c.id !== req.params.carrierId) {
              return res.status(400).jsonp(new BadRequestError('Bad Request'));
            }
          }
        }
        const user = req.user as User;
        try {
          await setCarriers(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            req.params.carrierId,
            request,
          );
          return res.json(request as dto.SetCarriersRequest);
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

    this.server.delete(
      `${this.prefix}/:id/carriers/:carrierId`,
      async (req, res) => {
        const user = req.user as User;
        try {
          return res.status(204).json(
            (await deleteCarriers(
              {
                id: req.params.id,
                accountId: user.credentials.accountId,
              },
              req.params.carrierId,
            )) as undefined,
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

    this.server.get(
      `${this.prefix}/:id/collection-detail`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getCollectionDetail({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.GetCollectionDetailResponse);
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
      `${this.prefix}/:id/collection-detail`,
      async (req, res) => {
        if (!validateSetCollectionDetailRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.SetCollectionDetailRequest;
        const user = req.user as User;
        try {
          await setCollectionDetail(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          );
          return res.json(request as dto.SetCollectionDetailResponse);
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

    this.server.get(`${this.prefix}/:id/exit-location`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getExitLocation({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetExitLocationResponse);
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

    this.server.put(`${this.prefix}/:id/exit-location`, async (req, res) => {
      if (!validatePutExitLocationRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const request = req.body as dto.PutExitLocationRequest;
      const user = req.user as User;
      try {
        await setExitLocation(
          {
            id: req.params.id,
            accountId: user.credentials.accountId,
          },
          request,
        );
        return res.json(request as dto.PutExitLocationResponse);
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

    this.server.get(
      `${this.prefix}/:id/transit-countries`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getTransitCountries({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.GetTransitCountriesResponse);
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
      `${this.prefix}/:id/transit-countries`,
      async (req, res) => {
        if (!validatePutTransitCountriesRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.PutTransitCountriesRequest;
        const user = req.user as User;
        try {
          await setTransitCountries(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          );
          return res.json(request as dto.PutTransitCountriesResponse);
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

    this.server.get(
      `${this.prefix}/:id/recovery-facility`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await listRecoveryFacilityDetail({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.ListRecoveryFacilityDetailResponse);
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

    this.server.post(
      `${this.prefix}/:id/recovery-facility`,
      async (req, res) => {
        if (!validateCreateRecoveryFacilityDetailRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.CreateRecoveryFacilityDetailRequest;
        const user = req.user as User;
        try {
          return res.status(201).json(
            (await createRecoveryFacilityDetail(
              {
                id: req.params.id,
                accountId: user.credentials.accountId,
              },
              request,
            )) as dto.CreateRecoveryFacilityDetailRequest,
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

    this.server.get(
      `${this.prefix}/:id/recovery-facility/:rfdId`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getRecoveryFacilityDetail(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            req.params.rfdId,
          );
          return res.json(value as dto.GetRecoveryFacilityDetailResponse);
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
      `${this.prefix}/:id/recovery-facility/:rfdId`,
      async (req, res) => {
        if (!validateSetRecoveryFacilityDetailRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.SetRecoveryFacilityDetailRequest;
        if (request.status === 'Started' || request.status === 'Complete') {
          for (const c of request.values) {
            if (c.id !== req.params.rfdId) {
              return res.status(400).jsonp(new BadRequestError('Bad Request'));
            }
          }
        }
        const user = req.user as User;
        try {
          await setRecoveryFacilityDetail(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            req.params.rfdId,
            request,
          );
          return res.json(request as dto.SetRecoveryFacilityDetailRequest);
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

    this.server.delete(
      `${this.prefix}/:id/recovery-facility/:rfdId`,
      async (req, res) => {
        const user = req.user as User;
        try {
          return res.status(204).json(
            (await deleteRecoveryFacilityDetail(
              {
                id: req.params.id,
                accountId: user.credentials.accountId,
              },
              req.params.rfdId,
            )) as undefined,
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

    this.server.get(
      `${this.prefix}/:id/submission-confirmation`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getSubmissionConfirmation({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.GetSubmissionConfirmationResponse);
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
      `${this.prefix}/:id/submission-confirmation`,
      async (req, res) => {
        if (!validatePutSubmissionConfirmationRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.PutSubmissionConfirmationRequest;
        const user = req.user as User;
        try {
          await updateSubmissionConfirmation(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          );
          return res.json(request as dto.PutSubmissionConfirmationResponse);
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

    this.server.get(
      `${this.prefix}/:id/submission-declaration`,
      async (req, res) => {
        const user = req.user as User;
        try {
          const value = await getSubmissionDeclaration({
            id: req.params.id,
            accountId: user.credentials.accountId,
          });
          return res.json(value as dto.GetSubmissionDeclarationResponse);
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
      `${this.prefix}/:id/submission-declaration`,
      async (req, res) => {
        if (!validatePutSubmissionDeclarationRequest(req.body)) {
          return res.status(400).jsonp(new BadRequestError('Bad Request'));
        }

        const request = req.body as dto.PutSubmissionDeclarationRequest;
        const user = req.user as User;
        try {
          await updateSubmissionDeclaration(
            {
              id: req.params.id,
              accountId: user.credentials.accountId,
            },
            request,
          );
          return res.json(request as dto.PutSubmissionDeclarationResponse);
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
  }
}
