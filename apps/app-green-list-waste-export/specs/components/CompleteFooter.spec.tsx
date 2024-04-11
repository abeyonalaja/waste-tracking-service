import { render, screen } from 'jest-utils';
import { Footer } from 'components/Footer';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('CompleteFooter', () => {
  it('renders Footer component', () => {
    const { baseElement } = render(<Footer />);
    expect(baseElement).toBeTruthy();
    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
