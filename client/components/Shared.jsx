import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  font-weight: bold;
  font-size: 1.25em;
  border-bottom: solid 0.1em;
`;

const SubHeader = styled.div`
`;

const StyledRow = styled.div`
  position: relative;
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
`;

const StyledFieldSet = styled.fieldset`
  display: flex;
  flex-direction: column;
  border: none;
`;

const Counter = styled.div`
  padding: 0.5em;
  margin: 0.5em;
  border: solid 1px;
  border-radius: 0.2em;
  text-align: center;
  cursor: pointer;
  background-color: white;
  color: dodgerblue;
`;

const Button = styled(Counter)`
  cursor: pointer;
  &.active, &:hover {
    background-color: dodgerblue;
    color: white;
    font-weight: bold;
  }
`;

const Row = ({ subheader, children }) => {
  return (
    <StyledRow>
      {subheader && <SubHeader>{subheader}</SubHeader>}
      {children}
    </StyledRow>
  )
}

const FieldSet = ({ header, children }) => {
  return (
    <StyledFieldSet>
      <Header>{header}</Header>
      {children}
    </StyledFieldSet>
  )
}

export {
  FieldSet,
  Header,
  SubHeader,
  Counter,
  Button,
  Row,
}