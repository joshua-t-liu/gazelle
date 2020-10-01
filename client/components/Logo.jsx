import React from 'react';
import styled from 'styled-components';
import { COLORS, BACKGROUND_COLORS, MIN_WIDTH, nextColor } from '../helper';

const Logo = styled.div`
  padding: 0.1em;
  font-size: 5em;
  font-weight: bold;
  @media (max-width: ${MIN_WIDTH}) {
    font-size: 3em;
    text-align: center;
  }
`;

export default ({ name }) => {
  return (
    <Logo>
      {name.split('').map((char, index) => {
        const [color, background] = nextColor(index);
        return (
          <span key={String(index)} style={{ color }}>
            {char}
          </span>
        )
      })}
    </Logo>
  )
};
