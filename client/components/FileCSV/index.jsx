import React, { useRef, useEffect } from 'react';

import { FieldSet, Row, Button } from '../Shared';
import { open, update } from '../../IndexedDB';
import { preProcess } from '../../hooks/useProcessor/processor';
import formatcsv from './formatcsv';

export default ({ setIsLoading, dispatch }) => {
  const ref = useRef();

  function readFile() {
    const reader = new FileReader();

    reader.onloadstart = () => setIsLoading(true);

    reader.onload = function(event) {
      const { data, dataType } = formatcsv(event.target.result);

      open()
      .then(() => update(data))
      .then(() => {
        dispatch({ type: 'init', payload: { ...preProcess(data), dataType } });
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
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