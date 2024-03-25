import { useRouter } from 'next/router';
import styled from 'styled-components';
import { BackLink } from 'govuk-react';
import { BreadcrumbWrap } from 'components';

const BreadCrumbPlaceholder = styled.div`
  height: 40px;
`;

interface FeedbackBreadCrumbsProps {
  newWindow: boolean;
}

export default function FeedbackBreadCrumbs({
  newWindow,
}: FeedbackBreadCrumbsProps) {
  const router = useRouter();

  if (!newWindow) {
    return (
      <BreadcrumbWrap>
        <BackLink
          href="#"
          onClick={() => {
            router.back();
          }}
        ></BackLink>
      </BreadcrumbWrap>
    );
  }

  return <BreadCrumbPlaceholder />;
}
