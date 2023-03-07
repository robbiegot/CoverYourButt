import styles from '@/styles/TitleBar.module.css';

export default function TitleBar({ children }) {
  return (
    <div id={styles.title_banner}>
      <span id={styles.title_contents}>{children}</span>
    </div>
  );
}
