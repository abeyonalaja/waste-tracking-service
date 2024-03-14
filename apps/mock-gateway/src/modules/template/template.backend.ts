import * as dto from '@wts/api/waste-tracking-gateway';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../libs/errors';
import { db } from '../../db';
import {
  DraftWasteDescription,
  Template,
  TemplatePageMetadata,
  TemplateSummary,
  TemplateSummaryPage,
} from '@wts/api/annex-vii';
import { v4 as uuidv4 } from 'uuid';
import {
  Carriers,
  CollectionDetail,
  ExitLocation,
  ExporterDetail,
  ImporterDetail,
  RecoveryFacilityDetail,
  Submission,
  TransitCountries,
  WasteDescription,
} from '@wts/api/waste-tracking-gateway';

export type OrderRef = {
  order: 'ASC' | 'DESC';
};

function paginateArray<T>(
  array: T[],
  pageSize: number,
  pageNumber: number
): T[] {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

export type SubmissionBasePlusId = {
  submissionBase: dto.SubmissionBase;
  id: string;
};

export type SubmissionRef = {
  id: string;
  accountId: string;
};

export type TemplateRef = {
  id: string;
  accountId: string;
};

export async function getTemplates(
  accountId: string,
  { order }: OrderRef,
  pageLimit = 15,
  token?: string
): Promise<TemplateSummaryPage> {
  const rawValues: dto.Template[] = db.templates.filter(
    (t) => t.accountId === accountId
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
  const metadataArray: TemplatePageMetadata[] = [];
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
      pageNumber + 1
    );

    hasMoreResults = nextPaginatedValues.length === 0 ? false : true;
    totalTemplates += paginatedValues.length;
    contToken = nextPaginatedValues.length === 0 ? '' : pageNumber.toString();

    const pageMetadata: dto.SubmissionPageMetadata = {
      pageNumber: pageNumber,
      token: nextPaginatedValues.length === 0 ? '' : pageNumber.toString(),
    };
    metadataArray.push(pageMetadata);

    if (!hasMoreResults && token === '') {
      break;
    }
  }

  return Promise.resolve({
    totalTemplates: totalTemplates,
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
    (t) => t.id == id && t.accountId == accountId
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
  templateDetails: { name: string; description: string }
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      'Template name must be unique and between 1 and 50 alphanumeric characters.'
    );
  }
  if (templateDetails.description && templateDetails.description.length > 100) {
    throw new BadRequestError(
      'Template description cannot exceed 100 characters.'
    );
  }

  if (doesTemplateAlreadyExist(accountId, templateDetails.name)) {
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
  templateDetails: { name: string; description: string }
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      'Template name must be unique and between 1 and 50 alphanumeric characters.'
    );
  }
  if (templateDetails.description && templateDetails.description.length > 100) {
    throw new BadRequestError(
      'Template description cannot exceed 100 characters.'
    );
  }

  if (doesTemplateAlreadyExist(accountId, templateDetails.name)) {
    throw new ConflictError('A template with this name already exists');
  }

  const submission = await getSubmission({
    id,
    accountId,
  } as SubmissionRef);

  id = uuidv4();

  const template: Template & { accountId: string } = {
    id,
    templateDetails: {
      name: templateDetails.name,
      description: templateDetails.description,
      created: new Date(),
      lastModified: new Date(),
    },
    wasteDescription: submission.wasteDescription as DraftWasteDescription,
    exporterDetail: submission.exporterDetail,
    importerDetail: submission.importerDetail,
    carriers: copyCarriersNoTransport(
      submission.carriers,
      isSmallWaste(submission.wasteDescription)
    ),
    collectionDetail: submission.collectionDetail,
    ukExitLocation: submission.ukExitLocation,
    transitCountries: submission.transitCountries,
    recoveryFacilityDetail: copyRecoveryFacilities(
      submission.recoveryFacilityDetail
    ),
    accountId: accountId,
  };

  db.templates.push(template);
  return Promise.resolve(template);
}

