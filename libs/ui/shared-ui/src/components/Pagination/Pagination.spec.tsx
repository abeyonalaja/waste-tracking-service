import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from './Pagination';

jest.mock('@wts/ui/navigation', () => ({
  usePathname: jest.fn(() => '/multiples/1234/view'),
}));

const mockGet = jest.fn();
jest.mock('next/navigation', () => {
  return {
    useSearchParams: jest.fn(() => ({
      get: mockGet,
    })),
    usePathname: jest.fn(() => '/multiples/1234/view'),
  };
});

describe('Pagination component', () => {
  it('should render the component', () => {
    mockGet.mockReturnValue('1');

    render(<Pagination totalPages={10} />);
  });

  it('should render with a next link when on page 1', () => {
    mockGet.mockReturnValue('1');

    render(<Pagination totalPages={10} />);

    expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument();
  });

  it('should not render a next link when on the last page', () => {
    mockGet.mockReturnValue('10');

    render(<Pagination totalPages={10} />);

    expect(
      screen.queryByRole('link', { name: /Next/ }),
    ).not.toBeInTheDocument();
  });

  it('should not render a previous link when on page 1 ', () => {
    mockGet.mockReturnValue('1');

    render(<Pagination totalPages={10} />);

    expect(
      screen.queryByRole('link', { name: /Previous/ }),
    ).not.toBeInTheDocument();
  });

  it('Should render the previous link when not on page 1', () => {
    mockGet.mockReturnValue('2');

    render(<Pagination totalPages={10} />);

    expect(screen.getByRole('link', { name: /Previous/ })).toBeInTheDocument();
  });

  it('Should render links to the correct pages when on page 1', () => {
    mockGet.mockReturnValue('1');

    render(<Pagination totalPages={10} />);

    const page2Link = screen.getByRole('link', { name: /2/ });
    const page3Link = screen.getByRole('link', { name: /3/ });
    const page4Link = screen.getByRole('link', { name: /4/ });
    const page5Link = screen.getByRole('link', { name: /5/ });
    const page10Link = screen.getByRole('link', { name: /10/ });

    expect(page2Link).toBeInTheDocument();
    expect(page3Link).toBeInTheDocument();
    expect(page4Link).toBeInTheDocument();
    expect(page5Link).toBeInTheDocument();
    expect(page10Link).toBeInTheDocument();
  });

  it('should have the aria-current "page" attribute on the current page', () => {
    mockGet.mockReturnValue('3');

    render(<Pagination totalPages={10} />);

    const page1Link = screen.getByRole('link', { name: /3/ });

    expect(page1Link).toHaveAttribute('aria-current', 'page');
  });

  it('should not have the aria-current "page" attribute on the other pages', () => {
    mockGet.mockReturnValue('3');

    render(<Pagination totalPages={10} />);

    const page2Link = screen.getByRole('link', { name: /2/ });
    const page4Link = screen.getByRole('link', { name: /4/ });

    expect(page2Link).not.toHaveAttribute('aria-current', 'page');
    expect(page4Link).not.toHaveAttribute('aria-current', 'page');
  });
});
