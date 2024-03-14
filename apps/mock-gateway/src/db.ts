import {
  Submission,
  Template,
  ListAddressesResponse,
  ListWasteCodesResponse,
  ListEWCCodesResponse,
  ListCountriesResponse,
  ListRecoveryCodesResponse,
  ListDisposalCodesResponse,
  BulkSubmission,
} from '@wts/api/waste-tracking-gateway';

export type SubmissionWithAccount = Submission & { accountId: string };
export type TemplateWithAccount = Template & { accountId: string };
export type BulkWithAccount = BulkSubmission & { accountId: string };

export interface DB {
  addresses: ListAddressesResponse;
  submissions: SubmissionWithAccount[];
  templates: TemplateWithAccount[];
  wasteCodes: ListWasteCodesResponse;
  ewcCodes: ListEWCCodesResponse;
  countries: ListCountriesResponse;
  recoveryCodes: ListRecoveryCodesResponse;
  disposalCodes: ListDisposalCodesResponse;
  batches: BulkWithAccount[];
}

export const db: DB = {
  addresses: [
    {
      addressLine1: 'Armira Capital Ltd',
      addressLine2: '110 Bishopsgate',
      townCity: 'LONDON',
      postcode: 'EC2N 4AY',
      country: 'England',
    },
    {
      addressLine1: 'Autonomy Capital Research LLP',
      addressLine2: '110 Bishopsgate',
      townCity: 'LONDON',
      postcode: 'EC2N 4AY',
      country: 'England',
    },
    {
      addressLine1: 'B A S F Metals',
      addressLine2: '110 Bishopsgate',
      townCity: 'LONDON',
      postcode: 'EC2N 4AY',
      country: 'England',
    },
    {
      addressLine1: 'Single Address Result',
      addressLine2: '110 Single Address Street',
      townCity: 'LONDON',
      postcode: 'AA1 1AA',
      country: 'England',
    },
  ],

  submissions: [],
  templates: [],
  batches: [],
  wasteCodes: [
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
  ],
  ewcCodes: [
    {
      code: '010101',
      value: {
        description: {
          en: 'wastes from mineral metalliferous excavation',
          cy: 'gwastraff o gloddio metelaidd mwynol',
        },
      },
    },
    {
      code: '010102',
      value: {
        description: {
          en: 'wastes from mineral non-metalliferous excavation',
          cy: 'gwastraff o gloddio anfetelaidd mwynol',
        },
      },
    },
    {
      code: '010304*',
      value: {
        description: {
          en: 'acid-generating tailings from processing of sulphide ore',
          cy: "cynffonnau sy'n cynhyrchu asid o brosesu mwyn sylffid",
        },
      },
    },
    {
      code: '010305*',
      value: {
        description: {
          en: 'other tailings containing hazardous substances',
          cy: "Tails eraill sy'n cynnwys sylweddau peryglus",
        },
      },
    },
    {
      code: '010306',
      value: {
        description: {
          en: 'tailings other than those mentioned in 01 03 04 and 01 03 05',
          cy: "Cynffonnau heblaw'r rhai a grybwyllir yn 01 03 04 a 01 03 05",
        },
      },
    },
    {
      code: '010307*',
      value: {
        description: {
          en: 'other wastes containing hazardous substances from physical and chemical processing of metalliferous minerals',
          cy: "Gwastraff eraill sy'n cynnwys sylweddau peryglus o brosesu mwynau metelaidd yn gorfforol a chemegol",
        },
      },
    },
    {
      code: '010308',
      value: {
        description: {
          en: 'dusty and powdery wastes other than those mentioned in 01 03 07',
          cy: "gwastraff llychlyd a phowdrog heblaw'r rhai a grybwyllir yn 01 03 07",
        },
      },
    },
    {
      code: '010309',
      value: {
        description: {
          en: 'red mud from alumina production other than the wastes mentioned in 01 03 10',
          cy: "Mwd coch o gynhyrchu alwmina heblaw'r gwastraff a grybwyllir yn 01 03 10",
        },
      },
    },
    {
      code: '010310*',
      value: {
        description: {
          en: 'red mud from alumina production containing hazardous substances other than the wastes mentioned in 01 03 07',
          cy: "Mwd coch o gynhyrchu alwmina sy'n cynnwys sylweddau peryglus heblaw'r gwastraff a grybwyllir yn 01 03 07",
        },
      },
    },
    {
      code: '010399',
      value: {
        description: {
          en: 'wastes not otherwise specified',
          cy: 'gwastraff na nodir fel arall',
        },
      },
    },
  ],
  countries: [
    {
      name: 'Afghanistan [AF]',
    },
    {
      name: 'Åland Islands [AX]',
    },
    {
      name: 'Albania [AL]',
    },
    {
      name: 'Algeria [DZ]',
    },
    {
      name: 'American Samoa [AS]',
    },
    {
      name: 'Andorra [AD]',
    },
    {
      name: 'Angola [AO]',
    },
  ],
  recoveryCodes: [
    {
      code: 'R1',
      value: {
        description: {
          en: 'Use principally as a fuel or other means to generate energy',
          cy: 'Defnyddiwch yn bennaf fel tanwydd neu ddulliau eraill i gynhyrchu ynni',
        },
        interim: false,
      },
    },
    {
      code: 'R2',
      value: {
        description: {
          en: 'Solvent reclamation/regeneration',
          cy: 'Adfer/adfywio toddyddion',
        },
        interim: false,
      },
    },
    {
      code: 'R3',
      value: {
        description: {
          en: 'Recycling/reclamation of organic substances which are not used as solvents (including composting and other biological transformation processes)',
          cy: "Ailgylchu/adfer sylweddau organig nad ydyn nhw'n cael eu defnyddio fel toddyddion (gan gynnwys compostio a phrosesau trawsnewid biolegol eraill)",
        },
        interim: false,
      },
    },
    {
      code: 'R4',
      value: {
        description: {
          en: 'Recycling/reclamation of metals and metal compounds',
          cy: 'Ailgylchu/Adfer Metelau a Chyfansoddion Metel',
        },
        interim: false,
      },
    },
    {
      code: 'R5',
      value: {
        description: {
          en: 'Recycling/reclamation of other inorganic materials',
          cy: 'Ailgylchu/adfer deunyddiau anorganig eraill',
        },
        interim: false,
      },
    },
    {
      code: 'R6',
      value: {
        description: {
          en: 'Regeneration of acids or bases',
          cy: 'Adfywio asidau neu seiliau',
        },
        interim: false,
      },
    },
    {
      code: 'R7',
      value: {
        description: {
          en: 'Recovery of components used for pollution abatement',
          cy: 'Adfer y cydrannau a ddefnyddir ar gyfer lleihau llygredd',
        },
        interim: false,
      },
    },
    {
      code: 'R8',
      value: {
        description: {
          en: 'Recovery of components from catalysts',
          cy: 'Adfer cydrannau o gatalyddion',
        },
        interim: false,
      },
    },
    {
      code: 'R9',
      value: {
        description: {
          en: 'Oil refining or other re-uses of oil',
          cy: 'Mireinio olew neu ailddefnyddio olew eraill',
        },
        interim: false,
      },
    },
    {
      code: 'R10',
      value: {
        description: {
          en: 'Land treatment resulting in benefit to agriculture or ecological improvement',
          cy: 'Triniaeth tir gan arwain at fudd i amaethyddiaeth neu welliant ecolegol',
        },
        interim: false,
      },
    },
    {
      code: 'R11',
      value: {
        description: {
          en: 'Use of wastes obtained from any of the operations numbered R01 to R11',
          cy: "Defnyddio gwastraff a gafwyd o unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R11",
        },
        interim: false,
      },
    },
    {
      code: 'R12',
      value: {
        description: {
          en: 'Exchange of wastes for submission to any of the operations numbered R01 to R11',
          cy: "Cyfnewid gwastraff i'w gyflwyno i unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R11",
        },
        interim: true,
      },
    },
    {
      code: 'R13',
      value: {
        description: {
          en: 'Storage of wastes pending any of the operations numbered R01 to R12 (excluding temporary storage, pending collection, on the site where it is produced).',
          cy: "Storio gwastraff hyd nes y bydd unrhyw un o'r gweithrediadau wedi'u rhifo R01 i R12 (ac eithrio storio dros dro, hyd nes y bydd y casgliad, ar y safle lle mae'n cael ei gynhyrchu).",
        },
        interim: true,
      },
    },
  ],
  disposalCodes: [
    {
      code: 'D1',
      value: {
        description: {
          en: 'Deposit into or onto land',
          cy: 'Adneuo i mewn neu ymlaen i dir',
        },
      },
    },
    {
      code: 'D2',
      value: {
        description: {
          en: 'Land Treatment',
          cy: 'Triniaeth Tir',
        },
      },
    },
    {
      code: 'D3',
      value: {
        description: {
          en: 'Deep injection',
          cy: 'Chwistrelliad dwfn',
        },
      },
    },
    {
      code: 'D4',
      value: {
        description: {
          en: 'Surface impoundment',
          cy: 'Cronni arwyneb',
        },
      },
    },
    {
      code: 'D5',
      value: {
        description: {
          en: 'Specially engineered landfill',
          cy: "Safle tirlenwi wedi'i beiriannu'n arbennig",
        },
      },
    },
    {
      code: 'D6',
      value: {
        description: {
          en: 'Release into a water body except seas/oceans',
          cy: 'Rhyddhau i gorff dŵr ac eithrio moroedd/cefnforoedd',
        },
      },
    },
    {
      code: 'D7',
      value: {
        description: {
          en: 'Release into seas/oceans including seabed insertion',
          cy: 'Rhyddhau i foroedd/cefnforoedd gan gynnwys mewnosodiad môr',
        },
      },
    },
    {
      code: 'D8',
      value: {
        description: {
          en: 'Biological treatment not specified elsewhere which results in final compounds or mixtures which are disposed of by any of the operations numbered D01 to D12',
          cy: "Triniaeth fiolegol heb ei nodi mewn man arall sy'n arwain at gyfansoddion neu gymysgeddau terfynol y mae unrhyw un o'r gweithrediadau wedi'u rhifo D01 i D12 yn eu gwaredu",
        },
      },
    },
    {
      code: 'D9',
      value: {
        description: {
          en: 'Physico-chemical treatment not specified elsewhere which results in final compounds or mixtures which are disposed of by any of the operations numbered D01 to D12',
          cy: "Triniaeth ffisegol-gemegol heb ei nodi mewn man arall sy'n arwain at gyfansoddion neu gymysgeddau terfynol y mae unrhyw un o'r gweithrediadau wedi'u rhifo D01 i D12 yn eu gwaredu",
        },
      },
    },
    {
      code: 'D10',
      value: {
        description: {
          en: 'Incineration on land',
          cy: 'Llosgi ar dir',
        },
      },
    },
    {
      code: 'D11',
      value: {
        description: {
          en: 'Incineration at sea',
          cy: 'Llosgi ar y môr',
        },
      },
    },
    {
      code: 'D12',
      value: {
        description: {
          en: 'Permanent storage',
          cy: 'Storio parhaol',
        },
      },
    },
    {
      code: 'D13',
      value: {
        description: {
          en: 'Blending or mixing prior to submission to any of the operations numbered D01 to D12',
          cy: "Cymysgu neu gymysgu cyn ei gyflwyno i unrhyw un o'r gweithrediadau wedi'u rhifo D01 i D12",
        },
      },
    },
    {
      code: 'D14',
      value: {
        description: {
          en: 'Repackaging prior to submission to any of the operations numbered D01 to D12',
          cy: "Ail -becynnu cyn ei gyflwyno i unrhyw un o'r gweithrediadau wedi'u rhifo D01 i D12",
        },
      },
    },
    {
      code: 'D15',
      value: {
        description: {
          en: 'Storage pending any of the operations numbered D01 to D14 (excluding temporary storage, pending collection, on the site where it is produced)',
          cy: "Storio hyd nes y bydd unrhyw un o'r gweithrediadau wedi'u rhifo D01 i D14 (ac eithrio storio dros dro, hyd nes y bydd casgliad, ar y safle lle mae'n cael ei gynhyrchu)",
        },
      },
    },
  ],
};
