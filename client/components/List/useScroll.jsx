import React, { useReducer, useEffect } from 'react';

function store(state) {
  const { items, heights } = state;
  let addHeight = 0;

  items.forEach(({ index, top }) => {
    const ele = document.getElementById(String(index));
    if (ele && !heights[index]) {
      const images = ele.querySelectorAll('img');
      let finished = true;
      images.forEach((img) => finished = finished && img.complete);
      if (!finished) return;

      const { offsetHeight } = ele;
      addHeight += offsetHeight;
      heights[index] = {
        index,
        top,
        height: offsetHeight,
      };
    }
  })

  return addHeight;
}

function retrieve(offset, state) {
  const { heights, list, checkNext } = state;
  const items = [];

  let index = getStartIndex(heights, offset);

  while (heights[index] && (checkNext(items, offset) || items.length === 1)) {
    items.push(heights[index]);
    index++;
  }

  const lastItem = items[items.length - 1];
  const top = (lastItem) ? lastItem.top + lastItem.height : 0;

  if (checkNext(items, offset)) items.push({ index, top });

  return items;
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
    switch (parsedHeight[2]) {
      case 'px':
        containerHeight = parsedHeight[1];
        break;
      case 'vh':
        containerHeight = parsedHeight[1] * vhUnit;
        break;
      default:
        break;
    }
  }

  return {
    list,
    heights: [],
    totalHeight: 0,
    items: [],
    offset: 0,
    containerHeight,
    preLoadHeight,
    checkNext: (items, offset) => checkNext(items, offset, containerHeight, preLoadHeight, list.length - 1),
  };
}

function reducer(state, action) {
  const { offset: prevOffset, list } = state;
  const { type, payload = {} } = action;

  switch (type) {
    case 'reset':
      return init([list, payload.height, state.preLoadHeight]);
      break;
    case 'getNext':
      if (!state.checkNext(state.items, prevOffset)) return state;
    case 'offset':
      const offset = (payload.offset !== undefined) ? payload.offset : prevOffset;
      const addHeight = store(state);
      const items = retrieve(offset, state);
      return {
        ...state,
        offset,
        items,
        totalHeight: state.totalHeight + addHeight,
      };
      break;
    default:
      return state;
  }
}

function checkNext(items, offset, containerHeight, preLoadHeight, size) {
  if (!items) return true;
  const last = items[items.length - 1];
  if (!last) return true;
  return last.top < (offset + preLoadHeight * containerHeight) && last.index < size;
}

export default (list, height, preLoadHeight) => {
  const [state, dispatch] = useReducer(reducer, [list, height, preLoadHeight], init);

  useEffect(() => {
    window.addEventListener('resize', () => dispatch({ type: 'reset', payload: { height } }));
  }, [])

  useEffect(() => {
    const { checkNext, items, offset } = state;
    if (checkNext(items, offset)) dispatch({ type: 'getNext' });
  }, [state.items]);

  return [state, dispatch];
};