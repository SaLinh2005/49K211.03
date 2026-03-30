export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <div className="searchbar">
      <div className="search-input-wrap">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          value={value}
          maxLength={255}
          onChange={(e) => {
            const newValue = e.target.value.slice(0, 255); 
            onChange(newValue);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSearch()
          }}
          placeholder="Tìm theo môn học hoặc tên mentor..."
        />

        <button
          type="button"
          className="search-btn"
          onClick={onSearch}
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  )
}