export async function createTemplateFromTemplate(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string }
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      'Template name must be unique and between 1 and 50 alphanumeric characters.'
    );
  }
  if (templateDetails.description && templateDetails.description.length > 100) {
    throw new BadRequestError(
      'Template description cannot exceed 100 characters.'
    );
  }

  if (doesTemplateAlreadyExist(accountId, templateDetails.name)) {
    throw new ConflictError('A template with this name already exists');
  }

  const template = await getTemplate({ id, accountId } as SubmissionRef);

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
      isSmallWaste(template.wasteDescription)
    ),
    collectionDetail: template.collectionDetail,
    ukExitLocation: template.ukExitLocation,
    transitCountries: template.transitCountries,
    recoveryFacilityDetail: copyRecoveryFacilities(
      template.recoveryFacilityDetail
    ),
    accountId: accountId,
  };

  db.templates.push(newTemplate);
  return Promise.resolve(newTemplate);
}

export async function updateTemplate(
  id: string,
  accountId: string,
  templateDetails: { name: string; description: string }
): Promise<Template> {
  if (!isTemplateNameValid(templateDetails.name)) {
    throw new BadRequestError(
      'Template name must be unique and between 1 and 50 alphanumeric characters.'
    );
  }
  if (templateDetails.description && templateDetails.description.length > 100) {
    throw new BadRequestError(
      'Template description cannot exceed 100 characters.'
    );
  }
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );

  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    template.templateDetails.name !== templateDetails.name ||
    template.templateDetails.description !== templateDetails.description
  ) {
    if (template.templateDetails.name !== templateDetails.name) {
      if (doesTemplateAlreadyExist(accountId, templateDetails.name)) {
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
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  db.templates = db.templates.filter(
    (t) => t.id !== id || t.accountId !== accountId
  );
  return Promise.resolve();
}

export async function getWasteDescription({
  id,
  accountId,
}: SubmissionRef): Promise<WasteDescription> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.wasteDescription as WasteDescription);
}

export async function setWasteDescription(
  { id, accountId }: SubmissionRef,
  value: DraftWasteDescription
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  const submissionBase = setBaseWasteDescription(
    template as dto.SubmissionBase,
    value
  );
  template.wasteDescription =
    submissionBase.wasteDescription as DraftWasteDescription;
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
    (t) => t.id == id && t.accountId == accountId
  );

  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }
  return Promise.resolve(template.exporterDetail);
}

export async function setExporterDetail(
  { id, accountId }: SubmissionRef,
  value: ExporterDetail
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.exporterDetail = setBaseExporterDetail(
    template as dto.SubmissionBase,
    value
  ).exporterDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getImporterDetail({
  id,
  accountId,
}: SubmissionRef): Promise<ImporterDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.importerDetail);
}

export async function setImporterDetail(
  { id, accountId }: SubmissionRef,
  value: ImporterDetail
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.importerDetail = setBaseImporterDetail(
    template as dto.SubmissionBase,
    value
  ).importerDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function listCarriers({
  id,
  accountId,
}: SubmissionRef): Promise<Carriers> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.carriers);
}

export async function createCarriers(
  { id, accountId }: SubmissionRef,
  value: Omit<Carriers, 'transport' | 'values'>
): Promise<Carriers> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on carrier detail creation"`
      )
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (template.carriers.status !== 'NotStarted') {
    if (template.carriers.values.length === 5) {
      return Promise.reject(
        new BadRequestError('Cannot add more than 5 carriers')
      );
    }
  }

  const submissionBasePlusId: SubmissionBasePlusId = createBaseCarriers(
    template as dto.SubmissionBase,
    value
  );

  template.carriers = submissionBasePlusId.submissionBase.carriers;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve({
    status: value.status,
    transport: template.carriers.transport,
    values: [{ id: submissionBasePlusId.id }],
  });
}

export async function getCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string
): Promise<Carriers> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
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

  const value: dto.Carriers = {
    status: template.carriers.status,
    transport: template.carriers.transport,
    values: [carrier],
  };

  return Promise.resolve(value);
}

