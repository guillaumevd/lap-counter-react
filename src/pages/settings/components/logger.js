import React, { useEffect } from 'react';
import { useLogContext } from '../../../logger/LogContext';

const Logger = () => {
  const { logMessages, addLogMessage } = useLogContext();

  useEffect(() => {
    window.serialAPI.onLogMessage((message) => {
      addLogMessage(message);
    });

    return () => {
      // Handle cleanup if necessary
    };
  }, []);

  return (
    <div className="logger">
      <h3>Logger</h3>
      <ul>
        {logMessages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Logger;
