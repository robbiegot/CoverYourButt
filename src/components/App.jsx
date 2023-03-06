import { useEffect, useRef, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

import Card from '@/components/Card';
import CardHeader from '@/components/CardHeader';
import SearchForm from '@/components/SearchForm';
import TermsList from '@/components/TermsList';
import TitleBar from '@/components/TitleBar';
import Toggle from '@/components/Toggle';
import {
  hideCookies,
  hideHistoryItems,
  loadCovered,
  loadTermsList,
  restoreCookies,
  restoreHistoryItems,
  saveCovered,
  saveTermsList,
} from '@/utils/actions';

import styles from '@/styles/App.module.css';
import toggleStyles from '@/styles/Toggle.module.css';

export default function App() {
  const initialRender = useRef(true);
  const [covered, setCovered] = useState(loadCovered());
  const [showList, setShowList] = useState(false);
  const [termsList, setTermsList] = useState(new Set(loadTermsList()));

  const pillRef = useRef(null);
  const peachRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    if (covered) {
      pillRef.current.classList.add(toggleStyles.toggled);
      peachRef.current.classList.remove(toggleStyles.untoggled);
      circleRef.current.classList.add(toggleStyles.toggled);
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      hideHistoryItems(10000);
      hideCookies();
    } else {
      pillRef.current.classList.remove(toggleStyles.toggled);
      peachRef.current.classList.add(toggleStyles.untoggled);
      circleRef.current.classList.remove(toggleStyles.toggled);
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      restoreHistoryItems();
      restoreCookies();
    }
    saveCovered(covered);
  }, [covered]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    saveTermsList(Array.from(termsList));
  }, [termsList]);

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
        <Card>
          <section className={styles.spacer}>
            <Toggle
              covered={covered}
              setCovered={setCovered}
              pillRef={pillRef}
              peachRef={peachRef}
              circleRef={circleRef}
            />
          </section>
          <section className={styles.spacer}>
            <p>
              Your butt is
              <strong>{covered ? ' COVERED' : ' SHOWING '}</strong>
              {!covered && <FiAlertTriangle />}
            </p>
          </section>
        </Card>
        <Card>
          <CardHeader text={'Blocklist'} />
          <section className={styles.spacer}>
            <SearchForm
              addTerm={addTerm}
              tempSetShowList={() => {
                if (showList === false) {
                  setShowList(true);
                  setTimeout(() => setShowList(false), 5000);
                }
              }}
            />
          </section>
          <div
            id="expand"
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => {
              setShowList(() => !showList);
            }}
          >
            {!showList ? 'Expand' : 'Collapse'}
          </div>
          {showList && (
            <TermsList termsList={termsList} removeTerm={removeTerm} />
          )}
        </Card>
      </main>
    </>
  );
}
