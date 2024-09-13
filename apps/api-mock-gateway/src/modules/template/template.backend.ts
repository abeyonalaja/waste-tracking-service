import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../lib/errors';
import { db } from '../../db';
import { v4 as uuidv4 } from 'uuid';
import {
  Carrier,
  CarrierPartial,
  Carriers,
  CollectionDetail,
  CustomerReference,
  DraftSubmission,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  PageMetadata,
  RecoveryFacility,
  RecoveryFacilityDetail,
  RecoveryFacilityPartial,
  Submission,
  Template,
  TemplateSummary,
  TemplateSummaryPage,
  TransitCountries,
  WasteDescription,
} from '@wts/api/waste-tracking-gateway';
import { submission } from '@wts/api/green-list-waste-export';
import {
  paginateArray,
  copyCarriersNoTransport,
  setBaseWasteDescription,
  doesTemplateAlreadyExist,
} from '../../lib/util';
import { glwe } from '@wts/util/shared-validation';

const locale = 'en';
const context = 'api';

export interface SubmissionRef {
  id: string;
  accountId: string;
}

export type SubmissionTypeRef = SubmissionRef & {
  submitted: boolean;
};

export interface TemplateRef {
  id: string;
  accountId: string;
}

export interface OrderRef {
  order: 'ASC' | 'DESC';
}

export async function getTemplate({
  id,
  accountId,
}: TemplateRef): Promise<Template> {
  const value = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  ) as Template;
  if (value === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }
  const template: Template = {
    templateDetails: value.templateDetails,
    id: value.id,
    wasteDescription: value.wasteDescription,
    exporterDetail: value.exporterDetail,
    importerDetail: value.importerDetail,
    carriers: value.carriers,
    collectionDetail: value.collectionDetail,
    ukExitLocation: value.ukExitLocation,
    transitCountries: value.transitCountries,
    recoveryFacilityDetail: value.recoveryFacilityDetail,
  };
  return Promise.resolve(template);
}

export async function getTemplates(
  accountId: string,
  { order }: OrderRef,
  pageLimit = 15,
  token?: string,
): Promise<TemplateSummaryPage> {
  const rawValues: Template[] = db.templates.filter(
    (t) => t.accountId === accountId,
  );
  let templates: ReadonlyArray<TemplateSummary> = rawValues
    .map((s) => {
      return {
        id: s.id,
        templateDetails: s.templateDetails,
        wasteDescription: s.wasteDescription,
        exporterDetail: s.exporterDetail,
        importerDetail: s.exporterDetail,
        carriers: s.carriers,
        collectionDetail: s.collectionDetail,
        ukExitLocation: s.ukExitLocation,
        transitCountries: s.transitCountries,
        recoveryFacilityDetail: s.recoveryFacilityDetail,
      };
    })
    .sort((x, y) => {
      return x.templateDetails.lastModified > y.templateDetails.lastModified
        ? 1
        : -1;
    });

  if (order === 'DESC') {
    templates = rawValues
      .map((s) => {
        return {
          id: s.id,
          templateDetails: s.templateDetails,
          wasteDescription: s.wasteDescription,
          exporterDetail: s.exporterDetail,
          importerDetail: s.exporterDetail,
          carriers: s.carriers,
          collectionDetail: s.collectionDetail,
          ukExitLocation: s.ukExitLocation,
          transitCountries: s.transitCountries,
          recoveryFacilityDetail: s.recoveryFacilityDetail,
        };
      })
      .sort((x, y) => {
        return x.templateDetails.lastModified > y.templateDetails.lastModified
          ? 1
          : -1;
      })
      .reverse();
  }

  if (!Array.isArray(templates) || templates.length === 0) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  let hasMoreResults = true;
  let totalTemplates = 0;
  let totalPages = 0;
  let currentPage = 0;
  let pageNumber = 0;
  let contToken = '';
  const metadataArray: PageMetadata[] = [];
  let pageValues: ReadonlyArray<TemplateSummary> = [];

  while (hasMoreResults) {
    totalPages += 1;
    pageNumber += 1;

    const paginatedValues = paginateArray(templates, pageLimit, pageNumber);

    if ((!token && pageNumber === 1) || token === contToken) {
      pageValues = paginatedValues;
      currentPage = pageNumber;
    }

    const nextPaginatedValues = paginateArray(
      templates,
      pageLimit,
      pageNumber + 1,
    );

    hasMoreResults = nextPaginatedValues.length === 0 ? false : true;
    totalTemplates += paginatedValues.length;
    contToken = nextPaginatedValues.length === 0 ? '' : pageNumber.toString();

    const pageMetadata: PageMetadata = {
      pageNumber: pageNumber,
      token: nextPaginatedValues.length === 0 ? '' : pageNumber.toString(),
    };
    metadataArray.push(pageMetadata);

    if (!hasMoreResults && token === '') {
      break;
    }
  }

  return Promise.resolve({
    totalRecords: totalTemplates,
    totalPages: totalPages,
    currentPage: currentPage,
    pages: metadataArray,
    values: pageValues,
  });
}

export async function getNumberOfTemplates(accountId: string): Promise<number> {
  return Promise.resolve(
    db.templates.filter((template) => template.accountId === accountId).length,
  );
}

