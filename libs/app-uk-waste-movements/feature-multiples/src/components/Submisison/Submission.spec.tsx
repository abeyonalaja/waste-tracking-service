import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Submission } from './Submission';

const mockData = {
  transactionId: '12345',
  wasteInformation: {
    status: 'InProgress',
    wasteTypes: [
      {
        ewcCode: '01 01 01',
        wasteDescription: 'Waste description 1',
        physicalForm: 'Solid',
        wasteQuantityType: 'EstimateData',
        wasteQuantity: '1000',
        quantityUnit: 'kg',
        chemicalAndBiologicalComponents: [
          { name: 'Component 1', concentration: '50', concentrationUnit: '%' },
        ],
        hasHazardousProperties: true,
        hazardousWasteCodes: [{ code: 'H1', name: 'Explosive' }],
        containsPops: true,
        pops: [{ name: 'POP 1', concentration: '10', concentrationUnit: '%' }],
      },
    ],
    wasteTransportation: {
      numberAndTypeOfContainers: '5 containers',
      specialHandlingRequirements: 'Handle with care',
    },
  },
  producerAndCollection: {
    status: 'InProgress',
    producer: {
      contact: {
        organisationName: 'Producer Org',
        name: 'Producer Name',
        email: 'producer@example.com',
        phone: '1234567890',
      },
      address: {
        addressLine1: '123 Street',
        townCity: 'City',
        postcode: 'AB12 3CD',
        country: 'Country',
      },
      sicCode: 'SIC1234',
    },
    wasteCollection: {
      address: {
        addressLine1: '456 Avenue',
        townCity: 'Town',
        postcode: 'CD34 5EF',
        country: 'Country',
      },
      localAuthority: 'Local Authority',
      wasteSource: 'Waste Source',
      brokerRegistrationNumber: 'BRN12345',
    },
  },
  receiver: {
    status: 'InProgress',
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
};

describe('Submission component', () => {
  it('renders correctly with provided data', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Your reference: 12345')).toBeInTheDocument();
    expect(screen.getByText('Waste movement record')).toBeInTheDocument();
    expect(screen.getByText('About the waste')).toBeInTheDocument();
    expect(
      screen.getByText('Producer and collection details')
    ).toBeInTheDocument();
    expect(screen.getByText('Receiver details')).toBeInTheDocument();
  });

  it('toggles sections correctly', () => {
    render(<Submission data={mockData} />);

    const aboutWasteButton = screen.getByLabelText('About the waste');
    const producerCollectorButton = screen.getByLabelText(
      'Producer and collection details'
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
      screen.getByText('Chemical and biological components of waste')
    ).toBeInTheDocument();
    expect(screen.getByText('50% Component 1')).toBeInTheDocument();
  });

  it('renders producer and collection details correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Producer organisation name')).toBeInTheDocument();
    expect(screen.getByText('Producer Org')).toBeInTheDocument();
    expect(screen.getByText('Producer address')).toBeInTheDocument();
    expect(
      screen.getByText('123 Street, City, AB12 3CD, Country')
    ).toBeInTheDocument();
    expect(screen.getByText('Producer contact name')).toBeInTheDocument();
    expect(screen.getByText('Producer Name')).toBeInTheDocument();
    expect(
      screen.getByText('Producer contact email address')
    ).toBeInTheDocument();
    expect(screen.getByText('producer@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('Producer contact phone number')
    ).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
  });

  it('renders receiver details correctly', () => {
    render(<Submission data={mockData} />);

    expect(screen.getByText('Receiver organisation name')).toBeInTheDocument();
    expect(screen.getByText('Receiver Org')).toBeInTheDocument();
    expect(screen.getByText('Receiver address')).toBeInTheDocument();
    expect(
      screen.getByText('789 Boulevard, Village, EF56 7GH, Country')
    ).toBeInTheDocument();
    expect(screen.getByText('Receiver contact name')).toBeInTheDocument();
    expect(screen.getByText('Receiver Name')).toBeInTheDocument();
    expect(
      screen.getByText('Receiver contact email address')
    ).toBeInTheDocument();
    expect(screen.getByText('receiver@example.com')).toBeInTheDocument();
    expect(
      screen.getByText('Receiver contact phone number')
    ).toBeInTheDocument();
    expect(screen.getByText('0987654321')).toBeInTheDocument();
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
