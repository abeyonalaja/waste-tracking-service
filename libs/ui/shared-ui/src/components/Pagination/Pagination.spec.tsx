import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagination } from './Pagination';

describe('Pagination component', () => {
  it('should render the component', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        setCurrentPage={() => null}
      />,
    );
  });

  it('should render with a next link when on page 1', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        setCurrentPage={() => null}
      />,
    );

    expect(screen.getByRole('link', { name: /Next/ })).toBeInTheDocument();
  });

  it('should not render a next link when on the last page', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={10}
        setCurrentPage={() => null}
      />,
    );

    expect(
      screen.queryByRole('link', { name: /Next/ }),
    ).not.toBeInTheDocument();
  });

  it('should not render a previous link when on page 1 ', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        setCurrentPage={() => null}
      />,
    );

    expect(
      screen.queryByRole('link', { name: /Previous/ }),
    ).not.toBeInTheDocument();
  });

  it('Should render the previous link when not on page 1', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={2}
        setCurrentPage={() => null}
      />,
    );

    expect(screen.getByRole('link', { name: /Previous/ })).toBeInTheDocument();
  });

  it('Should render links to the correct pages when on page 1', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        setCurrentPage={() => null}
      />,
    );

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
    render(
      <Pagination
        totalPages={10}
        currentPage={3}
        setCurrentPage={() => null}
      />,
    );

    const page3Link = screen.getByRole('link', { name: /3/ });

    expect(page3Link).toHaveAttribute('aria-current', 'page');
  });

  it('should not have the aria-current "page" attribute on the other pages', () => {
    render(
      <Pagination
        totalPages={10}
        currentPage={1}
        setCurrentPage={() => null}
      />,
    );

    const page2Link = screen.getByRole('link', { name: /2/ });
    const page4Link = screen.getByRole('link', { name: /4/ });

    expect(page2Link).not.toHaveAttribute('aria-current', 'page');
    expect(page4Link).not.toHaveAttribute('aria-current', 'page');
  });
});
