import { render, screen } from '../../jest-utils';
import { Header } from 'components/Header';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  }),
);

describe('CompleteHeader', () => {
  it('renders Header component', () => {
    render(<Header />);

    expect(screen.findByText('GsOV.UK')).toBeTruthy();
  });
});
