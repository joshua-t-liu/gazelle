import { nextColor, alphabeticalSort, numericalSort, setMultiColors } from '../../helper';
import DataSet from './DataSet';

function DataSets(graphType, aggregate, dataType) {
  this.datasets = new Map();
  this.labels = new Set();
  this.graphType = graphType;
  this.aggregate = aggregate;
  this.dataType = dataType;
}

DataSets.prototype.getChartJsDataSets = function() {
  this.aggregateData();
  const processedData = this.formatData();
  const labels = this.sortDataSets(this.dataType, processedData);
  return { datasets: processedData, labels };
}

DataSets.prototype.formatData = function() {
  const datasets = [];
  let index = 0;

  this.datasets.forEach((dataset, label) => {
    let updatedData;
    switch (this.graphType) {
      case 'scatter':
        updatedData = dataset.data;
        break;
      case 'line':
      case 'area':
        updatedData = Array.from(this.labels)
                        .filter((x) => dataset.getDataPoint(x) !== undefined)
                        .map((x) => ({ x, y: dataset.getDataPoint(x) }));
        break;
      case 'bar':
      case 'pie':
      case 'doughnut':
        updatedData = Array.from(this.labels).map((x) =>  dataset.getDataPoint(x));
      default:
        break;
    }
    datasets.push(this.createDataSet(label, updatedData, index++));
  })

  return datasets;
}

DataSets.prototype.addLabel = function(label) {
  this.labels.add(label);
}

DataSets.prototype.getGroup = function(groupName) {
  if (this.datasets.get(groupName)) return this.datasets.get(groupName);

  const dataset = new DataSet(this.graphType, this.aggregate);
  this.datasets.set(groupName, dataset);

  return dataset;
}

DataSets.prototype.addData = function(groupName, x, y) {
  const dataset = this.getGroup(groupName);
  dataset.addData(x, y);
}

DataSets.prototype.aggregateData = function() {
  if (this.graphType === 'scatter') return;
  this.datasets.forEach((dataset, group) => {
    dataset.aggregateData(this.aggregate);
  });
}

DataSets.prototype.createDataSet = function(label, data, index) {
  let colors = {};
  let fill = false;

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

DataSets.prototype.sortDataSets = function(dataType, datasets) {
  let sortedLabels;
  const sortFunc = (dataType === 'number') ? numericalSort : alphabeticalSort;

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