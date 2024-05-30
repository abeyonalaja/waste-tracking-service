import React from 'react';
import { render, screen } from 'jest-utils';
import { Pagination } from 'components';
import '@testing-library/jest-dom';
import 'i18n/config';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

describe('Pagination Component', () => {
  it('renders the component with page numbers and previous/next buttons', () => {
    const pages = [
      {
        pageNumber: 1,
        token: '1',
      },
      {
        pageNumber: 2,
        token: '2',
      },
      {
        pageNumber: 3,
        token: '',
      },
    ];

    render(
      <Pagination url="test" currentPage={2} totalPages={3} pages={pages} />,
    );

    const paginationNav = screen.findByText('results');
    expect(paginationNav).toBeTruthy();

    for (let pageNumber = 1; pageNumber <= 3; pageNumber++) {
      const pageButton = screen.findByText(`Page ${pageNumber}`);
      expect(pageButton).toBeTruthy();
    }

    const previousButton = screen.findByText('Previous page');
    expect(previousButton).toBeTruthy();

    const nextButton = screen.findByText('Next page');
    expect(nextButton).toBeTruthy();
  });
});
