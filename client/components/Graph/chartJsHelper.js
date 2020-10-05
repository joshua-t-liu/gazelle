import Chart from 'chart.js';

const GRAPH_TYPES = {
  'line': 'line',
  'scatter': 'scatter',
  'area': 'line',
  'pie': 'pie',
  'bar': 'bar',
  'doughnut': 'doughnut',
};

function getChartJsDataType(type, graphType) {
  switch (type) {
    case 'date':
      return 'time';
      break;
    case 'number':
      return (graphType === 'bar' || graphType === 'pie' || graphType === 'doughnut') ? 'category' : 'linear';
      break;
    default:
      return 'category';
  }
}

function getChartJsScales(graphType, type, x, y) {
  if (graphType !== 'pie' && graphType !== 'doughnut') {
    return {
      xAxes: [{
        type: type,
        display: true,
        scaleLabel: {
          display: true,
          labelString: x,
          fontSize: 24,
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: y,
          fontSize: 24,
        }
      }]
    };
  }
  return null;
}

function showLegend(data, graphType) {
  return {
    display: (
      data && data.datasets &&
      (data.datasets.length > 1 || graphType === 'pie' || graphType === 'doughnut')) ? true : false,
  };
}

function getChartJsGraphType(graphType) {
  return GRAPH_TYPES[graphType];
}

function createChart(ctx, type, data, scales, title, legend) {
  return new Chart(ctx, {
    type,
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales,
      layout: {
        // padding: 24,
      },
      title,
      legend,
    }
  })
}

function groupChanged(data1 = [], data2 = []) {
  const groups = new Set();
  let count = 0;

  for(let i = 0; i < data2.length; i++) {
    if (data2[i].label !== undefined) groups.add(data2[i].label);
  };

  for(let i = 0; i < data1.length; i++) {
    if (!groups.has(data1[i].label)) return true;
    groups.delete(data1[i].label);
  };

  return (groups.size === 0) ? false : true;
}

function copyData(data) {
  if (!data) return data;
  if (!data.datasets) return data;

  const datasets = [];
  data.datasets.forEach((dataset) => datasets.push({...dataset }));

  return { datasets, labels: data.labels };
}

export {
  getChartJsGraphType,
  getChartJsScales,
  getChartJsDataType,
  showLegend,
  createChart,
  groupChanged,
  copyData,
}