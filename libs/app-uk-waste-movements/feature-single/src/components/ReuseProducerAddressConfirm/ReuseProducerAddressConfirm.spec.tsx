import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ReuseProducerAddressConfirm } from './ReuseProducerAddressConfirm';

const formStrings = {
  buttonOne: 'Use this address and continue',
  buttonTwo: 'Save and return',
};

window.scrollTo = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

const mockAddress = {
  addressLine1: '1 Fake Street',
  addressLine2: 'Test Town',
  townCity: 'Testington',
  postcode: 'TE1 1ST',
  country: 'United Kingdom',
};

describe('ReuseProducerAddressConfirm', () => {
  it('renders with primary button and correct text content', () => {
    render(
      <ReuseProducerAddressConfirm
        id="123"
        token="ABC"
        formStrings={formStrings}
        address={mockAddress}
      />,
    );

    const saveAndContinueButton = screen.getByRole('button', {
      name: 'Use this address and continue',
    });

    expect(saveAndContinueButton).toBeInTheDocument();
  });

  it('renders with secondary button and correct text content', () => {
    render(
      <ReuseProducerAddressConfirm
        id="123"
        token="ABC"
        formStrings={formStrings}
        address={mockAddress}
      />,
    );

    const saveAndReturnButton = screen.getByRole('button', {
      name: 'Save and return',
    });

    expect(saveAndReturnButton).toBeInTheDocument();
  });
});
