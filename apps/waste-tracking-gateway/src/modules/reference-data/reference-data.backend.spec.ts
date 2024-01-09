import { ReferenceDataStub } from './reference-data.backend';

describe(ReferenceDataStub, () => {
  let subject: ReferenceDataStub;

  beforeEach(() => {
    subject = new ReferenceDataStub();
  });

  it('returns a list of waste codes', async () => {
    const wasteCodes = await subject.listWasteCodes();
    expect(wasteCodes[0]).toHaveProperty('type', 'BaselAnnexIX');
    expect(wasteCodes[1]).toHaveProperty('type', 'OECD');
  });

  it('returns a list of EWC codes', async () => {
    const ewcCodes = await subject.listEWCCodes();
    expect(ewcCodes[0]).toHaveProperty('code', '010101');
    expect(ewcCodes[1]).toHaveProperty('code', '010102');
  });

  it('returns a list of countries', async () => {
    const countries = await subject.listCountries();
    expect(countries[0]).toHaveProperty('name', 'Afghanistan [AF]');
    expect(countries[1]).toHaveProperty('name', 'Åland Islands [AX]');
  });

  it('returns a list of Recovery codes', async () => {
    const recoveryCodes = await subject.listRecoveryCodes();
    expect(recoveryCodes[0]).toHaveProperty('code', 'R1');
    expect(recoveryCodes[1]).toHaveProperty('code', 'R2');
  });

  it('returns a list of Disposal codes', async () => {
    const disposalCodes = await subject.listDisposalCodes();
    expect(disposalCodes[0]).toHaveProperty('code', 'D1');
    expect(disposalCodes[1]).toHaveProperty('code', 'D2');
  });
});
