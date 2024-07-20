import React from 'react';

const getEmoji = (score, highScore, previousHighScore) => {
  if (score === 0) return '😢';
  if (score > previousHighScore) return '🎉';
  if (score >= previousHighScore * 0.8) return '🔥';
  if (score >= previousHighScore * 0.5) return '👍';
  if (score >= previousHighScore * 0.3) return '😊';
  return '🙂';
};

const getMessage = (score, highScore, previousHighScore) => {
  if (score === 0) return 'Oops! Better luck next time!';
  if (score > previousHighScore) return 'Wow! New high score!';
  if (score >= previousHighScore * 0.8) return 'So close to the high score!';
  if (score >= previousHighScore * 0.5) return 'Great job!';
  if (score >= previousHighScore * 0.3) return 'Nice try!';
  return 'Keep practicing!';
};

const GameOverBoard = ({ score, highScore, previousHighScore, onRestart }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Game Over</h2>
      <p style={{ fontSize: '24px', marginBottom: '8px' }}>Score: {score}</p>
      <p style={{ fontSize: '20px', marginBottom: '16px' }}>High Score: {highScore}</p>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {getEmoji(score, highScore, previousHighScore)}
      </div>
      <p style={{ fontSize: '20px', marginBottom: '24px' }}>{getMessage(score, highScore, previousHighScore)}</p>
      <button 
        onClick={onRestart}
        style={{
          fontSize: '18px',
          padding: '12px 24px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Play Again
      </button>
    </div>
  </div>
);

export default GameOverBoard;
