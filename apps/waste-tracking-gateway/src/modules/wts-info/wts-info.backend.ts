import Boom from '@hapi/boom';
import {
  GetCountriesResponse,
  GetDisposalCodesResponse,
  GetEWCCodesResponse,
  GetRecoveryCodesResponse,
  GetWasteCodesResponse,
} from '@wts/api/annex-vii';
import * as api from '@wts/api/waste-tracking-gateway';
import { DaprAnnexViiClient } from '@wts/client/annex-vii';
import { Logger } from 'winston';

export interface WTSInfoBackend {
  listWasteCodes(language: string): Promise<api.ListWasteCodesResponse>;
  listEWCCodes(language: string): Promise<api.ListEWCCodesResponse>;
  listCountries(): Promise<api.ListCountriesResponse>;
  listRecoveryCodes(language: string): Promise<api.ListRecoveryCodesResponse>;
  listDisposalCodes(language: string): Promise<api.ListDisposalCodesResponse>;
}

/**
 * This is a stub backend and should not be used in production.
 */
export class WTSInfoStub implements WTSInfoBackend {
  async listWasteCodes(language: string): Promise<api.ListWasteCodesResponse> {
    if (language === 'en') {
      return [
        {
          type: 'BaselAnnexIX',
          values: [
            {
              code: 'B1010',
              description:
                'Metal and metal-alloy wastes in metallic, non-dispersible form',
            },
            {
              code: 'B1020',
              description:
                'Clean, uncontaminated metal scrap, including alloys, in bulk finished form',
            },
            {
              code: 'B1030',
              description: 'Refractory metals containing residues',
            },
            {
              code: 'B1031',
              description:
                'Molybdenum, tungsten, titanium, tantalum, niobium and rhenium metal and metal alloy',
            },
            {
              code: 'B1040',
              description:
                'Scrap assemblies from electrical power generation not contaminated with lubricating oil',
            },
          ],
        },
        {
          type: 'OECD',
          values: [
            {
              code: 'GB040',
              description:
                'Slags from precious metals and copper processing for further refining',
            },
            {
              code: 'GC010',
              description:
                'Electrical assemblies consisting only of metals or alloys',
            },
            {
              code: 'GC020',
              description:
                'Electronic scrap (e.g. printed circuit boards, electronic components, wire, etc.)',
            },
            {
              code: 'GC030',
              description:
                'Vessels and other floating structures for breaking up',
            },
            {
              code: 'GC050',
              description:
                'Spent fluid catalytic cracking (FCC) catalysts (e.g. aluminium oxide, zeolites)',
            },
          ],
        },
        {
          type: 'AnnexIIIA',
          values: [
            {
              code: 'B1010 and B1050',
              description:
                'mixtures of wastes classified under Basel entries B1010 and B1050',
            },
            {
              code: 'B1010 and B1070',
              description:
                'mixtures of wastes classified under Basel entries B1010 and B1070',
            },
            {
              code: 'B3040 and B3080',
              description:
                'mixtures of wastes classified under Basel entries B3040 and B3080',
            },
            {
              code: 'GB040 and B1100',
              description:
                'mixtures of wastes classified under (OECD) entry GB040 and under Basel entry B1100 restricted to hard zinc spelter, zinc-containing drosses, aluminium skimmings (or skims) excluding salt slag and wastes of refractory linings, including crucibles, originating from copper smelting',
            },
            {
              code: 'GB040, B1070, and B1100',
              description:
                'mixtures of wastes classified under (OECD) entry GB040, under Basel entry B1070 and under Basel entry B1100 restricted to wastes of refractory linings, including crucibles, originating from copper smelting',
            },
            {
              code: 'B1010',
              description:
                'mixtures of wastes classified under Basel entry B1010',
            },
          ],
        },
        {
          type: 'AnnexIIIB',
          values: [
            {
              code: 'BEU04',
              description:
                'Composite packaging consisting of mainly paper and some plastic, not containing residues and not covered by Basel entry B3020',
            },
            {
              code: 'BEU05',
              description:
                'Clean biodegradable waste from agriculture, horticulture, forestry, gardens, parks and cemeteries',
            },
          ],
        },
      ] as unknown as api.WasteCodeType[];
    } else if (language === 'cy') {
      return [
        {
          type: 'BaselAnnexIX',
          values: [
            {
              code: 'B1010',
              description:
                "Gwastraff metel a metel-aloi ar ffurf fetelaidd, nad yw'n wasgaredig",
            },
            {
              code: 'B1020',
              description:
                'Sgrap metel glân, heb ei halogi, gan gynnwys aloion, ar ffurf gorffenedig swmp',
            },
            {
              code: 'B1030',
              description: "Metelau anhydrin sy'n cynnwys gweddillion",
            },
            {
              code: 'B1031',
              description:
                'Molybdenwm, twngsten, titaniwm, tantalwm, niobium a rheniwm metel a metel',
            },
            {
              code: 'B1040',
              description:
                'Cynulliadau sgrap o gynhyrchu pŵer trydanol heb eu halogi ag olew iro',
            },
          ],
        },
        {
          type: 'OECD',
          values: [
            {
              code: 'GB040',
              description:
                "Slagiau o fetelau gwerthfawr a phrosesu copr i'w mireinio ymhellach",
            },
            {
              code: 'GC010',
              description:
                "Cynulliadau trydanol sy'n cynnwys metelau neu aloion yn unig",
            },
            {
              code: 'GC020',
              description:
                'Sgrap electronig (e.e. byrddau cylched printiedig, cydrannau electronig, gwifren, ac ati)',
            },
            {
              code: 'GC030',
              description:
                'Llongau a strwythurau arnofio eraill ar gyfer torri i fyny',
            },
            {
              code: 'GC050',
              description:
                'Catalyddion cracio catalytig hylif wedi darfod (FCC) (e.e. ocsid alwminiwm, zeolites)',
            },
          ],
        },
        {
          type: 'AnnexIIIA',
          values: [
            {
              code: 'B1010 and B1050',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B1010 a B1050",
            },
            {
              code: 'B1010 and B1070',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B1010 a B1070",
            },
            {
              code: 'B3040 and B3080',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B3040 a B3080",
            },
            {
              code: 'GB040 and B1100',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad (OECD) GB040 ac o dan fynediad Basel B1100 wedi'i gyfyngu i spelter sinc caled, drosau sy'n cynnwys sinc, sgimiau alwminiwm (neu sgimiau) ac eithrio slag halen a gwastraff llu o linellau anhydrin, gan gynnwys copr, gan gynnwys copr.",
            },
            {
              code: 'GB040, B1070, and B1100',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan (OECD) Mynediad GB040, o dan fynediad Basel B1070 ac o dan fynediad Basel B1100 wedi'i gyfyngu i wastraff leininau anhydrin, gan gynnwys croeshoelion, yn tarddu o drychineb copr",
            },
            {
              code: 'B1010',
              description:
                "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B1010",
            },
          ],
        },
        {
          type: 'AnnexIIIB',
          values: [
            {
              code: 'BEU04',
              description:
                "Pecynnu cyfansawdd sy'n cynnwys papur yn bennaf a rhywfaint o blastig, nad yw'n cynnwys gweddillion ac nad yw'n cael ei orchuddio gan fynediad Basel B3020",
            },
            {
              code: 'BEU05',
              description:
                'Gwastraff bioddiraddadwy glân o amaethyddiaeth, garddwriaeth, coedwigaeth, gerddi, parciau a mynwentydd',
            },
          ],
        },
      ] as unknown as api.WasteCodeType[];
    } else {
      throw Boom.badRequest('Language ' + language + ' is not supported');
    }
  }

