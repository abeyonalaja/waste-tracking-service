import React from 'react';
import { render, act, screen } from 'jest-utils';
import { SummaryListWithActions } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('SummaryList', () => {
  it('renders a list of titles', async () => {
    const content = ['Title 1', 'Title 2', 'Title 3'];

    await act(async () => {
      render(<SummaryListWithActions content={content} />);
    });

    for (const title of content) {
      const titleElement = screen.getAllByText(title);
      expect(titleElement).toBeTruthy();
    }
  });

  it('prefixes numbers to titles when prefixNumbers prop is true', async () => {
    const content = ['Title 1', 'Title 2', 'Title 3'];

    await act(async () => {
      render(<SummaryListWithActions content={content} prefixNumbers />);
    });

    for (const [index, title] of content.entries()) {
      const prefixedTitle = `${index + 1}. ${title}`;
      const titleElement = screen.getByText(prefixedTitle);
      expect(titleElement).toBeTruthy();
    }
  });
});
