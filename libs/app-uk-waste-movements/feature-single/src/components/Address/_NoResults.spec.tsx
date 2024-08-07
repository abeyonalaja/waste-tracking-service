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
        'We could not find an address that matches AA1 1AA and Building. You can search again or enter the address manually.',
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
      screen.getByText(
        'We could not find an address that matches AA1 1AA. You can search again or enter the address manually.',
      ),
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
