import React from 'react';
import { render, fireEvent, screen, act } from 'jest-utils';
import EwcCodes from 'pages/incomplete/about/ewc-code';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: { id: '123' },
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

const defaultJsonResponse = { status: 'NotStarted' };
const startedJsonResponse = {
  status: 'Started',
  wasteCode: {
    type: 'AnnexIIIA',
    code: 'B1010 and B1050',
  },
  ewcCodes: [
    {
      code: '010101',
    },
  ],
};
const refDataResponse = [
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
];

function setupFetchStub(started = false) {
  return function fetchStub(_url) {
    let data = {};
    if (_url.includes('/reference-data/ewc-codes')) {
      data = refDataResponse;
    }
    if (_url.includes('/submissions/123/waste-description')) {
      data = defaultJsonResponse;
    }
    if (_url.includes('/submissions/123/waste-description') && started) {
      data = startedJsonResponse;
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

describe('EWC code page', () => {
  it('should display the page', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });
  });

  it('should show validation message if no radio is selected', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const pageTitle = screen.getByText(
      'What is the first European Waste Catalogue (EWC) code?'
    );
    expect(pageTitle).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if no EWC code is entered', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.click(ewcCode);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show validation message if only 4 chars entered for EWC code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByLabelText('Enter code');
    fireEvent.change(ewcCode, { target: { value: '0101' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show list page if EWC codes are returned from the API', async () => {
    global.fetch = jest.fn().mockImplementation(setupFetchStub(true));

    await act(async () => {
      render(<EwcCodes />);
    });

    const ewcCode = screen.getByText('01 01 01');
    expect(ewcCode).toBeTruthy();

    const pageTitle = screen.getByText(
      'You have added 1 European Waste Catalogue (EWC) code'
    );
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation message if selected YES to additional EWC code and do not enter a code', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const yesRadio = screen.getByLabelText('Yes');
    fireEvent.click(yesRadio);

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();
  });

  it('should show confirm view when remove link is clicked', async () => {
    await act(async () => {
      render(<EwcCodes />);
    });

    const removeLink = screen.getByText('Remove');
    fireEvent.click(removeLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to remove code: 01 01 01?'
    );
    expect(pageTitle).toBeTruthy();
  });
});
