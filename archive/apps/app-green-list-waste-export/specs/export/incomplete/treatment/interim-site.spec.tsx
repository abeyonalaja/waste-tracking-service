import React from 'react';
import { render, act, screen, fireEvent } from 'jest-utils';
import InterimSite from 'pages/incomplete/treatment/interim-site';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '9be973f2-63dc-43b3-a32a-6725350a9dce' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

const defaultJsonResponse = {
  status: 'Started',
  values: [{ id: '9be973f2-63dc-43b3-a32a-6725350a9dce' }],
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
    if (
      _url.includes(
        '/submissions/9be973f2-63dc-43b3-a32a-6725350a9dce/recovery-facility',
      )
    ) {
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

describe('Interim site pages', () => {
  it('should render the page', async () => {
    await act(async () => {
      render(<InterimSite />);
    });
  });
  it('should render view and show validation message if no content is entered', async () => {
    await act(async () => {
      render(<InterimSite />);
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorMessage = screen.getAllByText(
      'Select yes if the waste will go to an interim site',
    )[0];
    expect(errorMessage).toBeTruthy();
  });
});
