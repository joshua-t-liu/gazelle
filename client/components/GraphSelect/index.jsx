import React from 'react';

import { FieldSet, Row, Button } from '../Shared';
import TYPES from './Types';

export default ({ graphType, dispatch }) => {

  function setGraphType(event) {
    dispatch({ type: 'graph', payload: { graphType: event.target.id } });
  }

  return (
    <FieldSet header='Graph Types'>
      <Row>
        {TYPES.map(({ title, type }) => (
          <Button
            key={type}
            id={type}
            className={(graphType === type) && 'active'}
            onClick={setGraphType}>
              {title}
          </Button>
        ))}
      </Row>
    </FieldSet>
  )
}