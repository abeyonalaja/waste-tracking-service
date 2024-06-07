import styled from 'styled-components';
import { FileUpload as Input } from 'govuk-react';
import { BLACK, YELLOW } from 'govuk-colours';

const StyledInput = styled(Input)`
  > input:focus {
    outline: 3px solid ${YELLOW};
    color: ${BLACK};
    box-shadow: inset 0 0 0 4px ${BLACK};
    text-decoration: none;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
  }
`;

interface FileUploadProps {
  children: React.ReactNode;
}

export function FileUpload({ children }: FileUploadProps): React.ReactNode {
  return <StyledInput>{children}</StyledInput>;
}
