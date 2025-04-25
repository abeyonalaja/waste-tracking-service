import { Application } from 'express';
import * as dto from '@wts/api/waste-tracking-gateway';
import {
  BadRequestError,
  CustomError,
  InternalServerError,
} from '../../lib/errors';
import {
  getTemplates,
  getTemplate,
  createTemplate,
  createTemplateFromSubmission,
  createTemplateFromTemplate,
  updateTemplate,
  deleteTemplate,
  getWasteDescription,
  createCarriers,
  createRecoveryFacilityDetail,
  deleteCarriers,
  deleteRecoveryFacilityDetail,
  getCarriers,
  getCollectionDetail,
  getExitLocation,
  getExporterDetail,
  getImporterDetail,
  getRecoveryFacilityDetail,
  getTransitCountries,
  listCarriers,
  listRecoveryFacilityDetail,
  setCarriers,
  setCollectionDetail,
  setExitLocation,
  setExporterDetail,
  setImporterDetail,
  setRecoveryFacilityDetail,
  setTransitCountries,
  setWasteDescription,
  getNumberOfTemplates,
} from './template.backend';
import { validateCreateTemplateRequest } from './template.validation';
import {
  validateCreateCarriersRequest,
  validateCreateRecoveryFacilityDetailRequest,
  validatePutExitLocationRequest,
  validatePutExporterDetailRequest,
  validatePutImporterDetailRequest,
  validatePutTransitCountriesRequest,
  validatePutWasteDescriptionRequest,
  validateSetCarriersRequest,
  validateSetCollectionDetailRequest,
  validateSetRecoveryFacilityDetailRequest,
} from '../submission/submission.validation';
import { User } from '../../lib/user';

export default class TemplatePlugin {
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

      const token = req.query['paginationToken'] as string | undefined;
      const user = req.user as User;
      try {
        const value = await getTemplates(
          user.credentials.accountId,
          { order },
          pageLimit,
          token,
        );
        return res.json(value as dto.GetTemplatesResponse);
      } catch (err) {
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json({ message: err.message });
        }
        return res
          .status(500)
          .jsonp(new InternalServerError('An internal server error occurred'));
      }
    });

    this.server.get(`${this.prefix}/numberOfTemplates`, async (req, res) => {
      const user = req.user as User;
      try {
        const value = await getNumberOfTemplates(user.credentials.accountId);
        return res.json(value as dto.GetNumberOfTemplatesResponse);
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
      const user = req.user as User;
      try {
        const value = await getTemplate({
          id: req.params.id,
          accountId: user.credentials.accountId,
        });
        return res.json(value as dto.GetTemplateResponse);
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
      if (!validateCreateTemplateRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const { templateDetails } = req.body as dto.CreateTemplateRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .json(
            (await createTemplate(
              user.credentials.accountId,
              templateDetails,
            )) as dto.CreateTemplateResponse,
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

    this.server.post(`${this.prefix}/copy-submission/:id`, async (req, res) => {
      if (!validateCreateTemplateRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const { templateDetails } = req.body as dto.CreateTemplateRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .json(
            (await createTemplateFromSubmission(
              req.params.id,
              user.credentials.accountId,
              templateDetails,
            )) as dto.CreateTemplateResponse,
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
      if (!validateCreateTemplateRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const { templateDetails } = req.body as dto.CreateTemplateRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .json(
            (await createTemplateFromTemplate(
              req.params.id,
              user.credentials.accountId,
              templateDetails,
            )) as dto.CreateTemplateResponse,
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

    this.server.put(`${this.prefix}/update/:id`, async (req, res) => {
      if (!validateCreateTemplateRequest(req.body)) {
        return res.status(400).jsonp(new BadRequestError('Bad Request'));
      }

      const { templateDetails } = req.body as dto.CreateTemplateRequest;
      const user = req.user as User;
      try {
        return res
          .status(201)
          .json(
            (await updateTemplate(
              req.params.id,
              user.credentials.accountId,
              templateDetails,
            )) as dto.CreateTemplateResponse,
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
          (await deleteTemplate({
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
  }
}
