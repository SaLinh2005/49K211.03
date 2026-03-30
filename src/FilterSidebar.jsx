export default function FilterSidebar({
  fields,
  selectedFields,
  onToggleField,
  ratingOrder,
  onChangeRating,
  ratingFilter,
  onChangeRatingFilter,
  onReset,
  onOpenAddField,
}) {
  return (
    <div>
      <h2 className="sidebar-title">Bộ lọc</h2>

      <div className="filter-section">
        <div className="filter-heading">ĐÁNH GIÁ</div>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={ratingFilter === 'high'}
            onChange={() =>
              onChangeRatingFilter(ratingFilter === 'high' ? null : 'high')
            }
          />
          <span>☆☆☆☆ trở lên</span>
        </label>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={ratingFilter === 'low'}
            onChange={() =>
              onChangeRatingFilter(ratingFilter === 'low' ? null : 'low')
            }
          />
          <span>Dưới ☆☆☆☆</span>
        </label>
      </div>

      <div className="filter-section">
        <div className="filter-heading">LĨNH VỰC</div>

        {fields.map((field) => (
          <label key={field} className="filter-option">
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => onToggleField(field)}
            />
            <span>{field}</span>
          </label>
        ))}

        <button
          type="button"
          className="add-field-btn"
          onClick={onOpenAddField}
        >
          + Thêm lĩnh vực
        </button>
      </div>

      <button type="button" className="reset-btn" onClick={onReset}>
        Đặt lại tất cả
      </button>
    </div>
  )
}