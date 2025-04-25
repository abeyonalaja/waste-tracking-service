import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { formatAddress } from './formatAddress';

describe('formatAddress function', () => {
  it('renders address with building name or number', () => {
    const addressString = JSON.stringify({
      buildingNameOrNumber: '123',
      addressLine1: 'Main St',
      addressLine2: 'Apt 4',
      townCity: 'Anytown',
      postcode: '12345',
      country: 'USA',
    });
    render(formatAddress(addressString));
    expect(screen.getByText('123,')).toBeInTheDocument();
    expect(screen.getByText('Apt 4')).toBeInTheDocument();
    expect(screen.getByText('Anytown')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('renders address without building name or number', () => {
    const addressString = JSON.stringify({
      buildingNameOrNumber: '',
      addressLine1: 'Main St',
      addressLine2: 'Apt 4',
      townCity: 'Anytown',
      postcode: '12345',
      country: 'USA',
    });
    render(formatAddress(addressString));
    expect(screen.getByText('Main St')).toBeInTheDocument();
    expect(screen.getByText('Apt 4')).toBeInTheDocument();
    expect(screen.getByText('Anytown')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('renders address without address line 2', () => {
    const addressString = JSON.stringify({
      buildingNameOrNumber: '123',
      addressLine1: 'Main St',
      addressLine2: '',
      townCity: 'Anytown',
      postcode: '12345',
      country: 'USA',
    });
    render(formatAddress(addressString));
    expect(screen.getByText('123,')).toBeInTheDocument();
    expect(screen.getByText('Anytown')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('renders address without postcode', () => {
    const addressString = JSON.stringify({
      buildingNameOrNumber: '123',
      addressLine1: 'Main St',
      addressLine2: 'Apt 4',
      townCity: 'Anytown',
      postcode: '',
      country: 'USA',
    });
    render(formatAddress(addressString));
    expect(screen.getByText('123,')).toBeInTheDocument();
    expect(screen.getByText('Apt 4')).toBeInTheDocument();
    expect(screen.getByText('Anytown')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
  });

  it('renders address without country', () => {
    const addressString = JSON.stringify({
      buildingNameOrNumber: '123',
      addressLine1: 'Main St',
      addressLine2: 'Apt 4',
      townCity: 'Anytown',
      postcode: '12345',
      country: '',
    });
    render(formatAddress(addressString));
    expect(screen.getByText('123,')).toBeInTheDocument();
    expect(screen.getByText('Apt 4')).toBeInTheDocument();
    expect(screen.getByText('Anytown')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });
});
