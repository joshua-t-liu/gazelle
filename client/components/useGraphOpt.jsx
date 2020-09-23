import React, { useReducer } from 'react';

function init() {
  return {
    title: {
      display: true,
      position: 'top',
      text: 'Price1 vs Price2',
      fontSize: 32,
    },
    legend: {
      display: true,
      position: 'bottom',
    }
  }
}

function reducer(state, action) {
  let updatedTitle = state.title;
  let updatedLegend = state.legend;
  const { type, payload } = action;

  switch (type) {
    case 'title':
      updatedTitle = Object.assign({}, updatedTitle, payload);
      break;
    case 'legend':
      updatedLegend = Object.assign({}, updatedLegend, payload);
      break;
    default:
      return state;
  }

  return {
    title: updatedTitle,
    legend: updatedLegend,
  }
}

export default () => useReducer(reducer, undefined, init);
