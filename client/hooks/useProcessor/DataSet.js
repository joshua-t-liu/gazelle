function DataSet(graphType, aggregate) {
  this.graphType = graphType;
  this.aggregate = aggregate;
  this.accumFun = getAccumFuncs(aggregate);
  this.counts = new Map();
  this.data = new Map();
}

DataSet.countsFunc = getAccumFuncs('Count');

DataSet.prototype.aggregateData = function() {
  let aggrData;
  switch (this.aggregate) {
    case 'Count':
      aggrData = new Map(this.counts);
      break;
    case 'Average':
      aggrData = new Map();
      this.data.forEach((y, x) => aggrData.set(x, y / this.counts.get(x)));
      break;
    default:
      aggrData = new Map(this.data);
      break;
  }
  return aggrData;
}

DataSet.prototype.getData = function() {
  return this.data;
}

DataSet.prototype.getDataPoint = function(x) {
  return this.data.get(x);
}

DataSet.prototype.addData = function(x, y) {
  let prevVal =  this.data.get(x);
  this.data.set(x, this.accumFun(prevVal, y));

  prevVal = this.counts.get(x) || 0;
  this.counts.set(x, DataSet.countsFunc(prevVal, y));
}

DataSet.prototype.adjustData = function(filter, x) {
  switch (this.aggregate) {
    case 'None':
      break;
    case 'Sum':
      break;
    case 'Average':
      break;
    case 'Count':
      break;
    case 'Min':
      break;
    case 'Max':
      break;
    default:
      break;
  }
}

function getAccumFuncs(aggregate) {
  switch (aggregate) {
    case 'None':
      return (accum = [], b) => {
        if (!isNaN(Number(b))) accum.push(b);;
        return accum;
      }
      break;
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