export async function setCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string,
  value: Carriers
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject();
  }

  if (template.carriers.status === 'NotStarted') {
    return Promise.reject(new NotFoundError('Carriers NotStarted'));
  }

  if (value.status === 'NotStarted') {
    template.carriers = setBaseNoCarriers(
      template as dto.SubmissionBase,
      carrierId,
      value
    ).carriers;
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
      template as dto.SubmissionBase,
      carrierId,
      value,
      carrier,
      index
    ).carriers;
  }

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function deleteCarriers(
  { id, accountId }: SubmissionRef,
  carrierId: string
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
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

  template.carriers = deleteBaseCarriers(
    template as dto.SubmissionBase,
    carrierId
  ).carriers;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getCollectionDetail({
  id,
  accountId,
}: SubmissionRef): Promise<CollectionDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.collectionDetail);
}

export async function setCollectionDetail(
  { id, accountId }: SubmissionRef,
  value: CollectionDetail
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.collectionDetail = setBaseCollectionDetail(
    template as dto.SubmissionBase,
    value
  ).collectionDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getExitLocation({
  id,
  accountId,
}: SubmissionRef): Promise<ExitLocation> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.ukExitLocation);
}

export async function setExitLocation(
  { id, accountId }: SubmissionRef,
  value: ExitLocation
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.ukExitLocation = setBaseExitLocation(
    template as dto.SubmissionBase,
    value
  ).ukExitLocation;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getTransitCountries({
  id,
  accountId,
}: SubmissionRef): Promise<TransitCountries> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.transitCountries);
}

export async function setTransitCountries(
  { id, accountId }: SubmissionRef,
  value: TransitCountries
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  template.transitCountries = setBaseTransitCountries(
    template as dto.SubmissionBase,
    value
  ).transitCountries;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function listRecoveryFacilityDetail({
  id,
  accountId,
}: SubmissionRef): Promise<RecoveryFacilityDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  return Promise.resolve(template.recoveryFacilityDetail);
}

export async function createRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  value: Omit<RecoveryFacilityDetail, 'values'>
): Promise<RecoveryFacilityDetail> {
  if (value.status !== 'Started') {
    return Promise.reject(
      new BadRequestError(
        `"Status cannot be ${value.status} on recovery facility detail creation"`
      )
    );
  }

  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
  );
  if (template === undefined) {
    return Promise.reject(new NotFoundError('Template not found.'));
  }

  if (
    template.recoveryFacilityDetail.status === 'Started' ||
    template.recoveryFacilityDetail.status === 'Complete'
  ) {
    if (template.recoveryFacilityDetail.values.length === 3) {
      return Promise.reject(
        new BadRequestError(
          'Cannot add more than 3 facilities(1 InterimSite and 2 RecoveryFacilities)'
        )
      );
    }
  }

  const submissionBasePlusId: SubmissionBasePlusId =
    createBaseRecoveryFacilityDetail(template as dto.SubmissionBase, value);

  template.recoveryFacilityDetail =
    submissionBasePlusId.submissionBase.recoveryFacilityDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve({
    status: value.status,
    values: [{ id: submissionBasePlusId.id }],
  });
}

export async function getRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string
): Promise<RecoveryFacilityDetail> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
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

  const value: dto.RecoveryFacilityDetail = {
    status: template.recoveryFacilityDetail.status,
    values: [recoveryFacility],
  };
  return Promise.resolve(value);
}

export async function setRecoveryFacilityDetail(
  { id, accountId }: SubmissionRef,
  rfdId: string,
  value: RecoveryFacilityDetail
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
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
    template as dto.SubmissionBase,
    rfdId,
    value
  ).recoveryFacilityDetail;

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
  rfdId: string
): Promise<void> {
  const template = db.templates.find(
    (t) => t.id == id && t.accountId == accountId
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
    template as dto.SubmissionBase,
    rfdId
  ).recoveryFacilityDetail;

  template.templateDetails.lastModified = new Date();

  return Promise.resolve();
}

export async function getNumberOfTemplates(accountId: string): Promise<number> {
  return Promise.resolve(
    db.templates.filter((template) => template.accountId === accountId).length
  );
}

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

