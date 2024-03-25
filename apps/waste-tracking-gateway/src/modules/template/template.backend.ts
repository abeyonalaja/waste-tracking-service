import Boom from '@hapi/boom';
import {
  CreateDraftCarriersResponse,
  CreateDraftRecoveryFacilityDetailsResponse,
  CreateTemplateResponse,
  DeleteDraftCarriersResponse,
  DeleteDraftRecoveryFacilityDetailsResponse,
  DeleteTemplateResponse,
  DraftExitLocation,
  DraftTransitCountries,
  DraftWasteDescription,
  GetDraftCarriersResponse,
  GetDraftCollectionDetailResponse,
  GetDraftExitLocationByIdResponse,
  GetDraftExporterDetailByIdResponse,
  GetDraftImporterDetailByIdResponse,
  GetDraftRecoveryFacilityDetailsResponse,
  GetDraftTransitCountriesResponse,
  GetDraftWasteDescriptionByIdResponse,
  GetNumberOfTemplatesResponse,
  GetTemplatesResponse,
  ListDraftCarriersResponse,
  ListDraftRecoveryFacilityDetailsResponse,
  SetDraftCarriersResponse,
  SetDraftCollectionDetailResponse,
  SetDraftExitLocationByIdResponse,
  SetDraftExporterDetailByIdResponse,
  SetDraftImporterDetailByIdResponse,
  SetDraftRecoveryFacilityDetailsResponse,
  SetDraftTransitCountriesResponse,
  SetDraftWasteDescriptionByIdResponse,
  Template,
  TemplateSummary,
  TemplateSummaryPage,
  UpdateTemplateResponse,
} from '@wts/api/green-list-waste-export';
import * as dto from '@wts/api/waste-tracking-gateway';
import { v4 as uuidv4 } from 'uuid';
import {
  AnnexViiServiceSubmissionBaseBackend,
  Carriers,
  CollectionDetail,
  ExporterDetail,
  ImporterDetail,
  InMemorySubmissionBaseBackend,
  RecoveryFacilityDetail,
  SubmissionBaseBackend,
  SubmissionBasePlusId,
  SubmissionRef,
  WasteDescription,
} from '../submissionBase/submissionBase.backend';
import { DaprAnnexViiClient } from '@wts/client/green-list-waste-export';
import { Logger } from 'winston';
import { OrderRef, Submission } from '../submission';

export type TemplateRef = {
  id: string;
  accountId: string;
};

