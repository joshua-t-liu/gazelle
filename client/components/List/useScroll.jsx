import React, { useReducer, useEffect } from 'react';

function retrieve(offset, state) {
  const { items: prev, heights, list, containerHeight, preLoadHeight } = state;
  let addHeight = 0;

  prev.forEach(({ index, top }) => {
    const ele = document.getElementById(String(index));
    if (ele && !heights[index]) {
      const images = ele.querySelectorAll('img');
      const { offsetHeight } = ele;
      let finished = true;
      images.forEach((img) => finished = finished && img.complete);
      if (!finished) return;
      addHeight += offsetHeight;
      heights[index] = {
        index,
        top,
        height: offsetHeight,
      };
    }
  })

  const items = [];

  let index = getStartIndex(heights, offset);

  while (
    (checkNext(items, offset, containerHeight, preLoadHeight) || items.length === 1)
    && heights[index]) {
    items.push(heights[index]);
    index++;
  }

  if (checkNext(items, offset, containerHeight, preLoadHeight) && index < list.length) {
    let top = 0;
    if (index) {
      const { top: prevTop, height: prevHeight } = items[items.length - 1];
      top = prevTop + prevHeight;
    }
    items.push({ index, top });
  }

  return {
    items,
    addHeight,
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

function init([list, height, preLoadHeight = 2]) {
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
    list,
    heights: [],
    totalHeight: 0,
    items: [],
    offset: 0,
    containerHeight,
    originalHeight: height,
    preLoadHeight,
  };
}

function reducer(state, action) {
  const { items: prev, list, totalHeight, containerHeight, originalHeight, preLoadHeight } = state;
  const { type, payload = {} } = action;

  const res = [];

  switch (type) {
    case 'reset':
      return init([list, originalHeight, preLoadHeight]);
      break;
    case 'getNext':
      const { index = 0 } = prev[prev.length - 1] || {};
      if (index === list.length - 1) return state;
      if (!checkNext(prev, state.offset, containerHeight, preLoadHeight)) return state;
    case 'offset':
      const offset = (payload.offset !== undefined) ? payload.offset : state.offset;
      const { items, addHeight } = retrieve(offset, state);
      return {
        ...state,
        offset,
        items,
        totalHeight: totalHeight + addHeight,
      };
      break;
    default:
      return state;
  }
}

function checkNext(items, offset, containerHeight, preLoadHeight) {
  if (!items) return true;
  const last = items[items.length - 1];
  if (!last) return true;
  return last.top < (offset + preLoadHeight * containerHeight);
}

export default (list, height, preLoadHeight) => {
  const [state, dispatch] = useReducer(reducer, [list, height, preLoadHeight], init);

  useEffect(() => {
    window.addEventListener('resize', () => dispatch({ type: 'reset' }));
  }, [])

  useEffect(() => {
    const { items, offset, containerHeight, preLoadHeight } = state;
    if (checkNext(items, offset, containerHeight, preLoadHeight)) dispatch({ type: 'getNext' });
  }, [state.items]);

  return [state, dispatch];
};