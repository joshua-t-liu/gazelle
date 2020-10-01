import React, { useRef, useEffect } from 'react';
import { Row } from '../Shared';

export default ({ title, dispatchKey, dispatch, options, defaultValue }) => {
  const ref = useRef(null);
  const noneSelected = 'select-options';

  useEffect(() => {
    if (ref.current) ref.current.value = defaultValue || noneSelected;
  }, [defaultValue]);

  function onChange(event) {
    const { value } = event.target;
    if (value === noneSelected) return;
    dispatch({ type: dispatchKey, payload: { [dispatchKey]: value } });
  }

  return (
    <Row subheader={title}>
      <select
        ref={ref}
        style={{ height: '2em', marginTop: '0.25em' }}
        onChange={onChange}>
        <option value={noneSelected}>select options</option>
        {options.map((column) => <option key={column} value={column}>{column}</option>)}
      </select>
    </Row>
  )
}