import { render, screen, fireEvent } from '@testing-library/react';
import { NoResults } from './_NoResults';

interface MockPage {
  children: React.ReactNode;
}

jest.mock('@wts/ui/shared-ui/server', () => ({
  Page: ({ children }: MockPage) => <div>{children}</div>,
}));

const mockUpdateFormValues = jest.fn();
const mockUpdateView = jest.fn();

const defaultProps = {
  noResultsContent: <div>No Results Content</div>,
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
};

describe('No address found page', () => {
  it('renders no results content', () => {
    render(<NoResults {...defaultProps} />);
    expect(screen.getByText('No Results Content')).toBeTruthy();
  });

  it('displays correct message with postcode and building name or number', () => {
    render(<NoResults {...defaultProps} />);
    expect(
      screen.getByText(
        'Address not found AA1 1AA and Building. Enter the address manually',
      ),
    ).toBeTruthy();
  });

  it('displays correct message with only postcode', () => {
    render(
      <NoResults
        {...defaultProps}
        formValues={{ ...defaultProps.formValues, buildingNameOrNumber: '' }}
      />,
    );
    expect(
      screen.getByText('Address not found AA1 1AA. Enter the address manually'),
    ).toBeTruthy();
  });

  it('calls updateFormValues and updateView on search again click', () => {
    render(<NoResults {...defaultProps} />);
    fireEvent.click(screen.getByText('Search again'));
    expect(mockUpdateFormValues).toHaveBeenCalledWith({
      postcode: '',
      buildingNameOrNumber: '',
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      country: '',
      addressSelection: '',
    });
    expect(mockUpdateView).toHaveBeenCalledWith('search');
  });

  it('calls updateFormValues and updateView on enter manually click', () => {
    render(<NoResults {...defaultProps} />);
    fireEvent.click(screen.getByText('Enter the address manually'));
    expect(mockUpdateFormValues).toHaveBeenCalledWith({
      postcode: '',
      buildingNameOrNumber: '',
      addressLine1: '',
      addressLine2: '',
      townCity: '',
      country: '',
      addressSelection: '',
    });
    expect(mockUpdateView).toHaveBeenCalledWith('manual');
  });
});
