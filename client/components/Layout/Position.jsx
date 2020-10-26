import React from 'react';
import { Row , Button} from '../Shared';

export default ({ state, onClick }) => {
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