  async listEWCCodes(language: string): Promise<api.ListEWCCodesResponse> {
    if (language === 'en') {
      return [
        {
          code: '10101',
          description: 'wastes from mineral metalliferous excavation',
        },
        {
          code: '10102',
          description: 'wastes from mineral non-metalliferous excavation',
        },
        {
          code: '010304*',
          description:
            'acid-generating tailings from processing of sulphide ore',
        },
        {
          code: '010305*',
          description: 'other tailings containing hazardous substances',
        },
        {
          code: '10306',
          description:
            'tailings other than those mentioned in 01 03 04 and 01 03 05',
        },
        {
          code: '010307*',
          description:
            'other wastes containing hazardous substances from physical and chemical processing of metalliferous minerals',
        },
      ];
    } else if (language === 'cy') {
      return [
        {
          code: '10101',
          description: 'gwastraff o gloddio metelaidd mwynol',
        },
        {
          code: '10102',
          description: 'gwastraff o gloddio anfetelaidd mwynol',
        },
        {
          code: '010304*',
          description: "cynffonnau sy'n cynhyrchu asid o brosesu mwyn sylffid",
        },
        {
          code: '010305*',
          description: "Tails eraill sy'n cynnwys sylweddau peryglus",
        },
        {
          code: '10306',
          description:
            "Cynffonnau heblaw'r rhai a grybwyllir yn 01 03 04 a 01 03 05",
        },
        {
          code: '010307*',
          description:
            "Gwastraff eraill sy'n cynnwys sylweddau peryglus o brosesu mwynau metelaidd yn gorfforol a chemegol",
        },
      ];
    } else {
      throw Boom.badRequest('Language ' + language + ' is not supported');
    }
  }

  async listCountries(): Promise<api.ListCountriesResponse> {
    return [
      {
        name: 'Afghanistan(AF)',
      },
      {
        name: 'Åland Islands(AX)',
      },
      {
        name: 'Albania(AL)',
      },
      {
        name: 'Algeria(DZ)',
      },
      {
        name: 'American Samoa(AS)',
      },
      {
        name: 'Andorra(AD)',
      },
      {
        name: 'Angola(AO)',
      },
    ];
  }

