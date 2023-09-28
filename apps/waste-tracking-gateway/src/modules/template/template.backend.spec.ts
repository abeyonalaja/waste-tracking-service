import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import { InMemoryTemplateBackend } from './template.backend';
import {
  InMemorySubmissionBackend,
  Submission,
} from '../submission/submission.backend';
import { DraftWasteDescription, Template } from '@wts/api/annex-vii';

describe(InMemoryTemplateBackend, () => {
  const accountId = faker.datatype.uuid();
  const submissions = new Map<string, Submission>();
  const templates = new Map<string, Template>();
  const submissionBackend = new InMemorySubmissionBackend(
    submissions,
    templates
  );
  const subject = new InMemoryTemplateBackend(submissions, templates);

  it('persists a created template', async () => {
    const { id } = await subject.createTemplate(accountId, {
      name: 'My Template',
      description: 'My template description',
    });
    const result = await subject.getTemplate({ id, accountId });
    expect(result.id).toEqual(id);
    expect(result.wasteDescription.status).toEqual('NotStarted');
  });

  it('persists a template created from a submission', async () => {
    const mockSubmission = {
      id: faker.datatype.uuid(),
      reference: 'abc',
      wasteDescription: {
        status: 'Complete',
        wasteCode: {
          type: faker.datatype.string(),
          value: faker.datatype.string(),
        },
        ewcCodes: [faker.datatype.string()],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        description: faker.datatype.string(),
      } as unknown as DraftWasteDescription,
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            value: faker.datatype.number(),
          },
          estimateData: {},
        },
      },
      exporterDetail: {
        status: 'Complete',
        exporterAddress: {
          country: faker.datatype.string(),
          postcode: faker.datatype.string(),
          townCity: faker.datatype.string(),
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
        },
        exporterContactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      importerDetail: {
        status: 'Complete',
        importerAddressDetails: {
          address: faker.datatype.string(),
          country: faker.datatype.string(),
          organisationName: faker.datatype.string(),
        },
        importerContactDetails: {
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: faker.datatype.string(),
            month: faker.datatype.string(),
            day: faker.datatype.string(),
          },
          estimateDate: {},
        },
      },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              imo: faker.datatype.string(),
              type: 'BulkVessel',
            },
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              organisationName: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      collectionDetail: {
        status: 'Complete',
        address: {
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
          townCity: faker.datatype.string(),
          postcode: faker.datatype.string(),
          country: faker.datatype.string(),
        },
        contactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['Albania (AL)'],
      },
      recoveryFacilityDetail: {
        status: 'Complete',
        values: [
          {
            addressDetails: {
              address: faker.datatype.string(),
              country: faker.datatype.string(),
              name: faker.datatype.string(),
            },
            contactDetails: {
              emailAddress: faker.datatype.string(),
              faxNumber: faker.datatype.string(),
              fullName: faker.datatype.string(),
              phoneNumber: faker.datatype.string(),
            },
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'NotStarted',
      },
      submissionDeclaration: {
        status: 'CannotStart',
      },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;
    submissionBackend
      .getSubmisssionMap()
      .set(mockSubmission.id, mockSubmission);

    const { id } = await subject.createTemplateFromSubmission(
      mockSubmission.id,
      accountId,
      {
        name: 'My Template From Submission',
        description: 'My template from submission description',
      }
    );
    const result = await subject.getTemplate({ id, accountId });
    expect(result.id).toEqual(id);
    expect(result.wasteDescription.status).toEqual('Complete');
  });
});
