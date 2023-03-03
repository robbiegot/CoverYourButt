import { useState } from 'react';

import {
  loadCovered,
  loadTermsList,
  restoreHistoryItems,
  saveAndDeleteHistoryItems,
  saveCovered,
  saveTermsList
} from '../actions';
import SearchForm from './SearchForm';
import TermsList from './TermsList';
import TitleBar from './TitleBar';
import Toggle from './Toggle';

export default function App() {
  const [covered, setCovered] = useState(loadCovered());
  const [showList, setShowList] = useState(false);
  const [termsList, setTermsList] = useState(new Set(loadTermsList()));

  const toggleCovered = () => {
    if (covered) restoreHistoryItems();
    else saveAndDeleteHistoryItems();
    saveCovered(!covered);
    setCovered(() => !covered);
  };

  const addTerm = (term) => {
    if (termsList.size >= 50) return; // Maximum of 50 terms in list
    const newTermsList = structuredClone(termsList);
    newTermsList.add(term);
    setTermsList(newTermsList);
    saveTermsList(Array.from(newTermsList));
  };

  const removeTerm = (term) => {
    const newTermsList = structuredClone(termsList);
    if (!newTermsList.delete(term)) return;
    setTermsList(newTermsList);
    saveTermsList(Array.from(newTermsList));
  };

  return (
    <>
      <header>
        <TitleBar />
      </header>
      <main>
        <Toggle covered={covered} toggleCovered={toggleCovered} />
        <h3>
          Your butt is
          {covered ? ' COVERED' : ' SHOWING'}
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
        {showList && (
          <TermsList termsList={termsList} removeTerm={removeTerm} />
        )}
      </main>
    </>
  );
}
