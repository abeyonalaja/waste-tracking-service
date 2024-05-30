'use client';

import { ReactNode } from 'react';
interface Props {
  multiplesId: string;
  token: string | null | undefined;
  filename: string;
  children: ReactNode;
}

export function DownloadCSVLink({
  multiplesId,
  token,
  filename,
  children,
}: Props): JSX.Element {
  function downloadCSVFile(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/ukwm-batches/${multiplesId}/download`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.blob())
      .then((blob) => {
        const tempLink = document.createElement('a');
        tempLink.href = window.URL.createObjectURL(new Blob([blob]));
        tempLink.setAttribute('download', filename);
        tempLink.click();
      });
  }
  return (
    <a
      className={'govuk-link govuk-link--no-visited-state'}
      href={'#'}
      onClick={downloadCSVFile}
    >
      {children}
    </a>
  );
}
