import Boom from '@hapi/boom';
import { template as api, draft } from '@wts/api/green-list-waste-export';
import { fromBoom, success } from '@wts/util/invocation';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from 'winston';
import {
  DraftCarriers,
  Template,
  DraftCarrierPartial,
  DraftCarrier,
  DraftRecoveryFacility,
  DraftRecoveryFacilityPartial,
  DraftRecoveryFacilityDetails,
  DraftSubmission,
  Submission,
  FieldFormatError,
  RecoveryFacilityDetail,
} from '../../model';
import { setBaseWasteDescription, copyCarriersNoTransport } from '../../lib';
import { CosmosRepository } from '../../data';
import { glwe } from '@wts/util/shared-validation';
import {
  Country,
  RecoveryCode,
  WasteCode,
  WasteCodeType,
} from '@wts/api/reference-data';

export type Handler<Request, Response> = (
  request: Request,
) => Promise<Response>;

const locale = 'en';
const context = 'api';

const draftContainerName = 'drafts';
const submissionContainerName = 'submissions';
const templateContainerName = 'templates';

export default class TemplateController {
  constructor(
    private repository: CosmosRepository,
    private wasteCodeList: WasteCodeType[],
    private ewcCodeList: WasteCode[],
    private countryList: Country[],
    private countryIncludingUkList: Country[],
    private recoveryCodeList: RecoveryCode[],
    private disposalCodeList: WasteCode[],
    private logger: Logger,
  ) {}

