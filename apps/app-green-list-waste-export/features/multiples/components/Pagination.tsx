import React from 'react';
import styled from 'styled-components';
import { LINK_COLOUR, BLACK, YELLOW } from 'govuk-colours';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

interface Props {
  order: string | string[];
  url: string;
  pages?: Array<{ token: string; pageNumber: number }>;
  currentPage?: number;
  totalPages?: number;
}

const PaginationNav = styled('nav')`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  @media (min-width: 40.0625em) {
    margin-bottom: 30px;
  }
  @media (min-width: 40.0625em) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const PaginationList = styled('ul')`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const PaginationListItem = styled('li')<{ isCurrent?: boolean }>`
  position: relative;
  min-width: 45px;
  min-height: 45px;
  padding: 10px 10px;
  box-sizing: border-box;
  float: left;
  display: block;
  text-align: center;
  background: ${(props) => (props.isCurrent ? LINK_COLOUR : '#fff')};
  &:hover {
    background-color: ${(props) => (props.isCurrent ? LINK_COLOUR : '#f3f2f1')};
  }
`;

const PaginationLink = styled(Link)<{ $isCurrent?: boolean }>`
  color: ${(props) => (props.$isCurrent ? '#fff' : LINK_COLOUR)};
  font-weight: ${(props) => (props.$isCurrent ? '700' : 'inherit')};
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.1em;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.3;
  }
  &:hover {
    color: ${(props) => (props.$isCurrent ? '#fff' : '#003078')};
    text-decoration-thickness: max(3px, 0.1875rem, 0.12em);
    text-decoration-skip-ink: none;
  }
  &:focus {
    outline: 3px solid rgba(0, 0, 0, 0);
    color: ${BLACK};
    background-color: ${YELLOW};
    box-shadow:
      0 -2px ${YELLOW},
      0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

const Previous = styled(PaginationListItem)`
  font-weight: 700;
  padding-left: 0;
`;
const Next = styled(PaginationListItem)`
  font-weight: 700;
  padding-right: 0;
`;
const Icon = styled('svg')`
  margin-right: 15px;
`;

const NextIcon = styled(Icon)`
  margin-left: 15px;
  margin-right: 0;
`;

export const Pagination = ({
  order,
  url,
  currentPage = 0,
  totalPages = 1,
}: Props): React.ReactNode => {
  const { t } = useTranslation();

  const getPageRange = () => {
    const range: Array<string | number> = [];
    const maxPagesToShow = 5;
    const totalPagesInRange = Math.min(totalPages, maxPagesToShow);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else if (currentPage <= maxPagesToShow) {
      for (let i = 1; i <= totalPagesInRange; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      range.push(1);
      range.push('...');
      for (let i = totalPages - totalPagesInRange + 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      range.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages);
    }

    return range;
  };

  const pageRange = getPageRange();

  return (
    <>
      {totalPages > 1 && (
        <PaginationNav role="navigation" aria-label="results">
          <PaginationList>
            {currentPage > 1 && (
              <Previous>
                <PaginationLink
                  href={{
                    pathname: `${url}?sort=${order}&page=${currentPage - 1}`,
                  }}
                  rel="prev"
                >
                  <Icon
                    xmlns="http://www.w3.org/2000/svg"
                    height="13"
                    width="15"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 15 13"
                  >
                    <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z" />
                  </Icon>
                  {t('previousPage')}
                </PaginationLink>
              </Previous>
            )}

            {getPageRange().map((page, index) => (
              <PaginationListItem
                key={`pagination-page-${page}-${index}`}
                isCurrent={page === currentPage}
              >
                {page === '...' ? (
                  <span>...</span>
                ) : (
                  <PaginationLink
                    $isCurrent={page === currentPage}
                    aria-label={`Page ${page}`}
                    href={{
                      pathname: `${url}?sort=${order}&page=${pageRange[index]}`,
                    }}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationListItem>
            ))}

            {currentPage < totalPages && (
              <Next>
                <PaginationLink
                  href={{
                    pathname: `${url}?sort=${order}&page=${currentPage + 1}`,
                  }}
                  rel="next"
                >
                  {t('nextPage')}
                  <NextIcon
                    xmlns="http://www.w3.org/2000/svg"
                    height="13"
                    width="15"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 15 13"
                  >
                    <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z" />
                  </NextIcon>
                </PaginationLink>
              </Next>
            )}
          </PaginationList>
        </PaginationNav>
      )}
    </>
  );
};
