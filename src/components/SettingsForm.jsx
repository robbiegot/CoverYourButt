import { useEffect, useRef } from 'react';

import {
  loadCookiesPreference,
  loadHistoryPreference,
  saveCookiesPreference,
  saveHistoryPreference,
} from '@/utils/actions';

import styles from '@/styles/SettingsForm.module.css';

export default function SettingsForm({ setShowModal }) {
  const historyRef = useRef(null);
  const cookiesRef = useRef(null);

  useEffect(() => {
    [historyRef.current.checked, cookiesRef.current.checked] = [loadHistoryPreference(), loadCookiesPreference()];
  }, []);

  return (
    <div id={styles.settings_form_container}>
      <form id={styles.settings_form}>
        <p>Hide items from: </p>
        <input id={styles.input_text} ref={historyRef} type="checkbox" />
        <label htmlFor={styles.input_text}>history</label>
        <br />
        <input id={styles.input_text} ref={cookiesRef} type="checkbox" />
        <label htmlFor={styles.input_text}>cookies</label>
        <br />
      </form>
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
    </div>
  );
}
