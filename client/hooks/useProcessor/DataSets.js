import { nextColor, alphabeticalSort, numericalSort, setMultiColors } from '../../helper';
import DataSet from './DataSet';

function DataSets(graphType, aggregate, dataType, datasets, labels) {
  this.graphType = graphType;
  this.aggregate = aggregate;
  this.dataType = dataType;
  this.datasets = new Map();
  this.labels = (labels) ? labels : new Set();
  if (datasets) {
    datasets.forEach((dataset) =>
    this.datasets.set(dataset.groupName,
      new DataSet(dataset.groupName, graphType, aggregate, dataset.counts, dataset.data)));
  }
}

DataSets.prototype.addLabel = function(label) {
  this.labels.add(label);
}

DataSets.prototype.getGroup = function(groupName) {
  if (this.datasets.get(groupName)) return this.datasets.get(groupName);

  const dataset = new DataSet(groupName, this.graphType, this.aggregate);
  this.datasets.set(groupName, dataset);

  return dataset;
}

DataSets.prototype.addData = function(groupName, x, y) {
  const dataset = this.getGroup(groupName);
  dataset.addData(x, y);
}

DataSets.prototype.adjustData = function(state, data, labels) {
  this.datasets.forEach((dataset, groupKey) => {
    dataset.adjustData(state, data.get(groupKey));
  });
  labels.forEach((xKey) => this.labels.add(xKey));
}

DataSets.prototype.getChartJsDataSets = function() {
  const datasets = this.formatData();
  const labels = this.formatLabels(datasets);
  return { datasets, labels };
}

DataSets.prototype.formatData = function() {
  const datasets = [];
  let index = 0;

  this.datasets.forEach((dataset, label) => {
    let data = dataset.aggregateData();

    switch (this.graphType) {
      case 'scatter':
      case 'line':
      case 'area':
        data = (
          Array.from(this.labels)
          .filter((x) => data.get(x) !== undefined)
          .map((x) => {
            const y = data.get(x);
            if (Array.isArray(y)) {
              return y.map((y) => ({ x, y }));
            }
            return ({ x, y });
          }));
        break;
      case 'bar':
      case 'pie':
      case 'doughnut':
        data = Array.from(this.labels).map((x) =>  data.get(x));
      default:
        break;
    }
    datasets.push(this.createDataSet(label, data.flat(), index++));
  })

  return datasets;
}

DataSets.prototype.createDataSet = function(label, data, index) {
  let colors = {};
  let fill = false;
  const color = nextColor('color', index);
  const background = nextColor('background', index);

  switch (this.graphType) {
    case 'area':
      fill = true;
      break;
    case 'bar':
      if (this.datasets.size === 1) colors = setMultiColors(data.length);
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
    borderColor: color,
    backgroundColor: background,
    borderWidth: 1,
    pointBackgroundColor: background,
    pointBorderColor: color,
    pointBorderWidth: 1,
    lineTension: 0,
    data,
    ...colors,
  };
}

DataSets.prototype.formatLabels = function(datasets) {
  const sortFunc = (this.dataType === 'number') ? numericalSort : alphabeticalSort;
  let sortedLabels;

  switch (this.graphType) {
    case 'line':
    case 'scatter':
    case 'area':
      sortedLabels = Array.from(this.labels).sort((a, b) => sortFunc(a, b));
      datasets.forEach(({ data }) => data.sort(({ x: x1 }, { x: x2 }) => sortFunc(x1, x2)));
      break;
    case 'bar':
    case 'pie':
    case 'doughnut':
      sortedLabels = Array.from(this.labels).map((val, idx) => [val, idx]);
      sortedLabels.sort(([a, i], [b, j]) => sortFunc(a, b));
      datasets.forEach((dataset) => {
        dataset.data = sortedLabels.map(([_, index]) => dataset.data[index]);
      });
      sortedLabels = sortedLabels.map(([val, _]) => val);
      break;
    case 'bubble':
    case 'radar':
    default:
      return {};
  }

  return sortedLabels;
}

export default DataSets;