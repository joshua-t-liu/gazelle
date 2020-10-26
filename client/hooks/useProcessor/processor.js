import { uniqKey } from '../../helper';
import DataSets from './DataSets';
import { read, readAll, update, updateMultiple, getByIndex } from '../../IndexedDB';

function checkFilter(filters, record, col) {
  return filters.get(col).get(uniqKey(record[col]));
}

function filterData(state, datasets) {
  if (state.filterCategory) {
    return processFilteredDataCb(state, datasets);
  }

  const { data, filters, selectedGroup, x, y } = state;
  const columns = Object.keys(data[0]);

  data.forEach((record) => {
    const groupKey = getGroupKey(selectedGroup, record);

    if (!columns.every((col) => checkFilter(filters, record, col))) {
      datasets.getGroup(groupKey);
      return;
    };

    const { [x]: xVal, [y]: yVal } = record;
    const xKey = uniqKey(xVal);

    processAllCb(record, groupKey, xKey, yVal, state, datasets);
  });
}

function getGroupKey(selectedGroup, record) {
  return Array.from(selectedGroup).map((val) => record[val]).join(',');
}

function getDataSets(state) {
  return new Promise((resolve, reject) => {
    const { graphType, x, dataType, aggregate, filterCategory } = state;

    if (filterCategory) {
      Promise.all([readAll('datasets'), read('labels')])
      .then(([datasets, labels]) => {
        if (!datasets.length) {
          resolve(new DataSets(graphType, aggregate, dataType[x]));
        } else {
          resolve(new DataSets(graphType, aggregate, dataType[x], datasets, labels));
        }
      })
    } else {
      resolve(new DataSets(graphType, aggregate, dataType[x]));
    }
  })
}

function processAllCb(record, groupKey, xKey, yVal, state, dataSets) {
  dataSets.addLabel(xKey);
  dataSets.addData(groupKey, xKey, yVal);
}

function processFilteredDataCb(state, dataSets) {
  const { filterCategory, filterValue, filterStatus, filters, dataType, selectedGroup, x } = state;

  let value = filterValue;

  if (dataType[filterCategory] === 'number') {
    value = Number(filterValue);
  }

  return new Promise((resolve, reject) => {
    getByIndex('raw', filterCategory, value)
    .then((results) => {
      const data = new Map();
      const labels = new Set();

      //separate by groups
      const columns = Object.keys(results[0]);
      results.forEach((record) => {
        if (!columns.every((col) => (col === filterCategory) || checkFilter(filters, record, col) )) return;
        const groupKey = getGroupKey(selectedGroup, record);
        if (!data.get(groupKey)) data.set(groupKey, []);
        data.get(groupKey).push(record);
        const xKey = uniqKey(record[x]);
        labels.add(xKey)
      })

      //pass to each group
      dataSets.adjustData(state, data, labels);
    })
    .then(resolve)
    .catch((err) => reject(err));
  })
}

function process(state) {
  const { x, y } = state;

  if (!x || !y) return {};

  return new Promise((resolve, reject) => {
    let before = new Date();
    let dataSets;

    getDataSets(state)
    .then((result) => dataSets = result)
    .then(() => filterData(state, dataSets))
    .then(() => {
      Promise.all([
        updateMultiple(dataSets.datasets, 'datasets'),
        update(dataSets.labels, 'labels'),
      ]);

      console.log('write', new Date() - before);
      resolve(dataSets.getChartJsDataSets());
    })
    .catch((err) => reject(err));
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