import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AddressSearch } from './AddressSearch';
import { ukwm } from '@wts/util/shared-validation';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}));

interface MockPage {
  children: React.ReactNode;
}

jest.mock('@wts/ui/shared-ui/server', () => ({
  Page: ({ children }: MockPage) => <div>{children}</div>,
}));

const defaultProps = {
  defaultView: 'search',
  searchContent: <div>Search Content</div>,
  resultsContent: <div>Results Content</div>,
  noResultsContent: <div>No Results Content</div>,
  confirmationContent: <div>Confirmation Content</div>,
  manualContent: <div>Manual Content</div>,
  editContent: <div>Edit Content</div>,
  token: 'mock-token',
  content: {
    buildingNameLabel: 'Building Name or Number',
    buildingNameHint: 'Enter the building name or number',
    addressLine1Label: 'Address Line 1',
    addressLine1Hint: 'Enter the first line of the address',
    addressLine2Label: 'Address Line 2',
    addressLine2Hint: 'Enter the second line of the address',
    townCityLabel: 'Town/City',
    postcodeLabel: 'Postcode',
    buttonSave: 'Save and continue',
    buttonSecondary: 'Save and return',
    inputLabel: 'Postcode',
    inputHint: 'Enter your postcode',
    button: 'Search',
    manualLink: 'Enter the address manually',
    countryLabel: 'Country',
    manualLinkShort: 'Enter the address manually',
    searchAgain: 'Search again',
    legend: 'Select an address',
    notFound: 'Address not found',
    notFoundPrompt: 'Please enter the address manually',
    addressFound: 'Address found',
    addressesFound: 'Addresses found',
    useAddress: 'Use this address',
    useDifferentAddress: 'Use a different address',
  },
  id: 'mock-id',
  savedFormValues: {
    postcode: 'AA1 1AA',
    buildingNameOrNumber: 'Building',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
    addressSelection: '',
  },
  apiPartial: '/producer-address',
  destination: '/producer/contact',
  section: 'Producer' as ukwm.Section,
};

describe('Address parent component', () => {
  it('renders search view by default', () => {
    render(<AddressSearch {...defaultProps} defaultView="search" />);
    expect(screen.getByText('Search Content')).toBeInTheDocument();
  });

  it('renders results view when view is set to results', () => {
    render(<AddressSearch {...defaultProps} defaultView="results" />);
    expect(screen.getByText('Results Content')).toBeInTheDocument();
  });

  it('renders no results view when view is set to noResults', () => {
    render(<AddressSearch {...defaultProps} defaultView="noResults" />);
    expect(screen.getByText('No Results Content')).toBeInTheDocument();
  });

  it('renders confirmation view when view is set to confirm', () => {
    render(<AddressSearch {...defaultProps} defaultView="confirm" />);
    expect(screen.getByText('Confirmation Content')).toBeInTheDocument();
  });

  it('renders manual view when view is set to manual', () => {
    render(<AddressSearch {...defaultProps} defaultView="manual" />);
    expect(screen.getByText('Manual Content')).toBeInTheDocument();
  });

  it('renders edit view when view is set to edit', () => {
    render(<AddressSearch {...defaultProps} defaultView="edit" />);
    expect(screen.getByText('Edit Content')).toBeInTheDocument();
  });
});