export interface TemplateBackend extends SubmissionBaseBackend {
  createTemplate(
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  createTemplateFromTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  updateTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template>;
  getTemplates(
    accountId: string,
    { order }: OrderRef,
    pageLimit?: number,
    token?: string
  ): Promise<TemplateSummaryPage>;
  deleteTemplate(ref: TemplateRef): Promise<void>;
  getNumberOfTemplates(accountId: string): Promise<number>;
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

/**
 * This is a mock backend and should not be used in production.
 */
export class InMemoryTemplateBackend
  extends InMemorySubmissionBaseBackend
  implements TemplateBackend
{
  constructor(
    protected submissions: Map<string, Submission>,
    protected templates: Map<string, Template>
  ) {
    super(submissions, templates);
  }

  createTemplate(
    accountId: string,
    templateDetails: { name: string; description: string }
  ): Promise<Template> {
    if (!isTemplateNameValid(templateDetails.name)) {
      throw Boom.badRequest(
        'Template name must be unique and between 1 and 50 alphanumeric characters.'
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      throw Boom.badRequest(
        'Template description cannot exceed 100 characters.'
      );
    }

    if (this.doesTemplateAlreadyExist(accountId, templateDetails.name)) {
      throw Boom.conflict('A template with this name already exists');
    }

    const id = uuidv4();

    const template: Template = {
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
    };

    this.templates.set(JSON.stringify({ id, accountId }), template);
    return Promise.resolve(template);
  }

  async createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateDetails: { name: string; description: string }
  ): Promise<Template> {
    if (!isTemplateNameValid(templateDetails.name)) {
      throw Boom.badRequest(
        'Template name must be unique and between 1 and 50 alphanumeric characters.'
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      throw Boom.badRequest(
        'Template description cannot exceed 100 characters.'
      );
    }

    if (this.doesTemplateAlreadyExist(accountId, templateDetails.name)) {
      throw Boom.conflict('A template with this name already exists');
    }

    const submission = await this.getSubmission({
      id,
      accountId,
    } as SubmissionRef);

    id = uuidv4();

    const template: Template = {
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
      carriers: this.copyCarriersNoTransport(
        submission.carriers,
        this.isSmallWaste(submission.wasteDescription)
      ),
      collectionDetail: submission.collectionDetail,
      ukExitLocation: submission.ukExitLocation,
      transitCountries: submission.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        submission.recoveryFacilityDetail
      ),
    };

    this.templates.set(JSON.stringify({ id, accountId }), template);
    return Promise.resolve(template);
  }

  async createTemplateFromTemplate(
    id: string,
    accountId: string,
    templateDetails: { name: string; description: string }
  ): Promise<Template> {
    if (!isTemplateNameValid(templateDetails.name)) {
      throw Boom.badRequest(
        'Template name must be unique and between 1 and 50 alphanumeric characters.'
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      throw Boom.badRequest(
        'Template description cannot exceed 100 characters.'
      );
    }

    if (this.doesTemplateAlreadyExist(accountId, templateDetails.name)) {
      throw Boom.conflict('A template with this name already exists');
    }

    const template = await this.getTemplate({ id, accountId } as SubmissionRef);

    id = uuidv4();

    const newTemplate: Template = {
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
      carriers: this.copyCarriersNoTransport(
        template.carriers,
        this.isSmallWaste(template.wasteDescription)
      ),
      collectionDetail: template.collectionDetail,
      ukExitLocation: template.ukExitLocation,
      transitCountries: template.transitCountries,
      recoveryFacilityDetail: this.copyRecoveryFacilities(
        template.recoveryFacilityDetail
      ),
    };

    this.templates.set(JSON.stringify({ id, accountId }), newTemplate);
    return Promise.resolve(newTemplate);
  }

  updateTemplate(
    id: string,
    accountId: string,
    templateDetails: { name: string; description: string }
  ): Promise<Template> {
    if (!isTemplateNameValid(templateDetails.name)) {
      throw Boom.badRequest(
        'Template name must be unique and between 1 and 50 alphanumeric characters.'
      );
    }
    if (
      templateDetails.description &&
      templateDetails.description.length > 100
    ) {
      throw Boom.badRequest(
        'Template description cannot exceed 100 characters.'
      );
    }

    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      template.templateDetails.name !== templateDetails.name ||
      template.templateDetails.description !== templateDetails.description
    ) {
      if (template.templateDetails.name !== templateDetails.name) {
        if (this.doesTemplateAlreadyExist(accountId, templateDetails.name)) {
          throw Boom.conflict('A template with this name already exists');
        }
      }

      if (template === undefined) {
        return Promise.reject(Boom.notFound());
      }

      template.templateDetails.name = templateDetails.name;
      template.templateDetails.description = templateDetails.description;
      template.templateDetails.lastModified = new Date();

      this.templates.set(JSON.stringify({ id, accountId }), template);
    }

    return Promise.resolve(template);
  }

  doesTemplateAlreadyExist(accountId: string, templateName: string): boolean {
    let exists = false;
    const keys: string[] = [...this.templates.keys()].filter(
      (i) => (JSON.parse(i) as SubmissionRef).accountId === accountId
    );
    const templates: Template[] = [];
    keys.forEach((ref) => templates.push(this.templates.get(ref) as Template));

    Object.values(templates).map((template) => {
      if (template.templateDetails.name === templateName) {
        exists = true;
        return;
      }
    });

    return exists;
  }

  getNumberOfTemplates(accountId: string): Promise<number> {
    return Promise.resolve(
      [...this.templates.keys()].filter(
        (i) => (JSON.parse(i) as SubmissionRef).accountId === accountId
      ).length
    );
  }

  getTemplates(
    accountId: string,
    { order }: OrderRef,
    pageLimit = 15,
    token?: string
  ): Promise<TemplateSummaryPage> {
    const rawKeys: string[] = [...this.templates.keys()].filter(
      (i) => (JSON.parse(i) as SubmissionRef).accountId === accountId
    );
    const rawValues: Template[] = [];
    rawKeys.forEach((ref) =>
      rawValues.push(this.templates.get(ref) as Template)
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
      return Promise.reject(Boom.notFound());
    }

    let hasMoreResults = true;
    let totalTemplates = 0;
    let totalPages = 0;
    let currentPage = 0;
    let pageNumber = 0;
    let contToken = '';
    const metadataArray: dto.TemplatePageMetadata[] = [];
    let pageValues: ReadonlyArray<TemplateSummary> = [];

    while (hasMoreResults) {
      totalPages += 1;
      pageNumber += 1;

      const paginatedValues = this.paginateArray(
        templates,
        pageLimit,
        pageNumber
      );

      if ((!token && pageNumber === 1) || token === contToken) {
        pageValues = paginatedValues;
        currentPage = pageNumber;
      }

      const nextPaginatedValues = this.paginateArray(
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

  deleteTemplate({ id, accountId }: TemplateRef): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    this.templates.delete(JSON.stringify({ id, accountId }));
    return Promise.resolve();
  }

  getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.wasteDescription as WasteDescription);
  }

  setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: DraftWasteDescription
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const submissionBase = super.setBaseWasteDescription(
      template as dto.SubmissionBase,
      value
    );
    template.wasteDescription =
      submissionBase.wasteDescription as DraftWasteDescription;
    template.carriers = submissionBase.carriers;
    template.recoveryFacilityDetail = submissionBase.recoveryFacilityDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  getExporterDetail({ id, accountId }: SubmissionRef): Promise<ExporterDetail> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.exporterDetail);
  }

  setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    template.exporterDetail = super.setBaseExporterDetail(
      template as dto.SubmissionBase,
      value
    ).exporterDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  getImporterDetail({ id, accountId }: SubmissionRef): Promise<ImporterDetail> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.importerDetail);
  }

  setImporterDetail(
    { id, accountId }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    template.importerDetail = super.setBaseImporterDetail(
      template as dto.SubmissionBase,
      value
    ).importerDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.carriers);
  }

  createCarriers(
    { id, accountId }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on carrier detail creation"`
        )
      );
    }

    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (template.carriers.status !== 'NotStarted') {
      if (template.carriers.values.length === 5) {
        return Promise.reject(
          Boom.badRequest('Cannot add more than 5 carriers')
        );
      }
    }

    const submissionBasePlusId: SubmissionBasePlusId = this.createBaseCarriers(
      template as dto.SubmissionBase,
      value
    );

    template.carriers = submissionBasePlusId.submissionBase.carriers;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve({
      status: value.status,
      transport: template.carriers.transport,
      values: [{ id: submissionBasePlusId.id }],
    });
  }

  getCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<Carriers> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (template.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    const carrier = template.carriers.values.find((c) => {
      return c.id === carrierId;
    });

    if (carrier === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const value: dto.Carriers = {
      status: template.carriers.status,
      transport: template.carriers.transport,
      values: [carrier],
    };

    return Promise.resolve(value);
  }

  setCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (template.carriers.status === 'NotStarted') {
      return Promise.reject(Boom.notFound());
    }

    if (value.status === 'NotStarted') {
      template.carriers = super.setBaseNoCarriers(
        template as dto.SubmissionBase,
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
      template.carriers = super.setBaseCarriers(
        template as dto.SubmissionBase,
        carrierId,
        value,
        carrier,
        index
      ).carriers;
    }

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  deleteCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
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

    template.carriers = super.deleteBaseCarriers(
      template as dto.SubmissionBase,
      carrierId
    ).carriers;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  getCollectionDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<CollectionDetail> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.collectionDetail);
  }

  setCollectionDetail(
    { id, accountId }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    template.collectionDetail = super.setBaseCollectionDetail(
      template as dto.SubmissionBase,
      value
    ).collectionDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  getExitLocation({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftExitLocation> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.ukExitLocation);
  }

  setExitLocation(
    { id, accountId }: SubmissionRef,
    value: DraftExitLocation
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    template.ukExitLocation = super.setBaseExitLocation(
      template as dto.SubmissionBase,
      value as dto.ExitLocation
    ).ukExitLocation;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftTransitCountries> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.transitCountries);
  }

  setTransitCountries(
    { id, accountId }: SubmissionRef,
    value: DraftTransitCountries
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    template.transitCountries = super.setBaseTransitCountries(
      template as dto.SubmissionBase,
      value as dto.TransitCountries
    ).transitCountries as DraftTransitCountries;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  listRecoveryFacilityDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<RecoveryFacilityDetail> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    return Promise.resolve(template.recoveryFacilityDetail);
  }

  createRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    if (value.status !== 'Started') {
      return Promise.reject(
        Boom.badRequest(
          `"Status cannot be ${value.status} on recovery facility detail creation"`
        )
      );
    }

    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      template.recoveryFacilityDetail.status === 'Started' ||
      template.recoveryFacilityDetail.status === 'Complete'
    ) {
      if (template.recoveryFacilityDetail.values.length === 3) {
        return Promise.reject(
          Boom.badRequest(
            'Cannot add more than 3 facilities(1 InterimSite and 2 RecoveryFacilities)'
          )
        );
      }
    }

    const submissionBasePlusId: SubmissionBasePlusId =
      this.createBaseRecoveryFacilityDetail(
        template as dto.SubmissionBase,
        value
      );

    template.recoveryFacilityDetail =
      submissionBasePlusId.submissionBase.recoveryFacilityDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve({
      status: value.status,
      values: [{ id: submissionBasePlusId.id }],
    });
  }

  getRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
    if (template === undefined) {
      return Promise.reject(Boom.notFound());
    }

    if (
      template.recoveryFacilityDetail.status !== 'Started' &&
      template.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    const recoveryFacility = template.recoveryFacilityDetail.values.find(
      (rf) => {
        return rf.id === rfdId;
      }
    );

    if (recoveryFacility === undefined) {
      return Promise.reject(Boom.notFound());
    }

    const value: dto.RecoveryFacilityDetail = {
      status: template.recoveryFacilityDetail.status,
      values: [recoveryFacility],
    };
    return Promise.resolve(value);
  }

  setRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
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

    template.recoveryFacilityDetail = super.setBaseRecoveryFacilityDetail(
      template as dto.SubmissionBase,
      rfdId,
      value
    ).recoveryFacilityDetail;

    if (
      template.recoveryFacilityDetail.status !== 'Started' &&
      template.recoveryFacilityDetail.status !== 'Complete'
    ) {
      return Promise.reject(Boom.notFound());
    }

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }

  deleteRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<void> {
    const template = this.templates.get(JSON.stringify({ id, accountId }));
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

    template.recoveryFacilityDetail = super.deleteBaseRecoveryFacilityDetail(
      template as dto.SubmissionBase,
      rfdId
    ).recoveryFacilityDetail;

    template.templateDetails.lastModified = new Date();
    this.templates.set(JSON.stringify({ id, accountId }), template);

    return Promise.resolve();
  }
}

