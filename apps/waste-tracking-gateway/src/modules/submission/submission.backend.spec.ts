import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import { InMemorySubmissionBackend } from './submission.backend';
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
});
