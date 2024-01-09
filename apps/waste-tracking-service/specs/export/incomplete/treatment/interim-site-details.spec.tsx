import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import InterimSiteDetails from 'pages/export/incomplete/treatment/interim-site-details';

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
  values: [
    {
      id: '12345',
      addressDetails: {
        country: 'Afghanistan (AF)',
      },
      recoveryFacilityType: {
        type: 'InterimSite',
        recoveryCode: '',
      },
    },
  ],
};
const refDataResponse = [
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
];

function setupFetchStub() {
  return function fetchStub(_url) {
    let data = {};
    if (_url.includes('/reference-data/recovery-codes')) {
      data = refDataResponse;
    }
    if (_url.includes('/submissions/123/recovery-facility')) {
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

const CountrySelectorMock = ({ id, name, label, value, error, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      {error && <span>{error}</span>}
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

jest.mock('components/CountrySelector', () => ({
  CountrySelector: CountrySelectorMock,
}));

describe('Interim site pages', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });
  });
  it('should render address view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });

    const addressField = screen.getByLabelText('Address');
    expect(addressField).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Enter the interim site details'
    )[0];
    expect(errorMessage).toBeTruthy();
  });

  it('should render contact details view', async () => {
    await act(async () => {
      render(<InterimSiteDetails />);
    });

    const siteName = screen.getByLabelText('Interim site name');
    const address = screen.getByLabelText('Address');

    await act(async () => {
      fireEvent.change(siteName, { target: { value: 'site name' } });
      fireEvent.change(address, { target: { value: 'address' } });
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    await act(async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          json: () =>
            Promise.resolve({
              status: 'Started',
              values: [
                {
                  id: '123',
                  addressDetails: {
                    name: 'site name',
                    address: 'address',
                    country: 'England',
                  },
                },
              ],
            }),
        })
      );
    });

    expect(
      await screen.getByText('What are the interim site’s contact details?')
    ).toBeTruthy();
  });
});