export class AnnexViiServiceTemplateBackend
  extends AnnexViiServiceSubmissionBaseBackend
  implements TemplateBackend
{
  constructor(protected client: DaprAnnexViiClient, protected logger: Logger) {
    super(client, logger);
  }

  async createTemplate(
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: CreateTemplateResponse;
    try {
      response = await this.client.createTemplate({
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createTemplateFromSubmission(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: CreateTemplateResponse;
    try {
      response = await this.client.createTemplateFromSubmission({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createTemplateFromTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: CreateTemplateResponse;
    try {
      response = await this.client.createTemplateFromTemplate({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async updateTemplate(
    id: string,
    accountId: string,
    templateDetails: {
      name: string;
      description: string;
    }
  ): Promise<Template> {
    let response: UpdateTemplateResponse;
    try {
      response = await this.client.updateTemplate({
        id,
        accountId,
        templateDetails,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getTemplates(
    accountId: string,
    { order }: OrderRef,
    pageLimit?: number,
    token?: string
  ): Promise<TemplateSummaryPage> {
    let response: GetTemplatesResponse;
    try {
      response = await this.client.getTemplates({
        accountId,
        order,
        pageLimit,
        token,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getNumberOfTemplates(accountId: string): Promise<number> {
    let response: GetNumberOfTemplatesResponse;
    try {
      response = await this.client.getNumberOfTemplates({ accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async deleteTemplate({ id, accountId }: TemplateRef): Promise<void> {
    let response: DeleteTemplateResponse;
    try {
      response = await this.client.deleteTemplate({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getWasteDescription({
    id,
    accountId,
  }: SubmissionRef): Promise<WasteDescription> {
    let response: GetDraftWasteDescriptionByIdResponse;
    try {
      response = await this.client.getTemplateWasteDescriptionById({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value as WasteDescription;
  }

  async setWasteDescription(
    { id, accountId }: SubmissionRef,
    value: DraftWasteDescription
  ): Promise<void> {
    let response: SetDraftWasteDescriptionByIdResponse;
    try {
      response = await this.client.setTemplateWasteDescriptionById({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getExporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ExporterDetail> {
    let response: GetDraftExporterDetailByIdResponse;
    try {
      response = await this.client.getTemplateExporterDetailById({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setExporterDetail(
    { id, accountId }: SubmissionRef,
    value: ExporterDetail
  ): Promise<void> {
    let response: SetDraftExporterDetailByIdResponse;
    try {
      response = await this.client.setTemplateExporterDetailById({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getImporterDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<ImporterDetail> {
    let response: GetDraftImporterDetailByIdResponse;
    try {
      response = await this.client.getTemplateImporterDetailById({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setImporterDetail(
    { id, accountId }: SubmissionRef,
    value: ImporterDetail
  ): Promise<void> {
    let response: SetDraftImporterDetailByIdResponse;
    try {
      response = await this.client.setTemplateImporterDetailById({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async listCarriers({ id, accountId }: SubmissionRef): Promise<Carriers> {
    let response: ListDraftCarriersResponse;
    try {
      response = await this.client.listTemplateCarriers({ id, accountId });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createCarriers(
    { id, accountId }: SubmissionRef,
    value: Omit<Carriers, 'transport' | 'values'>
  ): Promise<Carriers> {
    let response: CreateDraftCarriersResponse;
    try {
      response = await this.client.createTemplateCarriers({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<Carriers> {
    let response: GetDraftCarriersResponse;
    try {
      response = await this.client.getTemplateCarriers({
        id,
        accountId,
        carrierId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string,
    value: Carriers
  ): Promise<void> {
    if (value.status !== 'NotStarted') {
      for (const c of value.values) {
        c.id = carrierId;
      }
    }

    let response: SetDraftCarriersResponse;
    try {
      response = await this.client.setTemplateCarriers({
        id,
        accountId,
        carrierId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async deleteCarriers(
    { id, accountId }: SubmissionRef,
    carrierId: string
  ): Promise<void> {
    let response: DeleteDraftCarriersResponse;
    try {
      response = await this.client.deleteTemplateCarriers({
        id,
        accountId,
        carrierId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getCollectionDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<CollectionDetail> {
    let response: GetDraftCollectionDetailResponse;
    try {
      response = await this.client.getTemplateCollectionDetail({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setCollectionDetail(
    { id, accountId }: SubmissionRef,
    value: CollectionDetail
  ): Promise<void> {
    let response: SetDraftCollectionDetailResponse;
    try {
      response = await this.client.setTemplateCollectionDetail({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getExitLocation({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftExitLocation> {
    let response: GetDraftExitLocationByIdResponse;
    try {
      response = await this.client.getTemplateExitLocationById({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setExitLocation(
    { id, accountId }: SubmissionRef,
    value: DraftExitLocation
  ): Promise<void> {
    let response: SetDraftExitLocationByIdResponse;
    try {
      response = await this.client.setTemplateExitLocationById({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async getTransitCountries({
    id,
    accountId,
  }: SubmissionRef): Promise<DraftTransitCountries> {
    let response: GetDraftTransitCountriesResponse;
    try {
      response = await this.client.getTemplateTransitCountries({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setTransitCountries(
    { id, accountId }: SubmissionRef,
    value: DraftTransitCountries
  ): Promise<void> {
    let response: SetDraftTransitCountriesResponse;
    try {
      response = await this.client.setTemplateTransitCountries({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async listRecoveryFacilityDetail({
    id,
    accountId,
  }: SubmissionRef): Promise<RecoveryFacilityDetail> {
    let response: ListDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.listTemplateRecoveryFacilityDetails({
        id,
        accountId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async createRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    value: Omit<RecoveryFacilityDetail, 'values'>
  ): Promise<RecoveryFacilityDetail> {
    let response: CreateDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.createTemplateRecoveryFacilityDetails({
        id,
        accountId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async getRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<RecoveryFacilityDetail> {
    let response: GetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.getTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }

    return response.value;
  }

  async setRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string,
    value: RecoveryFacilityDetail
  ): Promise<void> {
    if (value.status === 'Started' || value.status === 'Complete') {
      for (const c of value.values) {
        c.id = rfdId;
      }
    }

    let response: SetDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.setTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
        value,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }

  async deleteRecoveryFacilityDetail(
    { id, accountId }: SubmissionRef,
    rfdId: string
  ): Promise<void> {
    let response: DeleteDraftRecoveryFacilityDetailsResponse;
    try {
      response = await this.client.deleteTemplateRecoveryFacilityDetails({
        id,
        accountId,
        rfdId,
      });
    } catch (err) {
      this.logger.error(err);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
  }
}
