import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Confirm } from './_Confirm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ id: '1234' }),
  }),
) as jest.Mock;

interface MockPage {
  children: React.ReactNode;
}

jest.mock('@wts/ui/shared-ui/server', () => ({
  Page: ({ children }: MockPage) => <div>{children}</div>,
}));

jest.mock('./formatAddress');

const mockUpdateFormValues = jest.fn();
const mockUpdateView = jest.fn();

const defaultProps = {
  token: 'mock-token',
  id: 'mock-id',
  confirmationContent: <div>Confirmation Content</div>,
  formValues: {
    postcode: 'AA1 1AA',
    buildingNameOrNumber: 'Building',
    addressLine1: '',
    addressLine2: '',
    townCity: '',
    country: '',
    addressSelection: '{}',
  },
  addressData: undefined,
  updateFormValues: mockUpdateFormValues,
  updateView: mockUpdateView,
};

describe('Confirm address screen', () => {
  it('renders confirmation content', () => {
    render(<Confirm {...defaultProps} />);
    expect(screen.getByText('Confirmation Content')).toBeInTheDocument();
  });

  it('renders buttons with correct text', () => {
    render(<Confirm {...defaultProps} />);
    expect(
      screen.getByText('Use this address and continue'),
    ).toBeInTheDocument();
    expect(screen.getByText('Save and return')).toBeInTheDocument();
  });

  it('renders "Use a different address" link', () => {
    render(<Confirm {...defaultProps} />);
    expect(screen.getByText('Use a different address')).toBeInTheDocument();
  });

  it('calls updateView on "Use a different address" link being clicked', async () => {
    render(<Confirm {...defaultProps} />);
    fireEvent.click(screen.getByText('Use a different address'));
    expect(mockUpdateView).toHaveBeenCalledWith('search');
  });

  it('does not render address summary section if addressData is undefined', () => {
    render(<Confirm {...defaultProps} addressData={undefined} />);
    expect(
      screen.queryByText('1 address found for AA1 1AA.'),
    ).not.toBeInTheDocument();
  });
});
