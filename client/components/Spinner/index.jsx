import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';

const appear = keyframes`
  to {
    opacity: 1;
  }
`;

const SpinnerWrapper = styled.div`
  position: fixed;
  top: 50%;
  left 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  animation: ${appear} 0s 0.1s linear forwards;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Wheel = styled.div`
  position: relative;
  height: ${({ size }) => `${size}em`};
  width: ${({ size }) => `${size}em`};
  flex-shrink: 0;
  animation: ${({ n }) => css`${spin} 1s 0s steps(${n}) infinite`};
`;

const Circle = styled.div`
  position: absolute;
  border-radius: 50%;
  padding: 0.5em;
  background-color: ${({ alpha = 1 }) => `rgba(30, 144, 255, ${alpha})`};
  top: 50%;
  left: 50%;
  transform: ${({ x, y }) => `translate(calc(-50% + ${x}em), calc(-50% + ${y}em))`};
`;

const Spinner = ({ n = 8, size = 5 }) => (
  <SpinnerWrapper>
    <Wheel size={size} n={n}>
      {Array(n).fill(0).map((_, idx) => (
        <Circle
          key={idx}
          alpha={(idx + 0.5) / n}
          x={(size / 2) * Math.cos(2 * Math.PI * idx / n)}
          y={(size / 2) * Math.sin(2 * Math.PI * idx / n)}
        />
      ))}
    </Wheel>
  </SpinnerWrapper>
);

export default Spinner;
