import { uniqKey } from '../../helper';
import DataSets from './DataSets';
import { open, read, update } from '../../IndexedDB';

function checkFilter(filters, record, col) {
  return filters.get(col).get(uniqKey(record[col]));
}

function filterData(state, datasets, cb) {
  if (!cb) return null;
  const { data, filters} = state;
  const columns = Object.keys(data[0]);

  data.forEach((record) => {
    if (!columns.every((col) => checkFilter(filters, record, col))) return;
    cb(record, state, datasets);
  });
}

function getDataSets(state) {
  const { graphType, x, dataType, aggregate } = state;

  return (
    open()
    .then(() => read('datasets'))
    .then((result) => {
      if (!result) return update(new DataSets(graphType, aggregate, dataType[x]), 'datasets');
      return new DataSets(graphType, aggregate, dataType[x], result.datasets, result.labels);
    })
  )
}

function processAll(resolve, reject, state) {
  let before = new Date();
  let dataSets;

  getDataSets(state)
  .then((result) => dataSets = result)
  .then(() => filterData(state, dataSets, processAllCb))
  .then(() => {
    console.log(new Date() - before);
    resolve(dataSets.getChartJsDataSets());
  })
  .catch((err) => reject(err));
}

function processAllCb(record, state, dataSets) {
  const { selectedGroup, x, y } = state;

  const groupKey = Array.from(selectedGroup).map((val) => record[val]).join(',');
  const { [x]: xVal, [y]: yVal } = record;
  const xKey = uniqKey(xVal);
  dataSets.addLabel(xVal);
  dataSets.addData(groupKey, xVal, yVal);
}

function processFilteredData(record, state, dataSets) {

}

function process(state, filter, val, filterStatus) {
  const { x, y } = state;
  if (!x || !y) return {};

  return new Promise((resolve, reject) => {
    if (filter) {

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