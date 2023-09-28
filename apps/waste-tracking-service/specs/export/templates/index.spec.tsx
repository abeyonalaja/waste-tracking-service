import React from 'react';
import { render, screen, act, fireEvent } from 'jest-utils';
import ManageTemplates from 'pages/export/templates';

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({
    isReady: true,
    query: {},
  })),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe('Manage templates page', () => {
  it('should render successfully', () => {
    act(() => {
      render(<ManageTemplates />);
    });
    expect(
      screen.findByText('Manage your Annex VII record templates')
    ).toBeTruthy();
    expect(screen.findByText('You have no saved templates.')).toBeTruthy();
  });

  it('should show a list of templates if data is returned from the API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            values: [
              {
                id: '184eb9b7-ca6c-4396-98de-da7895a7d4ca',
                templateDetails: {
                  name: 'Template name',
                  description: 'This is a description of a template',
                  created: '2023-09-18T12:22:14.371Z',
                  lastModified: '2023-09-18T12:22:14.371Z',
                },
              },
              {
                id: '184eb9b7-ca6c-4396-98de-da7895a7d4ca',
                templateDetails: {
                  name: 'Another template here',
                  description: 'This is the description of the second template',
                  created: '2023-09-18T12:22:14.371Z',
                  lastModified: '2023-09-18T12:22:14.371Z',
                },
              },
            ],
          }),
      })
    );

    await act(async () => {
      render(<ManageTemplates />);
    });

    const templateName = screen.getByText('Template name');
    expect(templateName).toBeTruthy();

    const description = screen.getByText('This is a description of a template');
    expect(description).toBeTruthy();
  });

  it('should show delete confirmation screen when delete is clicked', async () => {
    await act(async () => {
      render(<ManageTemplates />);
    });
    const deleteLink = screen.getAllByText('Delete')[0];
    expect(deleteLink).toBeTruthy();
    fireEvent.click(deleteLink);

    const pageTitle = screen.getByText(
      'Are you sure you want to delete this record template?'
    );
    expect(pageTitle).toBeTruthy();

    const button = screen.getByText('Confirm and continue');
    fireEvent.click(button);

    const validationMessage = screen.getAllByText(
      'Select yes if you want to remove this record template'
    )[0];
    expect(validationMessage).toBeTruthy();
  });
});
