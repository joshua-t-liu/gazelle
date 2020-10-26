import React, { useState, useRef, useEffect } from 'react';

import { FieldSet, Row , Button} from './Shared';

const Group = ({ active, category, onClick }) => {
  return (
    <Button
      id={category}
      className={active && 'active'}
      onClick={onClick}>
        {category}
    </Button>
  )
}

const DropZone = ({ title, active, categories, onClick }) => {
  return (
    <Row subheader={title}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {Array.from(categories.keys())
          .filter((category) => (active) ? categories.get(category) : !categories.get(category))
          .map((category) => (
            <Group
              key={category}
              active={active}
              category={category}
              onClick={onClick} />
              ))}
      </div>
    </Row>
  )
};

export default ({ groups, dispatch }) => {
  function onClick(event) {
    dispatch({ type: 'groups', payload: { group: event.target.id } });
  }

  return (
    <FieldSet header='Group By'>
      <DropZone
        title='Selected Groups'
        active={true}
        categories={groups}
        onClick={onClick} />
      <DropZone
        title='Available Groups'
        categories={groups}
        onClick={onClick} />
    </FieldSet>
  )
};
