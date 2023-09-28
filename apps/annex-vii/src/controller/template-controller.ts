import Boom from '@hapi/boom';
import * as api from '@wts/api/annex-vii';
import { fromBoom, success } from '@wts/util/invocation';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import { Template } from '../model';
import {
  BaseController,
  Handler,
  SubmissionBasePlusId,
} from './base-controller';
import { TemplateRepository } from '../data/templates-repository';

function isTemplateNameValid(name: string): boolean {
  let valid = true;
  if (
    !name ||
    name.length < 1 ||
    name.length > 50 ||
    !/^[a-zA-Z0-9-._'/() ]+$/.test(name)
  ) {
    valid = false;
  }

  return valid;
}

export default class TemplateController extends BaseController {
  constructor(private repository: TemplateRepository, private logger: Logger) {
    super();
  }

  getTemplateById: Handler<
    api.GetTemplateByIdRequest,
    api.GetTemplateByIdResponse
  > = async ({ id, accountId }) => {
    try {
      return success(await this.repository.getTemplate(id, accountId));
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplates: Handler<api.GetTemplatesRequest, api.GetTemplatesResponse> =
    async ({ accountId, order, pageLimit, token }) => {
      try {
        return success(
          await this.repository.getTemplates(accountId, order, pageLimit, token)
        ) as api.GetTemplatesResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  createTemplate: Handler<
    api.CreateTemplateRequest,
    api.CreateTemplateResponse
  > = async ({ accountId, templateDetails }) => {
    if (!isTemplateNameValid(templateDetails.name)) {
      return fromBoom(
        Boom.badRequest(
          'Template name must be unique and between 1 and 50 alphanumeric characters.'
        )
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      return fromBoom(
        Boom.badRequest('Template description cannot exceed 100 characters.')
      );
    }

    try {
      const template: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: { status: 'NotStarted' },
        exporterDetail: { status: 'NotStarted' },
        importerDetail: { status: 'NotStarted' },
        carriers: {
          status: 'NotStarted',
          transport: true,
        },
        collectionDetail: { status: 'NotStarted' },
        ukExitLocation: { status: 'NotStarted' },
        transitCountries: { status: 'NotStarted' },
        recoveryFacilityDetail: { status: 'CannotStart' },
      };

      await this.repository.saveTemplate(template, accountId);
      return success(template);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateFromSubmission: Handler<
    api.CreateTemplateFromSubmissionRequest,
    api.CreateTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (!isTemplateNameValid(templateDetails.name)) {
      return fromBoom(
        Boom.badRequest(
          'Template name must be unique and between 1 and 50 alphanumeric characters.'
        )
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      return fromBoom(
        Boom.badRequest('Template description cannot exceed 100 characters.')
      );
    }

    try {
      return success(
        await this.repository.createTemplateFromSubmission(
          id,
          accountId,
          templateDetails.name,
          templateDetails.description
        )
      );
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateFromTemplate: Handler<
    api.CreateTemplateFromTemplateRequest,
    api.CreateTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (!isTemplateNameValid(templateDetails.name)) {
      return fromBoom(
        Boom.badRequest(
          'Template name must be unique and between 1 and 50 alphanumeric characters.'
        )
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      return fromBoom(
        Boom.badRequest('Template description cannot exceed 100 characters.')
      );
    }

    try {
      const template = await this.repository.getTemplate(id, accountId);
      const newTemplate: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: template.wasteDescription,
        exporterDetail: template.exporterDetail,
        importerDetail: template.importerDetail,
        carriers: this.repository.copyCarriers(template.carriers),
        collectionDetail: template.collectionDetail,
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: this.repository.copyRecoveryFacilities(
          template.recoveryFacilityDetail
        ),
      };

      await this.repository.saveTemplate(newTemplate, accountId);
      return success(newTemplate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  updateTemplate: Handler<
    api.UpdateTemplateRequest,
    api.UpdateTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (!isTemplateNameValid(templateDetails.name)) {
      return fromBoom(
        Boom.badRequest(
          'Template name must be unique and between 1 and 50 alphanumeric characters.'
        )
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      return fromBoom(
        Boom.badRequest('Template description cannot exceed 100 characters.')
      );
    }

    try {
      const template = await this.repository.getTemplate(id, accountId);

      if (
        template.templateDetails.name !== templateDetails.name ||
        template.templateDetails.description !== templateDetails.description
      ) {
        template.templateDetails.description = templateDetails.description;
        template.templateDetails.lastModified = new Date();
        template.templateDetails.name = templateDetails.name;
        await this.repository.saveTemplate(template, accountId);
      }

      return success(template);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplate: Handler<
    api.DeleteTemplateRequest,
    api.DeleteTemplateResponse
  > = async ({ id, accountId }) => {
    try {
      await this.repository.deleteTemplate(id, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateWasteDescriptionById: Handler<
    api.GetDraftWasteDescriptionByIdRequest,
    api.GetDraftWasteDescriptionByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.wasteDescription);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateWasteDescriptionById: Handler<
    api.SetDraftWasteDescriptionByIdRequest,
    api.SetDraftCustomerReferenceByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);

      const submissionBase = this.setBaseWasteDescription(
        template as api.SubmissionBase,
        value
      );

      template.wasteDescription = submissionBase.wasteDescription;
      template.carriers = submissionBase.carriers;
      template.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate(
        {
          ...template,
        },
        accountId
      );
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateExporterDetailById: Handler<
    api.GetDraftExporterDetailByIdRequest,
    api.GetDraftExporterDetailByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.exporterDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateExporterDetailById: Handler<
    api.SetDraftExporterDetailByIdRequest,
    api.SetDraftExporterDetailByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);

      template.exporterDetail = this.setBaseExporterDetail(
        template as api.SubmissionBase,
        value
      ).exporterDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateImporterDetailById: Handler<
    api.GetDraftImporterDetailByIdRequest,
    api.GetDraftImporterDetailByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.importerDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateImporterDetailById: Handler<
    api.SetDraftImporterDetailByIdRequest,
    api.SetDraftImporterDetailByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      template.importerDetail = this.setBaseImporterDetail(
        template as api.SubmissionBase,
        value
      ).importerDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  listTemplateCarriers: Handler<
    api.ListDraftCarriersRequest,
    api.ListDraftCarriersResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.carriers);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateCarriers: Handler<
    api.GetDraftCarriersRequest,
    api.GetDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const carrier = template.carriers.values.find((c) => {
        return c.id === carrierId;
      });

      if (carrier === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: api.DraftCarriers = {
        status: template.carriers.status,
        transport: template.carriers.transport,
        values: [carrier],
      };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateCarriers: Handler<
    api.CreateDraftCarriersRequest,
    api.CreateDraftCarriersResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on carrier detail creation"`
          )
        );
      }

      const template = await this.repository.getTemplate(id, accountId);
      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (template.carriers.status !== 'NotStarted') {
        if (template.carriers.values.length === 5) {
          return fromBoom(Boom.badRequest('Cannot add more than 5 carriers'));
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId =
        this.createBaseCarriers(template as api.SubmissionBase, value);

      template.carriers = submissionBasePlusId.submissionBase.carriers;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success({
        status: value.status,
        transport: submissionBasePlusId.submissionBase.carriers.transport,
        values: [{ id: submissionBasePlusId.id }],
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateCarriers: Handler<
    api.SetDraftCarriersRequest,
    api.SetDraftCarriersResponse
  > = async ({ id, accountId, carrierId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return Promise.reject(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        template.carriers = this.setBaseNoCarriers(
          template as api.SubmissionBase,
          carrierId,
          value
        ).carriers;
      } else {
        const carrier = value.values.find((c) => {
          return c.id === carrierId;
        });
        if (carrier === undefined) {
          return Promise.reject(Boom.badRequest());
        }

        const index = template.carriers.values.findIndex((c) => {
          return c.id === carrierId;
        });
        if (index === -1) {
          return Promise.reject(Boom.notFound());
        }
        template.carriers = this.setBaseCarriers(
          template as api.SubmissionBase,
          carrierId,
          value,
          carrier,
          index
        ).carriers;
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplateCarriers: Handler<
    api.DeleteDraftCarriersRequest,
    api.DeleteDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return Promise.reject(Boom.notFound());
      }

      const index = template.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return Promise.reject(Boom.notFound());
      }

      template.carriers = this.deleteBaseCarriers(
        template as api.SubmissionBase,
        carrierId
      ).carriers;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateCollectionDetail: Handler<
    api.GetDraftCollectionDetailRequest,
    api.GetDraftCollectionDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.collectionDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateCollectionDetail: Handler<
    api.SetDraftCollectionDetailRequest,
    api.SetDraftCollectionDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      template.collectionDetail = this.setBaseCollectionDetail(
        template as api.SubmissionBase,
        value
      ).collectionDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateExitLocationById: Handler<
    api.GetDraftExitLocationByIdRequest,
    api.GetDraftExitLocationByIdResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.ukExitLocation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateExitLocationById: Handler<
    api.SetDraftExitLocationByIdRequest,
    api.SetDraftExitLocationByIdResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      template.ukExitLocation = this.setBaseExitLocation(
        template as api.SubmissionBase,
        value
      ).ukExitLocation;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateTransitCountries: Handler<
    api.GetDraftTransitCountriesRequest,
    api.GetDraftTransitCountriesResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.transitCountries);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateTransitCountries: Handler<
    api.SetDraftTransitCountriesRequest,
    api.SetDraftTransitCountriesResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      template.transitCountries = this.setBaseTransitCountries(
        template as api.SubmissionBase,
        value
      ).transitCountries;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  listTemplateRecoveryFacilityDetails: Handler<
    api.ListDraftRecoveryFacilityDetailsRequest,
    api.ListDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      return success(template.recoveryFacilityDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateRecoveryFacilityDetails: Handler<
    api.GetDraftRecoveryFacilityDetailsRequest,
    api.GetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const recoveryFacilityDetail =
        template.recoveryFacilityDetail.values.find((c) => {
          return c.id === rfdId;
        });

      if (recoveryFacilityDetail === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: api.DraftRecoveryFacilityDetail = {
        status: template.recoveryFacilityDetail.status,
        values: [recoveryFacilityDetail],
      };

      return success(value);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  createTemplateRecoveryFacilityDetails: Handler<
    api.CreateDraftRecoveryFacilityDetailsRequest,
    api.CreateDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on recovery facility detail creation"`
          )
        );
      }

      const template = await this.repository.getTemplate(id, accountId);

      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (
        template.recoveryFacilityDetail.status === 'Started' ||
        template.recoveryFacilityDetail.status === 'Complete'
      ) {
        if (template.recoveryFacilityDetail.values.length === 3) {
          return fromBoom(
            Boom.badRequest(
              'Cannot add more than 3 recovery facilities (Maximum: 1 InterimSite & 2 Recovery Facilities )'
            )
          );
        }
      }

      const submissionBasePlusId: SubmissionBasePlusId =
        this.createBaseRecoveryFacilityDetail(
          template as api.SubmissionBase,
          value
        );

      template.recoveryFacilityDetail =
        submissionBasePlusId.submissionBase.recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success({
        status: value.status,
        values: [{ id: submissionBasePlusId.id }],
      });
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateRecoveryFacilityDetails: Handler<
    api.SetDraftRecoveryFacilityDetailsRequest,
    api.SetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId, value }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return Promise.reject(Boom.notFound());
      }

      if (value.status === 'Started' || value.status === 'Complete') {
        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        if (recoveryFacility === undefined) {
          return Promise.reject(Boom.badRequest());
        }
        const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
          return rf.id === rfdId;
        });
        if (index === -1) {
          return Promise.reject(Boom.notFound());
        }
      }

      template.recoveryFacilityDetail = this.setBaseRecoveryFacilityDetail(
        template as api.SubmissionBase,
        rfdId,
        value
      ).recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  deleteTemplateRecoveryFacilityDetails: Handler<
    api.DeleteDraftRecoveryFacilityDetailsRequest,
    api.DeleteDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = await this.repository.getTemplate(id, accountId);
      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }
      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return Promise.reject(Boom.notFound());
      }

      const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });

      if (index === -1) {
        return Promise.reject(Boom.notFound());
      }

      template.recoveryFacilityDetail = this.deleteBaseRecoveryFacilityDetail(
        template as api.SubmissionBase,
        rfdId
      ).recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveTemplate({ ...template }, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
