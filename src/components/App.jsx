import { useState, useCallback, useRef } from 'react';

import TitleBar from './TitleBar';
import Toggle from './Toggle';
import SearchForm from './SearchForm';
import { loadCovered, saveCovered } from '../actions';

export default function App() {
  const [covered, setCovered] = useState(loadCovered());
  const [showList, setShowList] = useState(false);
  const [termsList, setTermsList] = useState([]);

  const termRef = useRef();

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
      <SearchForm />
      <div id="hide-list">
        {!showList && 'Expand'}
        {showList && 'Collapse'}
      </div>
      <div id="blocked-domains-list"></div>
    </>
  );
};
