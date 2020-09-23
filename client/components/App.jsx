import React from 'react';
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

const App = styled.div`
  display: flex;
  font-family: sans-serif;
  width: 100%;
`;

const GraphContainer = styled.div`
  height: 100%;
  position: sticky;
  top: 8px;
  width: calc(100% - 350px);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 1em 0;
`;


export default () => {
  const [state, dispatch] = useProcessor();
  const [layoutState, dispatchLayout] = useGraphOpt();

  useExample((payload) => dispatch({ type: 'init', payload }));

  return (
    <App>
      {/* {isLoading && <Spinner />} */}
      <GraphContainer>
        <div>
          <Logo name='EasyChart' />
        </div>
        <Graph
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
