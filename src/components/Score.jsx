// Score.js
import React from 'react';
import './score.css';

const Score = ({ score, highScore, blink }) => (
  <div className={`score-container ${blink ? 'blink-twice' : ''}`} style={{
    position: 'absolute',
    top: '16px',
    right: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '12px',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'right'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
      Score: {score}
    </div>
    <div style={{ fontSize: '18px' }}>
      High Score: {highScore}
    </div>
  </div>
);

export default Score;
