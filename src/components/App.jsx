import React from 'react';

const App = () => {
  return (
    <>
      <h1>App Component</h1>
      <div id="switch-container">
        <div id="pill"></div>
        <img id="peach" src="download.png" />
        <div id="circle"></div>
      </div>
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
      <div id="hide-list">
        <span id="show">Expand </span>
        <span id="hide" hidden="true">
          Collapse{' '}
        </span>
      </div>
      <div id="blocked-domains-list"></div>
      <form id="form">
        <input
          type="text"
          id="input-text"
          autocomplete="off"
          placeholder="Domain name or title"
        />
        <input type="submit" id="buttonSubmit" value="Add" />
      </form>
    </>
  );
};

export default App;
