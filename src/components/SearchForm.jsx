import { useRef } from "react";

export default function SearchForm({ addTerm }) {
  
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    addTerm(inputRef.current.value)
  }

  return (
    <form
      id="form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        id="input-text"
        ref={inputRef}
        autoComplete="off"
        placeholder="Domain name or title"
      />
      <input type="submit" id="buttonSubmit" value="Add" />
    </form>
  );
}
