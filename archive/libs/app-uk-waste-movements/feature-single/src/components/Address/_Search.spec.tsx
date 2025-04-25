import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Search } from './_Search';
import { ukwm } from '@wts/util/shared-validation';

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
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

const mockUpdateFormValues = jest.fn();
const mockUpdateView = jest.fn();
const mockUpdateAddressData = jest.fn();

const defaultProps = {
  token: 'mock-token',
  searchContent: <div>Search Content</div>,
  formValues: {
    postcode: 'AA1 1AA',
    buildingNameOrNumber: 'Building',
    addressSelection: '',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
  },
  updateFormValues: mockUpdateFormValues,
  updateView: mockUpdateView,
  updateAddressData: mockUpdateAddressData,
  content: {
    inputLabel: 'Postcode',
    inputHint: 'Enter your postcode',
    buildingNameLabel: 'Building Name or Number',
    buildingNameHint: 'Enter the building name or number',
    button: 'Search',
    buttonSecondary: 'Save and return',
    manualLink: 'Enter the address manually',
    addressLine1Label: '',
    addressLine1Hint: '',
    addressLine2Label: '',
    addressLine2Hint: '',
    townCityLabel: '',
    postcodeLabel: '',
    countryLabel: '',
    buttonSave: 'Save and continue',
    manualLinkShort: 'Enter the address manually',
    searchAgain: 'Search again',
    legend: 'Select an address',
    notFound: 'Address not found',
    notFoundPrompt: 'Address not found',
    addressFound: 'Select an address',
    addressesFound: 'Select an address',
    useAddress: 'Use this address',
    useDifferentAddress: 'Use a different address',
  },
  section: 'Producer' as ukwm.Section,
};

describe('Address postcode search page', () => {
  it('renders search content', () => {
    render(<Search {...defaultProps} />);
    expect(screen.getByText('Search Content')).toBeInTheDocument();
  });

  it('displays error summary when form has errors', async () => {
    render(
      <Search
        {...defaultProps}
        formValues={{
          ...defaultProps.formValues,
          postcode: '',
          buildingNameOrNumber: '',
        }}
      />,
    );
    fireEvent.submit(screen.getByText('Search'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('calls updateView on manual link click', () => {
    render(<Search {...defaultProps} />);
    fireEvent.click(screen.getByText('Enter the address manually'));
    expect(mockUpdateView).toHaveBeenCalledWith('manual');
  });

  it('calls updateFormValues on input change', () => {
    render(<Search {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Postcode'), {
      target: { value: 'BB2 2BB' },
    });
    expect(mockUpdateFormValues).toHaveBeenCalledWith({
      ...defaultProps.formValues,
      postcode: 'BB2 2BB',
    });
  });
});
