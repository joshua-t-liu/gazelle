import React, { useRef } from 'react';

import { FieldSet, Row, Button } from './Shared';

function formatcsv(str) {
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

export default ({ dispatch }) => {
  const ref = useRef();

  function readFile() {
    const reader = new FileReader();
    reader.onload = function(event) {
      dispatch({ type: 'init', payload: formatcsv(event.target.result) });
    }
    reader.readAsText(ref.current.files[0]);
  }

  return (
    <FieldSet header='Data'>
      <Row>
        <label htmlFor='file'>
          <Button>Select a CSV File</Button>
        </label>
        <input
          style={{ opacity: 0, position: 'absolute', zIndex: -1 }}
          id='file'
          ref={ref}
          type='file'
          accept='.csv'
          onChange={readFile} />
        {ref.current && ref.current.files[0] && <div>Current file: {ref.current.files[0].name}</div>}
      </Row>
    </FieldSet>
  )
}