import { useState, useCallback, useRef } from 'react';

import TitleBar from './TitleBar';
import Toggle from './Toggle';
import SearchForm from './SearchForm';
import TermsList from './TermsList';
import { loadCovered, saveCovered } from '../actions';

export default function App() {
  const [covered, setCovered] = useState(loadCovered());
  const [showList, setShowList] = useState(false);
  const [termsList, setTermsList] = useState(new Set(['test', 'test', '123']));

  const toggleCovered = () => {
    setCovered(() => !covered);
    saveCovered(!covered);
  };

  const addTerm = (term) => {
    if (termsList.size >= 50) return; // Maximum of 50 terms in list
    const newTermsList = structuredClone(termsList);
    newTermsList.add(term);
    setTermsList(newTermsList);
  }

  const removeTerm = (term) => {
    const newTermsList = structuredClone(termsList);
    if (!newTermsList.delete(term)) return;
    setTermsList(newTermsList);
  }

  return (
    <>
      <header>
        <TitleBar />
      </header>
      <main>
        <Toggle covered={covered} toggleCovered={toggleCovered} />
        <h3>
          Your butt is
          {covered ? ' SHOWING' : ' COVERED'}
        </h3>
        <SearchForm addTerm={addTerm} />
        <div
          id="toggle-list"
          onClick={() => {
            setShowList(() => !showList);
          }}
        >
          {!showList ? 'Expand' : 'Collapse'}
        </div>
        {showList && <TermsList termsList={termsList} removeTerm={removeTerm} />}
      </main>
    </>
  );
}
