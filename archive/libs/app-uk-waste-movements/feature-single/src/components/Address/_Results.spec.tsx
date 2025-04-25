import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Results } from './_Results';

interface MockPage {
  children: React.ReactNode;
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@wts/ui/shared-ui/server', () => ({
  Page: ({ children }: MockPage) => <div>{children}</div>,
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

window.scrollTo = jest.fn();

const mockUpdateFormValues = jest.fn();
const mockUpdateView = jest.fn();

const defaultProps = {
  id: 'mock-id',
  token: 'mock-token',
  resultsContent: <div>Results Content</div>,
  formValues: {
    postcode: 'AA1 1AA',
    buildingNameOrNumber: '',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
    addressSelection: '',
  },
  addressData: [
    {
      text: '123 Street, City, AA1 1AA',
      value: '123 Street, City, AA1 1AA',
    },
  ],
  updateView: mockUpdateView,
  updateFormValues: mockUpdateFormValues,
  content: {
    inputLabel: '',
    inputHint: '',
    buildingNameLabel: '',
    buildingNameHint: '',
    addressLine1Label: '',
    addressLine1Hint: '',
    addressLine2Label: '',
    addressLine2Hint: '',
    townCityLabel: '',
    postcodeLabel: '',
    countryLabel: '',
    button: '',
    buttonSave: 'Save and continue',
    manualLink: '',
    manualLinkShort: 'Enter the address manually',
    searchAgain: 'Search again',
    legend: 'Select an address',
    buttonSecondary: 'Save and return',
    notFound: 'Address not found',
    notFoundPrompt: 'Enter the address manually',
    addressFound: 'Address found',
    addressesFound: 'Addresses found',
    useAddress: 'Use this address and continue',
    useDifferentAddress: 'Use a different address',
  },
  apiPartial: '/producer-address',
  section: 'Producer',
};

describe('Address search results page', () => {
  it('renders results content', () => {
    render(<Results {...defaultProps} />);
    expect(screen.getByText('Results Content')).toBeInTheDocument();
  });

  it('displays correct number of addresses found', () => {
    render(<Results {...defaultProps} />);
    expect(screen.getByText('1 Address found AA1 1AA.')).toBeInTheDocument();
  });

  it('calls updateView on search again link click', () => {
    render(<Results {...defaultProps} />);
    fireEvent.click(screen.getByText('Search again'));
    expect(mockUpdateView).toHaveBeenCalledWith('search');
  });

  it('calls updateView on enter manually link click', () => {
    render(<Results {...defaultProps} />);
    fireEvent.click(screen.getByText('Enter the address manually'));
    expect(mockUpdateView).toHaveBeenCalledWith('manual');
  });

  it('calls updateView on form submit without errors', () => {
    render(
      <Results
        {...defaultProps}
        formValues={{
          ...defaultProps.formValues,
          addressSelection: '123 Street, City, AA1 1AA',
        }}
      />,
    );
    fireEvent.submit(screen.getByText('Save and continue'));
    expect(mockUpdateView).toHaveBeenCalledWith('confirm');
  });
});
