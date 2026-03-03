import React, { useState, useEffect } from 'react';

const FakeCall = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = null;
    if (isCalling) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isCalling && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCalling, seconds]);

  const startCall = () => {
    setIsCalling(true);
    setSeconds(0);
  };

  const endCall = () => {
    setIsCalling(false);
    setSeconds(0);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      {!isCalling ? (
        <button onClick={startCall}>Start Fake Call</button>
      ) : (
        <div>
          <p>Calling... {seconds}s</p>
          <button onClick={endCall}>End Call</button>
        </div>
      )}
    </div>
  );
};

export default FakeCall;