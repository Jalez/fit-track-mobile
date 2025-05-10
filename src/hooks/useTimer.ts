import { useEffect, useRef, useState } from 'react';

const useTimer = (initialTime = 0) => {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef(null);

  const startTimer = () => {
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, time]);

  return { time, isActive, startTimer, stopTimer, resetTimer };
};

export default useTimer;