import React, { useState, useEffect, useCallback } from 'react';
import Intro from './Intro';
import Bird from './Bird';
import Pipe from './Pipe';
import Score from './Score';
import GameOverBoard from './GameOverBoard';

const GRAVITY = 3;
const JUMP_STRENGTH = 60;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const INITIAL_PIPE_SPEED = 10;
const PIPE_SPACING = 400;
const NUM_PIPES = 4;
const PIPE_VARIANCE = 110;
const MIN_PIPE_SPACING = 200;
const SPEED_INCREMENT_INTERVAL = 10; // Increase speed every 10 points
const SPACING_DECREASE_INTERVAL = 15; // Decrease spacing every 15 points
const VARIANCE_INCREASE_INTERVAL = 20; // Increase variance every 20 points

const Game = () => {
  const initialBirdY = window.innerHeight / 2 - 30;
  const [birdY, setBirdY] = useState(initialBirdY);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(INITIAL_PIPE_SPEED);
  const [frozen, setFrozen] = useState(true);
  const [previousHighScore, setPreviousHighScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const introTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000); // Duration of the intro

    return () => clearTimeout(introTimer);
  }, []);

  const getPipeSpeed = (score) => INITIAL_PIPE_SPEED + Math.floor(score / SPEED_INCREMENT_INTERVAL) * 0.5;

  const getPipeSpacing = (score) => {
    const minSpacing = MIN_PIPE_SPACING;
    const spacingDecrease = Math.floor(score / SPACING_DECREASE_INTERVAL) * 10;
    return Math.max(minSpacing, PIPE_SPACING - spacingDecrease);
  };

  const getPipeVariance = (score) => {
    const minVariance = 80;
    const varianceIncrease = Math.floor(score / VARIANCE_INCREASE_INTERVAL) * 5;
    return Math.min(PIPE_VARIANCE + varianceIncrease, 150);
  };

  const generatePipe = (x, prevY) => {
    const variance = getPipeVariance(score);
    const minGapTop = Math.max(50, prevY - variance);
    const maxGapTop = Math.min(window.innerHeight - PIPE_GAP - 50, prevY + variance);
    const yTop = Math.floor(Math.random() * (maxGapTop - minGapTop + 1)) + minGapTop;
    return { x, yTop };
  };

  const initializePipes = useCallback(() => {
    const newPipes = [];
    let prevY = Math.floor(window.innerHeight / 2 - PIPE_GAP / 2);
    for (let i = 0; i < NUM_PIPES; i++) {
      const pipe = generatePipe(window.innerWidth + i * getPipeSpacing(score), prevY);
      newPipes.push(pipe);
      prevY = pipe.yTop;
    }
    setPipes(newPipes);
  }, [score]);

  const jump = useCallback(() => {
    if (!gameOver && !frozen) {
      setBirdY(prev => Math.max(0, prev - JUMP_STRENGTH));
      if (!gameStarted) {
        setGameStarted(true);
        initializePipes();
      }
    }
  }, [gameOver, gameStarted, initializePipes, frozen]);

  const resetGame = useCallback(() => {
    setBirdY(initialBirdY);
    initializePipes();
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setGameSpeed(INITIAL_PIPE_SPEED);
    setFrozen(false);
    setPreviousHighScore(highScore);
  }, [initializePipes, highScore, initialBirdY]);

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
      const newPipeSpeed = getPipeSpeed(score);
      setBirdY(prev => Math.min(prev + GRAVITY, window.innerHeight - 30));
      setPipes(prevPipes => {
        const newPipes = prevPipes.map(pipe => ({
          ...pipe,
          x: pipe.x - newPipeSpeed,
        }));

        if (newPipes[0].x <= -PIPE_WIDTH) {
          const prevPipeY = newPipes[newPipes.length - 1].yTop;
          newPipes.shift();
          newPipes.push(generatePipe(newPipes[newPipes.length - 1].x + getPipeSpacing(score), prevPipeY));
          setScore(prevScore => {
            const newScore = prevScore + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem('highScore', newScore);
            }
            // Trigger blink effect
            if (newScore % 100 === 0) {
              setBlink(true);
              setTimeout(() => setBlink(false), 2000); // Reset blink after animation
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
  }, [birdY, pipes, gameOver, gameStarted, highScore, score, frozen]);

  useEffect(() => {
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
      const newHighScore = parseInt(storedHighScore, 10);
      setHighScore(newHighScore);
      setPreviousHighScore(newHighScore);
    }
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setFrozen(false); // Unfreeze the game when the intro ends
    }
  }, [showIntro]);

  const checkCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  return (
    <>
      {showIntro && <Intro onIntroEnd={() => setShowIntro(false)} />}
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
        <Score score={score} highScore={highScore} blink={blink} />
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
        {gameOver && <GameOverBoard score={score} highScore={highScore} previousHighScore={previousHighScore} onRestart={resetGame} />}
      </div>
    </>
  );
};

export default Game;
