import React from 'react';
import { render, fireEvent, act } from 'jest-utils';
import { screen } from '@testing-library/dom';
import Reference from 'pages/export/incomplete/reference';

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

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
  it('renders the page', async () => {
    await act(async () => {
      render(<Reference />);
    });
    const referenceField = screen.getByLabelText('Enter a reference');
    expect(referenceField).toBeTruthy();
  });

  it('displays a validation message when no reference is entered', async () => {
    await act(async () => {
      render(<Reference />);
    });
    expect(
      screen.getByText(
        'What is your unique reference for this Annex VII record?'
      )
    ).toBeTruthy();

    const submitButton = screen.getByText('Save and continue');
    act(() => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });

  it('displays a validation message when only spaces are entered for the reference', async () => {
    await act(async () => {
      render(<Reference />);
    });
    expect(
      screen.getByText(
        'What is your unique reference for this Annex VII record?'
      )
    ).toBeTruthy();

    const reference = screen.getByLabelText('Enter a reference');
    fireEvent.change(reference, { target: { value: '    ' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });

  it('displays a validation message when only spaces are entered for the reference', async () => {
    await act(async () => {
      render(<Reference />);
    });
    expect(
      screen.getByText(
        'What is your unique reference for this Annex VII record?'
      )
    ).toBeTruthy();

    const reference = screen.getByLabelText('Enter a reference');
    fireEvent.change(reference, { target: { value: '    ' } });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(screen.getAllByText('Enter a reference')[0]).toBeTruthy();
  });

  it('displays a validation message when too many characters are entered for the reference', async () => {
    await act(async () => {
      render(<Reference />);
    });
    expect(
      screen.getByText(
        'What is your unique reference for this Annex VII record?'
      )
    ).toBeTruthy();

    const reference = screen.getByLabelText('Enter a reference');
    fireEvent.change(reference, {
      target: { value: '012345678901234567890123456789' },
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(
      screen.getAllByText('Enter a reference using 20 character or less')[0]
    ).toBeTruthy();
  });

  it('displays a validation message when invalid characters are entered for the reference', async () => {
    await act(async () => {
      render(<Reference />);
    });
    expect(
      screen.getByText(
        'What is your unique reference for this Annex VII record?'
      )
    ).toBeTruthy();

    const reference = screen.getByLabelText('Enter a reference');
    fireEvent.change(reference, {
      target: { value: '?&£%iuat' },
    });

    const submitButton = screen.getByText('Save and continue');
    fireEvent.click(submitButton);

    expect(screen.getByText('There is a problem')).toBeTruthy();
    expect(
      screen.getAllByText(
        'The reference must only include letters a to z, numbers, spaces, hyphens and back slashes'
      )[0]
    ).toBeTruthy();
  });
});
