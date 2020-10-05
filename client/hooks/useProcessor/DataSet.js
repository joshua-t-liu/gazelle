import { uniqKey } from '../../helper';

function DataSet(groupName, graphType, aggregate, counts, data) {
  this.groupName = groupName;
  this.graphType = graphType;
  this.aggregate = aggregate;
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
  this.counts.set(x, DataSet.countsFunc(prevVal, 1));
}

DataSet.prototype.adjustData = function(state, data) {
  if (!data) return;
  if (!data.length) return;

  const { x, y } = state;
  let adjustment = new Map();
  let counts = new Map();

  data.forEach((record) => {
    const { [x]: xVal, [y]: yVal } = record;
    const xKey = uniqKey(xVal);
    const currVal = adjustment.get(xKey);
    const currCount = counts.get(xKey);
    adjustment.set(xKey, getAccumFuncs(this.aggregate)(currVal, yVal));
    counts.set(xKey, DataSet.countsFunc(currCount, 1));
  });

  switch (this.aggregate) {
    case 'None':
      this.adjustNone(state, adjustment, counts);
      break;
    case 'Min':
      break;
    case 'Max':
      break;
    case 'Sum':
    case 'Average':
    case 'Count':
    default:
      this.adjustSum(state, adjustment, counts);
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
      return (accum = 0, b) => isNaN(Number(b)) ? accum : accum + b;
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

DataSet.prototype.adjustNone = function(state, adjustment, counts) {
  const sign = (-1) ** !state.filterStatus;

  adjustment.forEach((vals, xKey) => {
    const currVal = this.data.get(xKey);
    const currCount = this.counts.get(xKey);

    if (sign) {
      vals.forEach((val) => this.data.set(xKey, getAccumFuncs(this.aggregate)(currVal, val)));
    } else {
      const temp = [...this.data.get(xKey)];
      const res = [];
      const counter = new Map();
      vals.forEach((val) => counter.set(val, counter.get(val) || 0 + 1));
      this.data.set(xKey, temp.filter((val) => {
        if (counter.get(val)) {
          counter.set(val, counter.get(val - 1));
          return false;
        }
        return true;
      }));
    }

    this.counts.set(xKey, DataSet.countsFunc(currCount, (sign * counts.get(xKey))));

    if (this.counts.get(xKey) === 0) {
      this.counts.delete(xKey);
      this.data.delete(xKey);
    }
  });
}

DataSet.prototype.adjustSum = function(state, adjustment, counts) {
  const sign = (-1) ** !state.filterStatus;

  adjustment.forEach((val, xKey) => {
    const currVal = this.data.get(xKey);
    const currCount = this.counts.get(xKey);
    this.data.set(xKey, getAccumFuncs(this.aggregate)(currVal, (sign * val)));
    this.counts.set(xKey, DataSet.countsFunc(currCount, (sign * counts.get(xKey))));

    if (this.counts.get(xKey) === 0) {
      this.counts.delete(xKey);
      this.data.delete(xKey);
    }
  });
}

export default DataSet;