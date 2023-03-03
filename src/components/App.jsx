import { useState, useCallback } from 'react';

import TitleBar from './TitleBar';
import Toggle from './Toggle';
import { loadCovered, saveCovered} from '../actions';

const App = () => {
  const [covered, setCovered] = useState(loadCovered());

  const toggleCovered = () => {
    setCovered(() => !covered);
    saveCovered(!covered);
  };

  return (
    <>
      <TitleBar />
      <Toggle covered={covered} toggleCovered={toggleCovered} />
      <h3>
        Your butt is 
        {!covered && ' SHOWING'}
        {covered && ' COVERED'}
      </h3>
      <form id="form">
        <input
          type="text"
          id="input-text"
          autoComplete="off"
          placeholder="Domain name or title"
        />
        <input type="submit" id="buttonSubmit" value="Add" />
      </form>
      <div id="hide-list">
        <span id="show">Expand </span>
        <span id="hide" hidden="true">
          Collapse{' '}
        </span>
      </div>
      <div id="blocked-domains-list"></div>
    </>
  );
};

export default App;
