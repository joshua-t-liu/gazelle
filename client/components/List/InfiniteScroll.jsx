import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const List = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: none;
`;

export default ({ id, children }) => {
  const [rowCount, setRowCount] = useState(50);
  const ref = useRef(null);

  useEffect(() => {
    const options = {
      root: document.getElementById(id),
      rootMargin: '0px',
      threshold: 0,
    }
    function showMore(entries) {
      if (entries[0] && entries[0].isIntersecting) setRowCount((val) => val + 50);
    }
    const observer = new IntersectionObserver(showMore, options);
    observer.observe(ref.current);
  }, []);

  return (
    <List id={id}>
        {React.Children.toArray(children).slice(0, rowCount)}
        <div ref={ref} style={{ padding: '1em' }}></div>
    </List>
  )
}
