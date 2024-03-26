import React from 'react';
import { render, screen, act, fireEvent } from 'jest-utils';
import TemplateCreate from 'pages/templates/create';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: {},
  })),
}));

jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ id_token: 'dummytoken' })),
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }) as Promise<Response>
);

describe('Create template page', () => {
  it('should render successfully', async () => {
    await act(async () => {
      render(<TemplateCreate />);
    });
    const pageTitle = screen.getByText('What is the name of the new template?');
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation when empty', async () => {
    await act(async () => {
      render(<TemplateCreate />);
    });
    const button = screen.getByText('Create template');
    fireEvent.click(button);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    const nameError = screen.getAllByText('Enter a name for the template')[0];
    expect(nameError).toBeTruthy();
  });

  it('should show validation when invalid names are entered', async () => {
    await act(async () => {
      render(<TemplateCreate />);
    });

    const nameField = screen.getByLabelText('Enter a template name');
    fireEvent.change(nameField, {
      target: { value: 'Name with invalid characters [{"?' },
    });

    const button = screen.getByText('Create template');
    fireEvent.click(button);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    const nameError = screen.getAllByText(
      'The template name must only include letters a to z, numbers, spaces, hyphens, brackets, apostrophes and back slashes'
    )[0];
    expect(nameError).toBeTruthy();
  });
});
