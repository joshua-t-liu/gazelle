import React, { useState, useEffect, useRef } from 'react';

import { FieldSet, Row } from './Shared';
import InfiniteScroll from './InfiniteScroll';
import FastScroll from './FastScroll';

const CheckBox = ({ item }) => {
  const { name, checked, onChange } = item;
  return (
    <div style={{ marginTop: '0.2em'}}>
      <input type='checkbox' name={name} checked={checked} onChange={onChange} />
      <label>{String(name)}</label>
    </div>
  )
}

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

  const list = [{ name:'all', checked: allSelected, onChange: toggle(true) }]
  values.forEach((val) => {
    list.push({
      name: val,
      checked: filters.get(val),
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
        <FastScroll
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