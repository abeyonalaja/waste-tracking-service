import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFLayout } from './PDFLayout';
import { Submission } from '@wts/api/waste-tracking-gateway';
import styled from 'styled-components';
import { LINK_COLOUR, BLACK, YELLOW } from 'govuk-colours';

interface Props {
  id?: string;
  submissionId: string;
  transactionId?: string | undefined;
  children?: ReactNode;
  data: Submission;
}

const StyledPDFDownloadLink = styled(PDFDownloadLink)`
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: underline;
  text-decoration-thickness: max(1px, 0.0625rem);
  text-underline-offset: 0.15em;
  color: ${LINK_COLOUR};
  font-weight: 400;
  font-size: 16px;
  line-height: 1.25;
  @media (min-width: 40.0625em) {
    font-size: 19px;
    line-height: 1.3;
  }
  &:hover {
    color: #003078;
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
`;

export const DownloadPDFLink = ({ transactionId, children, data }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledPDFDownloadLink
        document={
          <PDFLayout
            title="Annex VII"
            author="DEFRA"
            description=""
            data={data}
          />
        }
        fileName={`Annex VII ${transactionId}.pdf`}
      >
        {({ loading }) =>
          loading
            ? 'Loading document...'
            : children
              ? children
              : t('exportJourney.downloadPDFLinkText')
        }
      </StyledPDFDownloadLink>
    </>
  );
};
