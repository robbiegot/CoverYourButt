export default function SearchForm() {
  return (
    <form
      id="form"
      onSubmit={(e) => {
        e.preventDefault();
        console.log('submit');
      }}
    >
      <input
        type="text"
        id="input-text"
        // ref={termRef}
        autoComplete="off"
        placeholder="Domain name or title"
      />
      <input type="submit" id="buttonSubmit" value="Add" />
    </form>
  );
}
