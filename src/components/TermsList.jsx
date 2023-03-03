import { useRef } from 'react';
import { RxCross2 } from 'react-icons/rx';

import '../styles/TermsList.css';

function TableEntry({ term }) {
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
        <span ref={spanRef}>
          <RxCross2
            style={{
              cursor: 'pointer'
            }}
          />
        </span>
      </td>
    </tr>
  );
}

export default function TermsList({ termsList }) {
  return (
    <table>
      <tbody>
        {termsList.map((term) => {
          return <TableEntry key={crypto.randomUUID()} term={term} />;
        })}
      </tbody>
    </table>
  );
}
