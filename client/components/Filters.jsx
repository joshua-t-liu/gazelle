import React, { useState, useEffect, useRef } from 'react';

import { FieldSet, Row } from './Shared';
import InfiniteScroll from './InfiniteScroll';
import List from './List';

const CheckBox = ({ item }) => {
  const { name, checked, onChange } = item;
  return (
    <div style={{ marginTop: '0.2em'}}>
      <input type='checkbox' name={name} checked={checked()} onChange={onChange} />
      <label>{String(name)}</label>
    </div>
  )
}

const Filter = ({ category, filters, dispatch }) => {
  const [allSelected, setAllSelected] = useState(filters.size);
  const [isExpanded, setExpand] = useState(false);

  function toggle(all) {
    return (event) => {
      const { name, checked } = event.target;

      if (all) {
        setAllSelected((curr) => (curr === filters.size) ? 0 : filters.size);
        dispatch({ type: 'filters-all', payload: { category, checked }});
      } else {
        setAllSelected((curr) => curr + (-1) ** checked);
        dispatch({ type: 'filters', payload: { category, name, checked } });
      }
    }
  }

  const values = Array.from(filters.keys());

  const list = [{ name:'all', checked: () => allSelected === filters.size, onChange: toggle(true) }]
  values.forEach((val) => {
    list.push({
      name: val,
      checked: () => filters.get(val),
      onChange: toggle()
    })
  })

  return (
    <Row subheader={category}>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>

      {isExpanded &&
        <List
          id={`filter-${category}`}
          Component={CheckBox}
          height={'20vh'}
          list={list} />}
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