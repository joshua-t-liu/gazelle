import React, { useState } from 'react';

import { FieldSet, Row , Button} from './Shared';

const Position = ({ state, onClick }) => {
  return (
    <Row subheader={'Position'}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {['Top', 'Right', 'Bottom', 'Left'].map((val) => (
          <Button
            className={state && val.toLowerCase() === state.position && 'active'}
            id={val.toLowerCase()}
            onClick={onClick}>
              {val}
          </Button>
        ))}
      </div>
    </Row>
  )
}

const Legend = ({ subheader, state, dispatch }) => {
  const [isExpanded, setExpand] = useState(false);

  function updateLegend(event) {
    dispatch({
      type: 'legend',
      payload: { display: true, position: event.target.id } })
  }

  return (
    <Row subheader='Legend'>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>
      {isExpanded && <Position state={state} onClick={updateLegend} />}
    </Row>
  )
}

const Title = ({ subheader, state, dispatch }) => {
  const [isExpanded, setExpand] = useState(false);

  function updateText(event) {
    dispatch({ type: 'title', payload: { text: document.getElementById('title').value } })
  }

  function updatePosition(event) {
    dispatch({ type: 'title', payload: { position: event.target.id } });
  }

  return (
    <Row subheader='Title'>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>
      {isExpanded && (
        <>
        <Row subheader='Text'>
          <input
            type='text'
            id='title'
            name='title'
            value={state.text}
            onChange={updateText}
            style={{ height: '2em', marginTop: '0.25em' }} ></input>
        </Row>
        <Position state={state} onClick={updatePosition} />
        </>
      )}
    </Row>
  )
}

export default ({ state, dispatch }) => {
  return (
    <FieldSet header='Layout'>
      <Title subheader='Title' state={state.title} dispatch={dispatch} />
      <Legend subheader='Legend' state={state.legend} dispatch={dispatch} />
    </FieldSet>
  )
}