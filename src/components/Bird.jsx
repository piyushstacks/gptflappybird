import React from 'react';

const Bird = ({ y }) => (
  <div 
    style={{
      position: 'absolute',
      width: '50px',
      height: '50px',
      left: '80px',
      top: `${y}px`,
      backgroundImage: 'url(/bird.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      borderRadius: '50%' // If the bird image is circular, otherwise you can remove this
    }}
  />
);

export default Bird;
