import React, { useState, useRef, useEffect } from 'react';

import { App, GraphContainer, Form } from './styles'
import Logo from '../Logo';
import Spinner from '../Spinner';
import Graph from '../Graph';
import FileCSV from '../FileCSV';
import GraphSelect from '../GraphSelect';
import Variable from '../Variable';
import Filters from '../Filters';
import GroupBy from '../GroupBy';
import Layout from '../Layout';
import useProcessor from '../../hooks/useProcessor';
import useGraphOpt from '../../hooks/useGraphOpt';
import useExample from '../../hooks/useExample';

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [offsetHeight, setOffsetHeight] = useState(null);
  const [state, dispatch] = useProcessor(setIsLoading);
  const [layoutState, dispatchLayout] = useGraphOpt();
  const ref = useRef(null);

  useExample((payload) => dispatch({ type: 'init', payload }));

  useEffect(() => {
    setOffsetHeight(ref.current.offsetHeight)
    window.addEventListener('resize', () => setOffsetHeight(ref.current.offsetHeight));
  }, []);

  return (
    <App>
      {isLoading && <Spinner />}
      <GraphContainer>
        <div ref={ref}>
          <Logo name='CHARTSY' />
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
        <FileCSV
          setIsLoading={setIsLoading}
          data={state.data}
          dispatch={dispatch} />
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
