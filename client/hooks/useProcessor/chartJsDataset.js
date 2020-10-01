import { nextColor, alphabeticalSort, numericalSort, setMultiColors, uniqKey } from '../../helper';

function createDataSet(label, data, index, graphType, groupSize) {
  let colors = {};
  let fill = false;

  switch (graphType) {
    case 'area':
      fill = true;
      break;
    case 'bar':
      if (groupSize === 1) colors = setMultiColors(data.length);
      break;
    case 'pie':
    case 'doughnut':
      colors = setMultiColors(data.length);
      break;
    default:
      break;
  }

  return {
    label,
    fill,
    borderColor: nextColor('color', index),
    backgroundColor: nextColor('background', index),
    borderWidth: 1,
    pointBackgroundColor: nextColor('background', index),
    pointBorderColor: nextColor('color', index),
    pointBorderWidth: 1,
    lineTension: 0,
    data,
    ...colors,
  };
}

function getAccumFuncs(aggregate, groups, counts) {
  let func;
  const accumFuncs = new Map([[counts, (accum = 0, b) => isNaN(Number(b)) ? accum : accum + 1]]);

  switch (aggregate) {
    case 'Max':
      func = (accum = Number.NEGATIVE_INFINITY, b) => isNaN(Number(b)) ? accum : Math.max(accum, b);
      accumFuncs.set(groups, func);
      break;
    case 'Min':
      func = (accum = Number.POSITIVE_INFINITY, b) => isNaN(Number(b)) ? accum : Math.min(accum, b);
      accumFuncs.set(groups, func);
      break;
    default:
      accumFuncs.set(groups, (accum, b) => (accum || 0) + (b || 0));
      break;
  }

  return accumFuncs;
}

function aggregateData(aggregate, graphType, groups, counts) {
  if (graphType === 'scatter') return;
  switch (aggregate) {
    case 'Count':
      groups.forEach((data, group) => {
        data.forEach((y, x) => data.set(x, counts.get(group).get(x)));
      })
      break;
    case 'Average':
      groups.forEach((data, group) => {
        data.forEach((y, x) => data.set(x, y / counts.get(group).get(x)));
      })
      break;
    default:
      break;
  }
}

function createDataSets(groups, labels, graphType) {
  const datasets = [];
  let index = 0;

  groups.forEach((data, label) => {
    let updatedData = data;
    switch (graphType) {
      case 'line':
      case 'area':
        updatedData = (
          Array.from(labels)
            .filter((x) => data.get(x) !== undefined)
            .map((x) => ({ x, y: data.get(x) }))
            );
        break;
      case 'bar':
      case 'pie':
      case 'doughnut':
        updatedData = Array.from(labels).map((x) => data.get(x));
      default:
        break;
    }
    datasets.push(createDataSet(label, updatedData, index++, graphType, groups.size));
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
      sortedLabels = Array.from(labels).sort((a, b) => sortFunc(a, b));
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

export default function processData(state) {
  const { data, graphType, filters, selectedGroup, x, y, dataType, aggregate } = state;

  if (!x || !y) return {};

  const groups = new Map();
  const counts = new Map();
  const labels = new Set();

  const accumFuncs = getAccumFuncs(aggregate, groups, counts);

  filterData(data, filters, x, y, (record) => {
    const key = Array.from(selectedGroup).map((val) => record[val]).join(',');
    const xKey = uniqKey(record[x]);
    labels.add(xKey);

    switch (graphType) {
      case 'scatter':
        if (!groups.get(key)) groups.set(key, []);
        groups.get(key).push({ x: record[x], y: record[y] });
        break;
      case 'line':
      case 'area':
      case 'bar':
      case 'pie':
      case 'doughnut':
        [groups, counts].forEach((counter) => {
          if (!counter.get(key)) counter.set(key, new Map());
          const prev =  counter.get(key).get(xKey);
          const func = accumFuncs.get(counter);
          counter.get(key).set(xKey, func(prev, record[y]));
        });
        break;
      case 'bubble':
      case 'radar':
      default:
        return {};
    }
  });

  aggregateData(aggregate, graphType, groups, counts);

  const datasets = createDataSets(groups, labels, graphType);

  const sortedLabels = sortDataSets(labels, datasets, dataType[x], graphType);

  return { datasets, labels: sortedLabels };
}