import React from 'react';
import { render, fireEvent, act } from 'jest-utils';
import { screen } from '@testing-library/dom';
import Reference from 'pages/export/incomplete/reference';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        data: {},
      }),
  })
);

jest.mock('next/router', () => require('next-router-mock'));

describe('Add reference to submission', () => {
  it('renders without crashing', () => {
    act(() => {
      render(<Reference />);
    });
    expect(
      screen.findByText('Do you want to add your own reference to this export?')
    ).toBeTruthy();
  });

  it('displays a validation message when no option is selected', () => {
    act(() => {
      render(<Reference />);
    });
    expect(
      screen.findByText('Do you want to add your own reference to this export?')
    ).toBeTruthy();
    const submitButton = screen.getByText('Save and continue');

    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.findByText('There is a problem')).toBeTruthy();
    expect(
      screen.getAllByText('Select yes if you want to add a reference')[0]
    ).toBeTruthy();
  });

  it('displays a validation message when "Yes" is selected but no reference is entered', () => {
    act(() => {
      render(<Reference />);
    });
    expect(
      screen.findByText('Do you want to add your own reference to this export?')
    ).toBeTruthy();
    const yesRadioButton = screen.getByLabelText('Yes');
    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(yesRadioButton);
    fireEvent.click(submitButton);
    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });

  it('displays a validation message when "Yes" and only spaces are entered for the reference', () => {
    act(() => {
      render(<Reference />);
    });
    expect(
      screen.findByText('Do you want to add your own reference to this export?')
    ).toBeTruthy();
    const yesRadioButton = screen.getByLabelText('Yes');
    fireEvent.click(yesRadioButton);

    const reference = screen.getByLabelText('Enter your reference');
    fireEvent.change(reference, { target: { value: '    ' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });
});
