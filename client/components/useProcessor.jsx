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
  const { data, category, name, checked, group } = payload;
  let nextState;

  switch (type) {
    case 'init':
      nextState = { ...initial(), ...payload, ...init(data) };
      nextState.selectedGroup.forEach((group) => nextState.groups.set(group, true));
      break;
    case 'filters':
      state.filters.get(category).set(name, checked);
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
    default:
      throw new Error();
  }

  const results = processData({ ...state, ...nextState });

  return {
    ...state,
    ...nextState,
    results,
  }
}

export default () => useReducer(reducer, null, initial);
