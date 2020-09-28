import React, { useReducer, useEffect } from 'react';

function retrieve(offset, ref, heights, list, containerHeight) {
  let addHeight = 0;

  Array.from(ref.current.children).forEach(({ id, offsetHeight, style }) => {
    if (!heights[id]) {
      const top = style.transform.match(/translateY\(([0-9]+)px\)/)[1];
      addHeight += offsetHeight;
      heights[id] = {
        index: parseInt(id),
        top: Number(top),
        height: offsetHeight,
      };
    }
  });

  const items = { children: [] };
  let currHeight = 0;

  let index = getStartIndex(heights, offset);

  while (
    (checkNext(items, offset, containerHeight) || items.children.length === 1)
    && heights[index]) {
    items.children.push(heights[index]);
    currHeight += heights[index].height;
    index++;
  }

  if (checkNext(ref.current, offset, containerHeight) && index < list.length) {
    let top = 0;
    if (index) {
      const { top: prevTop, height: prevHeight } = items.children[items.children.length - 1];
      top = prevTop + prevHeight;
    }
    items.children.push({ index, top });
  }

  return {
    items,
    addHeight,
    currHeight,
  };
}

function checkRange(low, high, val) {
  if (low <= val && val <= high) return true;
  return false;
}

function getStartIndex(items, offset) {
  if (!items.length) return 0;

  const { top, height } = items[items.length - 1];
  if (checkRange(top, top + height, offset)) return items.length - 1;

  let start = 0;
  let end = items.length - 1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    const { top, height } = items[mid];
    if (checkRange(top, top + height, offset)) {
      return mid;
    } else if (top <= offset) {
      start = mid + (start === mid);
    } else {
      end = mid;
    }
  }
  return 0;
}

function init([ref, list, height]) {
  const vhUnit = window.innerHeight / 100;
  const parsedHeight = height.match(/([.0-9]+)(px|vh)/);
  let containerHeight;

  if (parsedHeight) {
    if (parsedHeight[2] === 'px') {
      containerHeight = parsedHeight[1];
    } else if (parsedHeight[2] === 'vh') {
      containerHeight = parsedHeight[1] * vhUnit;
    }
  }

  return {
    ref,
    list,
    heights: [],
    totalHeight: 0,
    items: { children: [] },
    offset: 0,
    containerHeight,
    currHeight: 0,
  };
}

function reducer(state, action) {
  const { items: prev, ref, list, heights, totalHeight, containerHeight } = state;
  const { type, payload = {} } = action;

  const res = [];

  switch (type) {
    case 'reset':
      return init([ref, list, `${containerHeight}px`]);
      break;
    case 'getNext':
      const { index = 0 } = prev.children[prev.children.length - 1] || {};
      if (index === list.length - 1) return state;
      if (!checkNext(ref.current, state.offset, containerHeight)) return state;
    case 'offset':
      const offset = (payload.offset !== undefined) ? payload.offset : state.offset;
      const { items, addHeight, currHeight } = retrieve(offset, ref, heights, list, containerHeight);
      return {
        ref,
        list,
        heights,
        offset,
        containerHeight,
        totalHeight: totalHeight + addHeight,
        items: items,
        currHeight,
      };
      break;
    default:
      return state;
  }
}

function checkNext(ele, offset, containerHeight) {
  if (!ele) return true;

  const children = ele.children;
  const last = children[children.length - 1];

  if (!last) return true;

  let top = last.top;
  if (top === undefined) {
    top = last.style.transform.match(/translateY\(([0-9]+)px\)/)[1];
    top = Number(top);
  }

  return top < (offset + 2 * containerHeight);
}

export default (ref, list, height) => {
  const [state, dispatch] = useReducer(reducer, [ref, list, height], init);

  useEffect(() => {
    window.addEventListener('resize', () => dispatch({ type: 'reset' }));
  }, [])

  useEffect(() => {
    if (checkNext(ref.current, state.offset, state.containerHeight)) dispatch({ type: 'getNext' });
  }, [state.items]);

  return [state, dispatch];
};