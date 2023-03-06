import { useEffect, useRef } from 'react';

import styles from '@/styles/Toggle.module.css';
import peachUrl from '@/assets/peach.png';

export default function Toggle({
  covered,
  setCovered,
  pillRef,
  peachRef,
  circleRef
}) {
  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    pillRef.current.classList.add(styles.transition);
    circleRef.current.classList.add(styles.transition);
  }, [covered]); // Add transitions after initial render; this prevents the toggle animation when opening the extension

  return (
    <div id={styles.switch_container}>
      <div id={styles.pill} ref={pillRef} className={styles.border_box}></div>
      <img
        id={styles.peach}
        ref={peachRef}
        className={styles.border_box}
        src={peachUrl}
        draggable={false}
      />
      <div
        id={styles.circle}
        onClick={() => setCovered(() => !covered)}
        ref={circleRef}
        className={styles.border_box}
      ></div>
    </div>
  );
}
