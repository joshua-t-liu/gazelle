function DataSet(graphType, aggregate) {
  this.graphType = graphType;
  this.aggregate = aggregate;
  this.accumFun = getAccumFuncs(aggregate);
  this.counts = new Map();
  this.data = [];

  switch (graphType) {
    case 'scatter':
      this.data = [];
      break;
    case 'line':
    case 'area':
    case 'bar':
    case 'pie':
    case 'doughnut':
      this.data = new Map();
      break;
    case 'bubble':
    case 'radar':
    default:
      return {};
  }
}

DataSet.countsFunc = getAccumFuncs('Count');

DataSet.prototype.aggregateData = function() {
  switch (this.aggregate) {
    case 'Count':
      this.data.forEach((y, x) => this.data.set(x, this.counts.get(x)));
      break;
    case 'Average':
      this.data.forEach((y, x) => this.data.set(x, y / this.counts.get(x)));
      break;
    default:
      break;
  }
}

DataSet.prototype.getData = function() {
  return this.data;
}

DataSet.prototype.getDataPoint = function(x) {
  return this.data.get(x);
}

DataSet.prototype.addData = function(x, y) {
  switch (this.graphType) {
    case 'scatter':
      this.data.push({ x, y });
      break;
    case 'line':
    case 'area':
    case 'bar':
    case 'pie':
    case 'doughnut':
      let prevVal =  this.data.get(x) || 0;
      this.data.set(x, this.accumFun(prevVal, y));

      prevVal = this.counts.get(x) || 0;
      this.counts.set(x, DataSet.countsFunc(prevVal, y));
      break;
    case 'bubble':
    case 'radar':
    default:
      return {};
  }
}

function getAccumFuncs(aggregate) {
  switch (aggregate) {
    case 'Count':
      return (accum = 0, b) => isNaN(Number(b)) ? accum : accum + 1;
      break;
    case 'Max':
      return (accum = Number.NEGATIVE_INFINITY, b) => isNaN(Number(b)) ? accum : Math.max(accum, b);
      break;
    case 'Min':
      return (accum = Number.POSITIVE_INFINITY, b) => isNaN(Number(b)) ? accum : Math.min(accum, b);
      break;
    default:
      return (accum, b) => (accum || 0) + (b || 0);
      break;
  }
}

export default DataSet;