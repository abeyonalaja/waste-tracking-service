import { render, screen } from '@testing-library/react';
import { ErrorSummary } from './ErrorSummary';
import '@testing-library/jest-dom/extend-expect';

jest.mock('next/navigation', () => {
  return {
    __esModule: true,
    usePathname: () => ({
      pathname: '',
    }),
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
      get: () => {},
    }),
  };
});

describe('ErrorSummary', () => {
  it('renders without crashing', () => {
    const { container } = render(<ErrorSummary errors={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('renders the correct number of errors', () => {
    const errors = [
      { text: 'Error 1', href: '#error1' },
      { text: 'Error 2', href: '#error2' },
    ];
    render(<ErrorSummary errors={errors} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(errors.length);
  });

  it('renders the correct error text', () => {
    const errors = [{ text: 'Error 1', href: '#error1' }];
    render(<ErrorSummary errors={errors} />);
    const errorText = screen.getByText('Error 1');
    expect(errorText).toBeInTheDocument();
  });
});
