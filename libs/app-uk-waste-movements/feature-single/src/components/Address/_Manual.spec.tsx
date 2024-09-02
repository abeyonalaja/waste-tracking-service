import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Manual } from './_Manual';
import { ukwm } from '@wts/util/shared-validation';

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
const mockRouterPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

const defaultProps = {
  id: 'mock-id',
  token: 'mock-token',
  manualContent: <div>Manual Content</div>,
  formValues: {
    postcode: 'AA1 1AA',
    buildingNameOrNumber: 'Building',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
    addressSelection: '',
  },
  updateFormValues: mockUpdateFormValues,
  updateView: mockUpdateView,
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
    notFoundPrompt: 'Enter the address manually',
    addressFound: 'Address found',
    addressesFound: 'Addresses found',
    useAddress: 'Use this address and continue',
    useDifferentAddress: 'Use a different address',
  },
  mode: undefined,
  apiPartial: '/producer-address',
  section: 'Producer' as ukwm.Section,
};

window.scrollTo = jest.fn();

describe('Manual address form', () => {
  it('renders manual content', () => {
    render(<Manual {...defaultProps} />);
    expect(screen.getByText('Manual Content')).toBeInTheDocument();
  });

  it('calls updateFormValues on input change', () => {
    render(<Manual {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Postcode'), {
      target: { value: 'BB2 2BB' },
    });
    expect(mockUpdateFormValues).toHaveBeenCalledWith({
      ...defaultProps.formValues,
      postcode: 'BB2 2BB',
    });
  });

  it('displays error summary when form has errors', async () => {
    render(
      <Manual
        {...defaultProps}
        formValues={{
          ...defaultProps.formValues,
          postcode: '',
          buildingNameOrNumber: '',
        }}
      />,
    );
    fireEvent.click(screen.getByText('Save and continue'));
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('calls updateView with confirm when form is valid', async () => {
    render(
      <Manual
        {...defaultProps}
        formValues={{
          ...defaultProps.formValues,
          addressLine1: '123 Street',
          townCity: 'City',
          country: 'England',
        }}
      />,
    );
    fireEvent.click(screen.getByText('Save and continue'));
    expect(mockUpdateView).toHaveBeenCalledWith('confirm');
  });
});
