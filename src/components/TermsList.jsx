import { useRef } from 'react';
import { IconContext } from 'react-icons';
import { BiCookie, BiHistory } from 'react-icons/bi';
import { FiTrash2 } from 'react-icons/fi';

import styles from '@/styles/TermsList.module.css';

function ListEntry({ term, removeTerm }) {
  const spanRef = useRef(null);

  const iconStyle = { size: '0.75rem' };

  const handleMouseEnter = () => {
    spanRef.current.classList.add(styles.hover_opaque, styles.hover_scale);
  };

  const handleMouseLeave = () => {
    spanRef.current.classList.remove(styles.hover_opaque, styles.hover_scale);
  };

  return (
    <div
      className={styles.row}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.term_container}>
        <p className={styles.term_name}>{term}</p>
        <div className={styles.term_counters}>
          <HitCounters iconStyle={iconStyle} style={{color: 'red'}} />
        </div>
      </div>
      <div>
        <span
          className={styles.svg_wrapper}
          ref={spanRef}
          onClick={() => {
            return removeTerm(term);
          }}
        >
          <IconContext.Provider value={iconStyle}>
            <FiTrash2 />
          </IconContext.Provider>
        </span>
      </div>
    </div>
  );
}

function HitCounters({ iconStyle }) {
  return (
    <>
      <IconContext.Provider value={iconStyle}>
        <BiHistory />
      </IconContext.Provider>
      3
      <span style={{ width: '3px' }} />
      <IconContext.Provider value={iconStyle}>
        <BiCookie />
      </IconContext.Provider>
      2
    </>
  );
}

export default function TermsList({ termsList, removeTerm }) {
  return (
    <div id={styles.list_container}>
      {Array.from(termsList).map((term) => {
        return <ListEntry key={term} term={term} removeTerm={removeTerm} />;
      })}
    </div>
  );
}
