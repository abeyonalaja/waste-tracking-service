import * as filter from './user-filter';

describe('any', () => {
  it('always returns true', () => {
    expect(filter.any({ uniqueReference: 'BA202311-A6-1260-U6-4414' })).toBe(
      true
    );
  });
});

describe('uniqueReferenceString', () => {
  it('supports empty string', () => {
    const subject = filter.uniqueReferenceString('');
    expect(subject({ uniqueReference: 'BA202311-Z4-0330-G3-2710' })).toBe(
      false
    );
  });

  it('discriminates based on contents', () => {
    const subject = filter.uniqueReferenceString(
      'FD202312-C2-1846-B7-1212;BA202311-A6-1260-U6-4414;GR202310-H8-5724-F0-0111'
    );

    expect(subject({ uniqueReference: 'BA202311-Z4-0330-G3-2710' })).toBe(
      false
    );
    expect(subject({ uniqueReference: 'BA202311-A6-1260-U6-4414' })).toBe(true);
    expect(subject({ uniqueReference: 'GR202310-H8-5724-F0-0111' })).toBe(true);
  });
});
