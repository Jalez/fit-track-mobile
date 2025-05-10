import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const RestTimer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer = null;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
      setIsActive(false);
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  return (
    <View>
      <Text>{`Time Left: ${timeLeft}s`}</Text>
      <Button title="Start" onPress={startTimer} disabled={isActive} />
      <Button title="Reset" onPress={resetTimer} disabled={!isActive} />
    </View>
  );
};

export default RestTimer;