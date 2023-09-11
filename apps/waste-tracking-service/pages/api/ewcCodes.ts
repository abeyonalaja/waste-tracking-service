const ewcCodes = [
  {
    code: '010101',
    description: 'wastes from mineral metalliferous excavation',
  },
  {
    code: '010102',
    description: 'wastes from mineral non-metalliferous excavation',
  },
  {
    code: '010304*',
    description: 'acid-generating tailings from processing of sulphide ore',
  },
  {
    code: '010305*',
    description: 'other tailings containing hazardous substances',
  },
  {
    code: '010306',
    description: 'tailings other than those mentioned in 01 03 04 and 01 03 05',
  },
  {
    code: '010307*',
    description:
      'other wastes containing hazardous substances from physical and chemical processing of metalliferous minerals',
  },
  {
    code: '010308',
    description:
      'dusty and powdery wastes other than those mentioned in 01 03 07',
  },
  {
    code: '010309',
    description:
      'red mud from alumina production other than the wastes mentioned in 01 03 10',
  },
  {
    code: '010310*',
    description:
      'red mud from alumina production containing hazardous substances other than the wastes mentioned in 01 03 07',
  },
  { code: '010399', description: 'wastes not otherwise specified' },
  {
    code: '010407*',
    description:
      'wastes containing hazardous substances from physical and chemical processing of non-metalliferous minerals',
  },
  {
    code: '010408',
    description:
      'waste gravel and crushed rocks other than those mentioned in 01 04 07',
  },
  { code: '010409', description: 'waste sand and clays' },
  {
    code: '010410',
    description:
      'dusty and powdery wastes other than those mentioned in 01 04 07',
  },
  {
    code: '010411',
    description:
      'wastes from potash and rock salt processing other than those mentioned in 01 04 07',
  },
  {
    code: '010412',
    description:
      'tailings and other wastes from washing and cleaning of minerals other than those mentioned in 01 04 07 and 01 04 11',
  },
  {
    code: '010413',
    description:
      'wastes from stone cutting and sawing other than those mentioned in 01 04 07',
  },
  { code: '010499', description: 'wastes not otherwise specified' },
  { code: '010504', description: 'freshwater drilling muds and wastes' },
  { code: '010505*', description: 'oil-containing drilling muds and wastes' },
  {
    code: '010506*',
    description:
      'drilling muds and other drilling wastes containing hazardous substances',
  },
  {
    code: '010507',
    description:
      'barite-containing drilling muds and wastes other than those mentioned in 01 05 05 and 01 05 06',
  },
  {
    code: '010508',
    description:
      'chloride-containing drilling muds and wastes other than those mentioned in 01 05 05 and 01 05 06',
  },
  { code: '010599', description: 'wastes not otherwise specified' },
  { code: '020101', description: 'sludges from washing and cleaning' },
  { code: '020102', description: 'animal-tissue waste' },
  { code: '020103', description: 'plant-tissue waste' },
  { code: '020104', description: 'waste plastics (except packaging)' },
  {
    code: '020106',
    description:
      'animal faeces, urine and manure (including spoiled straw), effluent, collected separately and treated off-site',
  },
  { code: '020107', description: 'wastes from forestry' },
  {
    code: '020108*',
    description: 'agrochemical waste containing hazardous substances',
  },
  {
    code: '020109',
    description: 'agrochemical waste other than those mentioned in 02 01 08',
  },
  { code: '020110', description: 'waste metal' },
  { code: '020199', description: 'wastes not otherwise specified' },
  { code: '020201', description: 'sludges from washing and cleaning' },
  { code: '020202', description: 'animal-tissue waste' },
  {
    code: '020203',
    description: 'materials unsuitable for consumption or processing',
  },
  { code: '020204', description: 'sludges from on-site effluent treatment' },
  { code: '020299', description: 'wastes not otherwise specified' },
  {
    code: '020301',
    description:
      'sludges from washing, cleaning, peeling, centrifuging and separation',
  },
  { code: '020302', description: 'wastes from preserving agents' },
  { code: '020303', description: 'wastes from solvent extraction' },
  {
    code: '020304',
    description: 'materials unsuitable for consumption or processing',
  },
  { code: '020305', description: 'sludges from on-site effluent treatment' },
  { code: '020399', description: 'wastes not otherwise specified' },
  { code: '020401', description: 'soil from cleaning and washing beet' },
  { code: '020402', description: 'off-specification calcium carbonate' },
  { code: '020403', description: 'sludges from on-site effluent treatment' },
  { code: '020499', description: 'wastes not otherwise specified' },
  {
    code: '020501',
    description: 'materials unsuitable for consumption or processing',
  },
  { code: '020502', description: 'sludges from on-site effluent treatment' },
  { code: '020599', description: 'wastes not otherwise specified' },
  {
    code: '020601',
    description: 'materials unsuitable for consumption or processing',
  },
  { code: '020602', description: 'wastes from preserving agents' },
  { code: '020603', description: 'sludges from on-site effluent treatment' },
  { code: '020699', description: 'wastes not otherwise specified' },
  {
    code: '020701',
    description:
      'wastes from washing, cleaning and mechanical reduction of raw materials',
  },
  { code: '020702', description: 'wastes from spirits distillation' },
  { code: '020703', description: 'wastes from chemical treatment' },
  {
    code: '020704',
    description: 'materials unsuitable for consumption or processing',
  },
  { code: '020705', description: 'sludges from on-site effluent treatment' },
  { code: '020799', description: 'wastes not otherwise specified' },
  { code: '030101', description: 'waste bark and cork' },
  {
    code: '030104*',
    description:
      'sawdust, shavings, cuttings, wood, particle board and veneer containing hazardous substances',
  },
  {
    code: '030105',
    description:
      'sawdust, shavings, cuttings, wood, particle board and veneer other than those mentioned in 03 01 04',
  },
  { code: '030199', description: 'wastes not otherwise specified' },
  {
    code: '030201*',
    description: 'non-halogenated organic wood preservatives',
  },
  { code: '030202*', description: 'organochlorinated wood preservatives' },
  { code: '030203*', description: 'organometallic wood preservatives' },
  { code: '030204*', description: 'inorganic wood preservatives' },
  {
    code: '030205*',
    description: 'other wood preservatives containing hazardous substances',
  },
  { code: '030299', description: 'wood preservatives not otherwise specified' },
  { code: '030301', description: 'waste bark and wood' },
  {
    code: '030302',
    description: 'green liquor sludge (from recovery of cooking liquor)',
  },
  { code: '030305', description: 'de-inking sludges from paper recycling' },
  {
    code: '030307',
    description:
      'mechanically separated rejects from pulping of waste paper and cardboard',
  },
  {
    code: '030308',
    description:
      'wastes from sorting of paper and cardboard destined for recycling',
  },
  { code: '030309', description: 'lime mud waste' },
  {
    code: '030310',
    description:
      'fibre rejects, fibre-, filler- and coating-sludges from mechanical separation',
  },
  {
    code: '030311',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 03 03 10',
  },
  { code: '030399', description: 'wastes not otherwise specified' },
  { code: '040101', description: 'fleshings and lime split wastes' },
  { code: '040102', description: 'liming waste' },
  {
    code: '040103*',
    description: 'degreasing wastes containing solvents without a liquid phase',
  },
  { code: '040104', description: 'tanning liquor containing chromium' },
  { code: '040105', description: 'tanning liquor free of chromium' },
  {
    code: '040106',
    description:
      'sludges, in particular from on-site effluent treatment containing chromium',
  },
  {
    code: '040107',
    description:
      'sludges, in particular from on-site effluent treatment free of chromium',
  },
  {
    code: '040108',
    description:
      'waste tanned leather (blue sheetings, shavings, cuttings, buffing dust) containing chromium',
  },
  { code: '040109', description: 'wastes from dressing and finishing' },
  { code: '040199', description: 'wastes not otherwise specified' },
  {
    code: '040209',
    description:
      'wastes from composite materials (impregnated textile, elastomer, plastomer)',
  },
  {
    code: '040210',
    description:
      'organic matter from natural products (for example grease, wax)',
  },
  {
    code: '040214*',
    description: 'wastes from finishing containing organic solvents',
  },
  {
    code: '040215',
    description: 'wastes from finishing other than those mentioned in 04 02 14',
  },
  {
    code: '040216*',
    description: 'dyestuffs and pigments containing hazardous substances',
  },
  {
    code: '040217',
    description:
      'dyestuffs and pigments other than those mentioned in 04 02 16',
  },
  {
    code: '040219*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '040220',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 04 02 19',
  },
  { code: '040221', description: 'wastes from unprocessed textile fibres' },
  { code: '040222', description: 'wastes from processed textile fibres' },
  { code: '040299', description: 'wastes not otherwise specified' },
  { code: '050102*', description: 'desalter sludges' },
  { code: '050103*', description: 'tank bottom sludges' },
  { code: '050104*', description: 'acid alkyl sludges' },
  { code: '050105*', description: 'oil spills' },
  {
    code: '050106*',
    description:
      'oily sludges from maintenance operations of the plant or equipment',
  },
  { code: '050107*', description: 'acid tars' },
  { code: '050108*', description: 'other tars' },
  {
    code: '050109*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '050110',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 05 01 09',
  },
  { code: '050111*', description: 'wastes from cleaning of fuels with bases' },
  { code: '050112*', description: 'oil containing acids' },
  { code: '050113', description: 'boiler feedwater sludges' },
  { code: '050114', description: 'wastes from cooling columns' },
  { code: '050115*', description: 'spent filter clays' },
  {
    code: '050116',
    description: 'sulphur-containing wastes from petroleum desulphurisation',
  },
  { code: '050117', description: 'bitumen' },
  { code: '050199', description: 'wastes not otherwise specified' },
  { code: '050601*', description: 'acid tars' },
  { code: '050603*', description: 'other tars' },
  { code: '050604', description: 'waste from cooling columns' },
  { code: '050699', description: 'wastes not otherwise specified' },
  { code: '050701*', description: 'wastes containing mercury' },
  { code: '050702', description: 'wastes containing sulphur' },
  { code: '050799', description: 'wastes not otherwise specified' },
  { code: '060101*', description: 'sulphuric acid and sulphurous acid' },
  { code: '060102*', description: 'hydrochloric acid' },
  { code: '060103*', description: 'hydrofluoric acid' },
  { code: '060104*', description: 'phosphoric and phosphorous acid' },
  { code: '060105*', description: 'nitric acid and nitrous acid' },
  { code: '060106*', description: 'other acids' },
  { code: '060199', description: 'wastes not otherwise specified' },
  { code: '060201*', description: 'calcium hydroxide' },
  { code: '060203*', description: 'ammonium hydroxide' },
  { code: '060204*', description: 'sodium and potassium hydroxide' },
  { code: '060205*', description: 'other bases' },
  { code: '060299', description: 'wastes not otherwise specified' },
  {
    code: '060311*',
    description: 'solid salts and solutions containing cyanides',
  },
  {
    code: '060313*',
    description: 'solid salts and solutions containing heavy metals',
  },
  {
    code: '060314',
    description:
      'solid salts and solutions other than those mentioned in 06 03 11 and 06 03 13',
  },
  { code: '060315*', description: 'metallic oxides containing heavy metals' },
  {
    code: '060316',
    description: 'metallic oxides other than those mentioned in 06 03 15',
  },
  { code: '060399', description: 'wastes not otherwise specified' },
  { code: '060403*', description: 'wastes containing arsenic' },
  { code: '060404*', description: 'wastes containing mercury' },
  { code: '060405*', description: 'wastes containing other heavy metals' },
  { code: '060499', description: 'wastes not otherwise specified' },
  {
    code: '060502*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '060503',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 06 05 02',
  },
  { code: '060602*', description: 'wastes containing hazardous sulphides' },
  {
    code: '060603',
    description:
      'wastes containing sulphides other than those mentioned in 06 06 02',
  },
  { code: '060699', description: 'wastes not otherwise specified' },
  {
    code: '060701*',
    description: 'wastes containing asbestos from electrolysis',
  },
  { code: '060702*', description: 'activated carbon from chlorine production' },
  { code: '060703*', description: 'barium sulphate sludge containing mercury' },
  {
    code: '060704*',
    description: 'solutions and acids, for example contact acid',
  },
  { code: '060799', description: 'wastes not otherwise specified' },
  { code: '060802*', description: 'waste containing hazardous chlorosilanes' },
  { code: '060899', description: 'wastes not otherwise specified' },
  { code: '060902', description: 'phosphorous slag' },
  {
    code: '060903*',
    description:
      'calcium-based reaction wastes containing or contaminated with hazardous substances',
  },
  {
    code: '060904',
    description:
      'calcium-based reaction wastes other than those mentioned in 06 09 03',
  },
  { code: '060999', description: 'wastes not otherwise specified' },
  { code: '061002*', description: 'wastes containing hazardous substances' },
  { code: '061099', description: 'wastes not otherwise specified' },
  {
    code: '061101',
    description:
      'calcium-based reaction wastes from titanium dioxide production',
  },
  { code: '061199', description: 'wastes not otherwise specified' },
  {
    code: '061301*',
    description:
      'inorganic plant protection products, wood-preserving agents and other biocides',
  },
  { code: '061302*', description: 'spent activated carbon (except 06 07 02)' },
  { code: '061303', description: 'carbon black' },
  { code: '061304*', description: 'wastes from asbestos processing' },
  { code: '061305*', description: 'soot' },
  { code: '061399', description: 'wastes not otherwise specified' },
  {
    code: '070101*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070103*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070104*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070107*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070108*', description: 'other still bottoms and reaction residues' },
  {
    code: '070109*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070110*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070111*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070112',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 01 11',
  },
  { code: '070199', description: 'wastes not otherwise specified' },
  {
    code: '070201*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070203*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070204*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070207*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070208*', description: 'other still bottoms and reaction residues' },
  {
    code: '070209*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070210*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070211*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070212',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 02 11',
  },
  { code: '070213', description: 'waste plastic' },
  {
    code: '070214*',
    description: 'wastes from additives containing hazardous substances',
  },
  {
    code: '070215',
    description: 'wastes from additives other than those mentioned in 07 02 14',
  },
  { code: '070216*', description: 'waste containing hazardous silicones' },
  {
    code: '070217',
    description:
      'waste containing silicones other than those mentioned in 07 02 16',
  },
  { code: '070299', description: 'wastes not otherwise specified' },
  {
    code: '070301*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070303*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070304*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070307*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070308*', description: 'other still bottoms and reaction residues' },
  {
    code: '070309*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070310*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070311*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070312',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 03 11',
  },
  { code: '070399', description: 'wastes not otherwise specified' },
  {
    code: '070401*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070403*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070404*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070407*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070408*', description: 'other still bottoms and reaction residues' },
  {
    code: '070409*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070410*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070411*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070412',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 04 11',
  },
  {
    code: '070413*',
    description: 'solid wastes containing hazardous substances',
  },
  { code: '070499', description: 'wastes not otherwise specified' },
  {
    code: '070501*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070503*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070504*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070507*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070508*', description: 'other still bottoms and reaction residues' },
  {
    code: '070509*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070510*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070511*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070512',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 05 11',
  },
  {
    code: '070513*',
    description: 'solid wastes containing hazardous substances',
  },
  {
    code: '070514',
    description: 'solid wastes other than those mentioned in 07 05 13',
  },
  { code: '070599', description: 'wastes not otherwise specified' },
  {
    code: '070601*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070603*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070604*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070607*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070608*', description: 'other still bottoms and reaction residues' },
  {
    code: '070609*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070610*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070611*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070612',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 06 11',
  },
  { code: '070699', description: 'wastes not otherwise specified' },
  {
    code: '070701*',
    description: 'aqueous washing liquids and mother liquors',
  },
  {
    code: '070703*',
    description:
      'organic halogenated solvents, washing liquids and mother liquors',
  },
  {
    code: '070704*',
    description: 'other organic solvents, washing liquids and mother liquors',
  },
  {
    code: '070707*',
    description: 'halogenated still bottoms and reaction residues',
  },
  { code: '070708*', description: 'other still bottoms and reaction residues' },
  {
    code: '070709*',
    description: 'halogenated filter cakes and spent absorbents',
  },
  { code: '070710*', description: 'other filter cakes and spent absorbents' },
  {
    code: '070711*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '070712',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 07 07 11',
  },
  { code: '070799', description: 'wastes not otherwise specified' },
  {
    code: '080111*',
    description:
      'waste paint and varnish containing organic solvents or other hazardous substances',
  },
  {
    code: '080112',
    description:
      'waste paint and varnish other than those mentioned in 08 01 11',
  },
  {
    code: '080113*',
    description:
      'sludges from paint or varnish containing organic solvents or other hazardous substances',
  },
  {
    code: '080114',
    description:
      'sludges from paint or varnish other than those mentioned in 08 01 13',
  },
  {
    code: '080115*',
    description:
      'aqueous sludges containing paint or varnish containing organic solvents or other hazardous substances',
  },
  {
    code: '080116',
    description:
      'aqueous sludges containing paint or varnish other than those mentioned in 08 01 15',
  },
  {
    code: '080117*',
    description:
      'wastes from paint or varnish removal containing organic solvents or other hazardous substances',
  },
  {
    code: '080118',
    description:
      'wastes from paint or varnish removal other than those mentioned in 08 01 17',
  },
  {
    code: '080119*',
    description:
      'aqueous suspensions containing paint or varnish containing organic solvents or other hazardous substances',
  },
  {
    code: '080120',
    description:
      'aqueous suspensions containing paint or varnish other than those mentioned in 08 01 19',
  },
  { code: '080121*', description: 'waste paint or varnish remover' },
  { code: '080199', description: 'wastes not otherwise specified' },
  { code: '080201', description: 'waste coating powders' },
  {
    code: '080202',
    description: 'aqueous sludges containing ceramic materials',
  },
  {
    code: '080203',
    description: 'aqueous suspensions containing ceramic materials',
  },
  { code: '080299', description: 'wastes not otherwise specified' },
  { code: '080307', description: 'aqueous sludges containing ink' },
  { code: '080308', description: 'aqueous liquid waste containing ink' },
  { code: '080312*', description: 'waste ink containing hazardous substances' },
  {
    code: '080313',
    description: 'waste ink other than those mentioned in 08 03 12',
  },
  {
    code: '080314*',
    description: 'ink sludges containing hazardous substances',
  },
  {
    code: '080315',
    description: 'ink sludges other than those mentioned in 08 03 14',
  },
  { code: '080316*', description: 'waste etching solutions' },
  {
    code: '080317*',
    description: 'waste printing toner containing hazardous substances',
  },
  {
    code: '080318',
    description: 'waste printing toner other than those mentioned in 08 03 17',
  },
  { code: '080319*', description: 'disperse oil' },
  { code: '080399', description: 'wastes not otherwise specified' },
  {
    code: '080409*',
    description:
      'waste adhesives and sealants containing organic solvents or other hazardous substances',
  },
  {
    code: '080410',
    description:
      'waste adhesives and sealants other than those mentioned in 08 04 09',
  },
  {
    code: '080411*',
    description:
      'adhesive and sealant sludges containing organic solvents or other hazardous substances',
  },
  {
    code: '080412',
    description:
      'adhesive and sealant sludges other than those mentioned in 08 04 11',
  },
  {
    code: '080413*',
    description:
      'aqueous sludges containing adhesives or sealants containing organic solvents or other hazardous substances',
  },
  {
    code: '080414',
    description:
      'aqueous sludges containing adhesives or sealants other than those mentioned in 08 04 13',
  },
  {
    code: '080415*',
    description:
      'aqueous liquid waste containing adhesives or sealants containing organic solvents or other hazardous substances',
  },
  {
    code: '080416',
    description:
      'aqueous liquid waste containing adhesives or sealants other than those mentioned in 08 04 15',
  },
  { code: '080417*', description: 'rosin oil' },
  { code: '080499', description: 'wastes not otherwise specified' },
  { code: '080501*', description: 'waste isocyanates' },
  {
    code: '090101*',
    description: 'water-based developer and activator solutions',
  },
  {
    code: '090102*',
    description: 'water-based offset plate developer solutions',
  },
  { code: '090103*', description: 'solvent-based developer solutions' },
  { code: '090104*', description: 'fixer solutions' },
  {
    code: '090105*',
    description: 'bleach solutions and bleach fixer solutions',
  },
  {
    code: '090106*',
    description:
      'wastes containing silver from on-site treatment of photographic wastes',
  },
  {
    code: '090107',
    description:
      'photographic film and paper containing silver or silver compounds',
  },
  {
    code: '090108',
    description:
      'photographic film and paper free of silver or silver compounds',
  },
  { code: '090110', description: 'single-use cameras without batteries' },
  {
    code: '090111*',
    description:
      'single-use cameras containing batteries included in 16 06 01, 16 06 02 or 16 06 03',
  },
  {
    code: '090112',
    description:
      'single-use cameras containing batteries other than those mentioned in 09 01 11',
  },
  {
    code: '090113*',
    description:
      'aqueous liquid waste from on-site reclamation of silver other than those mentioned in 09 01 06',
  },
  { code: '090199', description: 'wastes not otherwise specified' },
  {
    code: '100101',
    description:
      'bottom ash, slag and boiler dust (excluding boiler dust mentioned in 10 01 04)',
  },
  { code: '100102', description: 'coal fly ash' },
  { code: '100103', description: 'fly ash from peat and untreated wood' },
  { code: '100104*', description: 'oil fly ash and boiler dust' },
  {
    code: '100105',
    description:
      'calcium-based reaction wastes from flue-gas desulphurisation in solid form',
  },
  {
    code: '100107',
    description:
      'calcium-based reaction wastes from flue-gas desulphurisation in sludge form',
  },
  { code: '100109*', description: 'sulphuric acid' },
  {
    code: '100113*',
    description: 'fly ash from emulsified hydrocarbons used as fuel',
  },
  {
    code: '100114*',
    description:
      'bottom ash, slag and boiler dust from co-incineration containing hazardous substances',
  },
  {
    code: '100115',
    description:
      'bottom ash, slag and boiler dust from co-incineration other than those mentioned in 10 01 14',
  },
  {
    code: '100116*',
    description: 'fly ash from co-incineration containing hazardous substances',
  },
  {
    code: '100117',
    description:
      'fly ash from co-incineration other than those mentioned in 10 01 16',
  },
  {
    code: '100118*',
    description: 'wastes from gas cleaning containing hazardous substances',
  },
  {
    code: '100119',
    description:
      'wastes from gas cleaning other than those mentioned in 10 01 05, 10 01 07 and 10 01 18',
  },
  {
    code: '100120*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '100121',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 10 01 20',
  },
  {
    code: '100122*',
    description:
      'aqueous sludges from boiler cleansing containing hazardous substances',
  },
  {
    code: '100123',
    description:
      'aqueous sludges from boiler cleansing other than those mentioned in 10 01 22',
  },
  { code: '100124', description: 'sands from fluidised beds' },
  {
    code: '100125',
    description:
      'wastes from fuel storage and preparation of coal-fired power plants',
  },
  { code: '100126', description: 'wastes from cooling-water treatment' },
  { code: '100199', description: 'wastes not otherwise specified' },
  { code: '100201', description: 'wastes from the processing of slag' },
  { code: '100202', description: 'unprocessed slag' },
  {
    code: '100207*',
    description:
      'solid wastes from gas treatment containing hazardous substances',
  },
  {
    code: '100208',
    description:
      'solid wastes from gas treatment other than those mentioned in 10 02 07',
  },
  { code: '100210', description: 'mill scales' },
  {
    code: '100211*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100212',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 02 11',
  },
  {
    code: '100213*',
    description:
      'sludges and filter cakes from gas treatment containing hazardous substances',
  },
  {
    code: '100214',
    description:
      'sludges and filter cakes from gas treatment other than those mentioned in 10 02 13',
  },
  { code: '100215', description: 'other sludges and filter cakes' },
  { code: '100299', description: 'wastes not otherwise specified' },
  { code: '100302', description: 'anode scraps' },
  { code: '100304*', description: 'primary production slags' },
  { code: '100305', description: 'waste alumina' },
  { code: '100308*', description: 'salt slags from secondary production' },
  { code: '100309*', description: 'black drosses from secondary production' },
  {
    code: '100315*',
    description:
      'skimmings that are flammable or emit, upon contact with water, flammable gases in hazardous quantities',
  },
  {
    code: '100316',
    description: 'skimmings other than those mentioned in 10 03 15',
  },
  {
    code: '100317*',
    description: 'tar-containing wastes from anode manufacture',
  },
  {
    code: '100318',
    description:
      'carbon-containing wastes from anode manufacture other than those mentioned in 10 03 17',
  },
  {
    code: '100319*',
    description: 'flue-gas dust containing hazardous substances',
  },
  {
    code: '100320',
    description: 'flue-gas dust other than those mentioned in 10 03 19',
  },
  {
    code: '100321*',
    description:
      'other particulates and dust (including ball-mill dust) containing hazardous substances',
  },
  {
    code: '100322',
    description:
      'other particulates and dust (including ball-mill dust) other than those mentioned in 10 03 21',
  },
  {
    code: '100323*',
    description:
      'solid wastes from gas treatment containing hazardous substances',
  },
  {
    code: '100324',
    description:
      'solid wastes from gas treatment other than those mentioned in 10 03 23',
  },
  {
    code: '100325*',
    description:
      'sludges and filter cakes from gas treatment containing hazardous substances',
  },
  {
    code: '100326',
    description:
      'sludges and filter cakes from gas treatment other than those mentioned in 10 03 25',
  },
  {
    code: '100327*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100328',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 03 27',
  },
  {
    code: '100329*',
    description:
      'wastes from treatment of salt slags and black drosses containing hazardous substances',
  },
  {
    code: '100330',
    description:
      'wastes from treatment of salt slags and black drosses other than those mentioned in 10 03 29',
  },
  { code: '100399', description: 'wastes not otherwise specified' },
  {
    code: '100401*',
    description: 'slags from primary and secondary production',
  },
  {
    code: '100402*',
    description: 'dross and skimmings from primary and secondary production',
  },
  { code: '100403*', description: 'calcium arsenate' },
  { code: '100404*', description: 'flue-gas dust' },
  { code: '100405*', description: 'other particulates and dust' },
  { code: '100406*', description: 'solid wastes from gas treatment' },
  {
    code: '100407*',
    description: 'sludges and filter cakes from gas treatment',
  },
  {
    code: '100409*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100410',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 04 09',
  },
  { code: '100499', description: 'wastes not otherwise specified' },
  {
    code: '100501',
    description: 'slags from primary and secondary production',
  },
  { code: '100503*', description: 'flue-gas dust' },
  { code: '100504', description: 'other particulates and dust' },
  { code: '100505*', description: 'solid waste from gas treatment' },
  {
    code: '100506*',
    description: 'sludges and filter cakes from gas treatment',
  },
  {
    code: '100508*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100509',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 05 08',
  },
  {
    code: '100510*',
    description:
      'dross and skimmings that are flammable or emit, upon contact with water, flammable gases in hazardous quantities',
  },
  {
    code: '100511',
    description: 'dross and skimmings other than those mentioned in 10 05 10',
  },
  { code: '100599', description: 'wastes not otherwise specified' },
  {
    code: '100601',
    description: 'slags from primary and secondary production',
  },
  {
    code: '100602',
    description: 'dross and skimmings from primary and secondary production',
  },
  { code: '100603*', description: 'flue-gas dust' },
  { code: '100604', description: 'other particulates and dust' },
  { code: '100606*', description: 'solid wastes from gas treatment' },
  {
    code: '100607*',
    description: 'sludges and filter cakes from gas treatment',
  },
  {
    code: '100609*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100610',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 06 09',
  },
  { code: '100699', description: 'wastes not otherwise specified' },
  {
    code: '100701',
    description: 'slags from primary and secondary production',
  },
  {
    code: '100702',
    description: 'dross and skimmings from primary and secondary production',
  },
  { code: '100703', description: 'solid wastes from gas treatment' },
  { code: '100704', description: 'other particulates and dust' },
  {
    code: '100705',
    description: 'sludges and filter cakes from gas treatment',
  },
  {
    code: '100707*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100708',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 07 07',
  },
  { code: '100799', description: 'wastes not otherwise specified' },
  { code: '100804', description: 'particulates and dust' },
  {
    code: '100808*',
    description: 'salt slag from primary and secondary production',
  },
  { code: '100809', description: 'other slags' },
  {
    code: '100810*',
    description:
      'dross and skimmings that are flammable or emit, upon contact with water, flammable gases in hazardous quantities',
  },
  {
    code: '100811',
    description: 'dross and skimmings other than those mentioned in 10 08 10',
  },
  {
    code: '100812*',
    description: 'tar-containing wastes from anode manufacture',
  },
  {
    code: '100813',
    description:
      'carbon-containing wastes from anode manufacture other than those mentioned in 10 08 12',
  },
  { code: '100814', description: 'anode scrap' },
  {
    code: '100815*',
    description: 'flue-gas dust containing hazardous substances',
  },
  {
    code: '100816',
    description: 'flue-gas dust other than those mentioned in 10 08 15',
  },
  {
    code: '100817*',
    description:
      'sludges and filter cakes from flue-gas treatment containing hazardous substances',
  },
  {
    code: '100818',
    description:
      'sludges and filter cakes from flue-gas treatment other than those mentioned in 10 08 17',
  },
  {
    code: '100819*',
    description: 'wastes from cooling-water treatment containing oil',
  },
  {
    code: '100820',
    description:
      'wastes from cooling-water treatment other than those mentioned in 10 08 19',
  },
  { code: '100899', description: 'wastes not otherwise specified' },
  { code: '100903', description: 'furnace slag' },
  {
    code: '100905*',
    description:
      'casting cores and moulds which have not undergone pouring containing hazardous substances',
  },
  {
    code: '100906',
    description:
      'casting cores and moulds which have not undergone pouring other than those mentioned in 10 09 05',
  },
  {
    code: '100907*',
    description:
      'casting cores and moulds which have undergone pouring containing hazardous substances',
  },
  {
    code: '100908',
    description:
      'casting cores and moulds which have undergone pouring other than those mentioned in 10 09 07',
  },
  {
    code: '100909*',
    description: 'flue-gas dust containing hazardous substances',
  },
  {
    code: '100910',
    description: 'flue-gas dust other than those mentioned in 10 09 09',
  },
  {
    code: '100911*',
    description: 'other particulates containing hazardous substances',
  },
  {
    code: '100912',
    description: 'other particulates other than those mentioned in 10 09 11',
  },
  {
    code: '100913*',
    description: 'waste binders containing hazardous substances',
  },
  {
    code: '100914',
    description: 'waste binders other than those mentioned in 10 09 13',
  },
  {
    code: '100915*',
    description: 'waste crack-indicating agent containing hazardous substances',
  },
  {
    code: '100916',
    description:
      'waste crack-indicating agent other than those mentioned in 10 09 15',
  },
  { code: '100999', description: 'wastes not otherwise specified' },
  { code: '101003', description: 'furnace slag' },
  {
    code: '101005*',
    description:
      'casting cores and moulds which have not undergone pouring, containing hazardous substances',
  },
  {
    code: '101006',
    description:
      'casting cores and moulds which have not undergone pouring, other than those mentioned in 10 10 05',
  },
  {
    code: '101007*',
    description:
      'casting cores and moulds which have undergone pouring, containing hazardous substances',
  },
  {
    code: '101008',
    description:
      'casting cores and moulds which have undergone pouring, other than those mentioned in 10 10 07',
  },
  {
    code: '101009*',
    description: 'flue-gas dust containing hazardous substances',
  },
  {
    code: '101010',
    description: 'flue-gas dust other than those mentioned in 10 10 09',
  },
  {
    code: '101011*',
    description: 'other particulates containing hazardous substances',
  },
  {
    code: '101012',
    description: 'other particulates other than those mentioned in 10 10 11',
  },
  {
    code: '101013*',
    description: 'waste binders containing hazardous substances',
  },
  {
    code: '101014',
    description: 'waste binders other than those mentioned in 10 10 13',
  },
  {
    code: '101015*',
    description: 'waste crack-indicating agent containing hazardous substances',
  },
  {
    code: '101016',
    description:
      'waste crack-indicating agent other than those mentioned in 10 10 15',
  },
  { code: '101099', description: 'wastes not otherwise specified' },
  { code: '101103', description: 'waste glass-based fibrous materials' },
  { code: '101105', description: 'particulates and dust' },
  {
    code: '101109*',
    description:
      'waste preparation mixture before thermal processing, containing hazardous substances',
  },
  {
    code: '101110',
    description:
      'waste preparation mixture before thermal processing, other than those mentioned in 10 11 09',
  },
  {
    code: '101111*',
    description:
      'waste glass in small particles and glass powder containing heavy metals (for example from cathode ray tubes)',
  },
  {
    code: '101112',
    description: 'waste glass other than those mentioned in 10 11 11',
  },
  {
    code: '101113*',
    description:
      'glass-polishing and -grinding sludge containing hazardous substances',
  },
  {
    code: '101114',
    description:
      'glass-polishing and -grinding sludge other than those mentioned in 10 11 13',
  },
  {
    code: '101115*',
    description:
      'solid wastes from flue-gas treatment containing hazardous substances',
  },
  {
    code: '101116',
    description:
      'solid wastes from flue-gas treatment other than those mentioned in 10 11 15',
  },
  {
    code: '101117*',
    description:
      'sludges and filter cakes from flue-gas treatment containing hazardous substances',
  },
  {
    code: '101118',
    description:
      'sludges and filter cakes from flue-gas treatment other than those mentioned in 10 11 17',
  },
  {
    code: '101119*',
    description:
      'solid wastes from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '101120',
    description:
      'solid wastes from on-site effluent treatment other than those mentioned in 10 11 19',
  },
  { code: '101199', description: 'wastes not otherwise specified' },
  {
    code: '101201',
    description: 'waste preparation mixture before thermal processing',
  },
  { code: '101203', description: 'particulates and dust' },
  {
    code: '101205',
    description: 'sludges and filter cakes from gas treatment',
  },
  { code: '101206', description: 'discarded moulds' },
  {
    code: '101208',
    description:
      'waste ceramics, bricks, tiles and construction products (after thermal processing)',
  },
  {
    code: '101209*',
    description:
      'solid wastes from gas treatment containing hazardous substances',
  },
  {
    code: '101210',
    description:
      'solid wastes from gas treatment other than those mentioned in 10 12 09',
  },
  {
    code: '101211*',
    description: 'wastes from glazing containing heavy metals',
  },
  {
    code: '101212',
    description: 'wastes from glazing other than those mentioned in 10 12 11',
  },
  { code: '101213', description: 'sludge from on-site effluent treatment' },
  { code: '101299', description: 'wastes not otherwise specified' },
  {
    code: '101301',
    description: 'waste preparation mixture before thermal processing',
  },
  {
    code: '101304',
    description: 'wastes from calcination and hydration of lime',
  },
  {
    code: '101306',
    description: 'particulates and dust (except 10 13 12 and 10 13 13)',
  },
  {
    code: '101307',
    description: 'sludges and filter cakes from gas treatment',
  },
  {
    code: '101309*',
    description: 'wastes from asbestos-cement manufacture containing asbestos',
  },
  {
    code: '101310',
    description:
      'wastes from asbestos-cement manufacture other than those mentioned in 10 13 09',
  },
  {
    code: '101311',
    description:
      'wastes from cement-based composite materials other than those mentioned in 10 13 09 and 10 13 10',
  },
  {
    code: '101312*',
    description:
      'solid wastes from gas treatment containing hazardous substances',
  },
  {
    code: '101313',
    description:
      'solid wastes from gas treatment other than those mentioned in 10 13 12',
  },
  { code: '101314', description: 'waste concrete and concrete sludge' },
  { code: '101399', description: 'wastes not otherwise specified' },
  {
    code: '101401*',
    description: 'waste from gas cleaning containing mercury',
  },
  { code: '110105*', description: 'pickling acids' },
  { code: '110106*', description: 'acids not otherwise specified' },
  { code: '110107*', description: 'pickling bases' },
  { code: '110108*', description: 'phosphatising sludges' },
  {
    code: '110109*',
    description: 'sludges and filter cakes containing hazardous substances',
  },
  {
    code: '110110',
    description:
      'sludges and filter cakes other than those mentioned in 11 01 09',
  },
  {
    code: '110111*',
    description: 'aqueous rinsing liquids containing hazardous substances',
  },
  {
    code: '110112',
    description:
      'aqueous rinsing liquids other than those mentioned in 11 01 11',
  },
  {
    code: '110113*',
    description: 'degreasing wastes containing hazardous substances',
  },
  {
    code: '110114',
    description: 'degreasing wastes other than those mentioned in 11 01 13',
  },
  {
    code: '110115*',
    description:
      'eluate and sludges from membrane systems or ion exchange systems containing hazardous substances',
  },
  { code: '110116*', description: 'saturated or spent ion exchange resins' },
  {
    code: '110198*',
    description: 'other wastes containing hazardous substances',
  },
  { code: '110199', description: 'wastes not otherwise specified' },
  {
    code: '110202*',
    description:
      'sludges from zinc hydrometallurgy (including jarosite, goethite)',
  },
  {
    code: '110203',
    description:
      'wastes from the production of anodes for aqueous electrolytical processes',
  },
  {
    code: '110205*',
    description:
      'wastes from copper hydrometallurgical processes containing hazardous substances',
  },
  {
    code: '110206',
    description:
      'wastes from copper hydrometallurgical processes other than those mentioned in 11 02 05',
  },
  {
    code: '110207*',
    description: 'other wastes containing hazardous substances',
  },
  { code: '110299', description: 'wastes not otherwise specified' },
  { code: '110301*', description: 'wastes containing cyanide' },
  { code: '110302*', description: 'other wastes' },
  { code: '110501', description: 'hard zinc' },
  { code: '110502', description: 'zinc ash' },
  { code: '110503*', description: 'solid wastes from gas treatment' },
  { code: '110504*', description: 'spent flux' },
  { code: '110599', description: 'wastes not otherwise specified' },
  { code: '120101', description: 'ferrous metal filings and turnings' },
  { code: '120102', description: 'ferrous metal dust and particles' },
  { code: '120103', description: 'non-ferrous metal filings and turnings' },
  { code: '120104', description: 'non-ferrous metal dust and particles' },
  { code: '120105', description: 'plastics shavings and turnings' },
  {
    code: '120106*',
    description:
      'mineral-based machining oils containing halogens (except emulsions and solutions)',
  },
  {
    code: '120107*',
    description:
      'mineral-based machining oils free of halogens (except emulsions and solutions)',
  },
  {
    code: '120108*',
    description: 'machining emulsions and solutions containing halogens',
  },
  {
    code: '120109*',
    description: 'machining emulsions and solutions free of halogens',
  },
  { code: '120110*', description: 'synthetic machining oils' },
  { code: '120112*', description: 'spent waxes and fats' },
  { code: '120113', description: 'welding wastes' },
  {
    code: '120114*',
    description: 'machining sludges containing hazardous substances',
  },
  {
    code: '120115',
    description: 'machining sludges other than those mentioned in 12 01 14',
  },
  {
    code: '120116*',
    description: 'waste blasting material containing hazardous substances',
  },
  {
    code: '120117',
    description:
      'waste blasting material other than those mentioned in 12 01 16',
  },
  {
    code: '120118*',
    description:
      'metal sludge (grinding, honing and lapping sludge) containing oil',
  },
  { code: '120119*', description: 'readily biodegradable machining oil' },
  {
    code: '120120*',
    description:
      'spent grinding bodies and grinding materials containing hazardous substances',
  },
  {
    code: '120121',
    description:
      'spent grinding bodies and grinding materials other than those mentioned in 12 01 20',
  },
  { code: '120199', description: 'wastes not otherwise specified' },
  { code: '120301*', description: 'aqueous washing liquids' },
  { code: '120302*', description: 'steam degreasing wastes' },
  { code: '130101*', description: 'hydraulic oils, containing PCBs' },
  { code: '130104*', description: 'chlorinated emulsions' },
  { code: '130105*', description: 'non-chlorinated emulsions' },
  { code: '130109*', description: 'mineral-based chlorinated hydraulic oils' },
  {
    code: '130110*',
    description: 'mineral based non-chlorinated hydraulic oils',
  },
  { code: '130111*', description: 'synthetic hydraulic oils' },
  { code: '130112*', description: 'readily biodegradable hydraulic oils' },
  { code: '130113*', description: 'other hydraulic oils' },
  {
    code: '130204*',
    description: 'mineral-based chlorinated engine, gear and lubricating oils',
  },
  {
    code: '130205*',
    description:
      'mineral-based non-chlorinated engine, gear and lubricating oils',
  },
  {
    code: '130206*',
    description: 'synthetic engine, gear and lubricating oils',
  },
  {
    code: '130207*',
    description: 'readily biodegradable engine, gear and lubricating oils',
  },
  { code: '130208*', description: 'other engine, gear and lubricating oils' },
  {
    code: '130301*',
    description: 'insulating or heat transmission oils containing PCBs',
  },
  {
    code: '130306*',
    description:
      'mineral-based chlorinated insulating and heat transmission oils other than those mentioned in 13 03 01',
  },
  {
    code: '130307*',
    description:
      'mineral-based non-chlorinated insulating and heat transmission oils',
  },
  {
    code: '130308*',
    description: 'synthetic insulating and heat transmission oils',
  },
  {
    code: '130309*',
    description: 'readily biodegradable insulating and heat transmission oils',
  },
  {
    code: '130310*',
    description: 'other insulating and heat transmission oils',
  },
  { code: '130401*', description: 'bilge oils from inland navigation' },
  { code: '130402*', description: 'bilge oils from jetty sewers' },
  { code: '130403*', description: 'bilge oils from other navigation' },
  {
    code: '130501*',
    description: 'solids from grit chambers and oil/water separators',
  },
  { code: '130502*', description: 'sludges from oil/water separators' },
  { code: '130503*', description: 'interceptor sludges' },
  { code: '130506*', description: 'oil from oil/water separators' },
  { code: '130507*', description: 'oily water from oil/water separators' },
  {
    code: '130508*',
    description:
      'mixtures of wastes from grit chambers and oil/water separators',
  },
  { code: '130701*', description: 'fuel oil and diesel' },
  { code: '130702*', description: 'petrol' },
  { code: '130703*', description: 'other fuels (including mixtures)' },
  { code: '130801*', description: 'desalter sludges or emulsions' },
  { code: '130802*', description: 'other emulsions' },
  { code: '130899*', description: 'wastes not otherwise specified' },
  { code: '140601*', description: 'chlorofluorocarbons, HCFC, HFC' },
  {
    code: '140602*',
    description: 'other halogenated solvents and solvent mixtures',
  },
  { code: '140603*', description: 'other solvents and solvent mixtures' },
  {
    code: '140604*',
    description: 'sludges or solid wastes containing halogenated solvents',
  },
  {
    code: '140605*',
    description: 'sludges or solid wastes containing other solvents',
  },
  { code: '150101', description: 'paper and cardboard packaging' },
  { code: '150102', description: 'plastic packaging' },
  { code: '150103', description: 'wooden packaging' },
  { code: '150104', description: 'metallic packaging' },
  { code: '150105', description: 'composite packaging' },
  { code: '150106', description: 'mixed packaging' },
  { code: '150107', description: 'glass packaging' },
  { code: '150109', description: 'textile packaging' },
  {
    code: '150110*',
    description:
      'packaging containing residues of or contaminated by hazardous substances',
  },
  {
    code: '150111*',
    description:
      'metallic packaging containing a hazardous solid porous matrix (for example asbestos), including empty pressure containers',
  },
  {
    code: '150202*',
    description:
      'absorbents, filter materials (including oil filters not otherwise specified), wiping cloths, protective clothing contaminated by hazardous substances',
  },
  {
    code: '150203',
    description:
      'absorbents, filter materials, wiping cloths and protective clothing other than those mentioned in 15 02 02',
  },
  { code: '160103', description: 'end-of-life tyres' },
  { code: '160104*', description: 'end-of-life vehicles' },
  {
    code: '160106',
    description:
      'end-of-life vehicles, containing neither liquids nor other hazardous components',
  },
  { code: '160107*', description: 'oil filters' },
  { code: '160108*', description: 'components containing mercury' },
  { code: '160109*', description: 'components containing PCBs' },
  {
    code: '160110*',
    description: 'explosive components (for example air bags)',
  },
  { code: '160111*', description: 'brake pads containing asbestos' },
  {
    code: '160112',
    description: 'brake pads other than those mentioned in 16 01 11',
  },
  { code: '160113*', description: 'brake fluids' },
  {
    code: '160114*',
    description: 'antifreeze fluids containing hazardous substances',
  },
  {
    code: '160115',
    description: 'antifreeze fluids other than those mentioned in 16 01 14',
  },
  { code: '160116', description: 'tanks for liquefied gas' },
  { code: '160117', description: 'ferrous metal' },
  { code: '160118', description: 'non-ferrous metal' },
  { code: '160119', description: 'plastic' },
  { code: '160120', description: 'glass' },
  {
    code: '160121*',
    description:
      'hazardous components other than those mentioned in 16 01 07 to 16 01 11 and 16 01 13 and 16 01 14',
  },
  { code: '160122', description: 'components not otherwise specified' },
  { code: '160199', description: 'wastes not otherwise specified' },
  {
    code: '160209*',
    description: 'transformers and capacitors containing PCBs',
  },
  {
    code: '160210*',
    description:
      'discarded equipment containing or contaminated by PCBs other than those mentioned in 16 02 09',
  },
  {
    code: '160211*',
    description:
      'discarded equipment containing chlorofluorocarbons, HCFC, HFC',
  },
  {
    code: '160212*',
    description: 'discarded equipment containing free asbestos',
  },
  {
    code: '160213*',
    description:
      'discarded equipment containing hazardous componentsother than those mentioned in 16 02 09 to 16 02 12',
  },
  {
    code: '160214',
    description:
      'discarded equipment other than those mentioned in 16 02 09 to 16 02 13',
  },
  {
    code: '160215*',
    description: 'hazardous components removed from discarded equipment',
  },
  {
    code: '160216',
    description:
      'components removed from discarded equipment other than those mentioned in 16 02 15',
  },
  {
    code: '160303*',
    description: 'inorganic wastes containing hazardous substances',
  },
  {
    code: '160304',
    description: 'inorganic wastes other than those mentioned in 16 03 03',
  },
  {
    code: '160305*',
    description: 'organic wastes containing hazardous substances',
  },
  {
    code: '160306',
    description: 'organic wastes other than those mentioned in 16 03 05',
  },
  { code: '160307*', description: 'metallic mercury' },
  { code: '160401*', description: 'waste ammunition' },
  { code: '160402*', description: 'fireworks wastes' },
  { code: '160403*', description: 'other waste explosives' },
  {
    code: '160504*',
    description:
      'gases in pressure containers (including halons) containing hazardous substances',
  },
  {
    code: '160505',
    description:
      'gases in pressure containers other than those mentioned in 16 05 04',
  },
  {
    code: '160506*',
    description:
      'laboratory chemicals, consisting of or containing hazardous substances, including mixtures of laboratory chemicals',
  },
  {
    code: '160507*',
    description:
      'discarded inorganic chemicals consisting of or containing hazardous substances',
  },
  {
    code: '160508*',
    description:
      'discarded organic chemicals consisting of or containing hazardous substances',
  },
  {
    code: '160509',
    description:
      'discarded chemicals other than those mentioned in 16 05 06, 16 05 07 or 16 05 08',
  },
  { code: '160601*', description: 'lead batteries' },
  { code: '160602*', description: 'Ni-Cd batteries' },
  { code: '160603*', description: 'mercury-containing batteries' },
  { code: '160604', description: 'alkaline batteries (except 16 06 03)' },
  { code: '160605', description: 'other batteries and accumulators' },
  {
    code: '160606*',
    description:
      'separately collected electrolyte from batteries and accumulators',
  },
  { code: '160708*', description: 'wastes containing oil' },
  {
    code: '160709*',
    description: 'wastes containing other hazardous substances',
  },
  { code: '160799', description: 'wastes not otherwise specified' },
  {
    code: '160801',
    description:
      'spent catalysts containing gold, silver, rhenium, rhodium, palladium, iridium or platinum (except 16 08 07)',
  },
  {
    code: '160802*',
    description:
      'spent catalysts containing hazardous transition metals or hazardous transition metal compounds',
  },
  {
    code: '160803',
    description:
      'spent catalysts containing transition metals or transition metal compounds not otherwise specified',
  },
  {
    code: '160804',
    description: 'spent fluid catalytic cracking catalysts (except 16 08 07)',
  },
  {
    code: '160805*',
    description: 'spent catalysts containing phosphoric acid',
  },
  { code: '160806*', description: 'spent liquids used as catalysts' },
  {
    code: '160807*',
    description: 'spent catalysts contaminated with hazardous substances',
  },
  {
    code: '160901*',
    description: 'permanganates, for example potassium permanganate',
  },
  {
    code: '160902*',
    description:
      'chromates, for example potassium chromate, potassium or sodium dichromate',
  },
  { code: '160903*', description: 'peroxides, for example hydrogen peroxide' },
  {
    code: '160904*',
    description: 'oxidising substances, not otherwise specified',
  },
  {
    code: '161001*',
    description: 'aqueous liquid wastes containing hazardous substances',
  },
  {
    code: '161002',
    description: 'aqueous liquid wastes other than those mentioned in 16 10 01',
  },
  {
    code: '161003*',
    description: 'aqueous concentrates containing hazardous substances',
  },
  {
    code: '161004',
    description: 'aqueous concentrates other than those mentioned in 16 10 03',
  },
  {
    code: '161101*',
    description:
      'carbon-based linings and refractories from metallurgical processes containing hazardous substances',
  },
  {
    code: '161102',
    description:
      'carbon-based linings and refractories from metallurgical processes others than those mentioned in 16 11 01',
  },
  {
    code: '161103*',
    description:
      'other linings and refractories from metallurgical processes containing hazardous substances',
  },
  {
    code: '161104',
    description:
      'other linings and refractories from metallurgical processes other than those mentioned in 16 11 03',
  },
  {
    code: '161105*',
    description:
      'linings and refractories from non-metallurgical processes containing hazardous substances',
  },
  {
    code: '161106',
    description:
      'linings and refractories from non-metallurgical processes others than those mentioned in 16 11 05',
  },
  { code: '170101', description: 'concrete' },
  { code: '170102', description: 'bricks' },
  { code: '170103', description: 'tiles and ceramics' },
  {
    code: '170106*',
    description:
      'mixtures of, or separate fractions of concrete, bricks, tiles and ceramics containing hazardous substances',
  },
  {
    code: '170107',
    description:
      'mixtures of concrete, bricks, tiles and ceramics other than those mentioned in 17 01 06',
  },
  { code: '170201', description: 'wood' },
  { code: '170202', description: 'glass' },
  { code: '170203', description: 'plastic' },
  {
    code: '170204*',
    description:
      'glass, plastic and wood containing or contaminated with hazardous substances',
  },
  { code: '170301*', description: 'bituminous mixtures containing coal tar' },
  {
    code: '170302',
    description: 'bituminous mixtures other than those mentioned in 17 03 01',
  },
  { code: '170303*', description: 'coal tar and tarred products' },
  { code: '170401', description: 'copper, bronze, brass' },
  { code: '170402', description: 'aluminium' },
  { code: '170403', description: 'lead' },
  { code: '170404', description: 'zinc' },
  { code: '170405', description: 'iron and steel' },
  { code: '170406', description: 'tin' },
  { code: '170407', description: 'mixed metals' },
  {
    code: '170409*',
    description: 'metal waste contaminated with hazardous substances',
  },
  {
    code: '170410*',
    description:
      'cables containing oil, coal tar and other hazardous substances',
  },
  {
    code: '170411',
    description: 'cables other than those mentioned in 17 04 10',
  },
  {
    code: '170503*',
    description: 'soil and stones containing hazardous substances',
  },
  {
    code: '170504',
    description: 'soil and stones other than those mentioned in 17 05 03',
  },
  {
    code: '170505*',
    description: 'dredging spoil containing hazardous substances',
  },
  {
    code: '170506',
    description: 'dredging spoil other than those mentioned in 17 05 05',
  },
  {
    code: '170507*',
    description: 'track ballast containing hazardous substances',
  },
  {
    code: '170508',
    description: 'track ballast other than those mentioned in 17 05 07',
  },
  { code: '170601*', description: 'insulation materials containing asbestos' },
  {
    code: '170603*',
    description:
      'other insulation materials consisting of or containing hazardous substances',
  },
  {
    code: '170604',
    description:
      'insulation materials other than those mentioned in 17 06 01 and 17 06 03',
  },
  {
    code: '170605*',
    description: 'construction materials containing asbestos',
  },
  {
    code: '170801*',
    description:
      'gypsum-based construction materials contaminated with hazardous substances',
  },
  {
    code: '170802',
    description:
      'gypsum-based construction materials other than those mentioned in 17 08 01',
  },
  {
    code: '170901*',
    description: 'construction and demolition wastes containing mercury',
  },
  {
    code: '170902*',
    description:
      'construction and demolition wastes containing PCB (for example PCB- containing sealants, PCB-containing resin-based floorings, PCB-containing sealed glazing units, PCB-containing capacitors)',
  },
  {
    code: '170903*',
    description:
      'other construction and demolition wastes (including mixed wastes) containing hazardous substances',
  },
  {
    code: '170904',
    description:
      'mixed construction and demolition wastes other than those mentioned in 17 09 01, 17 09 02 and 17 09 03',
  },
  { code: '180101', description: 'sharps (except 18 01 03)' },
  {
    code: '180102',
    description:
      'body parts and organs including blood bags and blood preserves (except 18 01 03)',
  },
  {
    code: '180103*',
    description:
      'wastes whose collection and disposal is subject to special requirements in order to prevent infection',
  },
  {
    code: '180104',
    description:
      'wastes whose collection and disposal is not subject to special requirements in order to prevent infection (for example dressings, plaster casts, linen, disposable clothing, diapers)',
  },
  {
    code: '180106*',
    description: 'chemicals consisting of or containing hazardous substances',
  },
  {
    code: '180107',
    description: 'chemicals other than those mentioned in 18 01 06',
  },
  { code: '180108*', description: 'cytotoxic and cytostatic medicines' },
  {
    code: '180109',
    description: 'medicines other than those mentioned in 18 01 08',
  },
  { code: '180110*', description: 'amalgam waste from dental care' },
  { code: '180201', description: 'sharps (except 18 02 02)' },
  {
    code: '180202*',
    description:
      'wastes whose collection and disposal is subject to special requirements in order to prevent infection',
  },
  {
    code: '180203',
    description:
      'wastes whose collection and disposal is not subject to special requirements in order to prevent infection',
  },
  {
    code: '180205*',
    description: 'chemicals consisting of or containing hazardous substances',
  },
  {
    code: '180206',
    description: 'chemicals other than those mentioned in 18 02 05',
  },
  { code: '180207*', description: 'cytotoxic and cytostatic medicines' },
  {
    code: '180208',
    description: 'medicines other than those mentioned in 18 02 07',
  },
  { code: '190102', description: 'ferrous materials removed from bottom ash' },
  { code: '190105*', description: 'filter cake from gas treatment' },
  {
    code: '190106*',
    description:
      'aqueous liquid wastes from gas treatment and other aqueous liquid wastes',
  },
  { code: '190107*', description: 'solid wastes from gas treatment' },
  {
    code: '190110*',
    description: 'spent activated carbon from flue-gas treatment',
  },
  {
    code: '190111*',
    description: 'bottom ash and slag containing hazardous substances',
  },
  {
    code: '190112',
    description: 'bottom ash and slag other than those mentioned in 19 01 11',
  },
  { code: '190113*', description: 'fly ash containing hazardous substances' },
  {
    code: '190114',
    description: 'fly ash other than those mentioned in 19 01 13',
  },
  {
    code: '190115*',
    description: 'boiler dust containing hazardous substances',
  },
  {
    code: '190116',
    description: 'boiler dust other than those mentioned in 19 01 15',
  },
  {
    code: '190117*',
    description: 'pyrolysis wastes containing hazardous substances',
  },
  {
    code: '190118',
    description: 'pyrolysis wastes other than those mentioned in 19 01 17',
  },
  { code: '190119', description: 'sands from fluidised beds' },
  { code: '190199', description: 'wastes not otherwise specified' },
  {
    code: '190203',
    description: 'premixed wastes composed only of non-hazardous wastes',
  },
  {
    code: '190204*',
    description: 'premixed wastes composed of at least one hazardous waste',
  },
  {
    code: '190205*',
    description:
      'sludges from physico/chemical treatment containing hazardous substances',
  },
  {
    code: '190206',
    description:
      'sludges from physico/chemical treatment other than those mentioned in 19 02 05',
  },
  { code: '190207*', description: 'oil and concentrates from separation' },
  {
    code: '190208*',
    description: 'liquid combustible wastes containing hazardous substances',
  },
  {
    code: '190209*',
    description: 'solid combustible wastes containing hazardous substances',
  },
  {
    code: '190210',
    description:
      'combustible wastes other than those mentioned in 19 02 08 and 19 02 09',
  },
  {
    code: '190211*',
    description: 'other wastes containing hazardous substances',
  },
  { code: '190299', description: 'wastes not otherwise specified' },
  {
    code: '190304*',
    description:
      'wastes marked as hazardous, partly stabilised other than 19 03 08',
  },
  {
    code: '190305',
    description: 'stabilised wastes other than those mentioned in 19 03 04',
  },
  { code: '190306*', description: 'wastes marked as hazardous, solidified' },
  {
    code: '190307',
    description: 'solidified wastes other than those mentioned in 19 03 06',
  },
  { code: '190308*', description: 'partly stabilised mercury' },
  { code: '190401', description: 'vitrified waste' },
  {
    code: '190402*',
    description: 'fly ash and other flue-gas treatment wastes',
  },
  { code: '190403*', description: 'non-vitrified solid phase' },
  {
    code: '190404',
    description: 'aqueous liquid wastes from vitrified waste tempering',
  },
  {
    code: '190501',
    description: 'non-composted fraction of municipal and similar wastes',
  },
  {
    code: '190502',
    description: 'non-composted fraction of animal and vegetable waste',
  },
  { code: '190503', description: 'off-specification compost' },
  { code: '190599', description: 'wastes not otherwise specified' },
  {
    code: '190603',
    description: 'liquor from anaerobic treatment of municipal waste',
  },
  {
    code: '190604',
    description: 'digestate from anaerobic treatment of municipal waste',
  },
  {
    code: '190605',
    description:
      'liquor from anaerobic treatment of animal and vegetable waste',
  },
  {
    code: '190606',
    description:
      'digestate from anaerobic treatment of animal and vegetable waste',
  },
  { code: '190699', description: 'wastes not otherwise specified' },
  {
    code: '190702*',
    description: 'landfill leachate containing hazardous substances',
  },
  {
    code: '190703',
    description: 'landfill leachate other than those mentioned in 19 07 02',
  },
  { code: '190801', description: 'screenings' },
  { code: '190802', description: 'waste from desanding' },
  {
    code: '190805',
    description: 'sludges from treatment of urban waste water',
  },
  { code: '190806*', description: 'saturated or spent ion exchange resins' },
  {
    code: '190807*',
    description: 'solutions and sludges from regeneration of ion exchangers',
  },
  {
    code: '190808*',
    description: 'membrane system waste containing heavy metals',
  },
  {
    code: '190809',
    description:
      'grease and oil mixture from oil/water separation containing only edible oil and fats',
  },
  {
    code: '190810*',
    description:
      'grease and oil mixture from oil/water separation other than those mentioned in 19 08 09',
  },
  {
    code: '190811*',
    description:
      'sludges containing hazardous substances from biological treatment of industrial waste water',
  },
  {
    code: '190812',
    description:
      'sludges from biological treatment of industrial waste water other than those mentioned in 19 08 11',
  },
  {
    code: '190813*',
    description:
      'sludges containing hazardous substances from other treatment of industrial waste water',
  },
  {
    code: '190814',
    description:
      'sludges from other treatment of industrial waste water other than those mentioned in 19 08 13',
  },
  { code: '190899', description: 'wastes not otherwise specified' },
  {
    code: '190901',
    description: 'solid waste from primary filtration and screenings',
  },
  { code: '190902', description: 'sludges from water clarification' },
  { code: '190903', description: 'sludges from decarbonation' },
  { code: '190904', description: 'spent activated carbon' },
  { code: '190905', description: 'saturated or spent ion exchange resins' },
  {
    code: '190906',
    description: 'solutions and sludges from regeneration of ion exchangers',
  },
  { code: '190999', description: 'wastes not otherwise specified' },
  { code: '191001', description: 'iron and steel waste' },
  { code: '191002', description: 'non-ferrous waste' },
  {
    code: '191003*',
    description:
      'fluff-light fraction and dust containing hazardous substances',
  },
  {
    code: '191004',
    description:
      'fluff-light fraction and dust other than those mentioned in 19 10 03',
  },
  {
    code: '191005*',
    description: 'other fractions containing hazardous substances',
  },
  {
    code: '191006',
    description: 'other fractions other than those mentioned in 19 10 05',
  },
  { code: '191101*', description: 'spent filter clays' },
  { code: '191102*', description: 'acid tars' },
  { code: '191103*', description: 'aqueous liquid wastes' },
  { code: '191104*', description: 'wastes from cleaning of fuel with bases' },
  {
    code: '191105*',
    description:
      'sludges from on-site effluent treatment containing hazardous substances',
  },
  {
    code: '191106',
    description:
      'sludges from on-site effluent treatment other than those mentioned in 19 11 05',
  },
  { code: '191107*', description: 'wastes from flue-gas cleaning' },
  { code: '191199', description: 'wastes not otherwise specified' },
  { code: '191201', description: 'paper and cardboard' },
  { code: '191202', description: 'ferrous metal' },
  { code: '191203', description: 'non-ferrous metal' },
  { code: '191204', description: 'plastic and rubber' },
  { code: '191205', description: 'glass' },
  { code: '191206*', description: 'wood containing hazardous substances' },
  { code: '191207', description: 'wood other than that mentioned in 19 12 06' },
  { code: '191208', description: 'textiles' },
  { code: '191209', description: 'minerals (for example sand, stones)' },
  { code: '191210', description: 'combustible waste (refuse derived fuel)' },
  {
    code: '191211*',
    description:
      'other wastes (including mixtures of materials) from mechanical treatment of waste containing hazardous substances',
  },
  {
    code: '191212',
    description:
      'other wastes (including mixtures of materials) from mechanical treatment of wastes other than those mentioned in 19 12 11',
  },
  {
    code: '191301*',
    description:
      'solid wastes from soil remediation containing hazardous substances',
  },
  {
    code: '191302',
    description:
      'solid wastes from soil remediation other than those mentioned in 19 13 01',
  },
  {
    code: '191303*',
    description:
      'sludges from soil remediation containing hazardous substances',
  },
  {
    code: '191304',
    description:
      'sludges from soil remediation other than those mentioned in 19 13 03',
  },
  {
    code: '191305*',
    description:
      'sludges from groundwater remediation containing hazardous substances',
  },
  {
    code: '191306',
    description:
      'sludges from groundwater remediation other than those mentioned in 19 13 05',
  },
  {
    code: '191307*',
    description:
      'aqueous liquid wastes and aqueous concentrates from groundwater remediation containing hazardous substances',
  },
  {
    code: '191308',
    description:
      'aqueous liquid wastes and aqueous concentrates from groundwater remediation other than those mentioned in 19 13 07',
  },
  { code: '200101', description: 'paper and cardboard' },
  { code: '200102', description: 'glass' },
  { code: '200108', description: 'biodegradable kitchen and canteen waste' },
  { code: '200110', description: 'clothes' },
  { code: '200111', description: 'textiles' },
  { code: '200113*', description: 'solvents' },
  { code: '200114*', description: 'acids' },
  { code: '200115*', description: 'alkalines' },
  { code: '200117*', description: 'photochemicals' },
  { code: '200119*', description: 'pesticides' },
  {
    code: '200121*',
    description: 'fluorescent tubes and other mercury-containing waste',
  },
  {
    code: '200123*',
    description: 'discarded equipment containing chlorofluorocarbons',
  },
  { code: '200125', description: 'edible oil and fat' },
  {
    code: '200126*',
    description: 'oil and fat other than those mentioned in 20 01 25',
  },
  {
    code: '200127*',
    description:
      'paint, inks, adhesives and resins containing hazardous substances',
  },
  {
    code: '200128',
    description:
      'paint, inks, adhesives and resins other than those mentioned in 20 01 27',
  },
  {
    code: '200129*',
    description: 'detergents containing hazardous substances',
  },
  {
    code: '200130',
    description: 'detergents other than those mentioned in 20 01 29',
  },
  { code: '200131*', description: 'cytotoxic and cytostatic medicines' },
  {
    code: '200132',
    description: 'medicines other than those mentioned in 20 01 31',
  },
  {
    code: '200133*',
    description:
      'batteries and accumulators included in 16 06 01, 16 06 02 or 16 06 03 and unsorted batteries and accumulators containing these batteries',
  },
  {
    code: '200134',
    description:
      'batteries and accumulators other than those mentioned in 20 01 33',
  },
  {
    code: '200135*',
    description:
      'discarded electrical and electronic equipment other than those mentioned in 20 01 21 and 20 01 23 containing hazardous components',
  },
  {
    code: '200136',
    description:
      'discarded electrical and electronic equipment other than those mentioned in 20 01 21, 20 01 23 and 20 01 35',
  },
  { code: '200137*', description: 'wood containing hazardous substances' },
  { code: '200138', description: 'wood other than that mentioned in 20 01 37' },
  { code: '200139', description: 'plastics' },
  { code: '200140', description: 'metals' },
  { code: '200141', description: 'wastes from chimney sweeping' },
  { code: '200199', description: 'other fractions not otherwise specified' },
  { code: '200201', description: 'biodegradable waste' },
  { code: '200202', description: 'soil and stones' },
  { code: '200203', description: 'other non-biodegradable wastes' },
  { code: '200301', description: 'mixed municipal waste' },
  { code: '200302', description: 'waste from markets' },
  { code: '200303', description: 'street-cleaning residues' },
  { code: '200304', description: 'septic tank sludge' },
  { code: '200306', description: 'waste from sewage cleaning' },
  { code: '200307', description: 'bulky waste' },
  { code: '200399', description: 'municipal wastes not otherwise specified' },
];
export { ewcCodes };
