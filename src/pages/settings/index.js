import Config from './components/config.js';
import Logger from './components/logger.js';

const Settings = (props) => {
  return (
    <div className="row">
      <div class="col">
        <Config/>
      </div>
      <div className="col">
        <Logger/>
      </div>
    </div>
  );
}
 
export default Settings;
