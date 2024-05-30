import { render, screen } from '@testing-library/react';
import { ErrorSummary } from './ErrorSummary';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => {
  return {
    __esModule: true,
    usePathname: (): { pathname: string } => ({
      pathname: '',
    }),
    useRouter: (): {
      push: jest.Mock;
      replace: jest.Mock;
      prefetch: jest.Mock;
    } => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }),
    useSearchParams: (): {
      get: () => void;
    } => ({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      get: (): void => {},
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
