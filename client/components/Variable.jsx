import React, { useRef, useEffect } from 'react';

import { FieldSet, Row } from './Shared';

const DropDown = ({ title, dispatch, options, defaultValue }) => {
  const ref = useRef(null);
  const noneSelected = 'select-options';

  useEffect(() => {
    if (ref.current) ref.current.value = defaultValue || noneSelected;
  }, [defaultValue]);

  function onChange(event) {
    const { value } = event.target;
    const key = title.toLowerCase();
    if (value === noneSelected) return;
    dispatch({ type: key, payload: { [key]: value } });
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

export default ({ groups, dispatch, x, y }) => {
  const options = Array.from(groups.keys());

  return (
    <FieldSet header='Variables'>
      <DropDown title='X' dispatch={dispatch} options={options} defaultValue={x} />
      <DropDown title='Y' dispatch={dispatch} options={options} defaultValue={y} />
    </FieldSet>
  )
};
