import styles from '../styles/Header.module.css';

export default function CardHeader({ text }) {
  return (
    <div className={styles.header_container}>
      <div className={styles.header_spacer}></div>
      <h3 className={styles.header_text}>{text}</h3>
      <div className={styles.header_spacer}></div>
    </div>
  );
}