export async function createTemplate(
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (
    !templateDetails.name ||
    templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
    templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
    !glwe.regex.templateNameRegex.test(templateDetails.name)
  ) {
    throw new BadRequestError(
      `Template name must be unique and between ${glwe.constraints.TemplateNameChar.min} and ${glwe.constraints.TemplateNameChar.max} alphanumeric characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length >
      glwe.constraints.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }

  if (doesTemplateAlreadyExist(db.templates, accountId, templateDetails.name)) {
    throw new ConflictError('A template with this name already exists');
  }

  const id = uuidv4();

  const template: Template & { accountId: string } = {
    id,
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
    accountId: accountId,
  };

  db.templates.push(template);
  return Promise.resolve(template);
}

export async function updateTemplate(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (
    !templateDetails.name ||
    templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
    templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
    !glwe.regex.templateNameRegex.test(templateDetails.name)
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length >
      glwe.constraints.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );

  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    template.templateDetails.name !== templateDetails.name ||
    template.templateDetails.description !== templateDetails.description
  ) {
    if (template.templateDetails.name !== templateDetails.name) {
      if (
        doesTemplateAlreadyExist(db.templates, accountId, templateDetails.name)
      ) {
        throw new ConflictError('A template with this name already exists');
      }
    }

    if (template === undefined) {
      return Promise.reject(new NotFoundError('Template not found.'));
    }

    template.templateDetails.name = templateDetails.name;
    template.templateDetails.description = templateDetails.description;
    template.templateDetails.lastModified = new Date();
  }

  return Promise.resolve(template);
}

export async function deleteTemplate({
  id,
  accountId,
}: TemplateRef): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  db.templates = db.templates.filter(
    (t) => t.id !== id || t.accountId !== accountId,
  );
  return Promise.resolve();
}

export async function getWasteDescription({
  id,
  accountId,
}: SubmissionRef): Promise<WasteDescription> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.wasteDescription as WasteDescription);
}

export async function setWasteDescription(
  { id, accountId }: SubmissionRef,
  value: WasteDescription,
): Promise<void> {
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    if (value.wasteCode) {
      if (value.wasteCode.type === 'NotApplicable') {
        value.wasteCode = {
          type: value.wasteCode.type,
        };
      } else {
        if (value.wasteCode.code) {
          const wasteCodeValidationResult =
            glwe.validationRules.validateWasteCode(
              value.wasteCode.code,
              value.wasteCode.type,
              db.wasteCodes,
            );

          if (!wasteCodeValidationResult.valid) {
            errors.fieldFormatErrors.push(
              ...wasteCodeValidationResult.errors.fieldFormatErrors,
            );
          } else {
            value.wasteCode = wasteCodeValidationResult.value;
          }
        }
      }
    }

    if (value.ewcCodes) {
      const ewcCodesValidationResult = glwe.validationRules.validateEwcCodes(
        value.ewcCodes.map((e) => e.code),
        db.ewcCodes,
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
  }

  if (value.status === 'Complete') {
    if (
      value.wasteCode.type !== 'NotApplicable' &&
      !('code' in value.wasteCode)
    ) {
      const wasteCodeValidationResult = glwe.validationRules.validateWasteCode(
        '',
        value.wasteCode.type,
        db.wasteCodes,
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
      const wasteCodeValidationResult = glwe.validationRules.validateWasteCode(
        value.wasteCode.code,
        value.wasteCode.type,
        db.wasteCodes,
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

    const ewcCodesValidationResult = glwe.validationRules.validateEwcCodes(
      value.ewcCodes.map((e) => e.code),
      db.ewcCodes,
    );

    if (!ewcCodesValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...ewcCodesValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.ewcCodes = ewcCodesValidationResult.value;
    }

    const nationalCodeValidationResult =
      glwe.validationRules.validateNationalCode(
        value.nationalCode?.provided === 'Yes'
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
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  const submissionBase = setBaseWasteDescription(
    template.wasteDescription,
    template.carriers,
    template.recoveryFacilityDetail,
    value,
  );
  template.wasteDescription =
    submissionBase.wasteDescription as WasteDescription;
  template.carriers = submissionBase.carriers;
  template.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getExporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ExporterDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );

  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }
  return Promise.resolve(template.exporterDetail);
}

export async function setExporterDetail(
  { id, accountId }: SubmissionRef,
  value: ExporterDetail,
): Promise<void> {
  const section = 'ExporterDetail';
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    if (value.exporterAddress?.addressLine1) {
      const addressLine1ValidationResult =
        glwe.validationRules.validateAddressLine1(
          value.exporterAddress.addressLine1,
          section,
          locale,
          context,
        );

      if (!addressLine1ValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...addressLine1ValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterAddress.addressLine1 = addressLine1ValidationResult.value;
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
        errors.fieldFormatErrors.push(
          ...addressLine2ValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterAddress.addressLine2 = addressLine2ValidationResult.value;
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
        errors.fieldFormatErrors.push(
          ...townOrCityValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterAddress.townCity = townOrCityValidationResult.value;
      }
    }

    if (value.exporterAddress?.postcode) {
      const postcodeValidationResult = glwe.validationRules.validatePostcode(
        value.exporterAddress.postcode,
        section,
        locale,
        context,
      );

      if (!postcodeValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...postcodeValidationResult.errors.fieldFormatErrors,
        );
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
        errors.fieldFormatErrors.push(
          ...countryValidationResult.errors.fieldFormatErrors,
        );
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
        errors.fieldFormatErrors.push(
          ...organisationNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterContactDetails.organisationName =
          organisationNameValidationResult.value;
      }
    }

    if (value.exporterContactDetails?.fullName) {
      const fullNameValidationResult = glwe.validationRules.validateFullName(
        value.exporterContactDetails.fullName,
        section,
        locale,
        context,
      );

      if (!fullNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...fullNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterContactDetails.fullName = fullNameValidationResult.value;
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
        errors.fieldFormatErrors.push(
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
        errors.fieldFormatErrors.push(
          ...phoneNumberValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterContactDetails.phoneNumber =
          phoneNumberValidationResult.value;
      }
    }

    if (value.exporterContactDetails?.faxNumber) {
      const faxNumberValidationResult = glwe.validationRules.validateFaxNumber(
        value.exporterContactDetails.faxNumber,
        section,
        locale,
        context,
      );

      if (!faxNumberValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...faxNumberValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.exporterContactDetails.faxNumber =
          faxNumberValidationResult.value;
      }
    }
  }

  if (value.status === 'Complete') {
    const addressLine1ValidationResult =
      glwe.validationRules.validateAddressLine1(
        value.exporterAddress.addressLine1,
        section,
        locale,
        context,
      );

    if (!addressLine1ValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...addressLine1ValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterAddress.addressLine1 = addressLine1ValidationResult.value;
    }

    const addressLine2ValidationResult =
      glwe.validationRules.validateAddressLine2(
        value.exporterAddress.addressLine2,
        section,
        locale,
        context,
      );

    if (!addressLine2ValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...addressLine2ValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterAddress.addressLine2 = addressLine2ValidationResult.value;
    }

    const townOrCityValidationResult = glwe.validationRules.validateTownOrCity(
      value.exporterAddress.townCity,
      section,
      locale,
      context,
    );

    if (!townOrCityValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...townOrCityValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterAddress.townCity = townOrCityValidationResult.value;
    }

    const postcodeValidationResult = glwe.validationRules.validatePostcode(
      value.exporterAddress.postcode,
      section,
      locale,
      context,
    );

    if (!postcodeValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...postcodeValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterAddress.postcode = postcodeValidationResult.value;
    }

    const countryValidationResult = glwe.validationRules.validateCountry(
      value.exporterAddress.country,
      section,
      locale,
      context,
    );

    if (!countryValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...countryValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterAddress.country = countryValidationResult.value;
    }

    const organisationNameValidationResult =
      glwe.validationRules.validateOrganisationName(
        value.exporterContactDetails.organisationName,
        section,
        locale,
        context,
      );

    if (!organisationNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...organisationNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterContactDetails.organisationName =
        organisationNameValidationResult.value;
    }

    const fullNameValidationResult = glwe.validationRules.validateFullName(
      value.exporterContactDetails.fullName,
      section,
      locale,
      context,
    );

    if (!fullNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...fullNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterContactDetails.fullName = fullNameValidationResult.value;
    }

    const emailAddressValidationResult =
      glwe.validationRules.validateEmailAddress(
        value.exporterContactDetails.emailAddress,
        section,
        locale,
        context,
      );

    if (!emailAddressValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...emailAddressValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterContactDetails.emailAddress =
        emailAddressValidationResult.value;
    }

    const phoneNumberValidationResult =
      glwe.validationRules.validatePhoneNumber(
        value.exporterContactDetails.phoneNumber,
        section,
        locale,
        context,
      );

    if (!phoneNumberValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...phoneNumberValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterContactDetails.phoneNumber =
        phoneNumberValidationResult.value;
    }

    const faxNumberValidationResult = glwe.validationRules.validateFaxNumber(
      value.exporterContactDetails.faxNumber,
      section,
      locale,
      context,
    );

    if (!faxNumberValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...faxNumberValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.exporterContactDetails.faxNumber = faxNumberValidationResult.value;
    }
  }

  if (errors.fieldFormatErrors.length > 0) {
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.exporterDetail = value;
  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getImporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ImporterDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.importerDetail);
}

export async function setImporterDetail(
  { id, accountId }: SubmissionRef,
  value: ImporterDetail,
): Promise<void> {
  const section = 'ImporterDetail';
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    if (value.importerAddressDetails?.organisationName) {
      const organisationNameValidationResult =
        glwe.validationRules.validateOrganisationName(
          value.importerAddressDetails.organisationName,
          section,
          locale,
          context,
        );

      if (!organisationNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...organisationNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerAddressDetails.organisationName =
          organisationNameValidationResult.value;
      }
    }

    if (value.importerAddressDetails?.address) {
      const addressValidationResult = glwe.validationRules.validateAddress(
        value.importerAddressDetails.address,
        section,
        locale,
        context,
      );

      if (!addressValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...addressValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerAddressDetails.address = addressValidationResult.value;
      }
    }

    if (value.importerAddressDetails?.country) {
      const countryValidationResult = glwe.validationRules.validateCountry(
        value.importerAddressDetails.country,
        section,
        locale,
        context,
        db.countries,
      );

      if (!countryValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...countryValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerAddressDetails.country = countryValidationResult.value;
      }
    }

    if (value.importerContactDetails?.fullName) {
      const contactFullNameValidationResult =
        glwe.validationRules.validateFullName(
          value.importerContactDetails.fullName,
          section,
          locale,
          context,
        );

      if (!contactFullNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...contactFullNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerContactDetails.fullName =
          contactFullNameValidationResult.value;
      }
    }

    if (value.importerContactDetails?.phoneNumber) {
      const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
        value.importerContactDetails.phoneNumber,
        section,
        locale,
        context,
      );

      if (!phoneValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...phoneValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerContactDetails.phoneNumber = phoneValidationResult.value;
      }
    }

    if (value.importerContactDetails?.faxNumber) {
      const faxValidationResult = glwe.validationRules.validateFaxNumber(
        value.importerContactDetails.faxNumber,
        section,
        locale,
        context,
      );

      if (!faxValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...faxValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerContactDetails.faxNumber = faxValidationResult.value;
      }
    }

    if (value.importerContactDetails?.emailAddress) {
      const emailValidationResult = glwe.validationRules.validateEmailAddress(
        value.importerContactDetails.emailAddress,
        section,
        locale,
        context,
      );

      if (!emailValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...emailValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.importerContactDetails.emailAddress = emailValidationResult.value;
      }
    }
  }

  if (value.status === 'Complete') {
    const organisationNameValidationResult =
      glwe.validationRules.validateOrganisationName(
        value.importerAddressDetails.organisationName,
        section,
        locale,
        context,
      );

    if (!organisationNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...organisationNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerAddressDetails.organisationName =
        organisationNameValidationResult.value;
    }

    const addressValidationResult = glwe.validationRules.validateAddress(
      value.importerAddressDetails.address,
      section,
      locale,
      context,
    );

    if (!addressValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...addressValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerAddressDetails.address = addressValidationResult.value;
    }

    const countryValidationResult = glwe.validationRules.validateCountry(
      value.importerAddressDetails.country,
      section,
      locale,
      context,
      db.countries,
    );

    if (!countryValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...countryValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerAddressDetails.country = countryValidationResult.value;
    }

    const contactFullNameValidationResult =
      glwe.validationRules.validateFullName(
        value.importerContactDetails.fullName,
        section,
        locale,
        context,
      );

    if (!contactFullNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...contactFullNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerContactDetails.fullName =
        contactFullNameValidationResult.value;
    }

    const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
      value.importerContactDetails.phoneNumber,
      section,
      locale,
      context,
    );

    if (!phoneValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...phoneValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerContactDetails.phoneNumber = phoneValidationResult.value;
    }

    const faxValidationResult = glwe.validationRules.validateFaxNumber(
      value.importerContactDetails.faxNumber,
      section,
      locale,
      context,
    );

    if (!faxValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...faxValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerContactDetails.faxNumber = faxValidationResult.value;
    }

    const emailValidationResult = glwe.validationRules.validateEmailAddress(
      value.importerContactDetails.emailAddress,
      section,
      locale,
      context,
    );

    if (!emailValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...emailValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.importerContactDetails.emailAddress = emailValidationResult.value;
    }
  }

  if (errors.fieldFormatErrors.length > 0) {
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

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
      return Promise.reject(
        new BadRequestError(
          'Validation failed',
          transitCountriesCrossValidationResult.errors,
        ),
      );
    }
  }

  template.importerDetail = value;
  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function listCarriers({
  id,
  accountId,
}: SubmissionRef): Promise<Carriers> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.carriers);
}

export async function getCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
): Promise<Carriers> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (template.carriers.status === 'NotStarted') {
    return Promise.reject(new NotFoundError('Carriers NotStarted.'));
  }

  const carrier = template.carriers.values.find((c) => {
    return c.id === carrierId;
  });

  if (carrier === undefined) {
    return Promise.reject(new NotFoundError('Carrier not found.'));
  }

  const value: Carriers =
    template.carriers.status !== 'Complete'
      ? {
          status: template.carriers.status,
          transport: template.carriers.transport,
          values: [carrier as CarrierPartial],
        }
      : {
          status: template.carriers.status,
          transport: template.carriers.transport,
          values: [carrier as Carrier],
        };

  return Promise.resolve(value);
}

export async function createCarriers(
  { id, accountId }: SubmissionRef,
  value: Omit<Carriers, 'transport' | 'values'>,
): Promise<Carriers> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on carrier detail creation"`,
      ),
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (template.carriers.status !== 'NotStarted') {
    if (
      template.carriers.values.length === glwe.constraints.CarrierLength.max
    ) {
      return Promise.reject(
        new BadRequestError(
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
    const carriers: CarrierPartial[] = [];
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

  return Promise.resolve({
    status: value.status,
    transport: template.carriers.transport,
    values: [{ id: uuid }],
  });
}

export async function setCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
  value: Carriers,
): Promise<void> {
  const section = 'Carriers';
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    let index = 0;
    value.values.forEach((v) => {
      index += 1;

      if (v.addressDetails?.organisationName) {
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
      }

      if (v.addressDetails?.address) {
        const addressValidationResult = glwe.validationRules.validateAddress(
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
      }

      if (v.addressDetails?.country) {
        const countryValidationResult = glwe.validationRules.validateCountry(
          v.addressDetails.country,
          section,
          locale,
          context,
          db.countriesIncludingUk,
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

      if (v.contactDetails?.fullName) {
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
      }

      if (v.contactDetails?.phoneNumber) {
        const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
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
      }

      if (v.contactDetails?.faxNumber) {
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
      }

      if (v.contactDetails?.emailAddress) {
        const emailValidationResult = glwe.validationRules.validateEmailAddress(
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
            ...meansOfTransportDetailsValidationResult.errors.fieldFormatErrors,
          );
        } else {
          v.transportDetails.description =
            meansOfTransportDetailsValidationResult.value;
        }
      }
    });
  }

  if (value.status === 'Complete') {
    let index = 0;
    value.values.forEach((v) => {
      index += 1;
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

      const addressValidationResult = glwe.validationRules.validateAddress(
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

      const countryValidationResult = glwe.validationRules.validateCountry(
        v.addressDetails.country,
        section,
        locale,
        context,
        db.countriesIncludingUk,
        index,
      );

      if (!countryValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...countryValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.addressDetails.country = countryValidationResult.value;
      }

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

      const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
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

      const emailValidationResult = glwe.validationRules.validateEmailAddress(
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
            ...meansOfTransportDetailsValidationResult.errors.fieldFormatErrors,
          );
        } else {
          v.transportDetails.description =
            meansOfTransportDetailsValidationResult.value;
        }
      }
    });
  }

  if (errors.fieldFormatErrors.length > 0) {
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject();
  }

  if (template.carriers.status === 'NotStarted') {
    return Promise.reject(new NotFoundError('Carriers NotStarted'));
  }

  if (value.status === 'NotStarted') {
    template.carriers = value;
  } else {
    const carrier = value.values.find((c) => {
      return c.id === carrierId;
    });
    if (carrier === undefined) {
      return Promise.reject(new BadRequestError('Carrier not found.'));
    }

    const index = template.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });
    if (index === -1) {
      return Promise.reject(new NotFoundError('Index not found.'));
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
        return Promise.reject(
          new BadRequestError(
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

  return Promise.resolve();
}

export async function deleteCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (template.carriers.status === 'NotStarted') {
    return Promise.reject(new NotFoundError('Carriers NotStarted.'));
  }

  const index = template.carriers.values.findIndex((c) => {
    return c.id === carrierId;
  });

  if (index === -1) {
    return Promise.reject(new NotFoundError('Index not found.'));
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

  return Promise.resolve();
}

export async function getCollectionDetail({
  id,
  accountId,
}: SubmissionRef): Promise<CollectionDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.collectionDetail);
}

export async function setCollectionDetail(
  { id, accountId }: SubmissionRef,
  value: CollectionDetail,
): Promise<void> {
  const section = 'CollectionDetail';
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    if (value.address?.addressLine1) {
      const addressLine1ValidationResult =
        glwe.validationRules.validateAddressLine1(
          value.address.addressLine1,
          section,
          locale,
          context,
        );

      if (!addressLine1ValidationResult.valid) {
        errors.fieldFormatErrors.push(
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
        errors.fieldFormatErrors.push(
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
        errors.fieldFormatErrors.push(
          ...townOrCityValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.address.townCity = townOrCityValidationResult.value;
      }
    }

    if (value.address?.postcode) {
      const postcodeValidationResult = glwe.validationRules.validatePostcode(
        value.address.postcode,
        section,
        locale,
        context,
      );

      if (!postcodeValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...postcodeValidationResult.errors.fieldFormatErrors,
        );
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
        errors.fieldFormatErrors.push(
          ...countryValidationResult.errors.fieldFormatErrors,
        );
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
        errors.fieldFormatErrors.push(
          ...organisationNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.contactDetails.organisationName =
          organisationNameValidationResult.value;
      }
    }

    if (value.contactDetails?.fullName) {
      const fullNameValidationResult = glwe.validationRules.validateFullName(
        value.contactDetails.fullName,
        section,
        locale,
        context,
      );

      if (!fullNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...fullNameValidationResult.errors.fieldFormatErrors,
        );
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
        errors.fieldFormatErrors.push(
          ...emailAddressValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.contactDetails.emailAddress = emailAddressValidationResult.value;
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
        errors.fieldFormatErrors.push(
          ...phoneNumberValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.contactDetails.phoneNumber = phoneNumberValidationResult.value;
      }
    }

    if (value.contactDetails?.faxNumber) {
      const faxNumberValidationResult = glwe.validationRules.validateFaxNumber(
        value.contactDetails.faxNumber,
        section,
        locale,
        context,
      );

      if (!faxNumberValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...faxNumberValidationResult.errors.fieldFormatErrors,
        );
      } else {
        value.contactDetails.faxNumber = faxNumberValidationResult.value;
      }
    }
  }

  if (value.status === 'Complete') {
    const addressLine1ValidationResult =
      glwe.validationRules.validateAddressLine1(
        value.address.addressLine1,
        section,
        locale,
        context,
      );

    if (!addressLine1ValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...addressLine1ValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.address.addressLine1 = addressLine1ValidationResult.value;
    }

    const addressLine2ValidationResult =
      glwe.validationRules.validateAddressLine2(
        value.address.addressLine2,
        section,
        locale,
        context,
      );

    if (!addressLine2ValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...addressLine2ValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.address.addressLine2 = addressLine2ValidationResult.value;
    }

    const townOrCityValidationResult = glwe.validationRules.validateTownOrCity(
      value.address.townCity,
      section,
      locale,
      context,
    );

    if (!townOrCityValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...townOrCityValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.address.townCity = townOrCityValidationResult.value;
    }

    const postcodeValidationResult = glwe.validationRules.validatePostcode(
      value.address.postcode,
      section,
      locale,
      context,
    );

    if (!postcodeValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...postcodeValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.address.postcode = postcodeValidationResult.value;
    }

    const countryValidationResult = glwe.validationRules.validateCountry(
      value.address.country,
      section,
      locale,
      context,
    );

    if (!countryValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...countryValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.address.country = countryValidationResult.value;
    }

    const organisationNameValidationResult =
      glwe.validationRules.validateOrganisationName(
        value.contactDetails.organisationName,
        section,
        locale,
        context,
      );

    if (!organisationNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...organisationNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.contactDetails.organisationName =
        organisationNameValidationResult.value;
    }

    const fullNameValidationResult = glwe.validationRules.validateFullName(
      value.contactDetails.fullName,
      section,
      locale,
      context,
    );

    if (!fullNameValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...fullNameValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.contactDetails.fullName = fullNameValidationResult.value;
    }

    const emailAddressValidationResult =
      glwe.validationRules.validateEmailAddress(
        value.contactDetails.emailAddress,
        section,
        locale,
        context,
      );

    if (!emailAddressValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...emailAddressValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.contactDetails.emailAddress = emailAddressValidationResult.value;
    }

    const phoneNumberValidationResult =
      glwe.validationRules.validatePhoneNumber(
        value.contactDetails.phoneNumber,
        section,
        locale,
        context,
      );

    if (!phoneNumberValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...phoneNumberValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.contactDetails.phoneNumber = phoneNumberValidationResult.value;
    }

    const faxNumberValidationResult = glwe.validationRules.validateFaxNumber(
      value.contactDetails.faxNumber,
      section,
      locale,
      context,
    );

    if (!faxNumberValidationResult.valid) {
      errors.fieldFormatErrors.push(
        ...faxNumberValidationResult.errors.fieldFormatErrors,
      );
    } else {
      value.contactDetails.faxNumber = faxNumberValidationResult.value;
    }
  }

  if (errors.fieldFormatErrors.length > 0) {
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.collectionDetail = value;
  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getExitLocation({
  id,
  accountId,
}: SubmissionRef): Promise<ExitLocation> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.ukExitLocation);
}

export async function setExitLocation(
  { id, accountId }: SubmissionRef,
  value: ExitLocation,
): Promise<void> {
  if (value.status === 'Complete') {
    const uKExitLocationValidationResult =
      glwe.validationRules.validateUkExitLocation(
        'value' in value.exitLocation &&
          typeof value.exitLocation.value === 'string'
          ? value.exitLocation.value
          : undefined,
      );
    if (!uKExitLocationValidationResult.valid) {
      return Promise.reject(
        new BadRequestError(
          'Validation failed',
          uKExitLocationValidationResult.errors,
        ),
      );
    }
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.ukExitLocation = value;
  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getTransitCountries({
  id,
  accountId,
}: SubmissionRef): Promise<TransitCountries> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.transitCountries);
}

export async function setTransitCountries(
  { id, accountId }: SubmissionRef,
  value: TransitCountries,
): Promise<void> {
  if (value.status === 'Started' || value.status === 'Complete') {
    const transitCountriesValidationResult =
      glwe.validationRules.validateTransitCountries(value.values, db.countries);
    if (!transitCountriesValidationResult.valid) {
      return Promise.reject(
        new BadRequestError(
          'Validation failed',
          transitCountriesValidationResult.errors,
        ),
      );
    }
  }
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );

  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    (template.importerDetail.status === 'Complete' &&
      value.status === 'Started') ||
    (template.importerDetail.status === 'Complete' &&
      value.status === 'Complete')
  ) {
    const transitCountriesCrossValidationResult =
      glwe.validationRules.validateImporterDetailAndTransitCountriesCross(
        template.importerDetail,
        value.values,
      );
    if (!transitCountriesCrossValidationResult.valid) {
      return Promise.reject(
        new BadRequestError(
          'Validation failed',
          transitCountriesCrossValidationResult.errors,
        ),
      );
    }
  }

  template.transitCountries = value;
  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function listRecoveryFacilityDetail({
  id,
  accountId,
}: SubmissionRef): Promise<RecoveryFacilityDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.recoveryFacilityDetail);
}

export async function getRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
): Promise<RecoveryFacilityDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    template.recoveryFacilityDetail.status !== 'Started' &&
    template.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError());
  }

  const recoveryFacility = template.recoveryFacilityDetail.values.find((rf) => {
    return rf.id === rfdId;
  });

  if (recoveryFacility === undefined) {
    return Promise.reject(new NotFoundError('RecoverFacility not found.'));
  }

  const value: RecoveryFacilityDetail =
    template.recoveryFacilityDetail.status !== 'Complete'
      ? {
          status: template.recoveryFacilityDetail.status as 'Started',
          values: [recoveryFacility as RecoveryFacilityPartial],
        }
      : {
          status: template.recoveryFacilityDetail.status,
          values: [recoveryFacility as RecoveryFacility],
        };

  return Promise.resolve(value);
}

