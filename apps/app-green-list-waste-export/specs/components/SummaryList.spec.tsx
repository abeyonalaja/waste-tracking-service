import React from 'react';
import { render } from 'jest-utils';
import { SummaryListWithActions } from 'components';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('SummaryList', () => {
  it('renders a list of titles', () => {
    const content = ['Title 1', 'Title 2', 'Title 3'];
    const { getAllByText } = render(
      <SummaryListWithActions content={content} />
    );

    content.forEach((title) => {
      const titleElement = getAllByText(title);
      expect(titleElement).toBeTruthy();
    });
  });

  it('prefixes numbers to titles when prefixNumbers prop is true', () => {
    const content = ['Title 1', 'Title 2', 'Title 3'];
    const { getByText } = render(
      <SummaryListWithActions content={content} prefixNumbers />
    );

    content.forEach((title, index) => {
      const prefixedTitle = `${index + 1}. ${title}`;
      const titleElement = getByText(prefixedTitle);
      expect(titleElement).toBeTruthy();
    });
  });
});
