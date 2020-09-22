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
import useProcessor from './useProcessor';
import useExample from './useExample';

const App = styled.div`
  display: flex;
  font-family: sans-serif;
  width: 100%;
`;

export default () => {
  const [state, dispatch] = useProcessor();

  useExample((payload) => dispatch({ type: 'init', payload }));

  return (
    <App>
      {/* {isLoading && <Spinner />} */}
      <div style={{ height: '100%', position: 'sticky', top: '8px', width: 'calc(100% - 350px)' }}>
        <div>
          <Logo name='EasyChart' />
        </div>
        <Graph
          graphType={state.graphType}
          data={state.results}
          dataType={state.dataType}
          x={state.x}
          y={state.y}
          dispatch={dispatch} />
      </div>
      <form style={{ display: 'flex', flexDirection: 'column', width: '350px' }}>
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
      </form>
    </App>
  );
};
