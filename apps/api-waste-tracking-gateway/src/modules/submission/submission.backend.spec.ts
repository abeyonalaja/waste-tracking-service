import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import {
  Carriers,
  RecoveryFacilityDetail,
  InMemorySubmissionBackend,
  TransitCountries,
  ExitLocation,
  SubmissionConfirmation,
  Submission,
  SubmissionDeclaration,
} from './submission.backend';
import { add } from 'date-fns';
import { InMemoryTemplateBackend } from '../template';
import {
  DraftWasteDescription,
  Template,
} from '@wts/api/green-list-waste-export';

describe(InMemorySubmissionBackend, () => {
  let subject: InMemorySubmissionBackend;
  let templateBackend: InMemoryTemplateBackend;
  const submissions = new Map<string, Submission>();
  const templates = new Map<string, Template>();

  beforeEach(() => {
    subject = new InMemorySubmissionBackend(submissions, templates);
    templateBackend = new InMemoryTemplateBackend(submissions, templates);
  });

  it('persists a created submission', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    const result = await subject.getSubmission({ id, accountId });
    expect(result.id).toEqual(id);
  });

  it('bad request if reference more than 20 chars', () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(21);
    expect(
      subject.createSubmission(accountId, reference)
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('creates a submission with a reference', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const result = await subject.createSubmission(accountId, reference);
    expect(result.reference).toBe(reference);
  });

  it('creates a submission and gets the submission using returned id to check all statuses are correct', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('NotStarted');
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.exporterDetail.status).toBe('NotStarted');
    expect(result?.importerDetail.status).toBe('NotStarted');
    expect(result?.collectionDate.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.collectionDetail.status).toBe('NotStarted');
    expect(result?.ukExitLocation.status).toBe('NotStarted');
    expect(result?.transitCountries.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');
    expect(result?.submissionConfirmation.status).toBe('CannotStart');
    expect(result?.submissionDeclaration.status).toBe('CannotStart');
    expect(result?.submissionState.status).toBe('InProgress');
  });

  it('enables waste quantity on completion of waste description', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Complete',
        wasteCode: { type: 'NotApplicable' },
        ewcCodes: [],
        nationalCode: { provided: 'No' },
        description: '',
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('NotStarted');
  });

  it('cannot initially start recovery facility section', async () => {
    const accountId = faker.datatype.uuid();
    const { recoveryFacilityDetail } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    expect(recoveryFacilityDetail.status).toBe('CannotStart');
  });

  it('enables recovery facility where some waste code is provided', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('lets us change a customer reference', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    const reference = faker.datatype.string(10);
    await subject.setCustomerReference({ id, accountId }, reference);
    expect(await subject.getCustomerReference({ id, accountId })).toBe(
      reference
    );
  });

  it('rejects where reference not found', () => {
    const id = faker.datatype.uuid();
    const accountId = faker.datatype.uuid();
    expect(subject.getSubmission({ id, accountId })).rejects.toHaveProperty(
      'isBoom',
      true
    );
    expect(
      subject.getWasteDescription({ id, accountId })
    ).rejects.toHaveProperty('isBoom', true);
    expect(
      subject.getCustomerReference({ id, accountId })
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('lets us change a carrier detail', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    const status: Omit<Carriers, 'transport' | 'values'> = {
      status: 'Started',
    };
    const carriers = await subject.createCarriers({ id, accountId }, status);

    if (carriers.status !== 'Started') {
      expect(false);
    } else {
      const carrierId = carriers.values[0].id;
      const value: Carriers = {
        status: status.status,
        transport: true,
        values: [
          {
            id: carriers.values[0].id,
            addressDetails: {
              organisationName: 'Acme Inc',
              address: '123 Anytown',
              country: 'UK',
            },
            contactDetails: {
              fullName: 'John Doe',
              emailAddress: 'johndoe@acme.com',
              phoneNumber: '555-1234',
              faxNumber: '555-5678',
            },
            transportDetails: {
              type: 'Road',
              description: 'hitch-hiking',
            },
          },
        ],
      };

      await subject.setCarriers({ id, accountId }, carrierId, value);
      expect(await subject.getCarriers({ id, accountId }, carrierId)).toEqual(
        value
      );
    }
  });

  it('accepts set exit location if provided is Yes and value is given', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    const setExitLocationRequest = {
      status: 'Complete',
      exitLocation: { provided: 'Yes', value: faker.datatype.string() },
    } as ExitLocation;

    expect(
      subject.setExitLocation({ id, accountId }, setExitLocationRequest)
    ).resolves.toEqual(undefined);
  });

  it('accepts set exit location if provided is No and value is not given', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    const setExitLocationRequest = {
      status: 'Complete',
      exitLocation: { provided: 'No' },
    } as ExitLocation;

    expect(
      subject.setExitLocation({ id, accountId }, setExitLocationRequest)
    ).resolves.toEqual(undefined);
  });

  it('lets us change a Transit Countries data', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    const transitCountryData = {
      status: 'Complete',
      values: ['N. Ireland', 'Wales'],
    } as TransitCountries;
    await subject.setTransitCountries({ id, accountId }, transitCountryData);
    expect(await subject.getTransitCountries({ id, accountId })).toBe(
      transitCountryData
    );
  });

  it('lets us change a Recovery Facility Detail', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    const status: Omit<RecoveryFacilityDetail, 'values'> = {
      status: 'Started',
    };
    const recoveryFacilities = await subject.createRecoveryFacilityDetail(
      { id, accountId },
      status
    );

    if (recoveryFacilities.status !== 'Started') {
      expect(false);
    } else {
      const rfdId = recoveryFacilities.values[0].id;
      const value: RecoveryFacilityDetail = {
        status: status.status,
        values: [
          {
            id: recoveryFacilities.values[0].id,
            recoveryFacilityType: {
              type: 'Laboratory',
              disposalCode: 'D01',
            },
            addressDetails: {
              name: 'Fireflies',
              address: '15 Firefly Ave',
              country: 'Boston',
            },
            contactDetails: {
              fullName: 'Joel Miller',
              emailAddress: 'jm@tlou.com',
              phoneNumber: '0123456789',
            },
          },
        ],
      };

      await subject.setRecoveryFacilityDetail({ id, accountId }, rfdId, value);
      expect(
        await subject.getRecoveryFacilityDetail({ id, accountId }, rfdId)
      ).toEqual(value);
    }
  });

  it('rejects invalid set submission confirmation request', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let setSubmissionConfirmationRequest = {
      status: 'NotStarted',
      confirmation: true,
    } as SubmissionConfirmation;

    expect(
      subject.setSubmissionConfirmation(
        { id, accountId },
        setSubmissionConfirmationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);

    setSubmissionConfirmationRequest = {
      status: 'CannotStart',
      confirmation: true,
    } as SubmissionConfirmation;

    expect(
      subject.setSubmissionConfirmation(
        { id, accountId },
        setSubmissionConfirmationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('accepts valid set submission confirmation request', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let date = add(new Date(), { days: 1 });

    const mockInvalidDateSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          code: faker.datatype.string(),
        },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        status: 'Complete',
        description: faker.datatype.string(),
      } as DraftWasteDescription,
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
        exporterAddress: {
          country: faker.datatype.string(),
          postcode: faker.datatype.string(),
          townCity: faker.datatype.string(),
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.datatype.string(),
          country: faker.datatype.string(),
          organisationName: faker.datatype.string(),
        },
        status: 'Complete',
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
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              type: 'Air',
              description: 'RyanAir',
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

    date = add(new Date(), { weeks: 2 });

    const mockValidSubmission = { ...mockInvalidDateSubmission };
    mockValidSubmission.collectionDate = {
      status: 'Complete',
      value: {
        type: 'ActualDate',
        actualDate: {
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          day: date.getDate().toString().padStart(2, '0'),
        },
        estimateDate: {},
      },
    };

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockValidSubmission);
    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });

    const SubmissionConfirmationRequest = {
      status: 'Complete',
      confirmation: true,
    } as SubmissionConfirmation;
    expect(
      subject.setSubmissionConfirmation(
        { id, accountId },
        SubmissionConfirmationRequest
      )
    ).resolves.toBe(undefined);

    subject.setExitLocation({ id, accountId }, { status: 'NotStarted' });

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'CannotStart' });

    subject.setExitLocation(
      { id, accountId },
      {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      }
    );

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });
  });

  it('rejects invalid set submission declaration request', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let setSubmissionDeclarationRequest = {
      status: 'Complete',
    } as SubmissionDeclaration;

    expect(
      subject.setSubmissionDeclaration(
        { id, accountId },
        setSubmissionDeclarationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);

    setSubmissionDeclarationRequest = {
      status: 'CannotStart',
      confirmation: true,
    } as SubmissionDeclaration;

    expect(
      subject.setSubmissionDeclaration(
        { id, accountId },
        setSubmissionDeclarationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('updates the status of the submission declaration based on the state of the submission confirmation', async () => {
    const accountId = faker.datatype.uuid();
    const id = (
      await subject.createSubmission(accountId, faker.datatype.string(10))
    ).id;

    let date = add(new Date(), { days: 1 });

    const mockInvalidDateSubmission = {
      id: id,
      reference: 'abc',
      wasteDescription: {
        wasteCode: {
          type: faker.datatype.string(),
          code: faker.datatype.string(),
        },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        status: 'Complete',
        description: faker.datatype.string(),
      } as DraftWasteDescription,
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
        exporterAddress: {
          country: faker.datatype.string(),
          postcode: faker.datatype.string(),
          townCity: faker.datatype.string(),
          addressLine1: faker.datatype.string(),
          addressLine2: faker.datatype.string(),
        },
        status: 'Complete',
        exporterContactDetails: {
          organisationName: faker.datatype.string(),
          fullName: faker.datatype.string(),
          emailAddress: faker.datatype.string(),
          phoneNumber: faker.datatype.string(),
        },
      },
      importerDetail: {
        importerAddressDetails: {
          address: faker.datatype.string(),
          country: faker.datatype.string(),
          organisationName: faker.datatype.string(),
        },
        status: 'Complete',
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
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              type: 'Air',
              description: 'RyanAir',
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

    date = add(new Date(), { weeks: 2 });

    const mockValidSubmission = { ...mockInvalidDateSubmission };
    mockValidSubmission.collectionDate = {
      status: 'Complete',
      value: {
        type: 'ActualDate',
        actualDate: {
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString().padStart(2, '0'),
          day: date.getDate().toString().padStart(2, '0'),
        },
        estimateDate: {},
      },
    };

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockValidSubmission);

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });

    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'CannotStart' });

    subject.setExitLocation({ id, accountId }, { status: 'NotStarted' });

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'CannotStart' });
    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'CannotStart' });

    subject.setExitLocation(
      { id, accountId },
      {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
      }
    );

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });
    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'CannotStart' });

    subject.setSubmissionConfirmation(
      { id, accountId },
      { status: 'Complete', confirmation: true }
    );

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'Complete', confirmation: true });
    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });

    subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    expect(
      (await subject.getSubmissionDeclaration({ id, accountId })).status
    ).toEqual('Complete');
  });

  it('Reset recovery facility when waste description is changed from Non-Laboratory to Laborarory', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
      }
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');

    const status: Omit<RecoveryFacilityDetail, 'values'> = {
      status: 'Started',
    };

    await subject.createRecoveryFacilityDetail({ id, accountId }, status);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('Started');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('Reset recovery facility when waste description is changed from Laboratory to Non-Laborarory', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      }
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');

    const status: Omit<RecoveryFacilityDetail, 'values'> = {
      status: 'Started',
    };

    await subject.createRecoveryFacilityDetail({ id, accountId }, status);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('Started');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('Reset quantity, carriers and recovery facility details when waste description is changed from small to bulk waste', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'NotApplicable' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: {
        status: 'Complete',
        transport: false,
        values: [
          {
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
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
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
      submissionConfirmation: { status: 'NotStarted' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.carriers.transport).toBe(true);
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toBeUndefined();
      expect(result?.wasteDescription.nationalCode).toBeUndefined();
      expect(result?.wasteDescription.description).toBeUndefined();
    }
  });

  it('Reset quantity, carriers and recovery facility details when waste description is changed from bulk to small waste', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: { status: 'NotStarted' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'NotApplicable' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.carriers.transport).toBe(false);
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toBeUndefined();
      expect(result?.wasteDescription.nationalCode).toBeUndefined();
      expect(result?.wasteDescription.description).toBeUndefined();
    }
  });

  it('Reset quantity, carriers and recovery facility details when waste description switches type of bulk-waste', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: { status: 'NotStarted' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIB', code: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.carriers.transport).toBe(true);
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toBeUndefined();
      expect(result?.wasteDescription.nationalCode).toBeUndefined();
      expect(result?.wasteDescription.description).toBeUndefined();
    }
  });

  it('Resets status of quantity, carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
    const accountId = faker.datatype.uuid();
    const { id } = await subject.createSubmission(
      accountId,
      faker.datatype.string(10)
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
      exporterDetail: { status: 'NotStarted' },
      importerDetail: { status: 'NotStarted' },
      collectionDate: { status: 'NotStarted' },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
      collectionDetail: { status: 'NotStarted' },
      ukExitLocation: { status: 'NotStarted' },
      transitCountries: { status: 'NotStarted' },
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: { status: 'NotStarted' },
      submissionDeclaration: { status: 'CannotStart' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject
      .getSubmissionMap()
      .set(JSON.stringify({ id, accountId }), mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', code: 'Z' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('Started');
    expect(result?.carriers.status).toBe('Started');
    expect(result?.carriers.transport).toBe(true);
    expect(result?.recoveryFacilityDetail.status).toBe('Started');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toBeUndefined();
      expect(result?.wasteDescription.nationalCode).toBeUndefined();
      expect(result?.wasteDescription.description).toBeUndefined();
    }
  });

  it('sets submission state status to SubmittedWithActuals when all data has actual values on initial submission', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const { id } = await subject.createSubmission(accountId, reference);
    const date = add(new Date(), { days: 20 });
    const value = {
      id: id,
      reference,
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
          addressLine1: '1 Sth Str',
          country: 'England',
          postcode: 'W140QA',
          townCity: 'London',
        },
        exporterContactDetails: {
          organisationName: 'Org Name',
          fullName: 'Name',
          emailAddress: 'name@name.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        status: 'Complete',
        importerContactDetails: {
          emailAddress: 'thomas@fleurada.de',
          fullName: 'Thomas Albers',
          phoneNumber: '07733222555',
        },
        importerAddressDetails: {
          address: 'Middel Broekweg 41A, \n2675 KD Honselersdijk',
          country: 'Holland',
          organisationName: 'Fleurada Holland BV',
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              type: 'Road',
              description: 'On the one road...',
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
          addressLine1: '123 Main St',
          townCity: 'Anytown',
          postcode: '12345',
          country: 'UK',
        },
        contactDetails: {
          organisationName: 'Acme Inc.',
          fullName: 'John Doe',
          emailAddress: 'johndoe@acme.com',
          phoneNumber: '555-1234',
          faxNumber: '555-5678',
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['France (FR)', 'Belgium (BE)'],
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'Complete',
        confirmation: true,
      },
      submissionDeclaration: { status: 'NotStarted' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject.getSubmissionMap().set(JSON.stringify({ id, accountId }), value);

    await subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithActuals');
  });

  it('sets submission state status to SubmittedWithEstimates when data has estimated values on initial submission', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const { id } = await subject.createSubmission(accountId, reference);
    const date = add(new Date(), { days: 20 });
    const value = {
      id: id,
      reference,
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'EstimateData',
          actualData: {},
          estimateData: {
            quantityType: 'Weight',
            value: faker.datatype.number(),
          },
        },
      },
      exporterDetail: {
        status: 'Complete',
        exporterAddress: {
          addressLine1: '1 Sth Str',
          country: 'England',
          postcode: 'W140QA',
          townCity: 'London',
        },
        exporterContactDetails: {
          organisationName: 'Org Name',
          fullName: 'Name',
          emailAddress: 'name@name.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        status: 'Complete',
        importerContactDetails: {
          emailAddress: 'thomas@fleurada.de',
          fullName: 'Thomas Albers',
          phoneNumber: '07733222555',
        },
        importerAddressDetails: {
          address: 'Middel Broekweg 41A, \n2675 KD Honselersdijk',
          country: 'Holland',
          organisationName: 'Fleurada Holland BV',
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'EstimateDate',
          actualDate: {},
          estimateDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        },
      },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
          addressLine1: '123 Main St',
          townCity: 'Anytown',
          postcode: '12345',
          country: 'UK',
        },
        contactDetails: {
          organisationName: 'Acme Inc.',
          fullName: 'John Doe',
          emailAddress: 'johndoe@acme.com',
          phoneNumber: '555-1234',
          faxNumber: '555-5678',
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['France (FR)', 'Belgium (BE)'],
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'Complete',
        confirmation: true,
      },
      submissionDeclaration: { status: 'NotStarted' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject.getSubmissionMap().set(JSON.stringify({ id, accountId }), value);

    await subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithEstimates');
  });

  it('sets submission state status to UpdatedWithActuals when data has estimated values on initial submission followed by update with actuals', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const { id } = await subject.createSubmission(accountId, reference);
    const date = add(new Date(), { days: 20 });
    const value = {
      id: id,
      reference,
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'EstimateData',
          actualData: {},
          estimateData: {
            quantityType: 'Weight',
            value: faker.datatype.number(),
          },
        },
      },
      exporterDetail: {
        status: 'Complete',
        exporterAddress: {
          addressLine1: '1 Sth Str',
          country: 'England',
          postcode: 'W140QA',
          townCity: 'London',
        },
        exporterContactDetails: {
          organisationName: 'Org Name',
          fullName: 'Name',
          emailAddress: 'name@name.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        status: 'Complete',
        importerContactDetails: {
          emailAddress: 'thomas@fleurada.de',
          fullName: 'Thomas Albers',
          phoneNumber: '07733222555',
        },
        importerAddressDetails: {
          address: 'Middel Broekweg 41A, \n2675 KD Honselersdijk',
          country: 'Holland',
          organisationName: 'Fleurada Holland BV',
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'EstimateDate',
          actualDate: {},
          estimateDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        },
      },
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
          addressLine1: '123 Main St',
          townCity: 'Anytown',
          postcode: '12345',
          country: 'UK',
        },
        contactDetails: {
          organisationName: 'Acme Inc.',
          fullName: 'John Doe',
          emailAddress: 'johndoe@acme.com',
          phoneNumber: '555-1234',
          faxNumber: '555-5678',
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['France (FR)', 'Belgium (BE)'],
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'Complete',
        confirmation: true,
      },
      submissionDeclaration: { status: 'NotStarted' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject.getSubmissionMap().set(JSON.stringify({ id, accountId }), value);

    await subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithEstimates');

    await subject.setWasteQuantity(
      { id, accountId },
      {
        status: 'Complete',
        value: {
          type: 'ActualData',
          actualData: {
            quantityType: 'Weight',
            value: faker.datatype.number(),
          },
          estimateData: {},
        },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithEstimates');

    await subject.setCollectionDate(
      { id, accountId },
      {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
          estimateDate: {},
        },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('UpdatedWithActuals');
  });

  it('sets submission state status to Deleted when submission has been removed', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const { id } = await subject.createSubmission(accountId, reference);
    const date = add(new Date(), { days: 20 });
    const value = {
      id: id,
      reference,
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
          addressLine1: '1 Sth Str',
          country: 'England',
          postcode: 'W140QA',
          townCity: 'London',
        },
        exporterContactDetails: {
          organisationName: 'Org Name',
          fullName: 'Name',
          emailAddress: 'name@name.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        status: 'Complete',
        importerContactDetails: {
          emailAddress: 'thomas@fleurada.de',
          fullName: 'Thomas Albers',
          phoneNumber: '07733222555',
        },
        importerAddressDetails: {
          address: 'Middel Broekweg 41A, \n2675 KD Honselersdijk',
          country: 'Holland',
          organisationName: 'Fleurada Holland BV',
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              type: 'Road',
              description: 'On the one road...',
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
          addressLine1: '123 Main St',
          townCity: 'Anytown',
          postcode: '12345',
          country: 'UK',
        },
        contactDetails: {
          organisationName: 'Acme Inc.',
          fullName: 'John Doe',
          emailAddress: 'johndoe@acme.com',
          phoneNumber: '555-1234',
          faxNumber: '555-5678',
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['France (FR)', 'Belgium (BE)'],
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'Complete',
        confirmation: true,
      },
      submissionDeclaration: { status: 'NotStarted' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject.getSubmissionMap().set(JSON.stringify({ id, accountId }), value);

    await subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithActuals');

    await subject.deleteSubmission({ id, accountId });
    expect(subject.getSubmission({ id, accountId })).rejects.toHaveProperty(
      'isBoom',
      true
    );
  });

  it('sets submission state status to Cancelled when submission has been removed', async () => {
    const accountId = faker.datatype.uuid();
    const reference = faker.datatype.string(10);
    const { id } = await subject.createSubmission(accountId, reference);
    const date = add(new Date(), { days: 20 });
    const value = {
      id: id,
      reference,
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', code: 'X' },
        ewcCodes: [
          {
            code: '010101',
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      } as DraftWasteDescription,
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
          addressLine1: '1 Sth Str',
          country: 'England',
          postcode: 'W140QA',
          townCity: 'London',
        },
        exporterContactDetails: {
          organisationName: 'Org Name',
          fullName: 'Name',
          emailAddress: 'name@name.com',
          phoneNumber: '07888888888',
        },
      },
      importerDetail: {
        status: 'Complete',
        importerContactDetails: {
          emailAddress: 'thomas@fleurada.de',
          fullName: 'Thomas Albers',
          phoneNumber: '07733222555',
        },
        importerAddressDetails: {
          address: 'Middel Broekweg 41A, \n2675 KD Honselersdijk',
          country: 'Holland',
          organisationName: 'Fleurada Holland BV',
        },
      },
      collectionDate: {
        status: 'Complete',
        value: {
          type: 'ActualDate',
          actualDate: {
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
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
              type: 'Road',
              description: 'On the one road...',
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
          addressLine1: '123 Main St',
          townCity: 'Anytown',
          postcode: '12345',
          country: 'UK',
        },
        contactDetails: {
          organisationName: 'Acme Inc.',
          fullName: 'John Doe',
          emailAddress: 'johndoe@acme.com',
          phoneNumber: '555-1234',
          faxNumber: '555-5678',
        },
      },
      ukExitLocation: {
        status: 'Complete',
        exitLocation: {
          provided: 'Yes',
          value: 'Dover',
        },
      },
      transitCountries: {
        status: 'Complete',
        values: ['France (FR)', 'Belgium (BE)'],
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
              type: 'RecoveryFacility',
              recoveryCode: 'R1',
            },
            id: faker.datatype.uuid(),
          },
        ],
      },
      submissionConfirmation: {
        status: 'Complete',
        confirmation: true,
      },
      submissionDeclaration: { status: 'NotStarted' },
      submissionState: {
        status: 'InProgress',
        timestamp: new Date(),
      },
    } as Submission;

    subject.getSubmissionMap().set(JSON.stringify({ id, accountId }), value);

    await subject.setSubmissionDeclaration(
      { id, accountId },
      {
        status: 'Complete',
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.submissionState.status).toBe('SubmittedWithActuals');

    await subject.cancelSubmission(
      { id, accountId },
      { type: 'NoLongerExportingWaste' }
    );

    expect(subject.getSubmission({ id, accountId })).rejects.toHaveProperty(
      'isBoom',
      true
    );
  });

  it('persists a submission created from a template', async () => {
    const accountId = faker.datatype.uuid();
    const mockTemplate = {
      id: faker.datatype.uuid(),
      templateDetails: {
        name: 'My Template',
        description: 'Description',
        created: new Date(),
        lastModified: new Date(),
      },
      wasteDescription: {
        status: 'Complete',
        wasteCode: {
          type: faker.datatype.string(),
          code: faker.datatype.string(),
        },
        ewcCodes: [
          {
            code: faker.datatype.string(),
          },
        ],
        nationalCode: {
          provided: 'Yes',
          value: faker.datatype.string(),
        },
        description: faker.datatype.string(),
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
      carriers: {
        status: 'Complete',
        transport: true,
        values: [
          {
            transportDetails: {
              type: 'Road',
              description: 'On the one road...',
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
    } as Template;
    templateBackend
      .getTemplateMap()
      .set(JSON.stringify({ id: mockTemplate.id, accountId }), mockTemplate);

    const { id } = await subject.createSubmissionFromTemplate(
      mockTemplate.id,
      accountId,
      'fromTemplate'
    );
    const result = await subject.getSubmission({ id, accountId });
    expect(result.id).toEqual(id);
    expect(result.wasteDescription.status).toEqual('Complete');
    expect(result.wasteQuantity.status).toEqual('NotStarted');
  });
});
