import styled from 'styled-components';

const Graph = styled.div`
  position: relative;
  height: ${({ height }) => (height) ? `calc(100% - ${height}px - 2em)` : null};
  width: calc(100% - 2em);
  flex-shrink: 0;
  padding: 1em;
`;

export {
  Graph,
}