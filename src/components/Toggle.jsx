import { useEffect, useState } from 'react';

import peachUrl from '@/assets/peach.png';
import styles from '@/styles/Toggle.module.css';
import peachUrl from '@/assets/peach.png';

export default function Toggle({
  covered,
  setCovered,
  pillRef,
  peachRef,
  circleRef
}) {
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) return;
    pillRef.current.classList.add(styles.transition);
    circleRef.current.classList.add(styles.transition);
  }, [covered]);

  useEffect(() => {
    if (!initialRender) return;
    setInitialRender(() => false);
  });

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
