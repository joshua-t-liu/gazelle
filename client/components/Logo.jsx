import React from 'react';

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

function nextColor(index = 0) {
  return [COLORS[index % COLORS.length], BACKGROUND_COLORS[index % BACKGROUND_COLORS.length]];
}

export default ({ name }) => {
  return (
    <div style={{ padding: '0.1em', fontSize: '5em', fontWeight: 'bold' }}>
      {name.split('').map((char, index) => {
        const [color, background] = nextColor(index);
        return (
          <span key={String(index)} style={{ color }}>
            {char}
          </span>
        )
      })}
    </div>
  )
};
