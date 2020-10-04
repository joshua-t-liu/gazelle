import { uniqKey } from '../../helper';
import DataSets from './DataSets';
import { open, read, readAll, update, updateMultiple } from '../../IndexedDB';

function checkFilter(filters, record, col) {
  return filters.get(col).get(uniqKey(record[col]));
}

function filterData(state, datasets, cb) {
  if (!cb) return null;

  const { data, filters, selectedGroup, x, y } = state;
  const columns = Object.keys(data[0]);

  data.forEach((record) => {
    if (!columns.every((col) => checkFilter(filters, record, col))) return;

    const groupKey = Array.from(selectedGroup).map((val) => record[val]).join(',');
    const { [x]: xVal, [y]: yVal } = record;
    const xKey = uniqKey(xVal);

    cb(record, groupKey, xKey, yVal, state, datasets);
  });
}

function getDataSets(state) {
  const { graphType, x, dataType, aggregate } = state;
  return (
    open()
    .then(() => Promise.all([readAll('datasets'), read('labels')]))
    .then(([datasets, labels]) => {
      if (!datasets.length) return new DataSets(graphType, aggregate, dataType[x]);
      return new DataSets(graphType, aggregate, dataType[x], datasets, labels);
    })
  )
}

function processAll(resolve, reject, state) {
  let before = new Date();
  let dataSets;

  getDataSets(state)
  .then((result) => dataSets = result)
  .then(() => filterData(state, dataSets, processAllCb))
  .then(() => Promise.all([
    updateMultiple(dataSets.datasets, 'datasets'),
    update(dataSets.labels, 'labels'),
  ]))
  .then(() => {
    console.log(new Date() - before);
    resolve(dataSets.getChartJsDataSets());
  })
  .catch((err) => reject(err));
}

function processAllCb(record, groupKey, xKey, yVal, state, dataSets) {
  dataSets.addLabel(xKey);
  dataSets.addData(groupKey, xKey, yVal);
}

function processFilteredDataCb(record, groupKey, xKey, yVal, state, dataSets) {
  const { filterCategory, filterValue, filterStatus } = state;
  const { [filterCategory]: filtVal,  } = record;
}

function processFilteredData(resolve, reject, state) {
  let before = new Date();
  let dataSets;

  getDataSets(state).then((result) => dataSets = result)
  .then(() => filterData(state, dataSets, processFilteredDataCb))
  .then(() => Promise.all([
    updateMultiple(dataSets.datasets, 'datasets'),
    update(dataSets.labels, 'labels'),
  ]))
  .then(() => {
    resolve(dataSets.getChartJsDataSets());
  })
  .catch((err) => reject(err));
}

function process(state) {
  const { x, y, filterCategory } = state;

  if (!x || !y) return {};

  return new Promise((resolve, reject) => {
    if (filterCategory) {
      processFilteredData(resolve, reject, state);
    } else {
      processAll(resolve, reject, state);
    }
  })
}

function preProcess(data) {
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

export {
  process,
  preProcess,
}