import React from 'react';
import { act, fireEvent, render, screen } from 'jest-utils';
import { CountrySelector } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { name: 'Afghanistan(AF)' },
        { name: 'Åland Islands(AX)' },
        { name: 'Albania(AL)' },
        { name: 'Algeria(DZ)' },
        { name: 'American Samoa(AS)' },
        { name: 'Andorra(AD)' },
        { name: 'Angola(AO)' },
      ]),
  }),
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

  it('should display the list of countries when input is focused', async () => {
    await act(async () => {
      render(<CountrySelector {...defaultProps} />);
    });
    const labelElement = screen.getByLabelText(defaultProps.label);
    await act(async () => {
      fireEvent.click(labelElement);
    });

    const hintElement = screen.getByText('Afghanistan(AF)');
    expect(hintElement).toBeTruthy();
  });
});
