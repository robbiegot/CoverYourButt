import { useRef } from 'react';
import { IconContext } from 'react-icons';
import { BiCookie, BiHistory } from 'react-icons/bi';
import { FiTrash2 } from 'react-icons/fi';

import styles from '@/styles/TermsList.module.css';

function ListEntry({ term, removeTerm, historyItemCount, cookieCount }) {
  const spanRef = useRef(null);

  const iconStyle = { size: '0.75rem' };

  const handleMouseEnter = () => {
    spanRef.current.classList.add(styles.hover_opaque, styles.hover_scale);
  };

  const handleMouseLeave = () => {
    spanRef.current.classList.remove(styles.hover_opaque, styles.hover_scale);
  };

  console.log(term, historyItemCount, cookieCount);

  return (
    <div className={styles.row} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className={styles.term_container}>
        <p className={styles.term_name}>{term}</p>
        <div className={styles.term_counters}>
          {typeof historyItemCount === 'number' && (
            <>
              <IconContext.Provider value={iconStyle}>
                <BiHistory />
              </IconContext.Provider>
              {historyItemCount}
            </>
          )}
          {typeof cookieCount === 'number' && (
            <>
              <IconContext.Provider value={iconStyle}>
                <BiCookie />
              </IconContext.Provider>
              {cookieCount}
            </>
          )}
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

export default function TermsList({ listRef, termsList, removeTerm, historyItemCountByTerm, cookieCountByTerm }) {
  return (
    <div id={styles.list_container} className={styles.expanded} ref={listRef}>
      {Array.from(termsList).map((term) => {
        return (
          <ListEntry
            key={term}
            term={term}
            removeTerm={removeTerm}
            historyItemCount={historyItemCountByTerm[term]}
            cookieCount={cookieCountByTerm[term]}
          />
        );
      })}
    </div>
  );
}
