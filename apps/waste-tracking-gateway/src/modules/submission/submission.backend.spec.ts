import { faker } from '@faker-js/faker';
import { expect } from '@jest/globals';
import {
  InMemorySubmissionBackend,
  ValdiationError,
} from './submission.backend';

describe(InMemorySubmissionBackend, () => {
  let subject: InMemorySubmissionBackend;

  beforeEach(() => {
    subject = new InMemorySubmissionBackend();
  });

  it('persists a created submission', async () => {
    const { id } = await subject.createSubmission(null);
    const result = await subject.getSubmission(id);

    expect(result).toBeDefined();
    if (result === undefined) {
      return;
    }

    expect(result.id).toEqual(id);
  });

  it('lists created submissions', async () => {
    const values = await Promise.all([
      subject.createSubmission(null),
      subject.createSubmission(null),
    ]);

    const result = await subject.listSubmissions();

    expect(result).toHaveLength(values.length);
    values.forEach((s) => {
      expect(result).toContain(s);
    });
  });

  it('validation error if reference more than 50 chars', () => {
    const reference = faker.datatype.string(51);
    expect(subject.createSubmission(reference)).rejects.toBeInstanceOf(
      ValdiationError
    );
  });

  it('creates submission without a reference', async () => {
    const result = await subject.createSubmission(null);
    expect(result.reference).toBeNull();
  });

  it('creates a submission with a reference', async () => {
    const reference = faker.datatype.string(10);
    const result = await subject.createSubmission(reference);
    expect(result.reference).toBe(reference);
  });

  it('enables waste quantity on completion of waste description', async () => {
    const { id } = await subject.createSubmission(null);
    await subject.setWasteDescription(id, {
      status: 'Complete',
      wasteCode: { type: 'NotApplicable' },
      ewcCodes: [],
      nationalCode: { provided: 'No' },
      description: '',
    });

    const result = await subject.getSubmission(id);
    expect(result?.wasteQuantity.status).toBe('NotStarted');
  });

  it('cannot initially start recovery facility section', async () => {
    const { recoveryFacilityDetail } = await subject.createSubmission(null);
    expect(recoveryFacilityDetail.status).toBe('CannotStart');
  });

  it('enables recovery facility where some waste code is provided', async () => {
    const { id } = await subject.createSubmission(null);
    await subject.setWasteDescription(id, {
      status: 'Started',
      wasteCode: { type: 'AnnexIIIA', value: 'X' },
    });

    const result = await subject.getSubmission(id);
    expect(result?.recoveryFacilityDetail.status).toBe('NotStarted');
  });

  it('lets us change a customer reference', async () => {
    const { id } = await subject.createSubmission(null);

    const reference = faker.datatype.string(10);
    let response = await subject.setCustomerReference(id, reference);
    expect(response).toBe(reference);

    response = await subject.setCustomerReference(id, null);
    expect(response).toBeNull();
  });

  it('returns undefined where reference not found', async () => {
    const id = faker.datatype.uuid();
    expect(await subject.getSubmission(id)).toBeUndefined();
    expect(await subject.getWasteDescription(id)).toBeUndefined();
    expect(await subject.getCustomerReference(id)).toBeUndefined();
  });
});
