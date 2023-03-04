import { useEffect, useRef, useState } from 'react';

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

import styles from '../styles/App.module.css';
import toggleStyles from '../styles/Toggle.module.css';

export default function App() {
  const [covered, setCovered] = useState(loadCovered());
  const [showList, setShowList] = useState(false);
  const [termsList, setTermsList] = useState(new Set(loadTermsList()));

  const pillRef = useRef(null);
  const peachRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (covered) {
      saveAndDeleteHistoryItems();
      circleRef.current.classList.add(toggleStyles.toggled);
      pillRef.current.classList.add(toggleStyles.toggled);
      peachRef.current.classList.remove(toggleStyles.untoggled);
    } else {
      restoreHistoryItems();
      circleRef.current.classList.remove(toggleStyles.toggled);
      pillRef.current.classList.remove(toggleStyles.toggled);
      peachRef.current.classList.add(toggleStyles.untoggled);
    }
    saveCovered(covered);
  }, [covered]);

  useEffect(() => {
    saveTermsList(Array.from(termsList));
  }, [termsList])

  const addTerm = (term) => {
    if (termsList.size >= 50) return; // Maximum of 50 terms in list
    const newTermsList = structuredClone(termsList);
    newTermsList.add(term);
    setTermsList(newTermsList);
  };

  const removeTerm = (term) => {
    const newTermsList = structuredClone(termsList);
    if (!newTermsList.delete(term)) return;
    setTermsList(newTermsList);
  };

  return (
    <>
      <header>
        <TitleBar />
      </header>
      <main id={styles.main}>
        <Toggle
          covered={covered}
          setCovered={setCovered}
          pillRef={pillRef}
          peachRef={peachRef}
          circleRef={circleRef}
        />
        <h3>
          Your butt is
          {covered ? ' COVERED' : ' SHOWING'}
        </h3>
        <SearchForm addTerm={addTerm} />
        <div
          id="expand"
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