  async listRecoveryCodes(
    language: string
  ): Promise<api.ListRecoveryCodesResponse> {
    if (language === 'en') {
      return [
        {
          code: 'R1',
          description:
            'Use principally as a fuel or other means to generate energy',
          interim: false,
        },
        {
          code: 'R2',
          description: 'Solvent reclamation/regeneration',
          interim: false,
        },
        {
          code: 'R3',
          description:
            'Recycling/reclamation of organic substances which are not used as solvents (including composting and other biological transformation processes)',
          interim: false,
        },
        {
          code: 'R11',
          description:
            'Use of wastes obtained from any of the operations numbered R01 to R11',
          interim: false,
        },
        {
          code: 'R12',
          description:
            'Exchange of wastes for submission to any of the operations numbered R01 to R11',
          interim: true,
        },
        {
          code: 'R13',
          description:
            'Storage of wastes pending any of the operations numbered R01 to R12 (excluding temporary storage, pending collection, on the site where it is produced).',
          interim: true,
        },
      ];
    } else if (language === 'cy') {
      return [
        {
          code: 'R1',
          description:
            'Defnyddiwch yn bennaf fel tanwydd neu ddulliau eraill i gynhyrchu ynni',
          interim: false,
        },
        {
          code: 'R2',
          description: 'Adfer/adfywio toddyddion',
          interim: false,
        },
        {
          code: 'R3',
          description:
            "Ailgylchu/adfer sylweddau organig nad ydyn nhw'n cael eu defnyddio fel toddyddion (gan gynnwys compostio a phrosesau trawsnewid biolegol eraill)",
          interim: false,
        },
        {
          code: 'R11',
          description:
            "Defnyddio gwastraff a gafwyd o unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R11",
          interim: false,
        },
        {
          code: 'R12',
          description:
            "Cyfnewid gwastraff i'w gyflwyno i unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R11",
          interim: true,
        },
        {
          code: 'R13',
          description:
            "Storio gwastraff hyd nes y bydd unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R12 (ac eithrio storio dros dro, hyd nes y bydd y casgliad, ar y safle lle mae'n cael ei gynhyrchu).",
          interim: true,
        },
      ];
    } else {
      throw Boom.badRequest('Language ' + language + ' is not supported');
    }
  }

  async listDisposalCodes(
    language: string
  ): Promise<api.ListDisposalCodesResponse> {
    if (language === 'en') {
      return [
        {
          code: 'D1',
          description: 'Deposit into or onto land',
        },
        {
          code: 'D2',
          description: 'Land Treatment',
        },
        {
          code: 'D3',
          description: 'Deep injection',
        },
        {
          code: 'D4',
          description: 'Surface impoundment',
        },
        {
          code: 'D5',
          description: 'Specially engineered landfill',
        },
        {
          code: 'D6',
          description: 'Release into a water body except seas/oceans',
        },
      ];
    } else if (language === 'cy') {
      return [
        {
          code: 'D1',
          description: 'Adneuo i mewn neu ymlaen i dir',
        },
        {
          code: 'D2',
          description: 'Triniaeth Tir',
        },
        {
          code: 'D3',
          description: 'Chwistrelliad dwfn',
        },
        {
          code: 'D4',
          description: 'Cronni arwyneb',
        },
        {
          code: 'D5',
          description: "Safle tirlenwi wedi'i beiriannu'n arbennig",
        },
        {
          code: 'D6',
          description: 'Rhyddhau i gorff dŵr ac eithrio moroedd/cefnforoedd',
        },
      ];
    } else {
      throw Boom.badRequest('Language ' + language + ' is not supported');
    }
  }
}

export class WTSInfoServiceBackend implements WTSInfoBackend {
  constructor(private client: DaprAnnexViiClient, private logger: Logger) {}

  async listWasteCodes(language: string): Promise<api.ListWasteCodesResponse> {
    let response: GetWasteCodesResponse;
    try {
      response = await this.client.getWasteCodes({
        language,
      });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listEWCCodes(language: string): Promise<api.ListEWCCodesResponse> {
    let response: GetEWCCodesResponse;
    try {
      response = await this.client.getEWCCodes({ language });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listCountries(): Promise<api.ListCountriesResponse> {
    let response: GetCountriesResponse;
    try {
      response = await this.client.getCountries();
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listRecoveryCodes(
    language: string
  ): Promise<api.ListRecoveryCodesResponse> {
    let response: GetRecoveryCodesResponse;
    try {
      response = await this.client.getRecoveryCodes({ language });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }

  async listDisposalCodes(
    language: string
  ): Promise<api.ListDisposalCodesResponse> {
    let response: GetDisposalCodesResponse;
    try {
      response = await this.client.getDisposalCodes({ language });
    } catch (error) {
      this.logger.error(error);
      throw Boom.internal();
    }

    if (!response.success) {
      throw new Boom.Boom(response.error.message, {
        statusCode: response.error.statusCode,
      });
    }
    return response.value;
  }
}
