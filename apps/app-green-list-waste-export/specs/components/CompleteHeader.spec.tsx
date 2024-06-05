import { render, screen, act } from '../../jest-utils';
import { Header } from 'components/Header';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  } as Response),
);

describe('CompleteHeader', () => {
  it('renders Header component', async () => {
    await act(async () => {
      render(<Header />);
    });

    expect(screen.findByText('GsOV.UK')).toBeTruthy();
  });
});
