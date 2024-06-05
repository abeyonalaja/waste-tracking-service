'use client';
import React from 'react';
import Link from 'next/link';
import { getPageRange } from '../../utils';

interface PaginationProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps): React.ReactElement | undefined {
  const pageRange = getPageRange(currentPage, totalPages);

  if (totalPages > 1) {
    return (
      <nav className="govuk-pagination" aria-label="Pagination">
        {currentPage > 1 && (
          <div className="govuk-pagination__prev">
            <Link
              rel="prev"
              href="#"
              className="govuk-link govuk-pagination__link"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Number(currentPage - 1));
                window.scrollTo(0, 0);
              }}
            >
              <svg
                className="govuk-pagination__icon govuk-pagination__icon--prev"
                xmlns="http://www.w3.org/2000/svg"
                height="13"
                width="15"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 15 13"
              >
                <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
              </svg>
              <span className="govuk-pagination__link-title">
                Previous<span className="govuk-visually-hidden"> page</span>
              </span>
            </Link>
          </div>
        )}

        <ul className="govuk-pagination__list">
          {pageRange.map((page, index) => {
            if (page === '...') {
              return (
                <li
                  className="govuk-pagination__item govuk-pagination__item--ellipses"
                  key={`pagination-page=${page}-${index}`}
                >
                  ...
                </li>
              );
            } else {
              return (
                <li
                  className={`govuk-pagination__item ${
                    page === currentPage
                      ? 'govuk-pagination__item--current'
                      : ''
                  }`}
                  key={`pagination-page=${page}-${index}`}
                >
                  <Link
                    href={`#`}
                    className={'govuk-link govuk-pagination__link'}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(Number(page));
                      window.scrollTo(0, 0);
                    }}
                  >
                    {page}
                  </Link>
                </li>
              );
            }
          })}
        </ul>
        {currentPage !== totalPages && (
          <div className="govuk-pagination__next">
            <Link
              className="govuk-link govuk-pagination__link"
              rel="next"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Number(currentPage + 1));
                window.scrollTo(0, 0);
              }}
            >
              <span className="govuk-pagination__link-title">
                Next<span className="govuk-visually-hidden">page</span>
              </span>
              <svg
                className="govuk-pagination__icon govuk-pagination__icon--next"
                xmlns="http://www.w3.org/2000/svg"
                height="13"
                width="15"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 15 13"
              >
                <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
              </svg>
            </Link>
          </div>
        )}
      </nav>
    );
  }
}
