import React, { useState, useReducer } from 'react';

import { uniqKey } from '../helper';
import { processData } from '../chartJsDataset';

function initial() {
  return ({
    graphType: 'line',
    data: {},
    dataType: {},
    filters: new Map(),
    groups: new Map(),
    selectedGroup: new Set(),
    x: null,
    y: null,
    aggregate: 'Sum',
  });
}

function init(data, type) {
  const filters = new Map();
  const groups = new Map();
  const columns = Object.keys(data[0]);

  columns.forEach((col) => {
    filters.set(col, new Map());
    groups.set(col, false);

    data.forEach((record) => filters.get(col).set(uniqKey(record[col]), true));
  });

  return {
    filters,
    groups,
  };
}

function reducer(state, action) {
  const { type, payload } = action;
  let nextState;

  switch (type) {
    case 'init':
      const { filters, groups } = init(payload.data);
      nextState = { ...initial(), ...payload, filters, groups };
      nextState.selectedGroup.forEach((group) => nextState.groups.set(group, true));
      break;
    case 'filters':
      nextState = { ...state };
      nextState.filters.get(payload.category).set(payload.name, payload.checked);
      break;
    case 'filters-all':
      nextState = { ...state };
      const newFilters = nextState.filters.get(payload.category);
      newFilters.forEach((_, val) => newFilters.set(val, payload.checked));
      break;
    case 'groups':
      nextState = { ...state };
      const newGroups = nextState.selectedGroup;
      const group = payload.group;
      nextState.groups.set(group, !newGroups.has(group));
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
      nextState = { ...state, ...payload }
      break;
    default:
      console.error(type)
      throw new Error();
  }

  const results = processData(nextState);

  return {
    ...nextState,
    results,
  }
}

export default () => useReducer(reducer, null, initial);
