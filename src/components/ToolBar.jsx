import styles from '@/styles/ToolBar.module.css';

export default function Footer({ children }) {
  return (
    <div id={styles.footer_banner}>
      <span id={styles.footer_content}>
        {children}
      </span>
    </div>
  );
}
