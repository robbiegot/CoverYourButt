import { useEffect, useRef } from 'react';

import peachUrl from '@/assets/peach.png';

import styles from '@/styles/Toggle.module.css';

export default function Toggle({ covered, setCovered, processingHide, processing, pillRef, peachRef, circleRef }) {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) return;
    pillRef.current.classList.add(styles.transition);
    circleRef.current.classList.add(styles.transition);
  }, [covered]); // * Add transitions only after initial render; this prevents the toggle animation when opening the extension

  useEffect(() => {
    initialRender.current = false;
  }, []);

  useEffect(() => {
    if (processingHide) return circleRef.current.classList.add(styles.processing)
    return circleRef.current.classList.remove(styles.processing)
  }, [processingHide])

  return (
    <div id={styles.switch_container}>
      <div
        id={styles.pill}
        ref={pillRef}
        className={`
          ${styles.border_box} 
          ${covered ? styles.toggled : ''} 
        `}
      />
      <img
        id={styles.peach}
        ref={peachRef}
        className={`
          ${styles.border_box} 
          ${covered ? styles.toggled : ''} 
        `}
        src={peachUrl}
        draggable={false}
      />
      <div
        id={styles.circle}
        onClick={() => {
          if (processing.current) return;
          setCovered(() => !covered);
        }}
        ref={circleRef}
        className={`
          ${styles.border_box} 
          ${covered ? styles.toggled : ''} 
        `}
      >{processingHide && <p style={{ textAlign: "center" }}>Wait!</p>}</div>
    </div>
  );
}
