// Intro.jsx
import React, { useEffect, useState } from 'react';
import './Intro.css'; // Import the CSS for the Intro component

const Intro = ({onIntroEnd}) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Setting fadeOut to true');
      setFadeOut(true);
      setTimeout(onIntroEnd, 1000);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [onIntroEnd]);

  return (
    <div className={`intro-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="intro-content">
        <h1>FlappyBird</h1>
        <div className="buffering">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>your concentration and focus: </p>
        <p>Before: 0 👎🏻    After: 100 🫣</p>
      </div>
    </div>
  );
};

export default Intro;
