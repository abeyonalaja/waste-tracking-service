import React from 'react';
import { render, screen, act, fireEvent } from 'jest-utils';
import ManageTemplates from 'pages/templates';
import '@testing-library/jest-dom';

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
          totalTemplates: 2,
          totalPages: 1,
          currentPage: 1,
          pages: [
            {
              pageNumber: 1,
              token: '',
            },
          ],
          values: [
            {
              id: '29b5d05d-774c-44bc-a5e9-f023ac03850e',
              templateDetails: {
                name: 'Another template here',
                description: 'This is the description of the second template',
                created: '2024-01-12T12:41:00.025Z',
                lastModified: '2024-01-12T12:41:00.025Z',
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
            },
            {
              id: 'd5573884-5774-4ad6-95a1-919d457ac716',
              templateDetails: {
                name: 'Template name',
                description: 'This is a description of a template',
                created: '2024-01-12T12:39:08.261Z',
                lastModified: '2024-01-12T12:40:42.227Z',
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
            },
          ],
        }),
    }) as Promise<Response>,
);

describe('Manage templates page', () => {
  it('should render successfully', async () => {
    await act(async () => {
      render(<ManageTemplates />);
    });

    expect(
      screen.findByText('Manage your Annex VII record templates'),
    ).toBeTruthy();
  });

  it('should show a list of templates if data is returned from the API', async () => {
    await act(async () => {
      render(<ManageTemplates />);
    });

    const templateName = screen.getByText('Template name');
    const description = screen.getByText('This is a description of a template');

    expect(templateName).toBeTruthy();
    expect(description).toBeTruthy();
  });

  it('should show delete confirmation screen when delete is clicked', async () => {
    await act(async () => {
      render(<ManageTemplates />);
    });

    const deleteLink = screen.getAllByRole('link', { name: 'Delete' })[0];

    expect(deleteLink).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(deleteLink);
    });
    const pageTitle = screen.getByText(
      'Are you sure you want to delete this record template?',
    );

    expect(pageTitle).toBeTruthy();

    const button = screen.getByText('Confirm and continue');
    await act(async () => {
      fireEvent.click(button);
    });
    const validationMessage = screen.getAllByText(
      'Select yes if you want to remove this record template',
    )[0];

    expect(validationMessage).toBeTruthy();
  });
});
