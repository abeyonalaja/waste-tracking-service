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
import { validation } from '@wts/api/green-list-waste-export';
import {
  paginateArray,
  createBaseCarriers,
  setBaseCarriers,
  deleteBaseCarriers,
  createBaseRecoveryFacilityDetail,
  setBaseRecoveryFacilityDetail,
  deleteBaseRecoveryFacilityDetail,
  copyCarriersNoTransport,
  copyRecoveryFacilities,
  isSmallWaste,
  isTemplateNameValid,
  setBaseWasteDescription,
  doesTemplateAlreadyExist,
  getCarrierTransport,
} from '../../lib/util';

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

export async function createTemplate(
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      `Template name must be unique and between ${validation.TemplateNameChar.min} and ${validation.TemplateNameChar.max} alphanumeric characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length > validation.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
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

export async function createTemplateFromSubmission(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length > validation.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
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
    carriers: copyCarriersNoTransport(
      {
        status: 'Complete',
        transport: isSmallWaste({
          status: 'Complete',
          ...submission.wasteDescription,
        }),
        values: submission.carriers.map((c) => {
          return {
            id: uuidv4(),
            ...c,
          };
        }),
      },
      isSmallWaste({
        status: 'Complete',
        ...submission.wasteDescription,
      }),
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
    recoveryFacilityDetail: copyRecoveryFacilities({
      status: 'Complete',
      values: submission.recoveryFacilityDetail.map((r) => {
        return {
          id: uuidv4(),
          ...r,
        };
      }),
    }),
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
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length > validation.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
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
      isSmallWaste(template.wasteDescription),
    ),
    collectionDetail: template.collectionDetail,
    ukExitLocation: template.ukExitLocation,
    transitCountries: template.transitCountries,
    recoveryFacilityDetail: copyRecoveryFacilities(
      template.recoveryFacilityDetail,
    ),
    accountId: accountId,
  };

  db.templates.push(newTemplate);
  return Promise.resolve(newTemplate);
}

export async function updateTemplate(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string },
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
    );
  }
  if (
    templateDetails.description &&
    templateDetails.description.length > validation.TemplateDescriptionChar.max
  ) {
    throw new BadRequestError(
      `Template description cannot exceed ${validation.TemplateDescriptionChar.max} characters.`,
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
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
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
    if (template.carriers.values.length === validation.CarrierLength.max) {
      return Promise.reject(
        new BadRequestError(
          `Cannot add more than ${validation.CarrierLength.max} carriers`,
        ),
      );
    }
  }

  template.carriers.transport = getCarrierTransport(template.wasteDescription);
  const { newCarrierId, carriers } = createBaseCarriers(
    template.carriers,
    value,
  );
  template.carriers = carriers;

  template.templateDetails.lastModified = new Date();

  if (template.carriers.status !== 'NotStarted') {
    return Promise.resolve({
      status: value.status,
      transport: template.carriers.transport,
      values: [{ id: newCarrierId }],
    });
  } else {
    return Promise.reject(new BadRequestError('Incorrect carrier status.'));
  }
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

export async function setCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
  value: Carriers,
): Promise<void> {
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
    template.carriers = setBaseCarriers(
      template.carriers,
      value,
      carrier,
      index,
    );
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

  template.carriers.transport = getCarrierTransport(template.wasteDescription);
  template.carriers = deleteBaseCarriers(template.carriers, carrierId);

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
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId,
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
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

  if (
    template.recoveryFacilityDetail.status === 'Started' ||
    template.recoveryFacilityDetail.status === 'Complete'
  ) {
    const maxFacilities =
      validation.InterimSiteLength.max + validation.RecoveryFacilityLength.max;
    if (template.recoveryFacilityDetail.values.length === maxFacilities) {
      return Promise.reject(
        new BadRequestError(
          `Cannot add more than ${maxFacilities} recovery facilities (Maximum: ${validation.InterimSiteLength.max} InterimSite & ${validation.RecoveryFacilityLength.max} Recovery Facilities)`,
        ),
      );
    }
  }

  const { newRecoveryFacilityDetailId, recoveryFacilityDetails } =
    createBaseRecoveryFacilityDetail(template.recoveryFacilityDetail, value);
  template.recoveryFacilityDetail = recoveryFacilityDetails;

  template.templateDetails.lastModified = new Date();

  if (template.recoveryFacilityDetail.status === 'Started') {
    return Promise.resolve({
      status: value.status,
      values: [{ id: newRecoveryFacilityDetailId }],
    });
  } else {
    return Promise.reject(
      new BadRequestError('Incorrect recovery facility status.'),
    );
  }
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
          status: template.carriers.status as 'Started',
          values: [recoveryFacility as RecoveryFacilityPartial],
        }
      : {
          status: template.carriers.status,
          values: [recoveryFacility as RecoveryFacility],
        };
  return Promise.resolve(value);
}

export async function setRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
  value: RecoveryFacilityDetail,
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
  }

  template.recoveryFacilityDetail = setBaseRecoveryFacilityDetail(
    template.recoveryFacilityDetail,
    rfdId,
    value,
  );

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

  template.recoveryFacilityDetail = deleteBaseRecoveryFacilityDetail(
    template.recoveryFacilityDetail,
    rfdId,
  );

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getNumberOfTemplates(accountId: string): Promise<number> {
  return Promise.resolve(
    db.templates.filter((template) => template.accountId === accountId).length,
  );
}
