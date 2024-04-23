import '@testing-library/jest-dom';
import { render, screen } from 'jest-utils';
import { ActionBox } from 'features/multiples';

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    }) as Promise<Response>
);

describe('ActionBox component', () => {
  it('Renders without errors', () => {
    render(<ActionBox pageCount={20} />);
  });

  it('Has an h2 with the correct heading text', () => {
    render(<ActionBox pageCount={20} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Action');
  });

  it('Has the page count from props in the link text ', () => {
    render(<ActionBox pageCount={20} />);
    const link = screen.getByRole('link');
    expect(link).toHaveTextContent(
      'Download all the Annex VII records for this transaction (PDF, 20 pages)'
    );
  });
});
