export default (str) => {
  const data = [];
  const dataType = {};
  let header;

  str.split('\n').forEach((row, idx) => {
    if (!idx) {
      header = row.split(',').map((col) => col.trim());
    } else {
      const result = {};
      const values = row.split(',');
      values.forEach((val, idx) => {
        if (header[idx].length) {
          result[header[idx]] = val;
          if (!isNaN(Number(val))) {
            result[header[idx]] = Number(val);
            dataType[header[idx]] = 'number';
          } else if (new Date(val).toString() !== 'Invalid Date'){
            result[header[idx]] = new Date(val);
            dataType[header[idx]] = 'date';
          }
        }
      });
      if (values.length > 1) data.push(result);
    }
  });

  return { data, dataType };
}