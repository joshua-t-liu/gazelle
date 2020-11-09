import React, { useRef, useEffect, useReducer } from 'react';

import { read, readAll } from '../../IndexedDB';

function initial() {
  return ({
    graphType: 'line',
    dataType: {},
    filters: new Map(),
    groups: new Map(),
    selectedGroup: new Set(),
    x: null,
    y: null,
    aggregate: 'None',
    processed: false,
  });
}

function reducer(state, action) {
  const { type, payload } = action;
  const { category, name, checked, group } = payload;
  let nextState;

  console.time('reducer');

  switch (type) {
    case 'init':
      nextState = { ...initial(), ...payload, results: undefined };
      nextState.selectedGroup.forEach((group) => nextState.groups.set(group, true));
      break;
    case 'filters':
      state.filters.get(category).set(name, checked);
      nextState = {
        filterCategory: category,
        filterValue: name,
        filterStatus: checked
      };
      break;
    case 'filters-all':
      state.filters.get(category).forEach((_, val) => state.filters.get(category).set(val, checked));
      break;
    case 'groups':
      const newGroups = state.selectedGroup;
      state.groups.set(group, !newGroups.has(group));
      if (newGroups.has(group)) {
        newGroups.delete(group);
      } else {
        newGroups.add(group);
      }
      break;
    case 'aggregate':
    case 'x':
    case 'y':
    case 'graph':
      nextState = payload;
      break;
    case 'results':
      nextState = { filterCategory: null, filterValue: null, filterStatus: null, ...payload };
      break;
    default:
      throw new Error();
  }

  console.timeEnd('reducer');

  return {
    ...state,
    ...nextState,
    processed: type === 'results',
  }
}

export default (setIsLoading) => {
  const [state, dispatch] = useReducer(reducer, null, initial);
  // const worker = useRef(new Worker('worker.js'));
  const worker = useRef(null);

  useEffect(() => {
    worker.current = new Worker('worker.js');

    worker.current.onerror = function(event) {
      console.error(event);
    }
    worker.current.onmessage = function(event) {
      console.time('read DB');

      Promise.all([readAll('processed-datasets'), read('processed-labels')])
      .then(([datasets, labels]) => {
        console.timeEnd('read DB');
        dispatch({ type: 'results', payload: { results: { datasets, labels } } });
        setIsLoading(false);
      });
      
    };
  }, []);

  useEffect(() => {
    if (!state.processed && state.x && state.y) {
      setIsLoading(true);
      console.log(state)
      worker.current.postMessage(state);
    }
  }, [state]);

  return [state, dispatch];
};
