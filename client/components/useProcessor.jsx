import React, { useState, useReducer } from 'react';

const COLORS = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'
];

const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)'
];

function nextColor(type, index = 0) {
  switch (type) {
    case 'color':
      return COLORS[index % COLORS.length];
    case 'background':
      return BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
    default:
      return COLORS[index % COLORS.length];
  }
}

function alphabeticalSort(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function numericalSort(a, b) {
  return a - b;
}

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
  });
}

function init(data, type) {
  const filters = new Map();
  const groups = new Map();
  const columns = Object.keys(data[0]);

  columns.forEach((col) => {
    filters.set(col, new Map());
    groups.set(col, false);
  });

  data.forEach((record) => {
    columns.forEach((col) => {
      if (typeof record[col] === 'object') {
        filters.get(col).set(record[col].toString(), true);
      } else {
        filters.get(col).set(String(record[col]), true);
      }
    })
  });

  return {
    filters,
    groups,
  };
}

function createDataSet(label, data, index, graphType) {
  const fill = graphType === 'area';
  const borderWidth = (graphType === 'bar' || graphType === 'pie' || graphType === 'doughnut') ? 1 : null;
  return ({
    label,
    fill,
    borderColor: nextColor('color', index),
    backgroundColor: nextColor('background', index),
    borderWidth,
    pointBackgroundColor: nextColor('background', index),
    pointBorderColor: nextColor('color', index),
    pointBorderWidth: 1,
    lineTension: 0,
    data,
  })
}

function setMultiColors(dataset) {
  const size = dataset.data.length;
  dataset.borderColor = [];
  dataset.backgroundColor = [];
  dataset.pointBackgroundColor = [];
  dataset.pointBorderColor = [];

  let i = 0;
  while(i < size) {
    dataset.borderColor.push(nextColor('color', i));
    dataset.backgroundColor.push(nextColor('background', i));
    dataset.pointBackgroundColor.push(nextColor('background', i)),
    dataset.pointBorderColor.push(nextColor('color', i)),
    i++;
  }
}

function processData(state) {
  const { graphType, data, filters, selectedGroup, x, y, dataType } = state;

  if (!x && !y) return {};

  const groups = new Map();
  const labels = new Set();

  filterData(data, filters, x, y, (record) => {
    const key = Array.from(selectedGroup).map((val) => record[val]).join(',');
    labels.add(record[x]);

    switch (graphType) {
      case 'line':
      case 'scatter':
      case 'area':
        if (!groups.get(key)) groups.set(key, []);
        groups.get(key).push({ x: record[x], y: record[y] });
        break;
      case 'bar':
      case 'pie':
      case 'doughnut':
        if (!groups.get(key)) groups.set(key, new Map());
        const prev =  groups.get(key).get(record[x]) || 0;
        groups.get(key).set(record[x], prev + (record[y] || 0));
        break;
      case 'bubble':
      case 'radar':
      default:
        return {};
    }
  });

  const datasets = createDataSets(groups, labels, graphType);

  const sortedLabels = sortDataSets(labels, datasets, dataType[x], graphType);

  return { datasets, labels: sortedLabels };
}

function createDataSets(groups, labels, graphType) {
  const datasets = [];
  let index = 0;

  groups.forEach((data, label) => {
    let updatedData = data;
    switch (graphType) {
      case 'bar':
      case 'pie':
      case 'doughnut':
        updatedData = Array.from(labels).map((x) => data.get(x));
      default:
        datasets.push(createDataSet(label, updatedData, index++, graphType));
        break;
    }
    if (graphType === 'pie' || graphType === 'doughnut') setMultiColors(datasets[datasets.length - 1]);
    if (groups.size === 1 && graphType === 'bar') setMultiColors(datasets[0]);
  });

  return datasets;
}

function sortDataSets(labels, datasets, dataType, graphType) {
  let sortedLabels;
  const sortFunc = (dataType === 'number') ? numericalSort : alphabeticalSort;

  switch (graphType) {
    case 'line':
    case 'scatter':
    case 'area':
      sortedLabels = Array.from(labels).sort(({ x: x1 }, { x: x2 }) => sortFunc(x1, x2));
      datasets.forEach(({ data }) => data.sort(({ x: x1 }, { x: x2 }) => sortFunc(x1, x2)));
      break;
    case 'bar':
    case 'pie':
    case 'doughnut':
      labels = Array.from(labels).map((val, idx) => [val, idx]);
      labels.sort(([a, i], [b, j]) => sortFunc(a, b));
      datasets.forEach((dataset) => {
        dataset.data = labels.map(([_, index]) => dataset.data[index]);
      });
      sortedLabels = labels.map(([val, _]) => val);
      break;
    case 'bubble':
    case 'radar':
    default:
      return {};
  }

  return sortedLabels;
}

function checkFilter(filters, record, col) {
  if (typeof record[col] === 'object') {
    return filters.get(col).get(record[col].toString());
  } else {
    return filters.get(col).get(String(record[col]));
  }
}

function filterData(data, filters, x, y, cb) {
  if (!cb) return null;
  const columns = Object.keys(data[0]);

  data.forEach((record) => {
    if (!columns.every((col) => checkFilter(filters, record, col))) return;
    cb(record);
  });
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
    case 'x':
    case 'y':
    case 'graph':
      nextState = { ...state, ...payload }
      break;
    default:
      throw new Error();
  }

  const results = processData(nextState);

  return {
    ...nextState,
    results,
  }
}

export default () => useReducer(reducer, null, initial);
