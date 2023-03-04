import { useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';

import styles from '../styles/TermsList.module.css';

function TableEntry({ term, removeTerm }) {
  const spanRef = useRef(null);

  const handleMouseEnter = () => {
    spanRef.current.classList.add(styles.hover_opaque, styles.hover_scale);
  };

  const handleMouseLeave = () => {
    spanRef.current.classList.remove(styles.hover_opaque, styles.hover_scale);
  };

  return (
    <tr onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <td className={`${styles.terms_cell} ${styles.td_left}`}>{term}</td>
      <td className={`${styles.terms_cell} ${styles.td_right}`}>
        <span
          className={styles.svg_wrapper}
          ref={spanRef}
          onClick={() => {
            return removeTerm(term);
          }}
        >
          <RxCross2 />
        </span>
      </td>
    </tr>
  );
}

export default function TermsList({ termsList, removeTerm }) {
  return (
    <div id={styles.table_container}>
      <table id={styles.terms_list}>
        <colgroup>
          <col width="85%" />
          <col width="15%" />
        </colgroup>
        <tbody>
          {Array.from(termsList).map((term) => {
            return (
              <TableEntry
                key={crypto.randomUUID()}
                term={term}
                removeTerm={removeTerm}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
