import React from 'react';
import styled from 'styled-components';

const COLORS = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
];

const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)'
];

const MIN_WIDTH = '768px';

const Logo = styled.div`
  padding: 0.1em;
  font-size: 5em;
  font-weight: bold;
  @media (max-width: ${MIN_WIDTH}) {
    font-size: 3em;
    text-align: center;
  }
`;

function nextColor(index = 0) {
  return [COLORS[index % COLORS.length], BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]];
}

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
