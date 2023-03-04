import styles from '../styles/Toggle.module.css';

export default function Toggle({ toggleCovered }) {
  return (
    <div id={styles.switch_container} onClick={toggleCovered}>
      <div id={styles.pill}></div>
      <img id={styles.peach} src="./peach.png" />
      <div id={styles.circle}></div>
    </div>
  );
}
