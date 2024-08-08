import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Submission } from './Submission';
import { UkwmDraft } from '@wts/api/waste-tracking-gateway';

const mockData: UkwmDraft = {
  id: '12345',
  wasteInformation: {
    status: 'Complete',
    wasteTypes: [
      {
        ewcCode: '01 01 01',
        wasteDescription: 'Waste description 1',
        physicalForm: 'Solid',
        wasteQuantityType: 'EstimateData',
        wasteQuantity: 1000,
        quantityUnit: 'Kilogram',
        chemicalAndBiologicalComponents: [
          { name: 'Component 1', concentration: 50, concentrationUnit: '%' },
        ],
        hasHazardousProperties: true,
        hazardousWasteCodes: [{ code: 'H1', name: 'Explosive' }],
        containsPops: true,
        pops: [{ name: 'POP 1', concentration: 10, concentrationUnit: '%' }],
      },
    ],
    wasteTransportation: {
      numberAndTypeOfContainers: '5 containers',
      specialHandlingRequirements: 'Handle with care',
    },
  },
  producerAndCollection: {
    status: 'Complete',
    producer: {
      reference: 'test ref',
      contact: {
        status: 'Complete',
        organisationName: 'Producer Org',
        name: 'Producer Name',
        email: 'producer@example.com',
        phone: '1234567890',
      },
      address: {
        status: 'Complete',
        addressLine1: '123 Street',
        townCity: 'City',
        postcode: 'AB12 3CD',
        country: 'Country',
      },
      sicCode: 'SIC1234',
    },
    wasteCollection: {
      expectedWasteCollectionDate: {
        day: '01',
        month: '01',
        year: '2024',
      },
      address: {
        status: 'Complete',
        addressLine1: '456 Avenue',
        townCity: 'Town',
        postcode: 'CD34 5EF',
        country: 'Country',
      },
      localAuthority: 'Local Authority',
      wasteSource: {
        status: 'Complete',
        value: 'Waste Source',
      },
      brokerRegistrationNumber: 'BRN12345',
    },
  },
  carrier: {
    status: 'Complete',
    value: {
      contact: {
        organisationName: 'Carrier Org',
        name: 'Carrier Name',
        email: 'carrier@example.com',
        phone: '1234567891',
      },
      address: {
        addressLine1: '121 Lane',
        townCity: 'Waste City',
        postcode: 'ZZ12 8HQ',
        country: 'Republic of Waste',
      },
    },
  },
  receiver: {
    status: 'Complete',
    value: {
      authorizationType: 'Permit',
      environmentalPermitNumber: 'Permit123',
      contact: {
        organisationName: 'Receiver Org',
        name: 'Receiver Name',
        email: 'receiver@example.com',
        phone: '0987654321',
      },
      address: {
        addressLine1: '789 Boulevard',
        townCity: 'Village',
        postcode: 'EF56 7GH',
        country: 'Country',
      },
    },
  },
  declaration: {
    status: 'Complete',
    value: {
      declarationTimestamp: new Date(),
      transactionId: 'WM2405_FDF4428F',
    },
  },
  state: {
    status: 'SubmittedWithEstimates',
    timestamp: new Date(),
  },
};

