import React, { useState } from 'react';
import { Row, Button } from '../Shared';

export default ({ aggregate, dispatch }) => {
  const [isExpanded, setExpand] = useState(false);

  function setFunc(event) {
    dispatch({ type: 'aggregate', payload: { aggregate: event.target.id } })
  }

  return (
    <Row subheader='Additional Options'>
      <div
        style={{ position: 'absolute', right: 0, color: 'dodgerblue', cursor: 'pointer' }}
        onClick={() => setExpand((val) => !val)}>
          {(isExpanded) ? 'collapse' : 'expand'}
      </div>
      {isExpanded &&
        <Row subheader='Group data points with the same X values using'>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {['None', 'Sum', 'Average', 'Count', 'Max', 'Min'] //None, Min, Max, Median
              .map((func) => (
                <Button
                  key={func}
                  id={func}
                  className={aggregate === func && 'active'}
                  onClick={setFunc}>
                    {func}
                  </Button>
                  ))}
          </div>
        </Row>
      }
    </Row>
  )
}