function getSubmission({ id, accountId }: SubmissionRef): Promise<Submission> {
  const value = db.submissions.find(
    (s) => s.id == id && s.accountId == accountId
  ) as Submission;

  if (
    value === undefined ||
    value.submissionState.status === 'Cancelled' ||
    value.submissionState.status === 'Deleted'
  ) {
    return Promise.reject(new NotFoundError('Submission not found.'));
  }
  const submission: Submission = {
    id: value.id,
    reference: value.reference,
    wasteQuantity: value.wasteQuantity,
    collectionDate: value.collectionDate,
    submissionConfirmation: value.submissionConfirmation,
    submissionDeclaration: value.submissionDeclaration,
    submissionState: value.submissionState,
    wasteDescription: value.wasteDescription,
    exporterDetail: value.exporterDetail,
    importerDetail: value.importerDetail,
    carriers: value.carriers,
    collectionDetail: value.collectionDetail,
    ukExitLocation: value.ukExitLocation,
    transitCountries: value.transitCountries,
    recoveryFacilityDetail: value.recoveryFacilityDetail,
  };

  return Promise.resolve(submission);
}

function doesTemplateAlreadyExist(
  accountId: string,
  templateName: string
): boolean {
  let exists = false;
  const templates: Template[] = db.templates.filter(
    (template) => template.accountId === accountId
  );

  templates.map((template) => {
    if (template.templateDetails.name === templateName) {
      exists = true;
      return;
    }
  });
  return exists;
}

function copyCarriersNoTransport(
  sourceCarriers: dto.Carriers,
  isSmallWaste: boolean
): dto.Carriers {
  let targetCarriers: dto.Carriers = {
    status: 'NotStarted',
    transport: true,
  };

  if (sourceCarriers.status !== 'NotStarted') {
    const carriers: dto.Carrier[] = [];
    for (const c of sourceCarriers.values) {
      const carrier: dto.Carrier = {
        id: uuidv4(),
        addressDetails: c.addressDetails,
        contactDetails: c.contactDetails,
      };
      carriers.push(carrier);
    }
    targetCarriers = {
      status: isSmallWaste ? sourceCarriers.status : 'Started',
      transport: true,
      values: carriers,
    };
  }

  return targetCarriers;
}

function copyRecoveryFacilities(
  sourceFacilities: dto.RecoveryFacilityDetail
): dto.RecoveryFacilityDetail {
  let targetFacilities: dto.RecoveryFacilityDetail = { status: 'NotStarted' };

  if (
    sourceFacilities.status === 'Started' ||
    sourceFacilities.status === 'Complete'
  ) {
    const facilities: dto.RecoveryFacility[] = [];
    for (const r of sourceFacilities.values) {
      const facility: dto.RecoveryFacility = {
        id: uuidv4(),
        addressDetails: r.addressDetails,
        contactDetails: r.contactDetails,
        recoveryFacilityType: r.recoveryFacilityType,
      };
      facilities.push(facility);
    }
    targetFacilities = {
      status: sourceFacilities.status,
      values: facilities,
    };
  } else {
    targetFacilities = {
      status: sourceFacilities.status,
    };
  }

  return targetFacilities;
}

function isSmallWaste(wasteDescription: DraftWasteDescription): boolean {
  return (
    wasteDescription.status === 'Complete' &&
    wasteDescription.wasteCode.type === 'NotApplicable'
  );
}

function setBaseWasteDescription(
  submissionBase: dto.SubmissionBase,
  value: DraftWasteDescription
): dto.SubmissionBase {
  let recoveryFacilityDetail: dto.Submission['recoveryFacilityDetail'] =
    submissionBase.recoveryFacilityDetail.status === 'CannotStart' &&
    value.status !== 'NotStarted' &&
    value.wasteCode !== undefined
      ? { status: 'NotStarted' }
      : submissionBase.recoveryFacilityDetail;

  let carriers: dto.Submission['carriers'] = submissionBase.carriers;

  if (
    submissionBase.wasteDescription.status === 'NotStarted' &&
    value.status !== 'NotStarted' &&
    value.wasteCode?.type === 'NotApplicable'
  ) {
    carriers.transport = false;
  }

  if (isWasteCodeChangingBulkToSmall(submissionBase.wasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: false };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (isWasteCodeChangingSmallToBulk(submissionBase.wasteDescription, value)) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkDifferentType(
      submissionBase.wasteDescription,
      value
    )
  ) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    carriers = { status: 'NotStarted', transport: true };

    recoveryFacilityDetail = { status: 'NotStarted' };
  }

  if (
    isWasteCodeChangingBulkToBulkSameType(
      submissionBase.wasteDescription,
      value
    )
  ) {
    if (value.status === 'Started') {
      value.ewcCodes = undefined;
      value.nationalCode = undefined;
      value.description = undefined;
    }

    if (submissionBase.carriers.status !== 'NotStarted') {
      carriers = {
        status: 'Started',
        transport: true,
        values: submissionBase.carriers.values,
      };
    }

    if (
      submissionBase.recoveryFacilityDetail.status === 'Started' ||
      submissionBase.recoveryFacilityDetail.status === 'Complete'
    ) {
      recoveryFacilityDetail = {
        status: 'Started',
        values: submissionBase.recoveryFacilityDetail.values,
      };
    }
  }

  submissionBase.wasteDescription = value as WasteDescription;
  submissionBase.carriers = carriers;
  submissionBase.recoveryFacilityDetail = recoveryFacilityDetail;

  return submissionBase;
}

