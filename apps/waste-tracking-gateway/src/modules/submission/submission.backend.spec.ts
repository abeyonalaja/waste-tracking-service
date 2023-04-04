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
    const { id } = await subject.createSubmission();
    const result = await subject.getSubmissionById(id);

    expect(result).toBeDefined();
    if (result === undefined) {
      return;
    }

    expect(result.id).toEqual(id);
  });

  it('lists created submissions', async () => {
    const values = await Promise.all([
      subject.createSubmission(),
      subject.createSubmission(),
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
    const result = await subject.createSubmission();
    expect(result.reference).not.toBeDefined();
  });

  it('creates a submission with a reference', async () => {
    const reference = faker.datatype.string(10);
    const result = await subject.createSubmission(reference);
    expect(result.reference).toBe(reference);
  });

  it('enables waste quantity on completion of waste description', async () => {
    const { id } = await subject.createSubmission();
    await subject.setWasteDescriptionById(id, {
      status: 'Complete',
      wasteCode: { type: 'NotApplicable' },
      ecaCodes: [],
      nationalCode: { provided: 'No' },
      description: '',
    });

    const result = await subject.getSubmissionById(id);
    expect(result?.wasteQuantity.status).toBe('NotStarted');
  });
});
