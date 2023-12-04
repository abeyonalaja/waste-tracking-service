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
        country: 'Afghanistan',
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
    description: 'Use principally as a fuel or other means to generate energy',
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

function setupFetchStub() {
  return function fetchStub(_url) {
    let data = {};
    if (_url.includes('/wts-info/recovery-codes?language=en')) {
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
