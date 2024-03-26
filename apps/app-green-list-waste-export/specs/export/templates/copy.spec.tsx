import React from 'react';
import { render, screen, act, fireEvent } from 'jest-utils';
import TemplateCopy from 'pages/templates/copy';

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
      json: () =>
        Promise.resolve({
          id: '12345678-1234-1234-1234-123456789',
          templateDetails: {
            name: 'TEMPLATENAME',
            description: '',
            created: '2023-09-18T13:08:13.224Z',
            lastModified: '2023-09-18T13:08:13.224Z',
          },
        }),
    }) as Promise<Response>
);

describe('Copy template page', () => {
  it('should render successfully', async () => {
    await act(async () => {
      render(<TemplateCopy />);
    });
    const pageCaption = screen.getByText(`Make a copy of: TEMPLATENAME`);
    expect(pageCaption).toBeTruthy();

    const pageTitle = screen.getByText('What is the name of the new template?');
    expect(pageTitle).toBeTruthy();
  });

  it('should show validation', async () => {
    await act(async () => {
      render(<TemplateCopy />);
    });
    const button = screen.getByText('Create new template');
    fireEvent.click(button);

    const errorHeading = screen.getByText('There is a problem');
    expect(errorHeading).toBeTruthy();

    const nameError = screen.getAllByText('Enter a name for the template')[0];
    expect(nameError).toBeTruthy();
  });
});
