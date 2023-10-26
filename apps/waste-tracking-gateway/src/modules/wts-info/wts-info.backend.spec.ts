import { WTSInfoStub } from './wts-info.backend';

describe(WTSInfoStub, () => {
  let subject: WTSInfoStub;

  beforeEach(() => {
    subject = new WTSInfoStub();
  });

  it('returns a list of waste codes', async () => {
    const wasteCodes = await subject.listWasteCodes('en');
    expect(wasteCodes).toHaveLength(4);
    expect(wasteCodes[0]).toHaveProperty('type', 'BaselAnnexIX');
    expect(wasteCodes[1]).toHaveProperty('type', 'OECD');
  });
});
