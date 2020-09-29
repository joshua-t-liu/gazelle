import React, { useEffect, useRef } from 'react';

import useScroll from './useScroll';

const Row = ({ id, top, children }) => {
  return (
    <div
      id={id}
      style={{ position: 'absolute', transform: `translateY(${top}px)` }}>
        {children}
    </div>
  )
}

export default ({ id, list = [], Component, height = '20vh', style = {} }) => {
  const [state, dispatch] = useScroll(list, height);
  const { totalHeight, items } = state;

  return (
    <div
      id={id}
      onScroll={(event) => dispatch({ type: 'offset', payload: { offset: event.target.scrollTop } })}
      style={{ height, width: '100%', overflowY: 'auto', ...style }}>

        <div
          style={{ position: 'relative', height: `${totalHeight}px` }}>

          {items.map(({ index, top }) => (
              <Row
                key={String(index)}
                id={index}
                top={top}>
                <Component
                  item={list[index]} />
              </Row>
              ))}

        </div>

    </div>
  )
}