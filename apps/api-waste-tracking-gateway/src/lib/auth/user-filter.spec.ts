import * as filter from './user-filter';

describe('any', () => {
  it('always returns true', () => {
    expect(
      filter.any({
        uniqueReference: 'BA202311-A6-1260-U6-4414',
        dcidSubjectId: '6f9411ec-d58d-41b4-9229-a4020456ac2c',
      }),
    ).resolves.toBe(true);
  });
});

describe('uniqueReferenceString', () => {
  it('supports empty string', () => {
    const subject = filter.uniqueReferenceString('');
    expect(
      subject({
        uniqueReference: 'BA202311-Z4-0330-G3-2710',
        dcidSubjectId: '4670f501-b7ad-4bf7-8e11-86b43a833a61',
      }),
    ).resolves.toBe(false);
  });

  it('discriminates based on contents', () => {
    const subject = filter.uniqueReferenceString(
      'FD202312-C2-1846-B7-1212;BA202311-A6-1260-U6-4414;GR202310-H8-5724-F0-0111',
    );

    expect(
      subject({
        uniqueReference: 'BA202311-Z4-0330-G3-2710',
        dcidSubjectId: '4670f501-b7ad-4bf7-8e11-86b43a833a61',
      }),
    ).resolves.toBe(false);
    expect(
      subject({
        uniqueReference: 'BA202311-A6-1260-U6-4414',
        dcidSubjectId: '6f9411ec-d58d-41b4-9229-a4020456ac2c',
      }),
    ).resolves.toBe(true);
    expect(
      subject({
        uniqueReference: 'GR202310-H8-5724-F0-0111',
        dcidSubjectId: 'f9b53eb6-57b2-4451-846e-1cddd9e50740',
      }),
    ).resolves.toBe(true);
  });
});
