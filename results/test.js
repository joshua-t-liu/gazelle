const fs = require('fs');
const { addPhoneData } = require('../db');

fs.readFile('./results/results.csv', 'utf8', (err, data) => {
  if (err) throw err;
  if (data.length) {
    addPhoneData(data.trim().split('\n').map((row) => {
      return row.split(',').map((val, idx) => {
        if (idx < 4) return `'${val}'`;
        return (val.length) ? val : `'NaN'`;
      }).join(',');
    }));
  }
});