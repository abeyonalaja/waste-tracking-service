import { render, screen, act } from 'jest-utils';
import { Footer } from 'components/Footer';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('CompleteFooter', () => {
  it('renders Footer component', async () => {
    let container: HTMLElement;

    await act(async () => {
      container = render(<Footer />).container;
    });
    expect(container).toBeTruthy();
    expect(screen.findByText('Accessibility statement')).toBeTruthy();
  });
});
