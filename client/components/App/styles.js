import styled from 'styled-components';

import { MIN_WIDTH } from '../helper';

const App = styled.div`
  display: flex;
  font-family: sans-serif;
  width: 100%;
  @media (max-width: ${MIN_WIDTH}) {
    flex-direction: column;
  }
`;

const GraphContainer = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  width: calc(100% - 350px);
  @media (max-width: ${MIN_WIDTH}) {
    width: 100%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: calc(350px - 2em);
  padding: 1em;
  background-color: white;
  z-index: 1;
  @media (max-width: ${MIN_WIDTH}) {
    width: calc(100% - 2em);
  }
`;

export {
  App,
  GraphContainer,
  Form,
};