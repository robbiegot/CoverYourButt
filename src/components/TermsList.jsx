import '../styles/TermsList.css';

export default function TermsList({ termsList }) {
  return (
    <table>
      <tbody>
        {termsList.map((term) => {
          return (
            <tr key={crypto.randomUUID()}>
              <td className="td-left">{term}</td>
              <td className="td-right">X</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