function isWasteCodeChangingBulkToSmall(
  currentWasteDescription: WasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type === 'NotApplicable'
  );
}
function isWasteCodeChangingSmallToBulk(
  currentWasteDescription: WasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type === 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable'
  );
}

function isWasteCodeChangingBulkToBulkDifferentType(
  currentWasteDescription: WasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    newWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    currentWasteDescription.wasteCode?.type !==
      newWasteDescription.wasteCode?.type
  );
}

function isWasteCodeChangingBulkToBulkSameType(
  currentWasteDescription: WasteDescription,
  newWasteDescription: DraftWasteDescription
): boolean {
  return (
    currentWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type !== 'NotApplicable' &&
    newWasteDescription.status !== 'NotStarted' &&
    currentWasteDescription.wasteCode?.type ===
      newWasteDescription.wasteCode?.type &&
    currentWasteDescription.wasteCode?.code !==
      newWasteDescription.wasteCode?.code
  );
}

function setBaseExporterDetail(
  submissionBase: dto.SubmissionBase,
  value: ExporterDetail
): dto.SubmissionBase {
  submissionBase.exporterDetail = value;

  return submissionBase;
}

function setBaseImporterDetail(
  submissionBase: dto.SubmissionBase,
  value: ImporterDetail
): dto.SubmissionBase {
  submissionBase.importerDetail = value;

  return submissionBase;
}

function createBaseCarriers(
  submissionBase: dto.SubmissionBase,
  value: Omit<Carriers, 'transport' | 'values'>
): SubmissionBasePlusId {
  const submissionBasePlusId = {
    submissionBase: submissionBase,
    id: uuidv4(),
  };
  const transport: Carriers['transport'] =
    submissionBase.wasteDescription.status !== 'NotStarted' &&
    submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
      ? false
      : true;

  if (submissionBase.carriers.status === 'NotStarted') {
    submissionBasePlusId.submissionBase.carriers = {
      status: value.status,
      transport: transport,
      values: [{ id: submissionBasePlusId.id }],
    };

    return submissionBasePlusId;
  }

  const carriers: dto.Carrier[] = [];
  for (const c of submissionBase.carriers.values) {
    carriers.push(c);
  }
  carriers.push({ id: submissionBasePlusId.id });
  submissionBasePlusId.submissionBase.carriers = {
    status: value.status,
    transport: transport,
    values: carriers,
  };

  return submissionBasePlusId;
}

function setBaseNoCarriers(
  submissionBase: dto.SubmissionBase,
  carrierId: string,
  value: Carriers
): dto.SubmissionBase {
  if (value.status === 'NotStarted') {
    submissionBase.carriers = value;

    return submissionBase;
  }

  return submissionBase;
}

function setBaseCarriers(
  submissionBase: dto.SubmissionBase,
  carrierId: string,
  value: Carriers,
  carrier: dto.Carrier,
  index: number
): dto.SubmissionBase {
  if (
    submissionBase !== undefined &&
    submissionBase.carriers.status !== 'NotStarted' &&
    value.status !== 'NotStarted'
  ) {
    submissionBase.carriers.status = value.status;
    submissionBase.carriers.values[index] = carrier as dto.Carrier;
  }
  return submissionBase;
}

