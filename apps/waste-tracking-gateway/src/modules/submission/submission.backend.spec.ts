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

describe(InMemorySubmissionBackend, () => {
  let subject: InMemorySubmissionBackend;
  const accountId = faker.datatype.uuid();

  beforeEach(() => {
    subject = new InMemorySubmissionBackend();
  });

  it('persists a created submission', async () => {
    const { id } = await subject.createSubmission(accountId, null);
    const result = await subject.getSubmission({ id, accountId });
    expect(result.id).toEqual(id);
  });

  it('bad request if reference more than 50 chars', () => {
    const reference = faker.datatype.string(51);
    expect(
      subject.createSubmission(accountId, reference)
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('creates submission without a reference', async () => {
    const result = await subject.createSubmission(accountId, null);
    expect(result.reference).toBeNull();
  });

  it('creates a submission with a reference', async () => {
    const reference = faker.datatype.string(10);
    const result = await subject.createSubmission(accountId, reference);
    expect(result.reference).toBe(reference);
  });

  it('enables waste quantity on completion of waste description', async () => {
    const { id } = await subject.createSubmission(accountId, null);
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
    const { recoveryFacilityDetail } = await subject.createSubmission(
      accountId,
      null
    );
    expect(recoveryFacilityDetail.status).toBe('CannotStart');
  });

  it('enables recovery facility where some waste code is provided', async () => {
    const { id } = await subject.createSubmission(accountId, null);
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
      }
    );

    const result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('lets us change a customer reference', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const reference = faker.datatype.string(10);
    await subject.setCustomerReference({ id, accountId }, reference);
    expect(await subject.getCustomerReference({ id, accountId })).toBe(
      reference
    );

    await subject.setCustomerReference({ id, accountId }, null);
    expect(await subject.getCustomerReference({ id, accountId })).toBeNull();
  });

  it('rejects where reference not found', () => {
    const id = faker.datatype.uuid();
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

  it('rejects if collection date less than three days in future', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const date = add(new Date(), { days: 1 });
    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it("rejects if collection date values aren't numbers", async () => {
    const { id } = await subject.createSubmission(accountId, null);

    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: 'X',
            month: '01',
            day: '01',
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('lets us change a carrier detail', async () => {
    const { id } = await subject.createSubmission(accountId, null);
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
              type: 'ShippingContainer',
              shippingContainerNumber: '2347027',
              vehicleRegistration: 'TL12 TFL',
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

  it('rejects if collection date less than three days in future', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const date = add(new Date(), { days: 1 });
    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it("rejects if collection date values aren't numbers", async () => {
    const { id } = await subject.createSubmission(accountId, null);

    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: 'X',
            month: '01',
            day: '01',
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('accepts set exit location if provided is Yes and value is given', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setExitLocationRequest = {
      status: 'Complete',
      exitLocation: { provided: 'Yes', value: faker.datatype.string() },
    } as ExitLocation;

    expect(
      subject.setExitLocation({ id, accountId }, setExitLocationRequest)
    ).resolves.toEqual(undefined);
  });

  it('accepts set exit location if provided is No and value is not given', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setExitLocationRequest = {
      status: 'Complete',
      exitLocation: { provided: 'No' },
    } as ExitLocation;

    expect(
      subject.setExitLocation({ id, accountId }, setExitLocationRequest)
    ).resolves.toEqual(undefined);
  });

  it('rejects if collection date less than three days in future', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const date = add(new Date(), { days: 1 });
    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, '0'),
            day: date.getDate().toString().padStart(2, '0'),
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it("rejects if collection date values aren't numbers", async () => {
    const { id } = await subject.createSubmission(accountId, null);

    expect(
      subject.setCollectionDate(
        { id, accountId },
        {
          status: 'Complete',
          value: {
            type: 'ActualDate',
            year: 'X',
            month: '01',
            day: '01',
          },
        }
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('lets us change a Transit Countries data', async () => {
    const { id } = await subject.createSubmission(accountId, null);

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
    const { id } = await subject.createSubmission(accountId, null);
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

  let date = add(new Date(), { days: 1 });
  let id = faker.datatype.uuid();

  const mockInvalidDateSubmission = {
    id: id,
    reference: 'abc',
    wasteDescription: {
      wasteCode: {
        type: faker.datatype.string(),
        value: faker.datatype.string(),
      },
      ewcCodes: [faker.datatype.string()],
      nationalCode: {
        provided: 'Yes',
        value: faker.datatype.string(),
      },
      status: 'Complete',
      description: faker.datatype.string(),
    },
    wasteQuantity: {
      status: 'Complete',
      value: {
        type: 'ActualData',
        quantityType: 'Weight',
        value: faker.datatype.number(),
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
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString().padStart(2, '0'),
        day: date.getDate().toString().padStart(2, '0'),
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
  } as Submission;

  date = add(new Date(), { weeks: 2 });

  const mockValidSubmission = { ...mockInvalidDateSubmission };
  mockValidSubmission.collectionDate = {
    status: 'Complete',
    value: {
      type: 'ActualDate',
      year: date.getFullYear().toString(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
      day: date.getDate().toString().padStart(2, '0'),
    },
  };

  it('rejects invalid set submission confirmation request', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setSubmissionConfirmationRequest = {
      status: 'NotStarted',
      confirmation: true,
    } as SubmissionConfirmation;

    expect(
      subject.setSubmissionConfirmation(
        { id, accountId },
        setSubmissionConfirmationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('rejects invalid set submission confirmation request', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setSubmissionConfirmationRequest = {
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
    const { id } = await subject.createSubmission(accountId, null);
    subject.submissions.set(id, mockValidSubmission);
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

  it('updates the status of the submission confirmation based on the state of the submission', async () => {
    id = (await subject.createSubmission(accountId, null)).id;
    subject.submissions.set(id, mockValidSubmission);

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
    ).resolves;

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

  it('Resets collection date to NotStarted if the collection date fails revalidation on the submission confirmation check', async () => {
    const { id } = await subject.createSubmission(accountId, null);
    subject.submissions.set(id, mockInvalidDateSubmission);

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });

    expect(subject.getCollectionDate({ id, accountId })).resolves.toEqual(
      mockInvalidDateSubmission.collectionDate
    );
    expect(
      subject.setSubmissionConfirmation(
        { id, accountId },
        { status: 'Complete', confirmation: true }
      )
    ).rejects.toHaveProperty('isBoom', true);

    expect(subject.getCollectionDate({ id, accountId })).resolves.toEqual({
      status: 'NotStarted',
    });
  });

  it('rejects invalid set submission declaration request', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setSubmissionDeclarationRequest = {
      status: 'Complete',
      declaration: true,
    } as SubmissionDeclaration;

    expect(
      subject.setSubmissionDeclaration(
        { id, accountId },
        setSubmissionDeclarationRequest
      )
    ).rejects.toHaveProperty('isBoom', true);
  });

  it('rejects invalid set submission declaration request', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    const setSubmissionDeclarationRequest = {
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

  it('accepts valid set submission declaration request', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    subject.submissions.set(id, mockValidSubmission);
    subject.setSubmissionConfirmation(
      { id, accountId },
      { status: 'Complete', confirmation: true }
    );

    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'NotStarted' });

    const SubmissionDeclarationRequest = {
      status: 'Complete',
      declaration: true,
    } as SubmissionDeclaration;
    expect(
      subject.setSubmissionDeclaration(
        { id, accountId },
        SubmissionDeclarationRequest
      )
    ).resolves;
  });

  it('updates the status of the submission declaration based on the state of the submission confirmation', async () => {
    id = (await subject.createSubmission(accountId, null)).id;
    subject.submissions.set(id, mockValidSubmission);

    expect(
      subject.getSubmissionConfirmation({ id, accountId })
    ).resolves.toEqual({ status: 'Complete', confirmation: true });
    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'Complete', declaration: true });

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

    expect(
      subject.setSubmissionDeclaration(
        { id, accountId },
        {
          status: 'Complete',
          declaration: true,
        }
      )
    ).resolves;

    expect(
      subject.getSubmissionDeclaration({ id, accountId })
    ).resolves.toEqual({ status: 'Complete', declaration: true });
  });

  it('Reset recovery facility when waste description is changed from Non-Laboratory to Laborarory', async () => {
    const { id } = await subject.createSubmission(accountId, null);
    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
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
    const { id } = await subject.createSubmission(accountId, null);
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
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('Reset quantity, carriers and recovery facility details when waste description is changed from small to bulk waste', async () => {
    const { id } = await subject.createSubmission(accountId, null);

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
        ewcCodes: ['EWC1', 'EWC2'],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.number(),
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
    } as Submission;

    subject.submissions.set(id, mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toEqual([]);
      expect(result?.wasteDescription.nationalCode).toEqual({ provided: 'No' });
      expect(result?.wasteDescription.description).toEqual('');
    }
  });

  it('Reset quantity, carriers and recovery facility details when waste description is changed from bulk to small waste', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
        ewcCodes: ['EWC1', 'EWC2'],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.number(),
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
    } as Submission;

    subject.submissions.set(id, mockSubmission);

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
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toEqual([]);
      expect(result?.wasteDescription.nationalCode).toEqual({ provided: 'No' });
      expect(result?.wasteDescription.description).toEqual('');
    }
  });

  it('Reset quantity, carriers and recovery facility details when waste description switches type of bulk-waste', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
        ewcCodes: ['EWC1', 'EWC2'],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.number(),
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
    } as Submission;

    subject.submissions.set(id, mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIB', value: 'X' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('NotStarted');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
    if (result?.wasteDescription.status === 'Started') {
      expect(result?.wasteDescription.ewcCodes).toEqual([]);
      expect(result?.wasteDescription.nationalCode).toEqual({ provided: 'No' });
      expect(result?.wasteDescription.description).toEqual('');
    }
  });

  it('Resets status of quantity, carriers and recovery facility if input switches bulk-waste code with the same bulk-waste type', async () => {
    const { id } = await subject.createSubmission(accountId, null);

    let result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteQuantity.status).toBe('CannotStart');
    expect(result?.carriers.status).toBe('NotStarted');
    expect(result?.recoveryFacilityDetail.status).toBe('CannotStart');

    const mockSubmission = {
      id: id,
      reference: 'mock',
      wasteDescription: {
        status: 'Complete',
        wasteCode: { type: 'AnnexIIIA', value: 'X' },
        ewcCodes: ['EWC1', 'EWC2'],
        nationalCode: {
          provided: 'Yes',
          value: 'NAT',
        },
        description: 'Waste Description',
      },
      wasteQuantity: {
        status: 'Complete',
        value: {
          type: 'ActualData',
          quantityType: 'Weight',
          value: faker.datatype.number(),
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
    } as Submission;

    subject.submissions.set(id, mockSubmission);

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Complete');
    expect(result?.wasteQuantity.status).toBe('Complete');
    expect(result?.carriers.status).toBe('Complete');
    expect(result?.recoveryFacilityDetail.status).toBe('Complete');

    await subject.setWasteDescription(
      { id, accountId },
      {
        status: 'Started',
        wasteCode: { type: 'AnnexIIIA', value: 'Z' },
      }
    );

    result = await subject.getSubmission({ id, accountId });
    expect(result?.wasteDescription.status).toBe('Started');
    expect(result?.wasteQuantity.status).toBe('Started');
    expect(result?.carriers.status).toBe('Started');
    expect(result?.recoveryFacilityDetail.status).toBe('Started');
  });
});
