import React, { ReactNode } from 'react';
import styled from 'styled-components';

const TableStyled = styled.table`
  line-height: 1.25;
  color: #0b0c0c;
  width: 100%;
  margin-bottom: 20px;
  border-spacing: 0;
  border-collapse: collapse;
  font-size: 16px;
  @media (min-width: 40.0625em) {
    font-size: 19px;
  }
`;

const HeadStyled = styled.thead`
  display: none;
  @media (min-width: 40.0625em) {
    display: table-header-group;
  }
`;
const BodyStyled = styled.tbody``;
const RowStyled = styled.tr`
  margin-bottom: 10px;
  display: block;
  float: left;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid #b1b4b6;
  @media (min-width: 40.0625em) {
    display: table-row;
    border: none;
    float: none;
    margin: 0;
  }
`;

type CellHeaderStyledProps = {
  $setWidth?: string;
  $textAlign?: 'left' | 'right';
};

const CellHeaderStyled = styled.th<CellHeaderStyledProps>`
  padding: ${(props) =>
    props.$textAlign === 'right' ? '10px 0' : '10px 20px 10px 0'};
  border-bottom: 1px solid #b1b4b6;
  text-align: left;
  vertical-align: top;
  width: ${(props) =>
    props.$setWidth !== undefined ? props.$setWidth : 'auto'};
  @media (min-width: 40.0625em) {
    text-align: ${(props) =>
      props.$textAlign !== undefined ? props.$textAlign : 'left'};
  }
`;

interface CellStyledProps {
  bold?: boolean;
  $textAlign?: 'left' | 'right';
}

const CellStyled = styled.td<CellStyledProps>`
  display: block;
  text-align: right;
  vertical-align: top;
  clear: left;
  float: left;
  width: 100%;
  padding: 10px 10px 8px;
  box-sizing: border-box;
  border-bottom: 1px dotted #b1b4b6;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  &:last-child {
    border: none;
    @media (min-width: 40.0625em) {
      border-bottom: 1px solid #b1b4b6;
    }
  }
  &:before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    padding-right: 10px;
    @media (min-width: 40.0625em) {
      display: none;
    }
  }
  @media (min-width: 40.0625em) {
    display: table-cell;
    float: none;
    clear: none;
    padding: ${(props) =>
      props.$textAlign === 'right' ? '10px 0' : '10px 20px 10px 0'};
    border-bottom-style: solid;
    width: auto;
    text-align: ${(props) =>
      props.$textAlign !== undefined ? props.$textAlign : 'left'};
  }
`;

export const Table = ({ children }) => {
  return <TableStyled>{children}</TableStyled>;
};

export const Thead = ({ children }) => {
  return <HeadStyled>{children}</HeadStyled>;
};

export const Tbody = ({ children }) => {
  return <BodyStyled>{children}</BodyStyled>;
};

export const Row = ({ children }) => {
  return <RowStyled>{children}</RowStyled>;
};

export const CellHeader = ({
  children,
  setWidth,
  textAlign,
  scope = 'col',
}: {
  children?: ReactNode;
  setWidth?: string;
  textAlign?: 'left' | 'right';
  scope?: 'col' | 'row';
}) => {
  return (
    <CellHeaderStyled $setWidth={setWidth} $textAlign={textAlign} scope={scope}>
      {children}
    </CellHeaderStyled>
  );
};

export const Cell = ({
  bold,
  children,
  label,
  textAlign,
}: {
  bold?: boolean;
  children?: React.ReactNode;
  label?: string;
  textAlign?: 'left' | 'right';
}) => {
  return (
    <CellStyled bold={bold} data-label={label} $textAlign={textAlign}>
      {children}
    </CellStyled>
  );
};
