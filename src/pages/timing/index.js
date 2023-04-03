import React, { useEffect, useState } from 'react';

import TitleBar from './components/TitleBar';
import InfoBar from './components/InfoBar';
import Timing from './components/Timing';

const LapTracker = () => {
  const [config, setConfig] = useState(null);
  const [data, setData] = useState({});
  const [renderData, setRenderData] = useState([]);
  console.log(config);
  useEffect(() => {
    async function getConfigData() {
      return window.electron.invoke('get-config-data');
    }

    const fetchData = async () => {
      const fetchedConfig = await getConfigData();
      setConfig(fetchedConfig);

      window.electron.on('serial-data', (event, data) => {
        const { personIndex, totalLaps, lastLap } = data;
        const lastLapMillis = timeToMillis(lastLap);
        setData(prevData => {
          const newData = { ...prevData };
          if (!newData[personIndex]) {
            newData[personIndex] = { totalLaps, lastLaps: [lastLapMillis] };
          } else {
            newData[personIndex].totalLaps = totalLaps;
            newData[personIndex].lastLaps.push(lastLapMillis);
            if (newData[personIndex].lastLaps.length > fetchedConfig.lastLapsToStore) {
              newData[personIndex].lastLaps.shift();
            }
          }
          return newData;
        });
        updateUI(fetchedConfig.main.sortType);
      });
    };

    fetchData();
  }, []);

  const timeToMillis = (timeStr) => {
    const [hours, minutes, seconds, millis] = timeStr.split(':').map(Number);
    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000 + millis;
  };

  const millisToTime = (millis) => {
    const hours = Math.floor(millis / (60 * 60 * 1000));
    const minutes = Math.floor((millis % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((millis % (60 * 1000)) / 1000);
    const ms = millis % 1000;
    return `${hours}:${minutes}:${seconds}:${ms}`;
  };

  const sortData = (data, sortType) => {
    if (sortType === 'totalLaps') {
      return Object.entries(data).sort((a, b) => b[1].totalLaps - a[1].totalLaps);
    } else if (sortType === 'bestLap') {
      return Object.entries(data).sort((a, b) => Math.min(...a[1].lastLaps) - Math.min(...b[1].lastLaps));
    }
  };

  const updateUI = (sortType) => {
    window.electron.invoke('save-data', data);
    setRenderData(sortData(data, sortType));
  };

  if (!config) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <TitleBar displayed={config.titleRow.displayed} title={config.titleRow.default} />
      <InfoBar displayed={config.totalRow.displayed} total={config.totalRow.default} />
      <Timing config={config} renderData={renderData} millisToTime={millisToTime} />
    </div>
  );
};

export default LapTracker;