describe('Submission component', () => {
  it('renders correctly with provided data', () => {
    render(<Submission data={mockData} />);

    expect(
      screen.getByText('Your reference: WM2405_FDF4428F'),
    ).toBeInTheDocument();
    expect(screen.getByText('Waste movement record')).toBeInTheDocument();
    expect(screen.getByText('About the waste')).toBeInTheDocument();
    expect(
      screen.getByText('Producer and collection details'),
    ).toBeInTheDocument();
    expect(screen.getByText('Receiver details')).toBeInTheDocument();
  });

  it('toggles sections correctly', () => {
    render(<Submission data={mockData} />);

    const aboutWasteButton = screen.getByLabelText('About the waste');
    const producerCollectorButton = screen.getByLabelText(
      'Producer and collection details',
    );
    const receiverDetailsButton = screen.getByLabelText('Receiver details');

    // Initially all sections should be expanded
    expect(aboutWasteButton).toHaveAttribute('aria-expanded', 'true');
    expect(producerCollectorButton).toHaveAttribute('aria-expanded', 'true');
    expect(receiverDetailsButton).toHaveAttribute('aria-expanded', 'true');

    // Toggle the 'About the waste' section
    fireEvent.click(aboutWasteButton);
    expect(aboutWasteButton).toHaveAttribute('aria-expanded', 'false');

    // Toggle the 'Producer and collection details' section
    fireEvent.click(producerCollectorButton);
    expect(producerCollectorButton).toHaveAttribute('aria-expanded', 'false');

    // Toggle the 'Receiver details' section
    fireEvent.click(receiverDetailsButton);
    expect(receiverDetailsButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders waste information correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('EWC 01 01 01')).toBeInTheDocument();
    expect(screen.getByText('Waste description')).toBeInTheDocument();
    expect(screen.getByText('Physical form')).toBeInTheDocument();
    expect(screen.getByText('Solid')).toBeInTheDocument();
    expect(screen.getByText('Waste quantity')).toBeInTheDocument();
    expect(screen.getByText('Estimated')).toBeInTheDocument();
    expect(screen.getByText('1000kg')).toBeInTheDocument();
    expect(
      screen.getByText('Chemical and biological components of waste'),
    ).toBeInTheDocument();
    expect(screen.getByText('50% Component 1')).toBeInTheDocument();
  });

  it('renders producer and collection details correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Producer organisation name')).toBeInTheDocument();
    expect(screen.getByText('Producer Org')).toBeInTheDocument();
    expect(screen.getByText('Producer address')).toBeInTheDocument();
    expect(screen.getByText(/123 Street/)).toBeInTheDocument();
    expect(screen.getByText('Producer contact name')).toBeInTheDocument();
    expect(screen.getByText('Producer Name')).toBeInTheDocument();
    expect(
      screen.getByText('Producer contact email address'),
    ).toBeInTheDocument();
    // expect(screen.getByText(/producer@example.com/)).toBeInTheDocument();
    expect(
      screen.getByText('Producer contact phone number'),
    ).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('renders receiver details correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Receiver organisation name')).toBeInTheDocument();
    expect(screen.getByText('Receiver Org')).toBeInTheDocument();
    expect(screen.getByText('Receiver address')).toBeInTheDocument();
    expect(screen.getByText(/789 Boulevard/)).toBeInTheDocument();
    expect(screen.getByText('Receiver contact name')).toBeInTheDocument();
    expect(screen.getByText('Receiver Name')).toBeInTheDocument();
    expect(
      screen.getByText('Receiver contact email address'),
    ).toBeInTheDocument();
    expect(screen.getByText('receiver@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('Receiver contact phone number'),
    ).toBeInTheDocument();
    expect(screen.getByText('0987654321')).toBeInTheDocument();
  });

  it('renders carrier details correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Carrier organisation name')).toBeInTheDocument();
    expect(screen.getByText('Carrier Org')).toBeInTheDocument();
    expect(screen.getByText('Carrier address')).toBeInTheDocument();
    expect(screen.getByText(/121 Lane/)).toBeInTheDocument();
    expect(screen.getByText('Carrier contact name')).toBeInTheDocument();
    expect(screen.getByText('Carrier Name')).toBeInTheDocument();
    expect(
      screen.getByText('Carrier contact email address'),
    ).toBeInTheDocument();
  });

  it('renders return button correctly', () => {
    render(<Submission data={mockData} />);

    const returnButton = screen.getByRole('link', {
      name: 'Return to view all records',
    });
    expect(returnButton).toBeInTheDocument();
    expect(returnButton).toHaveAttribute('href', '../view?page=1');
  });
});
