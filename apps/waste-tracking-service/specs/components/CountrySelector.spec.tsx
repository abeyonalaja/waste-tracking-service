import React from 'react';
import { act, fireEvent, render, screen } from 'jest-utils';
import { CountrySelector } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          isoCode: 'AF',
          description: 'Afghanistan',
        },
        {
          isoCode: 'AX',
          description: 'Åland Islands',
        },
        {
          isoCode: 'AL',
          description: 'Albania',
        },
        {
          isoCode: 'DZ',
          description: 'Algeria',
        },
        {
          isoCode: 'AS',
          description: 'American Samoa',
        },
        {
          isoCode: 'AD',
          description: 'Andorra',
        },
        {
          isoCode: 'AO',
          description: 'Angola',
        },
      ]),
  })
);

const defaultProps = {
  id: 'country',
  name: 'country',
  value: '',
  error: null,
  label: 'Country',
  hint: 'Choose a country from the list',
  onChange: () => {
    return;
  },
};

describe('Country selector component', () => {
  it('should render without errors', async () => {
    await act(async () => {
      render(<CountrySelector {...defaultProps} />);
    });
  });

  it('should display the label', async () => {
    await act(async () => {
      render(<CountrySelector {...defaultProps} />);
    });
    const labelElement = screen.getByLabelText(defaultProps.label);
    expect(labelElement).toBeTruthy();
  });

  it('should display the hint text', async () => {
    await act(async () => {
      render(<CountrySelector {...defaultProps} />);
    });
    const hintElement = screen.getByText(defaultProps.hint);
    expect(hintElement).toBeTruthy();
  });

  it('should display the list of countries when input is sfocused', async () => {
    await act(async () => {
      render(<CountrySelector {...defaultProps} />);
    });
    const labelElement = screen.getByLabelText(defaultProps.label);
    await act(async () => {
      fireEvent.click(labelElement);
    });

    const hintElement = screen.getByText('Afghanistan');
    expect(hintElement).toBeTruthy();
  });
});
