import styles from '../styles/Toggle.module.css';

export default function Toggle({ covered, setCovered, pillRef, peachRef, circleRef }) {
  return (
    <section id={styles.spacer}>
      <div 
        id={styles.switch_container} 
        onClick={() => setCovered(() => !covered)}
      >
        <div 
          id={styles.pill} 
          ref={pillRef} 
          className={styles.border_box}
        ></div>
        <img
          id={styles.peach}
          ref={peachRef}
          className={styles.border_box}
          src="./peach.png"
        />
        <div
          id={styles.circle}
          ref={circleRef}
          className={styles.border_box}
        ></div>
      </div>
    </section>
  );
}
