import React from 'react';
import { render, screen, act } from 'jest-utils';
import TemplateTasklist from 'pages/templates/tasklist';

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
          wasteDescription: {
            status: 'NotStarted',
          },
          exporterDetail: {
            status: 'NotStarted',
          },
          importerDetail: {
            status: 'NotStarted',
          },
          carriers: {
            status: 'NotStarted',
            transport: true,
          },
          collectionDetail: {
            status: 'NotStarted',
          },
          ukExitLocation: {
            status: 'NotStarted',
          },
          transitCountries: {
            status: 'NotStarted',
          },
          recoveryFacilityDetail: {
            status: 'CannotStart',
          },
        }),
    }) as Promise<Response>,
);

describe('Template tasklist page', () => {
  it('should render successfully', async () => {
    await act(async () => {
      render(<TemplateTasklist />);
    });
    const nameStatus = screen.getByTestId(`C-name-and-description-status`);
    expect(nameStatus).toBeTruthy();

    const pageTitle = screen.getByText('TEMPLATENAME');
    expect(pageTitle).toBeTruthy();
  });
});
