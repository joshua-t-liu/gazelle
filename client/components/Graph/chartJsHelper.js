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

export {
  getChartJsGraphType,
  getChartJsScales,
  getChartJsDataType,
  showLegend,
}