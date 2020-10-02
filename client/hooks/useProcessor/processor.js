import { uniqKey } from '../../helper';
import DataSets from './DataSets';

function checkFilter(filters, record, col) {
  return filters.get(col).get(uniqKey(record[col]));
}

function filterData(data, filters, x, y, cb) {
  if (!cb) return null;
  const columns = Object.keys(data[0]);

  data.forEach((record) => {
    if (!columns.every((col) => checkFilter(filters, record, col))) return;
    cb(record);
  });
}

function process(state) {
  const { data, graphType, filters, selectedGroup, x, y, dataType, aggregate } = state;

  if (!x || !y) return {};

  const dataSets = new DataSets(graphType, aggregate, dataType[x]);

  filterData(data, filters, x, y, (record) => {
    const groupKey = Array.from(selectedGroup).map((val) => record[val]).join(',');
    const { [x]: xVal, [y]: yVal } = record;
    const xKey = uniqKey(xVal);
    dataSets.addLabel(xVal);
    dataSets.addData(groupKey, xVal, yVal);
  });

  return dataSets.getChartJsDataSets();
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