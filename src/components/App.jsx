// import React from 'react';

import TitleBar from './TitleBar';
import Toggle from './Toggle';

const App = () => {
  return (
    <>
      <TitleBar />
      <Toggle />
      <h3>
        Your butt is{' '}
        <span id="show-ass">
          <br />
          SHOWING
        </span>
        <span id="covered-ass" hidden="true">
          <br />
          COVERED
        </span>
      </h3>
      <form id="form">
        <input
          type="text"
          id="input-text"
          autocomplete="off"
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
