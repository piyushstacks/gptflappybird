// Pipe.js
import React from 'react';

const Pipe = ({ x, yTop, gap }) => (
  <>
    <div 
      style={{
        position: 'absolute',
        top: 0,
        left: `${x}px`,
        width: '80px',
        height: `${yTop}px`,
        backgroundColor: 'green'
      }}
    />
    <div 
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${x}px`,
        width: '80px',
        height: `${window.innerHeight - yTop - gap}px`,
        backgroundColor: 'green'
      }}
    />
  </>
);

export default Pipe;