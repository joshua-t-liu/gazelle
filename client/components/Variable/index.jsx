import React, { useState, useRef, useEffect } from 'react';

import { FieldSet, Row, Button } from '../Shared';
import DropDown from './DropDown';
import AdvancedFields from './AdvancedFields';

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
