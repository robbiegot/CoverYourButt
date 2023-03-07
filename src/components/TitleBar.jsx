import styles from '@/styles/TitleBar.module.css';

export default function TitleBar({ children }) {
  return (
    <div id={styles.title_banner}>
      <h1 id={styles.title_text}>{children}</h1>
    </div>
  );
}
