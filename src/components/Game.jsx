// Game.js
import React, { useState, useEffect, useCallback } from 'react';
import Bird from './Bird';
import Pipe from './Pipe';
import Score from './Score';
import GameOverBoard from './GameOverBoard';

const GRAVITY = 3;
const JUMP_STRENGTH = 60;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const INITIAL_PIPE_SPEED = 5;
const PIPE_SPACING = 400;
const NUM_PIPES = 3;

const Game = () => {
  const [birdY, setBirdY] = useState(50);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_PIPE_SPEED);
  const [frozen, setFrozen] = useState(false);

  const generatePipe = (x) => ({
    x,
    yTop: Math.floor(Math.random() * (window.innerHeight - PIPE_GAP - 100)) + 50,
  });

  const initializePipes = useCallback(() => {
    const newPipes = [];
    for (let i = 0; i < NUM_PIPES; i++) {
      newPipes.push(generatePipe(window.innerWidth + i * PIPE_SPACING));
    }
    setPipes(newPipes);
  }, []);

  const jump = useCallback(() => {
    if (!gameOver) {
      setBirdY(prev => Math.max(0, prev - JUMP_STRENGTH));
      if (!gameStarted) {
        setGameStarted(true);
        initializePipes();
      }
    }
  }, [gameOver, gameStarted, initializePipes]);

  const resetGame = useCallback(() => {
    setBirdY(50);
    initializePipes();
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setGameSpeed(INITIAL_PIPE_SPEED);
    setFrozen(false);
  }, [initializePipes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        if (gameOver) {
          resetGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, gameOver, resetGame]);

  useEffect(() => {
    if (!gameStarted || frozen) return;

    const gameLoop = setInterval(() => {
      setBirdY(prev => Math.min(prev + GRAVITY, window.innerHeight - 30));
      setPipes(prevPipes => {
        const newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - gameSpeed,
        }));

        if (newPipes[0].x <= -PIPE_WIDTH) {
          newPipes.shift();
          newPipes.push(generatePipe(newPipes[newPipes.length - 1].x + PIPE_SPACING));
          setScore(prevScore => {
            const newScore = prevScore + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('highScore', newScore);
            }
            if (newScore % 10 === 0) {
              setGameSpeed(prevSpeed => prevSpeed + 0.75);
            }
            return newScore;
          });
        }

        return newPipes;
      });

      // Check for collisions
      const birdRect = { x: 50, y: birdY, width: 40, height: 30 };
      pipes.forEach(pipe => {
        const topPipeRect = { x: pipe.x, y: 0, width: PIPE_WIDTH, height: pipe.yTop };
        const bottomPipeRect = { x: pipe.x, y: pipe.yTop + PIPE_GAP, width: PIPE_WIDTH, height: window.innerHeight - pipe.yTop - PIPE_GAP };

        if (
          checkCollision(birdRect, topPipeRect) ||
          checkCollision(birdRect, bottomPipeRect) ||
          birdY >= window.innerHeight - 30
        ) {
          setGameOver(true);
          setFrozen(true);
        }
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [birdY, pipes, gameOver, gameStarted, highScore, gameSpeed, frozen]);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
  }, []);

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: 'skyblue',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={jump}
    >
      <Bird y={birdY} />
      {pipes.map((pipe, index) => (
        <Pipe key={index} x={pipe.x} yTop={pipe.yTop} gap={PIPE_GAP} />
      ))}
      <Score score={score} highScore={highScore} />
      {!gameStarted && !gameOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '16px',
            borderRadius: '8px'
          }}>
            Click or Press Space to Start
          </div>
        </div>
      )}
      {gameOver && <GameOverBoard score={score} highScore={highScore} onRestart={resetGame} />}
    </div>
  );
};

export default Game;