  getTemplate: Handler<api.GetTemplateRequest, api.GetTemplateResponse> =
    async ({ id, accountId }) => {
      try {
        return success(
          (await this.repository.getRecord(
            templateContainerName,
            id,
            accountId,
          )) as Template,
        );
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
          await this.repository.getRecords(
            templateContainerName,
            accountId,
            order,
            pageLimit,
            token,
          ),
        ) as api.GetTemplatesResponse;
      } catch (err) {
        if (err instanceof Boom.Boom) {
          return fromBoom(err);
        }

        this.logger.error('Unknown error', { error: err });
        return fromBoom(Boom.internal());
      }
    };

  getNumberOfTemplates: Handler<
    api.GetNumberOfTemplatesRequest,
    api.GetNumberOfTemplatesResponse
  > = async ({ accountId }) => {
    try {
      return success(
        await this.repository.getTotalNumber(templateContainerName, accountId),
      ) as api.GetNumberOfTemplatesResponse;
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
    if (
      !templateDetails.name ||
      templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
      templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
      !glwe.regex.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${glwe.constraints.TemplateNameChar.min} and ${glwe.constraints.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        glwe.constraints.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
        ),
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

      await this.repository.saveRecord(
        templateContainerName,
        template,
        accountId,
      );
      return success(template);
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
    if (
      !templateDetails.name ||
      templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
      templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
      !glwe.regex.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${glwe.constraints.TemplateNameChar.min} and ${glwe.constraints.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        glwe.constraints.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      if (
        template.templateDetails.name !== templateDetails.name ||
        template.templateDetails.description !== templateDetails.description
      ) {
        template.templateDetails.description = templateDetails.description;
        template.templateDetails.lastModified = new Date();
        template.templateDetails.name = templateDetails.name;
        await this.repository.saveRecord(
          templateContainerName,
          template,
          accountId,
        );
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
      await this.repository.deleteRecord(templateContainerName, id, accountId);
      return success(undefined);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  getTemplateWasteDescription: Handler<
    draft.GetDraftWasteDescriptionRequest,
    draft.GetDraftWasteDescriptionResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.wasteDescription);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateWasteDescription: Handler<
    draft.SetDraftWasteDescriptionRequest,
    draft.SetDraftCustomerReferenceResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        if (value.wasteCode) {
          if (
            value.status === 'Complete' &&
            value.wasteCode.type !== 'NotApplicable' &&
            !('code' in value.wasteCode)
          ) {
            const wasteCodeValidationResult =
              glwe.validationRules.validateWasteCode(
                '',
                value.wasteCode.type,
                this.wasteCodeList,
              );
            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else if (
            'code' in value.wasteCode &&
            typeof value.wasteCode.code === 'string'
          ) {
            const wasteCodeValidationResult =
              glwe.validationRules.validateWasteCode(
                value.wasteCode.code,
                value.wasteCode.type,
                this.wasteCodeList,
              );

            if (!wasteCodeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...wasteCodeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              value.wasteCode = wasteCodeValidationResult.value;
            }
          } else {
            value.wasteCode = {
              type: value.wasteCode.type,
            };
          }
        }

        if (value.ewcCodes) {
          const ewcCodesValidationResult =
            glwe.validationRules.validateEwcCodes(
              value.ewcCodes.map((e) => e.code),
              this.ewcCodeList,
            );

          if (!ewcCodesValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...ewcCodesValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.ewcCodes = ewcCodesValidationResult.value;
          }
        }

        if (value.nationalCode) {
          const nationalCodeValidationResult =
            glwe.validationRules.validateNationalCode(
              value.nationalCode.provided === 'Yes'
                ? value.nationalCode.value
                : undefined,
            );

          if (!nationalCodeValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...nationalCodeValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.nationalCode = nationalCodeValidationResult.value;
          }
        }

        if (value.description) {
          const descriptionValidationResult =
            glwe.validationRules.validateWasteDecription(value.description);

          if (!descriptionValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...descriptionValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.description = descriptionValidationResult.value;
          }
        }

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      const submissionBase = setBaseWasteDescription(
        template.wasteDescription,
        template.carriers,
        template.recoveryFacilityDetail,
        value,
      );

      template.wasteDescription = submissionBase.wasteDescription;
      template.carriers = submissionBase.carriers;
      template.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        {
          ...template,
        },
        accountId,
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

  getTemplateExporterDetail: Handler<
    draft.GetDraftExporterDetailRequest,
    draft.GetDraftExporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.exporterDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateExporterDetail: Handler<
    draft.SetDraftExporterDetailRequest,
    draft.SetDraftExporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const section = 'ExporterDetail';
        const errors: FieldFormatError[] = [];
        if (value.exporterAddress?.addressLine1) {
          const addressLine1ValidationResult =
            glwe.validationRules.validateAddressLine1(
              value.exporterAddress.addressLine1,
              section,
              locale,
              context,
            );

          if (!addressLine1ValidationResult.valid) {
            errors.push(
              ...addressLine1ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterAddress.addressLine1 =
              addressLine1ValidationResult.value;
          }
        }

        if (value.exporterAddress?.addressLine2) {
          const addressLine2ValidationResult =
            glwe.validationRules.validateAddressLine2(
              value.exporterAddress.addressLine2,
              section,
              locale,
              context,
            );

          if (!addressLine2ValidationResult.valid) {
            errors.push(
              ...addressLine2ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterAddress.addressLine2 =
              addressLine2ValidationResult.value;
          }
        }

        if (value.exporterAddress?.townCity) {
          const townOrCityValidationResult =
            glwe.validationRules.validateTownOrCity(
              value.exporterAddress.townCity,
              section,
              locale,
              context,
            );

          if (!townOrCityValidationResult.valid) {
            errors.push(...townOrCityValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.townCity = townOrCityValidationResult.value;
          }
        }

        if (value.exporterAddress?.postcode) {
          const postcodeValidationResult =
            glwe.validationRules.validatePostcode(
              value.exporterAddress.postcode,
              section,
              locale,
              context,
            );

          if (!postcodeValidationResult.valid) {
            errors.push(...postcodeValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.postcode = postcodeValidationResult.value;
          }
        }

        if (value.exporterAddress?.country) {
          const countryValidationResult = glwe.validationRules.validateCountry(
            value.exporterAddress.country,
            section,
            locale,
            context,
          );

          if (!countryValidationResult.valid) {
            errors.push(...countryValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterAddress.country = countryValidationResult.value;
          }
        }

        if (value.exporterContactDetails?.organisationName) {
          const organisationNameValidationResult =
            glwe.validationRules.validateOrganisationName(
              value.exporterContactDetails.organisationName,
              section,
              locale,
              context,
            );

          if (!organisationNameValidationResult.valid) {
            errors.push(
              ...organisationNameValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.organisationName =
              organisationNameValidationResult.value;
          }
        }

        if (value.exporterContactDetails?.fullName) {
          const fullNameValidationResult =
            glwe.validationRules.validateFullName(
              value.exporterContactDetails.fullName,
              section,
              locale,
              context,
            );

          if (!fullNameValidationResult.valid) {
            errors.push(...fullNameValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterContactDetails.fullName =
              fullNameValidationResult.value;
          }
        }

        if (value.exporterContactDetails?.emailAddress) {
          const emailAddressValidationResult =
            glwe.validationRules.validateEmailAddress(
              value.exporterContactDetails.emailAddress,
              section,
              locale,
              context,
            );

          if (!emailAddressValidationResult.valid) {
            errors.push(
              ...emailAddressValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.emailAddress =
              emailAddressValidationResult.value;
          }
        }

        if (value.exporterContactDetails?.phoneNumber) {
          const phoneNumberValidationResult =
            glwe.validationRules.validatePhoneNumber(
              value.exporterContactDetails.phoneNumber,
              section,
              locale,
              context,
            );

          if (!phoneNumberValidationResult.valid) {
            errors.push(
              ...phoneNumberValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.exporterContactDetails.phoneNumber =
              phoneNumberValidationResult.value;
          }
        }

        if (value.exporterContactDetails?.faxNumber) {
          const faxNumberValidationResult =
            glwe.validationRules.validateFaxNumber(
              value.exporterContactDetails.faxNumber,
              section,
              locale,
              context,
            );

          if (!faxNumberValidationResult.valid) {
            errors.push(...faxNumberValidationResult.errors.fieldFormatErrors);
          } else {
            value.exporterContactDetails.faxNumber =
              faxNumberValidationResult.value;
          }
        }

        if (errors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.exporterDetail = value;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  getTemplateImporterDetail: Handler<
    draft.GetDraftImporterDetailRequest,
    draft.GetDraftImporterDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.importerDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateImporterDetail: Handler<
    draft.SetDraftImporterDetailRequest,
    draft.SetDraftImporterDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.importerDetail = value;
      template.templateDetails.lastModified = new Date();

      if (
        (template.transitCountries.status === 'Complete' ||
          template.transitCountries.status === 'Started') &&
        (value.status === 'Complete' || value.status === 'Started')
      ) {
        const transitCountriesCrossValidationResult =
          glwe.validationRules.validateImporterDetailAndTransitCountriesCross(
            value,
            template.transitCountries.values,
          );
        if (!transitCountriesCrossValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesCrossValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }

      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  listTemplateCarriers: Handler<
    draft.ListDraftCarriersRequest,
    draft.ListDraftCarriersResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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
    draft.GetDraftCarriersRequest,
    draft.GetDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const carrier = template.carriers.values.find((c) => {
        return c.id === carrierId;
      });

      if (carrier === undefined) {
        return fromBoom(Boom.notFound());
      }

      const value: DraftCarriers =
        template.carriers.status !== 'Complete'
          ? {
              status: template.carriers.status,
              transport: template.carriers.transport,
              values: [carrier as DraftCarrierPartial],
            }
          : {
              status: template.carriers.status,
              transport: template.carriers.transport,
              values: [carrier as DraftCarrier],
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
    draft.CreateDraftCarriersRequest,
    draft.CreateDraftCarriersResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on carrier detail creation"`,
          ),
        );
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status !== 'NotStarted') {
        if (
          template.carriers.values.length === glwe.constraints.CarrierLength.max
        ) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${glwe.constraints.CarrierLength.max} carriers`,
            ),
          );
        }
      }

      template.carriers.transport =
        template.wasteDescription.status !== 'NotStarted' &&
        template.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      const uuid = uuidv4();

      if (template.carriers.status === 'NotStarted') {
        template.carriers = {
          status: 'Started',
          transport: template.carriers.transport,
          values: [{ id: uuid }],
        };
      } else {
        const carriers: DraftCarrierPartial[] = [];
        for (const c of template.carriers.values) {
          carriers.push(c);
        }
        carriers.push({ id: uuid });

        template.carriers = {
          status: 'Started',
          transport: template.carriers.transport,
          values: carriers,
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );

      return success({
        status: value.status,
        transport: template.carriers.transport,
        values: [{ id: uuid }],
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
    draft.SetDraftCarriersRequest,
    draft.SetDraftCarriersResponse
  > = async ({ id, accountId, carrierId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        let index = 0;
        value.values.forEach((v) => {
          const section = 'Carriers';
          index += 1;
          if (v.addressDetails) {
            const organisationNameValidationResult =
              glwe.validationRules.validateOrganisationName(
                v.addressDetails.organisationName,
                section,
                locale,
                context,
                index,
              );

            if (!organisationNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...organisationNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.organisationName =
                organisationNameValidationResult.value;
            }

            const addressValidationResult =
              glwe.validationRules.validateAddress(
                v.addressDetails.address,
                section,
                locale,
                context,
                index,
              );

            if (!addressValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...addressValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.address = addressValidationResult.value;
            }

            const countryValidationResult =
              glwe.validationRules.validateCountry(
                v.addressDetails.country,
                section,
                locale,
                context,
                this.countryIncludingUkList,
                index,
              );

            if (!countryValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...countryValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.country = countryValidationResult.value;
            }
          }

          if (v.contactDetails) {
            const contactFullNameValidationResult =
              glwe.validationRules.validateFullName(
                v.contactDetails.fullName,
                section,
                locale,
                context,
                index,
              );

            if (!contactFullNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...contactFullNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.fullName = contactFullNameValidationResult.value;
            }

            const phoneValidationResult =
              glwe.validationRules.validatePhoneNumber(
                v.contactDetails.phoneNumber,
                section,
                locale,
                context,
                index,
              );

            if (!phoneValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...phoneValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.phoneNumber = phoneValidationResult.value;
            }

            const faxValidationResult = glwe.validationRules.validateFaxNumber(
              v.contactDetails.faxNumber,
              section,
              locale,
              context,
              index,
            );

            if (!faxValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...faxValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.faxNumber = faxValidationResult.value;
            }

            const emailValidationResult =
              glwe.validationRules.validateEmailAddress(
                v.contactDetails.emailAddress,
                section,
                locale,
                context,
                index,
              );

            if (!emailValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...emailValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.emailAddress = emailValidationResult.value;
            }
          }

          if (value.transport && v.transportDetails) {
            const meansOfTransportDetailsValidationResult =
              glwe.validationRules.validateCarrierMeansOfTransportDetails(
                locale,
                context,
                v.transportDetails.description,
                index,
              );

            if (!meansOfTransportDetailsValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...meansOfTransportDetailsValidationResult.errors
                  .fieldFormatErrors,
              );
            } else {
              v.transportDetails.description =
                meansOfTransportDetailsValidationResult.value;
            }
          }
        });

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'NotStarted') {
        template.carriers = value;
      } else {
        const carrier = value.values.find((c) => {
          return c.id === carrierId;
        });
        if (carrier === undefined) {
          return fromBoom(Boom.badRequest());
        }

        const index = template.carriers.values.findIndex((c) => {
          return c.id === carrierId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        if (
          template.wasteDescription.status !== 'NotStarted' &&
          template.wasteDescription.wasteCode
        ) {
          const transportValidationResult =
            glwe.validationRules.validateWasteCodeSubSectionAndCarriersCrossSection(
              template.wasteDescription.wasteCode,
              value.values.map((v) => v.transportDetails),
            );

          if (!transportValidationResult.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                transportValidationResult.errors,
              ),
            );
          } else {
            value.transport =
              template.wasteDescription.wasteCode.type !== 'NotApplicable';
          }
        }

        if (template.carriers !== undefined) {
          template.carriers.status = value.status;
          template.carriers.values[index] = carrier;
        }
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  deleteTemplateCarriers: Handler<
    draft.DeleteDraftCarriersRequest,
    draft.DeleteDraftCarriersResponse
  > = async ({ id, accountId, carrierId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (template.carriers.status === 'NotStarted') {
        return fromBoom(Boom.notFound());
      }

      const index = template.carriers.values.findIndex((c) => {
        return c.id === carrierId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      template.carriers.transport =
        template.wasteDescription.status !== 'NotStarted' &&
        template.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      template.carriers.values.splice(index, 1);

      if (template.carriers.values.length === 0) {
        template.carriers = {
          status: 'NotStarted',
          transport: template.carriers.transport,
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  getTemplateCollectionDetail: Handler<
    draft.GetDraftCollectionDetailRequest,
    draft.GetDraftCollectionDetailResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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
    draft.SetDraftCollectionDetailRequest,
    draft.SetDraftCollectionDetailResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'NotStarted') {
        const section = 'CollectionDetail';
        const errors: FieldFormatError[] = [];
        if (value.address?.addressLine1) {
          const addressLine1ValidationResult =
            glwe.validationRules.validateAddressLine1(
              value.address.addressLine1,
              section,
              locale,
              context,
            );

          if (!addressLine1ValidationResult.valid) {
            errors.push(
              ...addressLine1ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.address.addressLine1 = addressLine1ValidationResult.value;
          }
        }

        if (value.address?.addressLine2) {
          const addressLine2ValidationResult =
            glwe.validationRules.validateAddressLine2(
              value.address.addressLine2,
              section,
              locale,
              context,
            );

          if (!addressLine2ValidationResult.valid) {
            errors.push(
              ...addressLine2ValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.address.addressLine2 = addressLine2ValidationResult.value;
          }
        }

        if (value.address?.townCity) {
          const townOrCityValidationResult =
            glwe.validationRules.validateTownOrCity(
              value.address.townCity,
              section,
              locale,
              context,
            );

          if (!townOrCityValidationResult.valid) {
            errors.push(...townOrCityValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.townCity = townOrCityValidationResult.value;
          }
        }

        if (value.address?.postcode) {
          const postcodeValidationResult =
            glwe.validationRules.validatePostcode(
              value.address.postcode,
              section,
              locale,
              context,
            );

          if (!postcodeValidationResult.valid) {
            errors.push(...postcodeValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.postcode = postcodeValidationResult.value;
          }
        }

        if (value.address?.country) {
          const countryValidationResult = glwe.validationRules.validateCountry(
            value.address.country,
            section,
            locale,
            context,
          );

          if (!countryValidationResult.valid) {
            errors.push(...countryValidationResult.errors.fieldFormatErrors);
          } else {
            value.address.country = countryValidationResult.value;
          }
        }

        if (value.contactDetails?.organisationName) {
          const organisationNameValidationResult =
            glwe.validationRules.validateOrganisationName(
              value.contactDetails.organisationName,
              section,
              locale,
              context,
            );

          if (!organisationNameValidationResult.valid) {
            errors.push(
              ...organisationNameValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.organisationName =
              organisationNameValidationResult.value;
          }
        }

        if (value.contactDetails?.fullName) {
          const fullNameValidationResult =
            glwe.validationRules.validateFullName(
              value.contactDetails.fullName,
              section,
              locale,
              context,
            );

          if (!fullNameValidationResult.valid) {
            errors.push(...fullNameValidationResult.errors.fieldFormatErrors);
          } else {
            value.contactDetails.fullName = fullNameValidationResult.value;
          }
        }

        if (value.contactDetails?.emailAddress) {
          const emailAddressValidationResult =
            glwe.validationRules.validateEmailAddress(
              value.contactDetails.emailAddress,
              section,
              locale,
              context,
            );

          if (!emailAddressValidationResult.valid) {
            errors.push(
              ...emailAddressValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.emailAddress =
              emailAddressValidationResult.value;
          }
        }

        if (value.contactDetails?.phoneNumber) {
          const phoneNumberValidationResult =
            glwe.validationRules.validatePhoneNumber(
              value.contactDetails.phoneNumber,
              section,
              locale,
              context,
            );

          if (!phoneNumberValidationResult.valid) {
            errors.push(
              ...phoneNumberValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.contactDetails.phoneNumber =
              phoneNumberValidationResult.value;
          }
        }

        if (value.contactDetails?.faxNumber) {
          const faxNumberValidationResult =
            glwe.validationRules.validateFaxNumber(
              value.contactDetails.faxNumber,
              section,
              locale,
              context,
            );

          if (!faxNumberValidationResult.valid) {
            errors.push(...faxNumberValidationResult.errors.fieldFormatErrors);
          } else {
            value.contactDetails.faxNumber = faxNumberValidationResult.value;
          }
        }

        if (errors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.collectionDetail = value;

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  getTemplateUkExitLocation: Handler<
    draft.GetDraftUkExitLocationRequest,
    draft.GetDraftUkExitLocationResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      return success(template.ukExitLocation);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateUkExitLocation: Handler<
    draft.SetDraftUkExitLocationRequest,
    draft.SetDraftUkExitLocationResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status === 'Complete') {
        const ukExitLocationValidationResult =
          glwe.validationRules.validateUkExitLocation(
            'value' in value.exitLocation &&
              typeof value.exitLocation.value === 'string'
              ? value.exitLocation.value
              : undefined,
          );
        if (!ukExitLocationValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            ukExitLocationValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      template.ukExitLocation = value;
      template.templateDetails.lastModified = new Date();

      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  getTemplateTransitCountries: Handler<
    draft.GetDraftTransitCountriesRequest,
    draft.GetDraftTransitCountriesResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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
    draft.SetDraftTransitCountriesRequest,
    draft.SetDraftTransitCountriesResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status === 'Started' || value.status === 'Complete') {
        const transitCountriesValidationResult =
          glwe.validationRules.validateTransitCountries(
            value.values,
            this.countryList,
          );

        if (!transitCountriesValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      template.transitCountries = value;

      if (
        (template.importerDetail.status === 'Complete' ||
          template.importerDetail.status === 'Started') &&
        (value.status === 'Complete' || value.status === 'Started')
      ) {
        const transitCountriesCrossValidationResult =
          glwe.validationRules.validateImporterDetailAndTransitCountriesCross(
            template.importerDetail,
            value.values,
          );
        if (!transitCountriesCrossValidationResult.valid) {
          const boom = Boom.badRequest(
            'Validation failed',
            transitCountriesCrossValidationResult.errors,
          );
          return fromBoom(boom);
        }
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  listTemplateRecoveryFacilityDetails: Handler<
    draft.ListDraftRecoveryFacilityDetailsRequest,
    draft.ListDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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
    draft.GetDraftRecoveryFacilityDetailsRequest,
    draft.GetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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

      const value: DraftRecoveryFacilityDetails =
        template.recoveryFacilityDetail.status !== 'Complete'
          ? {
              status: template.recoveryFacilityDetail.status as 'Started',
              values: [recoveryFacilityDetail as DraftRecoveryFacilityPartial],
            }
          : {
              status: template.recoveryFacilityDetail.status,
              values: [recoveryFacilityDetail as DraftRecoveryFacility],
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
    draft.CreateDraftRecoveryFacilityDetailsRequest,
    draft.CreateDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, value }) => {
    try {
      if (value.status !== 'Started') {
        return fromBoom(
          Boom.badRequest(
            `"Status cannot be ${value.status} on recovery facility detail creation"`,
          ),
        );
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      const uuid = uuidv4();

      if (
        template.recoveryFacilityDetail.status === 'Started' ||
        template.recoveryFacilityDetail.status === 'Complete'
      ) {
        const maxFacilities =
          glwe.constraints.InterimSiteLength.max +
          glwe.constraints.RecoveryFacilityLength.max;
        if (template.recoveryFacilityDetail.values.length === maxFacilities) {
          return fromBoom(
            Boom.badRequest(
              `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${glwe.constraints.InterimSiteLength.max} InterimSite & ${glwe.constraints.RecoveryFacilityLength.max} Recovery Facilities)`,
            ),
          );
        }

        const facilities: DraftRecoveryFacilityPartial[] = [];
        for (const rf of template.recoveryFacilityDetail.values) {
          facilities.push(rf);
        }
        facilities.push({ id: uuid });

        template.recoveryFacilityDetail = {
          status: 'Started',
          values: facilities,
        };
      } else {
        template.recoveryFacilityDetail = {
          status: 'Started',
          values: [{ id: uuid }],
        };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
      );

      return success(template.recoveryFacilityDetail);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };

  setTemplateRecoveryFacilityDetails: Handler<
    draft.SetDraftRecoveryFacilityDetailsRequest,
    draft.SetDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId, value }) => {
    try {
      if (value.status === 'Started' || value.status === 'Complete') {
        const errors = {
          fieldFormatErrors: [] as FieldFormatError[],
        };
        let index = 0;
        value.values.forEach((v) => {
          const section = 'RecoveryFacilityDetail';
          index += 1;
          if (v.addressDetails) {
            const organisationNameValidationResult =
              glwe.validationRules.validateOrganisationName(
                v.addressDetails.name,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!organisationNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...organisationNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.name = organisationNameValidationResult.value;
            }

            const addressValidationResult =
              glwe.validationRules.validateAddress(
                v.addressDetails.address,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!addressValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...addressValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.address = addressValidationResult.value;
            }

            const countryValidationResult =
              glwe.validationRules.validateCountry(
                v.addressDetails.country,
                section,
                locale,
                context,
                this.countryIncludingUkList,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!countryValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...countryValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.addressDetails.country = countryValidationResult.value;
            }
          }

          if (v.contactDetails) {
            const contactFullNameValidationResult =
              glwe.validationRules.validateFullName(
                v.contactDetails.fullName,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!contactFullNameValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...contactFullNameValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.fullName = contactFullNameValidationResult.value;
            }

            const phoneValidationResult =
              glwe.validationRules.validatePhoneNumber(
                v.contactDetails.phoneNumber,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!phoneValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...phoneValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.phoneNumber = phoneValidationResult.value;
            }

            const faxValidationResult = glwe.validationRules.validateFaxNumber(
              v.contactDetails.faxNumber,
              section,
              locale,
              context,
              index,
              v.recoveryFacilityType?.type,
            );

            if (!faxValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...faxValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.faxNumber = faxValidationResult.value;
            }

            const emailValidationResult =
              glwe.validationRules.validateEmailAddress(
                v.contactDetails.emailAddress,
                section,
                locale,
                context,
                index,
                v.recoveryFacilityType?.type,
              );

            if (!emailValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...emailValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.contactDetails.emailAddress = emailValidationResult.value;
            }
          }

          if (
            v.recoveryFacilityType &&
            ((v.recoveryFacilityType.type === 'Laboratory' &&
              v.recoveryFacilityType.disposalCode !== undefined) ||
              (v.recoveryFacilityType.type !== 'Laboratory' &&
                v.recoveryFacilityType.recoveryCode !== undefined))
          ) {
            const codeValidationResult =
              glwe.validationRules.validateDisposalOrRecoveryCode(
                v.recoveryFacilityType.type === 'Laboratory'
                  ? v.recoveryFacilityType.disposalCode
                  : v.recoveryFacilityType.recoveryCode,
                v.recoveryFacilityType.type === 'Laboratory'
                  ? {
                      type: v.recoveryFacilityType.type,
                      codeList: this.disposalCodeList,
                    }
                  : {
                      type: v.recoveryFacilityType.type,
                      codeList: this.recoveryCodeList,
                    },
                locale,
                context,
              );

            if (!codeValidationResult.valid) {
              errors.fieldFormatErrors.push(
                ...codeValidationResult.errors.fieldFormatErrors,
              );
            } else {
              v.recoveryFacilityType.type === 'Laboratory'
                ? (v.recoveryFacilityType.disposalCode =
                    codeValidationResult.value)
                : (v.recoveryFacilityType.recoveryCode =
                    codeValidationResult.value);
            }
          }
        });

        if (errors.fieldFormatErrors.length > 0) {
          return fromBoom(Boom.badRequest('Validation failed', errors));
        }
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }

      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      if (value.status === 'Started' || value.status === 'Complete') {
        const recoveryFacility = value.values.find((rf) => {
          return rf.id === rfdId;
        });

        if (recoveryFacility === undefined) {
          return fromBoom(Boom.badRequest());
        }
        const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
          return rf.id === rfdId;
        });
        if (index === -1) {
          return fromBoom(Boom.notFound());
        }

        if (
          template.wasteDescription.status !== 'NotStarted' &&
          template.wasteDescription.wasteCode
        ) {
          const recoveryFacilityTypes: RecoveryFacilityDetail['recoveryFacilityType']['type'][] =
            [];
          value.values.forEach((v) => {
            if (v.recoveryFacilityType) {
              recoveryFacilityTypes.push(v.recoveryFacilityType.type);
            }
          });
          const recoveryFacilityTypesValidationResult =
            glwe.validationRules.validateWasteCodeSubSectionAndRecoveryFacilityDetailCrossSection(
              template.wasteDescription.wasteCode,
              recoveryFacilityTypes,
            );

          if (!recoveryFacilityTypesValidationResult.valid) {
            return fromBoom(
              Boom.badRequest(
                'Validation failed',
                recoveryFacilityTypesValidationResult.errors,
              ),
            );
          }
        }

        template.recoveryFacilityDetail.status = value.status;
        template.recoveryFacilityDetail.values[index] =
          recoveryFacility as DraftRecoveryFacility;
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  deleteTemplateRecoveryFacilityDetails: Handler<
    draft.DeleteDraftRecoveryFacilityDetailsRequest,
    draft.DeleteDraftRecoveryFacilityDetailsResponse
  > = async ({ id, accountId, rfdId }) => {
    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
      if (template === undefined) {
        return fromBoom(Boom.notFound());
      }
      if (
        template.recoveryFacilityDetail.status !== 'Started' &&
        template.recoveryFacilityDetail.status !== 'Complete'
      ) {
        return fromBoom(Boom.notFound());
      }

      const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
        return rf.id === rfdId;
      });

      if (index === -1) {
        return fromBoom(Boom.notFound());
      }

      template.recoveryFacilityDetail.values.splice(index, 1);
      if (template.recoveryFacilityDetail.values.length === 0) {
        template.recoveryFacilityDetail = { status: 'NotStarted' };
      }

      template.templateDetails.lastModified = new Date();
      await this.repository.saveRecord(
        templateContainerName,
        { ...template },
        accountId,
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

  createDraftFromTemplate: Handler<
    api.CreateDraftFromTemplateRequest,
    draft.CreateDraftResponse
  > = async ({ id, accountId, reference }) => {
    try {
      const referenceValidationResult =
        glwe.validationRules.validateReference(reference);

      if (!referenceValidationResult.valid) {
        const boom = Boom.badRequest(
          'Validation failed',
          referenceValidationResult.errors,
        );
        return fromBoom(boom);
      }

      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;

      const draft: DraftSubmission = {
        id: uuidv4(),
        reference,
        wasteDescription: template.wasteDescription,
        wasteQuantity:
          template.wasteDescription.status === 'NotStarted'
            ? { status: 'CannotStart' }
            : { status: 'NotStarted' },
        exporterDetail: template.exporterDetail,
        importerDetail: template.importerDetail,
        collectionDate: { status: 'NotStarted' },
        carriers: copyCarriersNoTransport(
          template.carriers,
          template.wasteDescription.status === 'Complete' &&
            template.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: template.collectionDetail,
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: template.recoveryFacilityDetail,
        submissionConfirmation: { status: 'CannotStart' },
        submissionDeclaration: { status: 'CannotStart' },
        submissionState: {
          status: 'InProgress',
          timestamp: new Date(),
        },
      };

      await this.repository.saveRecord(draftContainerName, draft, accountId);

      return success(draft);
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
    if (
      !templateDetails.name ||
      templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
      templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
      !glwe.regex.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${glwe.constraints.TemplateNameChar.min} and ${glwe.constraints.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        glwe.constraints.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const submission = (await this.repository.getRecord(
        submissionContainerName,
        id,
        accountId,
      )) as Submission;

      const template: Template = {
        id: uuidv4(),
        templateDetails: {
          name: templateDetails.name,
          description: templateDetails.description,
          created: new Date(),
          lastModified: new Date(),
        },
        wasteDescription: {
          status: 'Complete',
          ...submission.wasteDescription,
        },
        exporterDetail: {
          status: 'Complete',
          ...submission.exporterDetail,
        },
        importerDetail: {
          status: 'Complete',
          ...submission.importerDetail,
        },
        carriers: copyCarriersNoTransport(
          {
            status: 'Complete',
            transport:
              submission.wasteDescription.wasteCode.type === 'NotApplicable',
            values: submission.carriers.map((c) => {
              return {
                id: uuidv4(),
                ...c,
              };
            }),
          },
          submission.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: {
          status: 'Complete',
          ...submission.collectionDetail,
        },
        ukExitLocation: {
          status: 'Complete',
          exitLocation: submission.ukExitLocation,
        },
        transitCountries: {
          status: 'Complete',
          values: submission.transitCountries,
        },
        recoveryFacilityDetail: {
          status: 'Complete',
          values: submission.recoveryFacilityDetail.map((r) => {
            return {
              id: uuidv4(),
              ...r,
            };
          }),
        },
      };

      await this.repository.saveRecord(
        templateContainerName,
        template,
        accountId,
      );

      return success(template);
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
    api.CreateTemplateFromTemplateResponse
  > = async ({ accountId, id, templateDetails }) => {
    if (
      !templateDetails.name ||
      templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
      templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
      !glwe.regex.templateNameRegex.test(templateDetails.name)
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template name must be unique and between ${glwe.constraints.TemplateNameChar.min} and ${glwe.constraints.TemplateNameChar.max} alphanumeric characters.`,
        ),
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length >
        glwe.constraints.TemplateDescriptionChar.max
    ) {
      return fromBoom(
        Boom.badRequest(
          `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
        ),
      );
    }

    try {
      const template = (await this.repository.getRecord(
        templateContainerName,
        id,
        accountId,
      )) as Template;
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
        carriers: copyCarriersNoTransport(
          template.carriers,
          template.wasteDescription.status === 'Complete' &&
            template.wasteDescription.wasteCode.type === 'NotApplicable',
        ),
        collectionDetail: template.collectionDetail,
        ukExitLocation: template.ukExitLocation,
        transitCountries: template.transitCountries,
        recoveryFacilityDetail: template.recoveryFacilityDetail,
      };

      await this.repository.saveRecord(
        templateContainerName,
        newTemplate,
        accountId,
      );
      return success(newTemplate);
    } catch (err) {
      if (err instanceof Boom.Boom) {
        return fromBoom(err);
      }

      this.logger.error('Unknown error', { error: err });
      return fromBoom(Boom.internal());
    }
  };
}
