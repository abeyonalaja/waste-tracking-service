import styled from 'styled-components';

const Main = styled.main`
  @media screen {
    padding: 30px;
    background: #eee;
  }
`;

export default function PDFLayout({ children }) {
  return <Main>{children}</Main>;
}
