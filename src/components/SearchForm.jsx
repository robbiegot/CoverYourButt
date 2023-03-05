import { useRef } from 'react';

import styles from '@/styles/SearchForm.module.css';

export default function SearchForm({ addTerm }) {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTerm(inputRef.current.value);
    e.target.reset()
  };

  return (
    <form id={styles.form} onSubmit={handleSubmit}>
      <input
        id={styles.input_text}
        type="text"
        ref={inputRef}
        autoComplete="off"
        placeholder="Domain name or title"
      />
      <input
        id={styles.input_submit}
        type="submit"
        value="Add"
      />
    </form>
  );
}
