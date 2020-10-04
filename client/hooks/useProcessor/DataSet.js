function DataSet(groupName, graphType, aggregate, counts, data) {
  this.groupName = groupName;
  this.graphType = graphType;
  this.aggregate = aggregate;
  // this.accumFun = getAccumFuncs(aggregate);
  this.counts = (counts) ? counts : new Map();
  this.data = (data) ? data : new Map();
}

DataSet.countsFunc = getAccumFuncs('Count');

DataSet.prototype.toString = function() {
  return JSON.stringify({ counts: this.counts, data: this.data });
}

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
  this.data.set(x, getAccumFuncs(this.aggregate)(prevVal, y));

  prevVal = this.counts.get(x) || 0;
  this.counts.set(x, DataSet.countsFunc(prevVal, y));
}

DataSet.prototype.adjustData = function(x, val, isApplied = true) {
  const sign = (-1) ** isApplied;
  const currVal = this.data.get(x);
  switch (this.aggregate) {
    case 'None':
      break;
    case 'Sum':
      this.data.set(x, currVal + (sign * currVal));
      break;
    case 'Average':
      this.data.set(x, currVal + (sign * currVal));
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