function deleteBaseCarriers(
  submissionBase: dto.SubmissionBase,
  carrierId: string
): dto.SubmissionBase {
  if (submissionBase.carriers.status !== 'NotStarted') {
    const index = submissionBase.carriers.values.findIndex((c) => {
      return c.id === carrierId;
    });

    submissionBase.carriers.values.splice(index, 1);
    if (submissionBase.carriers.values.length === 0) {
      const transport: Carriers['transport'] =
        submissionBase.wasteDescription.status !== 'NotStarted' &&
        submissionBase.wasteDescription.wasteCode?.type === 'NotApplicable'
          ? false
          : true;

      submissionBase.carriers = {
        status: 'NotStarted',
        transport: transport,
      };
    }
  }

  return submissionBase;
}

function setBaseCollectionDetail(
  submissionBase: dto.SubmissionBase,
  value: CollectionDetail
): dto.SubmissionBase {
  submissionBase.collectionDetail = value;

  return submissionBase;
}

function setBaseExitLocation(
  submissionBase: dto.SubmissionBase,
  value: ExitLocation
): dto.SubmissionBase {
  submissionBase.ukExitLocation = value;

  return submissionBase;
}

function setBaseTransitCountries(
  submissionBase: dto.SubmissionBase,
  value: TransitCountries
): dto.SubmissionBase {
  submissionBase.transitCountries = value;

  return submissionBase;
}

function createBaseRecoveryFacilityDetail(
  submissionBase: dto.SubmissionBase,
  value: Omit<RecoveryFacilityDetail, 'values'>
): SubmissionBasePlusId {
  const submissionBasePlusId = {
    submissionBase: submissionBase,
    id: uuidv4(),
  };
  if (
    submissionBase.recoveryFacilityDetail.status !== 'Started' &&
    submissionBase.recoveryFacilityDetail.status !== 'Complete'
  ) {
    submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
      status: value.status,
      values: [{ id: submissionBasePlusId.id }],
    };

    return submissionBasePlusId;
  }

  const facilities: dto.RecoveryFacility[] = [];
  for (const rf of submissionBase.recoveryFacilityDetail.values) {
    facilities.push(rf);
  }
  facilities.push({ id: submissionBasePlusId.id });
  submissionBasePlusId.submissionBase.recoveryFacilityDetail = {
    status: value.status,
    values: facilities,
  };

  return submissionBasePlusId;
}

function setBaseRecoveryFacilityDetail(
  submissionBase: dto.SubmissionBase,
  rfdId: string,
  value: RecoveryFacilityDetail
): dto.SubmissionBase {
  if (submissionBase !== undefined) {
    if (
      submissionBase.recoveryFacilityDetail.status === 'Started' ||
      submissionBase.recoveryFacilityDetail.status === 'Complete'
    ) {
      if (value.status !== 'Started' && value.status !== 'Complete') {
        submissionBase.recoveryFacilityDetail = value;
        return submissionBase;
      }

      const recoveryFacility = value.values.find((rf) => {
        return rf.id === rfdId;
      });

      const index = submissionBase.recoveryFacilityDetail.values.findIndex(
        (rf) => {
          return rf.id === rfdId;
        }
      );
      submissionBase.recoveryFacilityDetail.status = value.status;
      submissionBase.recoveryFacilityDetail.values[index] =
        recoveryFacility as dto.RecoveryFacility;
    }
  }

  return submissionBase;
}

function deleteBaseRecoveryFacilityDetail(
  submissionBase: dto.SubmissionBase,
  rfdId: string
): dto.SubmissionBase {
  if (
    submissionBase.recoveryFacilityDetail.status === 'Started' ||
    submissionBase.recoveryFacilityDetail.status === 'Complete'
  ) {
    const index = submissionBase.recoveryFacilityDetail.values.findIndex(
      (rf) => {
        return rf.id === rfdId;
      }
    );

    if (index !== -1) {
      submissionBase.recoveryFacilityDetail.values.splice(index, 1);
      if (submissionBase.recoveryFacilityDetail.values.length === 0) {
        submissionBase.recoveryFacilityDetail = { status: 'NotStarted' };
      }
    }
  }

  return submissionBase;
}
