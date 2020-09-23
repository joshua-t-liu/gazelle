import React, { useState, useEffect, useRef } from 'react';

import { FieldSet, Row, CheckBox } from './Shared';
import InfiniteScroll from './InfiniteScroll';

const Filter = ({ category, filters, dispatch }) => {
  const [allSelected, setAllSelected] = useState(true);
  const [isExpanded, setExpand] = useState(false);

  const values = Array.from(filters.keys());

  function toggle(all) {
    return (event) => {
      const { name, checked } = event.target;

      if (all) {
        setAllSelected(checked);
        dispatch({ type: 'filters-all', payload: { category, checked }});
      } else {
        dispatch({ type: 'filters', payload: { category, name, checked } });
      }
    }
  }

  return (
    <Row subheader={category}>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>

      {isExpanded &&
        (<InfiniteScroll id={`filter-${category}`}>
            <CheckBox
              name={'all'}
              checked={allSelected}
              onChange={toggle(true)} />
            {values.map((val) => (
              <CheckBox
                key={val}
                name={val}
                checked={filters.get(val)}
                onChange={toggle()} />
                ))}
        </InfiniteScroll>)}
    </Row>
  )
}

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