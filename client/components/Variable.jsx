import React, { useState, useRef, useEffect } from 'react';

import { FieldSet, Row, Button } from './Shared';

const DropDown = ({ title, dispatchKey, dispatch, options, defaultValue }) => {
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

const AdvancedFields = ({ aggregate, dispatch }) => {
  const [isExpanded, setExpand] = useState(false);

  function setFunc(event) {
    dispatch({ type: 'aggregate', payload: { aggregate: event.target.id } })
  }

  return (
    <Row subheader='Additional Options'>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>
      {isExpanded &&
        <Row subheader='Group data points with the same X values using'>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {['Sum', 'Average', 'Count', 'Max', 'Min'] //None, Min, Max, Median
              .map((func) => (
                <Button
                  key={func}
                  id={func}
                  className={aggregate === func && 'active'}
                  onClick={setFunc}>
                    {func}
                  </Button>
                  ))}
          </div>
        </Row>
      }
    </Row>
  )
}

export default ({ groups, aggregate, dispatch, x, y }) => {
  const options = Array.from(groups.keys());

  return (
    <FieldSet header='Variables'>
      <DropDown
        title='Variable x'
        dispatchKey='x'
        dispatch={dispatch}
        options={options}
        defaultValue={x} />
      <DropDown
        title='Variable y'
        dispatchKey='y'
        dispatch={dispatch}
        options={options}
        defaultValue={y} />
      <AdvancedFields
        aggregate={aggregate}
        dispatch={dispatch} />
    </FieldSet>
  )
};
