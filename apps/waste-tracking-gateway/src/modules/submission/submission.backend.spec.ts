import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import {
  Carriers,
  InMemorySubmissionBackend,
  TransitCountries,
} from './submission.backend';
import { add } from 'date-fns';
import { ExitLocation } from '@wts/api/waste-tracking-gateway';

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
    const status: Omit<Carriers, 'values'> = { status: 'Started' };
    const carriers = await subject.createCarriers({ id, accountId }, status);

    if (carriers.status !== 'Started') {
      expect(false);
    } else {
      const carrierId = carriers.values[0].id;
      const value: Carriers = {
        status: status.status,
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
});
