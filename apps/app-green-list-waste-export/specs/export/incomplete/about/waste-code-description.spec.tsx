import React from 'react';
import { render, screen, act, fireEvent } from 'jest-utils';
import WasteCodeDesc from 'pages/incomplete/about/waste-code-description';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

const defaultJsonResponse = {
  status: 'Started',
  wasteCode: {
    type: 'AnnexIIIB',
    code: '',
  },
};
const refDataResponse = [
  {
    type: 'BaselAnnexIX',
    values: [
      {
        code: 'B1010',
        value: {
          description: {
            en: 'Metal and metal-alloy wastes in metallic, non-dispersible form',
            cy: "Gwastraff metel a metel-aloi ar ffurf fetelaidd, nad yw'n wasgaredig",
          },
        },
      },
      {
        code: 'B1020',
        value: {
          description: {
            en: 'Clean, uncontaminated metal scrap, including alloys, in bulk finished form',
            cy: 'Sgrap metel glân, heb ei halogi, gan gynnwys aloion, ar ffurf gorffenedig swmp',
          },
        },
      },
      {
        code: 'B1030',
        value: {
          description: {
            en: 'Refractory metals containing residues',
            cy: "Metelau anhydrin sy'n cynnwys gweddillion",
          },
        },
      },
      {
        code: 'B1031',
        value: {
          description: {
            en: 'Molybdenum, tungsten, titanium, tantalum, niobium and rhenium metal and metal alloy',
            cy: 'Molybdenwm, twngsten, titaniwm, tantalwm, niobium a rheniwm metel a metel',
          },
        },
      },
      {
        code: 'B1040',
        value: {
          description: {
            en: 'Scrap assemblies from electrical power generation not contaminated with lubricating oil',
            cy: 'Cynulliadau sgrap o gynhyrchu pŵer trydanol heb eu halogi ag olew iro',
          },
        },
      },
      {
        code: 'B1050',
        value: {
          description: {
            en: 'Mixed non-ferrous metal, heavy fraction scrap',
            cy: 'Metel anfferrus cymysg, sgrap ffracsiwn trwm',
          },
        },
      },
      {
        code: 'B1060',
        value: {
          description: {
            en: 'Waste Selenium and Tellurium in metallic elemental form including powder',
            cy: 'Seleniwm gwastraff a tellurium ar ffurf elfennol metelaidd gan gynnwys powdr',
          },
        },
      },
      {
        code: 'B1070',
        value: {
          description: {
            en: 'Waste of copper and copper alloys in dispersible form',
            cy: 'Gwastraff aloion copr a chopr ar ffurf wasgaredig',
          },
        },
      },
      {
        code: 'B1080',
        value: {
          description: {
            en: 'Zinc ash and residues including zinc alloys residues in dispersible form',
            cy: 'Lludw sinc a gweddillion gan gynnwys gweddillion alo sinc ar ffurf wasgaredig',
          },
        },
      },
      {
        code: 'B1090',
        value: {
          description: {
            en: 'Waste batteries conforming to a specification, excluding those made with lead, cadmium or mercury',
            cy: "Batris gwastraff sy'n cydymffurfio â manyleb, ac eithrio'r rhai a wneir â phlwm, cadmiwm neu mercwri",
          },
        },
      },
    ],
  },
  {
    type: 'OECD',
    values: [
      {
        code: 'GB040',
        value: {
          description: {
            en: 'Slags from precious metals and copper processing for further refining',
            cy: "Slagiau o fetelau gwerthfawr a phrosesu copr i'w mireinio ymhellach",
          },
        },
      },
      {
        code: 'GC010',
        value: {
          description: {
            en: 'Electrical assemblies consisting only of metals or alloys',
            cy: "Cynulliadau trydanol sy'n cynnwys metelau neu aloion yn unig",
          },
        },
      },
      {
        code: 'GC020',
        value: {
          description: {
            en: 'Electronic scrap (e.g. printed circuit boards, electronic components, wire, etc.)',
            cy: 'Sgrap electronig (e.e. byrddau cylched printiedig, cydrannau electronig, gwifren, ac ati)',
          },
        },
      },
      {
        code: 'GC030',
        value: {
          description: {
            en: 'Vessels and other floating structures for breaking up',
            cy: 'Llongau a strwythurau arnofio eraill ar gyfer torri i fyny',
          },
        },
      },
      {
        code: 'GC050',
        value: {
          description: {
            en: 'Spent fluid catalytic cracking (FCC) catalysts (e.g. aluminium oxide, zeolites)',
            cy: 'Catalyddion cracio catalytig hylif wedi darfod (FCC) (e.e. ocsid alwminiwm, zeolites)',
          },
        },
      },
      {
        code: 'GE020',
        value: {
          description: {
            en: 'Glass fibre waste',
            cy: 'Gwastraff ffibr gwydr',
          },
        },
      },
      {
        code: 'GF010',
        value: {
          description: {
            en: 'Ceramic wastes which have been fired after shaping, including ceramic vessels',
            cy: 'Gwastraff cerameg sydd wedi cael eu tanio ar ôl siapio, gan gynnwys llongau cerameg',
          },
        },
      },
      {
        code: 'GG030',
        value: {
          description: {
            en: 'Bottom ash and slag tap from coal fired power plants',
            cy: 'Tap lludw a slag gwaelod o weithfeydd pŵer glo',
          },
        },
      },
      {
        code: 'GG040',
        value: {
          description: {
            en: 'Coal fired power plants fly ash',
            cy: 'Mae gweithfeydd pŵer glo yn hedfan lludw',
          },
        },
      },
      {
        code: 'GN010',
        value: {
          description: {
            en: 'Waste of pigs’, hogs’ or boars’ bristles and hair or of badger hair and other brush making hair',
            cy: 'Gwastraff mochyn ’, hogs’ neu boars ’blew a gwallt neu wallt neu wallt moch daear a gwallt arall yn gwneud gwallt',
          },
        },
      },
      {
        code: 'GN020',
        value: {
          description: {
            en: 'Horsehair waste, whether or not put up as a layer with or without supporting material',
            cy: "Gwastraff ceffylau, p'un a yw'n cael ei roi i fyny fel haen gyda deunydd cefnogi neu hebddo",
          },
        },
      },
      {
        code: 'GN030',
        value: {
          description: {
            en: 'Waste of skins and other parts of birds, with their feathers or down',
            cy: "Gwastraff crwyn a rhannau eraill o adar, gyda'u plu neu i lawr",
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIA',
    values: [
      {
        code: 'B1010 and B1050',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entries B1010 and B1050',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B1010 a B1050",
          },
        },
      },
      {
        code: 'B1010 and B1070',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entries B1010 and B1070',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B1010 a B1070",
          },
        },
      },
      {
        code: 'B3040 and B3080',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entries B3040 and B3080',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan gofnodion basel B3040 a B3080",
          },
        },
      },
      {
        code: 'GB040 and B1100',
        value: {
          description: {
            en: 'mixtures of wastes classified under (OECD) entry GB040 and under Basel entry B1100 restricted to hard zinc spelter, zinc-containing drosses, aluminium skimmings (or skims) excluding salt slag and wastes of refractory linings, including crucibles, originating from copper smelting',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad (OECD) GB040 ac o dan fynediad Basel B1100 wedi'i gyfyngu i spelter sinc caled, drosau sy'n cynnwys sinc, sgimiau alwminiwm (neu sgimiau) ac eithrio slag halen a gwastraff llu o linellau anhydrin, gan gynnwys copr, gan gynnwys copr.",
          },
        },
      },
      {
        code: 'GB040, B1070, and B1100',
        value: {
          description: {
            en: 'mixtures of wastes classified under (OECD) entry GB040, under Basel entry B1070 and under Basel entry B1100 restricted to wastes of refractory linings, including crucibles, originating from copper smelting',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan (OECD) Mynediad GB040, o dan fynediad Basel B1070 ac o dan fynediad Basel B1100 wedi'i gyfyngu i wastraff leininau anhydrin, gan gynnwys croeshoelion, yn tarddu o drychineb copr",
          },
        },
      },
      {
        code: 'B1010',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B1010',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B1010",
          },
        },
      },
      {
        code: 'B2010',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B2010',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B2010",
          },
        },
      },
      {
        code: 'B2030',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B2030',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B2030",
          },
        },
      },
      {
        code: 'B3020',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B3020 restricted to unbleached paper or paperboard or of corrugated paper or paperboard, other paper or paperboard, made mainly of bleached chemical pulp, not coloured in the mass, paper or paperboard made mainly of mechanical pulp (for example, newspapers, journals and similar printed matter)',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B3020 wedi'i gyfyngu i bapur neu fwrdd papur heb ei drin neu o bapur neu fwrdd papur rhychog, papur neu fwrdd papur arall, wedi'i wneud yn bennaf o fwydion cemegol cannu, heb ei liwio yn y màs, papur neu fwrdd papur wedi'i wneud yn bennaf o fwydion mecanyddol (er enghraifft (er enghraifft , papurau newydd, cyfnodolion a mater printiedig tebyg)",
          },
        },
      },
      {
        code: 'B3030',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B3030',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B3030",
          },
        },
      },
      {
        code: 'B3040',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B3040',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B3040",
          },
        },
      },
      {
        code: 'B3050',
        value: {
          description: {
            en: 'mixtures of wastes classified under Basel entry B3050',
            cy: "cymysgeddau o wastraff wedi'u dosbarthu o dan fynediad basel B3050",
          },
        },
      },
    ],
  },
  {
    type: 'AnnexIIIB',
    values: [
      {
        code: 'BEU04',
        value: {
          description: {
            en: 'Composite packaging consisting of mainly paper and some plastic, not containing residues and not covered by Basel entry B3020',
            cy: "Pecynnu cyfansawdd sy'n cynnwys papur yn bennaf a rhywfaint o blastig, nad yw'n cynnwys gweddillion ac nad yw'n cael ei orchuddio gan fynediad Basel B3020",
          },
        },
      },
      {
        code: 'BEU05',
        value: {
          description: {
            en: 'Clean biodegradable waste from agriculture, horticulture, forestry, gardens, parks and cemeteries',
            cy: 'Gwastraff bioddiraddadwy glân o amaethyddiaeth, garddwriaeth, coedwigaeth, gerddi, parciau a mynwentydd',
          },
        },
      },
    ],
  },
];

function setupFetchStub() {
  return function fetchStub(_url) {
    let data = {};
    if (_url.includes('/reference-data/waste-codes')) {
      data = refDataResponse;
    }
    if (_url.includes('/submissions/123/waste-description')) {
      data = defaultJsonResponse;
    }
    return new Promise((resolve) => {
      resolve({
        ok: true,
        json: () => Promise.resolve(data),
      });
    });
  };
}

global.fetch = jest.fn().mockImplementation(setupFetchStub());

describe('Waste code description page', () => {
  it('should display the page', async () => {
    await act(async () => {
      render(<WasteCodeDesc />);
    });
  });
  it('Has a "what is the" in the title', async () => {
    await act(async () => {
      render(<WasteCodeDesc />);
    });
    const paragraph = screen.getByText(/What is the/i);
    expect(paragraph).toBeTruthy();
  });
  it('should show validation message if no waste code description is selected', async () => {
    await act(async () => {
      render(<WasteCodeDesc />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });
  it('should show hint with text "Choose from the list or start typing" after the results were fetched', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub());

    await act(async () => {
      render(<WasteCodeDesc />);
    });

    const hint = screen.getByText('Choose from the list or start typing');
    expect(hint).toBeTruthy();
  });
});
