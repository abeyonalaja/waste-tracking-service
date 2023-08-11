import React, { ReactNode } from 'react';
import { AppLink } from './AppLink';
import { savePDF } from '../utils/savePDF';

interface Props {
  id?: string;
  submissionId: string;
  transactionId?: string;
  children?: ReactNode;
}

export const DownloadPDFLink = ({
  id,
  submissionId,
  transactionId,
  children,
}: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleClick = (e) => {
    if (loading) {
      return;
    }
    setLoading(true);
    savePDF(submissionId, transactionId).then(() => {
      setLoading(false);
    });
    e.preventDefault();
  };
  return (
    <AppLink
      href="#"
      noVisitedState={true}
      id={id}
      disabled={loading}
      onClick={handleClick}
    >
      {children
        ? children
        : 'download the Annex VII documents created from this export (PDF, 2 pages)'}
    </AppLink>
  );
};
