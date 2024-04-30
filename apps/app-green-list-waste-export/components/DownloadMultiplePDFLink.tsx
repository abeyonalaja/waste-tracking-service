import React, {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  RefObject,
} from 'react';
import { PDFLayout } from './PDFLayout';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { AppLink } from './index';
import styled from 'styled-components';
import { LINK_COLOUR, BLACK, YELLOW } from 'govuk-colours';
import { Submission } from '@wts/api/waste-tracking-gateway';

interface Props {
  id?: string;
  submissionId: string;
  transactionId?: string | undefined;
  children?: ReactNode;
  apiConfig: HeadersInit;
}

interface PDFContainerProps {
  loading: boolean;
  onLoadingFinished: () => void;
  linkText?: ReactNode;
}

const DownloadLoading = styled.span`
  color: #555;
  cursor: progress;
`;

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
    box-shadow: 0 -2px ${YELLOW}, 0 4px #0b0c0c;
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

export const DownloadMultiplePDFLink = ({
  submissionId,
  transactionId,
  children,
  apiConfig,
}: Props) => {
  const [showLink, setShowLink] = useState<boolean>(false);
  const [action, setAction] = useState<boolean>(false);
  const [pdfData, setPdfData] = useState<Submission[]>();
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/batches/${submissionId}/submissions?submitted=true`,
        { headers: apiConfig }
      )
        .then((response) => response.json())
        .then((data) => {
          setPdfData(data);
          setShowLink(true);
        });
    };
    fetchData();
  }, [submissionId]);

  const handleClick = async (e) => {
    e.preventDefault();
    setAction(true);
  };

  const onLoadingFinished = useCallback(function () {
    const elem = downloadLinkRef?.current;
    if (elem !== null) {
      elem.click();
    }
  }, []);

  return (
    <>
      {!action && showLink && (
        <AppLink href={'#'} onClick={handleClick}>
          {children}
        </AppLink>
      )}
      {action && (
        <StyledPDFDownloadLink
          document={
            <PDFLayout
              title="Annex VII"
              author="DEFRA"
              description=""
              data={pdfData}
            />
          }
          fileName={`Annex VII ${transactionId}.pdf`}
        >
          {({ loading }) => (
            <PDFDownloadLinkContainer
              loading={loading}
              onLoadingFinished={onLoadingFinished}
              linkText={children}
              ref={downloadLinkRef}
            />
          )}
        </StyledPDFDownloadLink>
      )}
    </>
  );
};

const PDFDownloadLinkContainer = forwardRef(function PDFDownloadLinkContainer(
  { loading, onLoadingFinished, linkText }: PDFContainerProps,
  ref
) {
  useEffect(() => {
    if (!loading) {
      onLoadingFinished();
    }
  }, [loading]);
  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      {loading ? <DownloadLoading>{linkText}</DownloadLoading> : linkText}
    </div>
  );
});
