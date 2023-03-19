const Searchbar = ({ handleChange, handleSubmit }) => (
  <header className="searchbar">
    <form className="form" onSubmit={handleSubmit}>
      <button type="submit" className="button">
        <span className="button-label">Search</span>
      </button>

      <input
        className="input"
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
        onChange={handleChange}
      />
    </form>
  </header>
);

export default Searchbar;
