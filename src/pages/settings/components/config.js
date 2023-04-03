import { useState, useEffect } from "react";

const Config = () => {
  const [comPort, setComPort] = useState('');
  const [outputDir, setoutputDir] = useState('');

  useEffect(() => {
    const comPort = window.Store.get('comPort');
    const outputDir = window.Store.get('outputDir');
    setComPort(comPort);
    setoutputDir(outputDir);
  }, []);

  function handleComChange(event) {
    setComPort(event.target.value);
    window.Store.set('comPort', event.target.value);
  }
  function handleOutputChange(event) {
    setoutputDir(event.target.value);
    window.Store.set('outputDir', event.target.value);
  }
  return (
  <div>
    <div>
      <label htmlFor="comPortInput">COM Port:</label>
      <input
        type="text"
        id="comPortInput"
        value={comPort}
        onChange={handleComChange}
      />
    </div>
    <div>
      <label htmlFor="comPortInput">Output dir:</label>
      <input
        type="text"
        id="comPortInput"
        value={outputDir}
        onChange={handleOutputChange}
      />
    </div>
  </div>
  );
}
 
export default Config;