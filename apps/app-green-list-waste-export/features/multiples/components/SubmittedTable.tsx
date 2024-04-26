import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import * as GovUK from 'govuk-react';
import { Tag } from 'components';
import { Table, Thead, Tbody, Row, CellHeader, Cell } from 'components/Table';
import { Transaction, formatDate } from 'features/multiples';

const InlineStatusRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px dotted #b1b4b6;
  padding-top: 9px;
  padding-bottom: 2px;
  margin-top: 6px;
  gap: 10px;
  @media (min-width: 40.0625em) {
    display: block;
    padding: 0;
    margin-top: 10px;
    border: none;
  }
`;

const StatusLabel = styled.div`
  @media (min-width: 40.0625em) {
    display: none;
  }
`;

interface SubmittedTableProps {
  transactions: Transaction[];
  apiConfig: HeadersInit;
  sortOrder: string | string[];
  pageNumber: number;
}

export function SubmittedTable({
  transactions,
  sortOrder,
  pageNumber,
}: SubmittedTableProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Table>
        <Thead>
          <Row>
            <CellHeader setWidth="15%">
              {t('multiples.submitted.table.transactionNumber')}
            </CellHeader>
            <CellHeader setWidth="15%">
              {t('multiples.submitted.table.collectionDate')}
            </CellHeader>
            <CellHeader setWidth="50%">
              {t('multiples.submitted.table.wasteCode')}
            </CellHeader>
            <CellHeader setWidth="15%">
              {t('multiples.submitted.table.uniqueReference')}
            </CellHeader>
            <CellHeader setWidth="15%" textAlign={'right'}>
              {t('multiples.submitted.table.action')}
            </CellHeader>
          </Row>
        </Thead>
        <Tbody>
          {transactions.map((transaction) => (
            <Row key={transaction.reference}>
              <Cell
                bold
                label={t('multiples.submitted.table.transactionNumber')}
              >
                {transaction.submissionDeclaration.transactionId}
                {transaction.hasEstimates && (
                  <InlineStatusRow>
                    <StatusLabel>Submission contains</StatusLabel>
                    <Tag>Estimates</Tag>
                  </InlineStatusRow>
                )}
              </Cell>
              <Cell label={t('multiples.submitted.table.collectionDate')}>
                {formatDate(transaction)}
              </Cell>
              <Cell label={t('multiples.submitted.table.wasteCode')}>
                <>
                  {transaction.wasteDescription.ewcCodes[0]['code']}:{' '}
                  {transaction.wasteDescription.description}
                </>
              </Cell>
              <Cell label={t('multiples.submitted.table.uniqueReference')}>
                {transaction.reference}
              </Cell>
              <Cell
                label={t('multiples.submitted.table.action')}
                textAlign={'right'}
              >
                <GovUK.Link
                  href={`/multiples/${router.query.id}/view/${transaction.id}?sort=${sortOrder}&page=${pageNumber}`}
                >
                  {t('multiples.submitted.table.link')}
                </GovUK.Link>
              </Cell>
            </Row>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
