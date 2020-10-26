import React, { useState, useEffect, useRef } from 'react';

import { FieldSet } from '../Shared';
import Filter from './Filter';

export default ({ filters, dispatch }) => {
  const categories = Array.from(filters.keys());

  return (
    <FieldSet header='Filters'>
      {categories.map((category) => (
        <Filter
          key={category}
          category={category}
          filters={filters.get(category)}
          dispatch={dispatch} />
      ))}
    </FieldSet>
  );
}