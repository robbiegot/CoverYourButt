import { useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';

import '../styles/TermsList.css';

function TableEntry({ term, removeTerm }) {
  const spanRef = useRef();

  const handleMouseEnter = () => {
    spanRef.current.classList.add('hover-opaque', 'hover-scale');
  };

  const handleMouseLeave = () => {
    spanRef.current.classList.remove('hover-opaque', 'hover-scale');
  };

  return (
    <tr onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <td className="td-left">{term}</td>
      <td className="td-right">
        <span 
          ref={spanRef}
          onClick={() => {
            return removeTerm(term);
          }}
          style={{
            cursor: 'pointer'
          }}
        >
          <RxCross2
          />
        </span>
      </td>
    </tr>
  );
}

export default function TermsList({ termsList, removeTerm }) {
  return (
    <table>
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
  );
}
