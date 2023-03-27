import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ reference: "12345" }),
  })
);

jest.mock('next/router', () => require('next-router-mock'));

import AddYourOwnExportReference from '../pages/add-your-own-export-reference';

describe('AddYourOwnExportReference', () => {
  it('renders without crashing', () => {
    render(<AddYourOwnExportReference />);
  });

  it('displays a validation message when no option is selected', () => {
    const { getByText } = render(<AddYourOwnExportReference />);
    const submitButton = getByText('Save and continue');
    fireEvent.click(submitButton);
    expect(getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Select yes if you want to add a reference')[0]).toBeTruthy();
  });

  it('displays a validation message when "Yes" is selected but no reference is entered', () => {
    const { getByText, getByLabelText } = render(<AddYourOwnExportReference />);
    const yesRadioButton = getByLabelText('Yes');
    const submitButton = getByText('Save and continue');
    fireEvent.click(yesRadioButton);
    fireEvent.click(submitButton);
    expect(getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });

});