export async function createRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  value: Omit<RecoveryFacilityDetail, 'values'>,
): Promise<RecoveryFacilityDetail> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on recovery facility detail creation"`,
      ),
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
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
      return Promise.reject(
        new BadRequestError(
          `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${glwe.constraints.InterimSiteLength.max} InterimSite & ${glwe.constraints.RecoveryFacilityLength.max} Recovery Facilities)`,
        ),
      );
    }

    const facilities: RecoveryFacilityPartial[] = [];
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

  if (template.recoveryFacilityDetail.status === 'Started') {
    return Promise.resolve({
      status: value.status,
      values: [{ id: uuid }],
    });
  } else {
    return Promise.reject(
      new BadRequestError('Incorrect recovery facility status.'),
    );
  }
}

export async function setRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
  value: RecoveryFacilityDetail,
): Promise<void> {
  const section = 'RecoveryFacilityDetail';
  const errors: glwe.Errors = {
    fieldFormatErrors: [],
  };
  if (value.status === 'Started') {
    let index = 0;
    value.values.forEach((v) => {
      index += 1;
      if (v.addressDetails?.name) {
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
      }

      if (v.addressDetails?.address) {
        const addressValidationResult = glwe.validationRules.validateAddress(
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
      }

      if (v.addressDetails?.country) {
        const countryValidationResult = glwe.validationRules.validateCountry(
          v.addressDetails.country,
          section,
          locale,
          context,
          db.countries,
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

      if (v.contactDetails?.fullName) {
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
      }

      if (v.contactDetails?.phoneNumber) {
        const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
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
      }

      if (v.contactDetails?.faxNumber) {
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
      }

      if (v.contactDetails?.emailAddress) {
        const emailValidationResult = glwe.validationRules.validateEmailAddress(
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
          v.recoveryFacilityType.disposalCode) ||
          (v.recoveryFacilityType.type !== 'Laboratory' &&
            v.recoveryFacilityType.recoveryCode))
      ) {
        const codeValidationResult =
          glwe.validationRules.validateDisposalOrRecoveryCode(
            v.recoveryFacilityType.type === 'Laboratory'
              ? v.recoveryFacilityType.disposalCode
              : v.recoveryFacilityType.recoveryCode,
            v.recoveryFacilityType.type === 'Laboratory'
              ? {
                  type: v.recoveryFacilityType.type,
                  codeList: db.disposalCodes,
                }
              : {
                  type: v.recoveryFacilityType.type,
                  codeList: db.recoveryCodes,
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
            ? (v.recoveryFacilityType.disposalCode = codeValidationResult.value)
            : (v.recoveryFacilityType.recoveryCode =
                codeValidationResult.value);
        }
      }
    });
  }

  if (value.status === 'Complete') {
    let index = 0;
    value.values.forEach((v) => {
      index += 1;

      const organisationNameValidationResult =
        glwe.validationRules.validateOrganisationName(
          v.addressDetails.name,
          section,
          locale,
          context,
          index,
          v.recoveryFacilityType.type,
        );

      if (!organisationNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...organisationNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.addressDetails.name = organisationNameValidationResult.value;
      }

      const addressValidationResult = glwe.validationRules.validateAddress(
        v.addressDetails.address,
        section,
        locale,
        context,
        index,
        v.recoveryFacilityType.type,
      );

      if (!addressValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...addressValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.addressDetails.address = addressValidationResult.value;
      }

      const countryValidationResult = glwe.validationRules.validateCountry(
        v.addressDetails.country,
        section,
        locale,
        context,
        db.countries,
        index,
        v.recoveryFacilityType.type,
      );

      if (!countryValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...countryValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.addressDetails.country = countryValidationResult.value;
      }

      const contactFullNameValidationResult =
        glwe.validationRules.validateFullName(
          v.contactDetails.fullName,
          section,
          locale,
          context,
          index,
          v.recoveryFacilityType.type,
        );

      if (!contactFullNameValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...contactFullNameValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.contactDetails.fullName = contactFullNameValidationResult.value;
      }

      const phoneValidationResult = glwe.validationRules.validatePhoneNumber(
        v.contactDetails.phoneNumber,
        section,
        locale,
        context,
        index,
        v.recoveryFacilityType.type,
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
        v.recoveryFacilityType.type,
      );

      if (!faxValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...faxValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.contactDetails.faxNumber = faxValidationResult.value;
      }

      const emailValidationResult = glwe.validationRules.validateEmailAddress(
        v.contactDetails.emailAddress,
        section,
        locale,
        context,
        index,
        v.recoveryFacilityType.type,
      );

      if (!emailValidationResult.valid) {
        errors.fieldFormatErrors.push(
          ...emailValidationResult.errors.fieldFormatErrors,
        );
      } else {
        v.contactDetails.emailAddress = emailValidationResult.value;
      }

      if (
        (v.recoveryFacilityType.type === 'Laboratory' &&
          v.recoveryFacilityType.disposalCode !== undefined) ||
        (v.recoveryFacilityType.type !== 'Laboratory' &&
          v.recoveryFacilityType.recoveryCode !== undefined)
      ) {
        const codeValidationResult =
          glwe.validationRules.validateDisposalOrRecoveryCode(
            v.recoveryFacilityType.type === 'Laboratory'
              ? v.recoveryFacilityType.disposalCode
              : v.recoveryFacilityType.recoveryCode,
            v.recoveryFacilityType.type === 'Laboratory'
              ? {
                  type: v.recoveryFacilityType.type,
                  codeList: db.disposalCodes,
                }
              : {
                  type: v.recoveryFacilityType.type,
                  codeList: db.recoveryCodes,
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
            ? (v.recoveryFacilityType.disposalCode = codeValidationResult.value)
            : (v.recoveryFacilityType.recoveryCode =
                codeValidationResult.value);
        }
      }
    });
  }

  if (errors.fieldFormatErrors.length > 0) {
    return Promise.reject(new BadRequestError('Validation failed', errors));
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    template.recoveryFacilityDetail.status !== 'Started' &&
    template.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError());
  }

  if (value.status === 'Started' || value.status === 'Complete') {
    const recoveryFacility = value.values.find((rf) => {
      return rf.id === rfdId;
    });

    if (recoveryFacility === undefined) {
      return Promise.reject(new BadRequestError('RecoveryFacility not found.'));
    }
    const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
      return rf.id === rfdId;
    });
    if (index === -1) {
      return Promise.reject(new NotFoundError('Index not found.'));
    }

    if (
      template.wasteDescription.status !== 'NotStarted' &&
      template.wasteDescription.wasteCode
    ) {
      const recoveryFacilityTypes: submission.RecoveryFacilityDetail['recoveryFacilityType']['type'][] =
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
        return Promise.reject(
          new BadRequestError(
            'Validation failed',
            recoveryFacilityTypesValidationResult.errors,
          ),
        );
      }
    }

    template.recoveryFacilityDetail.status = value.status;
    template.recoveryFacilityDetail.values[index] =
      recoveryFacility as RecoveryFacility;
  }

  if (
    template.recoveryFacilityDetail.status !== 'Started' &&
    template.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError());
  }

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function deleteRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }
  if (
    template.recoveryFacilityDetail.status !== 'Started' &&
    template.recoveryFacilityDetail.status !== 'Complete'
  ) {
    return Promise.reject(new NotFoundError());
  }

  const index = template.recoveryFacilityDetail.values.findIndex((rf) => {
    return rf.id === rfdId;
  });

  if (index === -1) {
    return Promise.reject(new NotFoundError('Index not found.'));
  }

  template.recoveryFacilityDetail.values.splice(index, 1);
  if (template.recoveryFacilityDetail.values.length === 0) {
    template.recoveryFacilityDetail = { status: 'NotStarted' };
  }

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function createSubmissionFromTemplate(
  id: string,
  accountId: string,
  reference: CustomerReference,
): Promise<DraftSubmission> {
  const referenceValidationResult =
    glwe.validationRules.validateReference(reference);

  if (!referenceValidationResult.valid) {
    return Promise.reject(
      new BadRequestError(
        'Validation failed',
        referenceValidationResult.errors,
      ),
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found'));
  }

  id = uuidv4();

  const value: DraftSubmission & { accountId: string } = {
    id,
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
    accountId: accountId,
  };

  db.drafts.push(value);

  return Promise.resolve(value);
}

export async function createTemplateFromSubmission(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (
    !templateDetails.name ||
    templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
    templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
    !glwe.regex.templateNameRegex.test(templateDetails.name)
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length >
      glwe.constraints.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }

  if (doesTemplateAlreadyExist(db.templates, accountId, templateDetails.name)) {
    throw new ConflictError('A template with this name already exists');
  }

  const submission = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId,
  ) as Submission;

  id = uuidv4();

  const template: Template & { accountId: string } = {
    id,
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
    carriers: {
      status:
        submission.wasteDescription.wasteCode.type === 'NotApplicable'
          ? 'Complete'
          : 'Started',
      transport: submission.wasteDescription.wasteCode.type === 'NotApplicable',
      values: submission.carriers.map((c) => {
        return {
          id: uuidv4(),
          ...c,
        };
      }),
    },
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
    accountId,
  };

  db.templates.push(template);
  return Promise.resolve(template);
}

export async function createTemplateFromTemplate(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (
    !templateDetails.name ||
    templateDetails.name.length < glwe.constraints.TemplateNameChar.min ||
    templateDetails.name.length > glwe.constraints.TemplateNameChar.max ||
    !glwe.regex.templateNameRegex.test(templateDetails.name)
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length >
      glwe.constraints.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${glwe.constraints.TemplateDescriptionChar.max} characters.`,
    );
  }

  if (doesTemplateAlreadyExist(db.templates, accountId, templateDetails.name)) {
    throw new ConflictError('A template with this name already exists');
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  ) as Template;

  id = uuidv4();

  const newTemplate: Template & { accountId: string } = {
    id,
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
    accountId: accountId,
  };

  db.templates.push(newTemplate);
  return Promise.resolve(newTemplate);
}
