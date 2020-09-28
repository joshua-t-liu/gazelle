import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import Logo from './Logo';
import Spinner from './Spinner';
import Graph from './Graph';
import FileCSV from './FileCSV';
import GraphSelect from './GraphSelect';
import Variable from './Variable';
import Filters from './Filters';
import GroupBy from './GroupBy';
import Layout from './Layout';
import useProcessor from './useProcessor';
import useGraphOpt from './useGraphOpt';
import useExample from './useExample';
import List from './List';

const MIN_WIDTH = '768px';

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


export default () => {
  const [state, dispatch] = useProcessor();
  const [layoutState, dispatchLayout] = useGraphOpt();
  const [offsetHeight, setOffsetHeight] = useState(null);
  const ref = useRef(null);

  useExample((payload) => dispatch({ type: 'init', payload }));

  useEffect(() => {
    setOffsetHeight(ref.current.offsetHeight)
    window.addEventListener('resize', () => setOffsetHeight(ref.current.offsetHeight));
  }, [])


  // const tst = Array(100000).fill().map(() => Array(Math.floor(1000 * Math.random())).fill('#').join(' '));

  return (
    <App>
      {/* <List Component={({item}) => <div style={{ border: 'solid 1px' }}>{item}</div>} list={tst}/> */}
      {/* {isLoading && <Spinner />} */}
      <GraphContainer>
        <div ref={ref}>
          <Logo name='Chartsy' />
        </div>
        <Graph
          height={offsetHeight}
          layoutState={layoutState}
          graphType={state.graphType}
          data={state.results}
          dataType={state.dataType}
          x={state.x}
          y={state.y}
          dispatch={dispatch} />
      </GraphContainer>
      <Form>
        <FileCSV dispatch={dispatch} />
        <GraphSelect
          graphType={state.graphType}
          dispatch={dispatch} />
        <Variable
          groups={state.groups}
          aggregate={state.aggregate}
          x={state.x}
          y={state.y}
          dispatch={dispatch} />
        <Filters
          filters={state.filters}
          dispatch={dispatch} />
        <GroupBy
          groups={state.groups}
          dispatch={dispatch} />
        <Layout
          state={layoutState}
          dispatch={dispatchLayout} />
      </Form>
    </App>
  );
};
