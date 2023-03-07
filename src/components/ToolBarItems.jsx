import { IconContext } from 'react-icons';
import { FaGithub } from 'react-icons/fa';
import { TbSettings } from 'react-icons/tb';

import styles from '@/styles/ToolBar.module.css';

export default function ToolBarItems() {
  return (
    <>
      <IconContext.Provider
        value={{
          size: '1.25rem',
          color: '#aaa',
        }}
      >
        <div>
          <FaGithub
            className={styles.pointer}
            onClick={() => {
              window.open('https://github.com/robbiegot/CoverYourButt');
            }}
          />
        </div>
        <div className={styles.spacer} />
        <div>
          <TbSettings
            className={styles.pointer}
            onClick={() => {
              window.open('https://github.com/robbiegot/CoverYourButt');
            }}
          />
        </div>
      </IconContext.Provider>
    </>
  );
}
