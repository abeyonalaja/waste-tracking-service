import { render, screen } from '../../jest-utils';
import { CompleteHeader } from '../../components/';

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: {} }),
  })
);

describe('CompleteHeader', () => {
  it('renders Header component', () => {
    render(<CompleteHeader />);

    expect(screen.findByText('GsOV.UK')).toBeTruthy();
  });
});
