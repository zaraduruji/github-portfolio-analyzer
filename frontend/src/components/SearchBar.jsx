function SearchBar({ value, onChange, onSearch, loading }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch();
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter a GitHub username..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        className="search-input"
      />
      <button onClick={onSearch} disabled={loading} className="search-btn">
        {loading ? <span className="btn-spinner" /> : 'Analyze'}
      </button>
    </div>
  );
}

export default SearchBar;
