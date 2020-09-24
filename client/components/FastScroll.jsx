import React, { useState, useEffect, useRef } from 'react';

const Row = ({ top, height, item, children }) => {
  return (
    <div style={{ position: 'absolute', top: top, height: `${height}px` }}>{item}
      {children}
    </div>
  )
}

function getOffset(offset, index, height, containerHeight) {
  const count = (offset + index * height) / height;
  const remainder = (count - Math.floor(count)) * height;
  return Math.min(offset + index * height - remainder, containerHeight);
}

export default ({ id, list = [], Component = Row, height = '20vh', style = {} }) => {
  const [offset, setOffset] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [listHeight, setListHeight] = useState(0);
  const [itemHeight, setItemHeight] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    setItemHeight(ref.current.children[0].offsetHeight);
  }, []);

  useEffect(() => {
    if (itemHeight) {
      console.log(itemHeight)
      setListHeight(list.length * itemHeight);

      const res = height.match(/([\.0-9]+)(vh|px)/);

      function getHeight() {
        let numHeight;
        if (res && res.length === 3) {
          if (res[2] === 'px') {
            return numHeight = Number(res[1]);
          } else {
            return numHeight = Number(res[1] * window.innerHeight / 100);
          }
        }
        return 20 * window.innerHeight / 100;
      }
      setContainerHeight(getHeight());

      window.addEventListener('resize', () => setContainerHeight(getHeight()));
    }
  }, [itemHeight])

  if (!itemHeight) {
    return (
      <div ref={ref} style={{ opacity: 0, height: 0 }}>
        <Component item={list[1]}/>
      </div>
    )
  }

  return (
    <div
      id={id}
      onScroll={(event) => setOffset(event.target.scrollTop)}
      style={{ height: `${containerHeight}px`, width: '100%', overflowY: 'auto', ...style }}>

        <div
          style={{ position: 'relative', height: `${listHeight}px` }}>

          {Array(Math.ceil(containerHeight / itemHeight) + 1).fill().map((_, idx) => {
            const item = list[Math.floor((offset + idx * itemHeight)/ itemHeight)];
            if (item) {
              return (
                <Row
                  key={String(idx)}
                  top={getOffset(offset, idx, itemHeight, listHeight)}
                  height={itemHeight}>
                  <Component
                    item={item} />
                </Row>
              )
            }
          })}

        </div>

    </div>
  )
}