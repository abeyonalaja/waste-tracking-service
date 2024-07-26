import {
  listWasteCodes,
  listEWCCodes,
  listCountries,
  listRecoveryCodes,
  listDisposalCodes,
  listHazardousCodes,
  listPops,
  listLocalAuthorities,
  listSICCodes,
} from './reference-data.backend';
import { DB } from '../../db';

describe('Reference Data Backend', () => {
  let db: DB;

  beforeEach(() => {
    db = {
      wasteCodes: [],
      ewcCodes: [],
      countries: [],
      recoveryCodes: [],
      disposalCodes: [],
      hazarodusCodes: [],
      pops: [],
      localAuthorities: [],
      sicCodes: [],
    } as unknown as DB;
  });

  it('returns waste codes', async () => {
    const result = await listWasteCodes(db);
    expect(result).toEqual(db.wasteCodes);
  });

  it('returns ewc codes', async () => {
    const result = await listEWCCodes(db, false);
    expect(result).toEqual(
      db.ewcCodes.filter((ewcCode) => !ewcCode.code.includes('*')),
    );
  });

  it('returns countries', async () => {
    const result = await listCountries(db, false);
    expect(result).toEqual(
      db.countries.filter(
        (country) => !country.name.includes('United Kingdom'),
      ),
    );
  });

  it('returns recovery codes', async () => {
    const result = await listRecoveryCodes(db);
    expect(result).toEqual(db.recoveryCodes);
  });

  it('returns disposal codes', async () => {
    const result = await listDisposalCodes(db);
    expect(result).toEqual(db.disposalCodes);
  });

  it('returns hazardous codes', async () => {
    const result = await listHazardousCodes(db);
    expect(result).toEqual(db.hazardousCodes);
  });

  it('returns pops', async () => {
    const result = await listPops(db);
    expect(result).toEqual(db.pops);
  });

  it('returns local authorities', async () => {
    const result = await listLocalAuthorities(db);
    expect(result).toEqual(db.localAuthorities);
  });

  it('returns sic codes', async () => {
    const result = await listSICCodes(db);
    expect(result).toEqual(db.sicCodes);
  });
});
