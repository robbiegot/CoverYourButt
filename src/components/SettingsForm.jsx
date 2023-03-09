import { useEffect, useRef, useState } from 'react';
import Toggle from 'react-toggle';

import {
  loadCookiesPreference,
  loadFuzzySearchPreference,
  loadHistoryPreference,
  saveCookiesPreference,
  saveFuzzySearchPreference,
  saveHistoryPreference,
} from '@/utils/actions';

import styles from '@/styles/SettingsForm.module.css';
import 'react-toggle/style.css';

export default function SettingsForm({ setShowModal }) {
  const historyRef = useRef(null);
  const cookiesRef = useRef(null);

  const [fuzzySearchPreference, setFuzzySearchPreference] = useState(loadFuzzySearchPreference());

  useEffect(() => {
    [historyRef.current.checked, cookiesRef.current.checked] = [true, loadCookiesPreference()];
  }, []);

  useEffect(() => {
    saveFuzzySearchPreference(fuzzySearchPreference);
  }, [fuzzySearchPreference]);

  return (
    <div id={styles.settings_form_container}>
      <form id={styles.settings_form}>
        <p>Hide items from: </p>
        <div id={styles.checkbox_row}>
          <input id={styles.input_text} ref={historyRef} type="checkbox" disabled="disabled" checked="checked" />
          <label htmlFor={styles.input_text}>History</label>
        </div>
        <div id={styles.checkbox_row}>
          <input id={styles.input_text} ref={cookiesRef} type="checkbox" />
          <label htmlFor={styles.input_text}>Cookies</label>
        </div>
        <div id={styles.fuzzy_row} >
          <label htmlFor="input_fuzzy">Enable fuzzy search</label>
          <Toggle
            id="input_fuzzy"
            checked={fuzzySearchPreference}
            onChange={() => {
              setFuzzySearchPreference(() => !fuzzySearchPreference);
            }}
          />
        </div>
        <p>(Not Recommended)</p>
      </form >
      <div id={styles.button_row}>
        <button
          id={styles.button_cancel}
          onClick={() => {
            setShowModal(() => false);
          }}
        >
          Cancel
        </button>
        <button
          id={styles.button_save}
          onClick={() => {
            saveHistoryPreference(historyRef.current.checked);
            saveCookiesPreference(cookiesRef.current.checked);
            setShowModal(() => false);
          }}
        >
          Save
        </button>
      </div>
    </div >
  );
}
