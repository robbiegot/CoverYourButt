import { useRef } from 'react';

export default function SearchForm({ addTerm }) {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTerm(inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        ref={inputRef}
        autoComplete="off"
        placeholder="Domain name or title"
      />
      <input type="submit" value="Add" />
    </form>
  );
}
