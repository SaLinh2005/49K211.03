  import { useEffect, useMemo, useState } from 'react'
  import SearchBar from './SearchBar'
  import FilterSidebar from './FilterSidebar'
  import MentorCard from './MentorCard'
  import logo from './assets/Background.png'
  import icon from './assets/Overlay.png'

  function normalizeText(text) {
    return (text || '').trim().toLowerCase()
  }

  const ITEMS_PER_PAGE = 12

  export default function MentorListPage() {
    const [selectedFields, setSelectedFields] = useState([])
    const [ratingOrder, setRatingOrder] = useState('desc')
    const [ratingFilter, setRatingFilter] = useState(null)
    const [page, setPage] = useState(1)
    const [isAddFieldOpen, setIsAddFieldOpen] = useState(false)
    const [newField, setNewField] = useState('')
   const DEFAULT_FIELDS = [
  'Pháp luật đại cương',
  'Nhập môn kinh doanh',
  'Marketing căn bản',
  'Triết học Mác - Lênin',
]

const [fields, setFields] = useState(() => {
  const savedFields = localStorage.getItem('fields')
  return savedFields ? JSON.parse(savedFields) : DEFAULT_FIELDS
})
    const [mentors, setMentors] = useState([])
    const [loading, setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [search, setSearch] = useState('')
    const user = JSON.parse(localStorage.getItem('user'))
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
      fetch('http://localhost:3000/messages/unread-count')
        .then((res) => res.json())
        .then((data) => {
          setUnreadCount(data.count || 0)
        })
        .catch(() => {
          setUnreadCount(0)
        })
    }, [])
    useEffect(() => {
  localStorage.setItem('fields', JSON.stringify(fields))
}, [fields])

    useEffect(() => {
      setLoading(true)

      fetch('http://localhost:3000/mentors')
        .then((res) => res.json())
        .then((result) => {
          const rawMentors = result.data || []

        const mappedMentors = rawMentors.map((item) => ({
    id: item.id,
    name: item.name || item.title || 'Chưa có tên',
    major: item.subjects?.[0] || 'Chưa có lĩnh vực',
    rating: item.rating || 0,
    experience: item.experience_years || 0,
    avatar_url: item.avatar_url || null,
    description: item.bio || 'Chưa có mô tả',
  }))

          const uniqueFields = [
            ...new Set(rawMentors.flatMap((item) => item.subjects || [])),
          ]

          setMentors(mappedMentors)
        })
        .catch((err) => {
          console.error('Lỗi tải mentors:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }, [])

    const handleAddField = () => {
      const value = newField.trim()
      if (!value) return

      setFields((prev) => (prev.includes(value) ? prev : [...prev, value]))
      setNewField('')
      setIsAddFieldOpen(false)
    }

    const filteredMentors = useMemo(() => {
      let result = [...mentors]

      if (search.trim()) {
        const keyword = normalizeText(search)

        result = result.filter((item) => {
          const name = normalizeText(item.name)
          const major = normalizeText(item.major)

          return name.includes(keyword) || major.includes(keyword)
        })
      }

      if (selectedFields.length > 0) {
        result = result.filter((item) => selectedFields.includes(item.major))
      }

      if (ratingFilter === 'high') {
        result = result.filter((item) => item.rating >= 4)
      }

      if (ratingFilter === 'low') {
        result = result.filter((item) => item.rating < 4)
      }

      result.sort((a, b) =>
        ratingOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating
      )

      return result
    }, [search, selectedFields, ratingOrder, ratingFilter, mentors])

    const totalPages = Math.max(
      1,
      Math.ceil(filteredMentors.length / ITEMS_PER_PAGE)
    )

    const paginatedMentors = useMemo(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      return filteredMentors.slice(startIndex, endIndex)
    }, [filteredMentors, page])

    const toggleField = (field) => {
      setSelectedFields((prev) =>
        prev.includes(field)
          ? prev.filter((item) => item !== field)
          : [...prev, field]
      )
      setPage(1)
    }

    const resetFilters = () => {
      setSearch('')
      setInputValue('')
      setSelectedFields([])
      setRatingOrder('desc')
      setRatingFilter(null)
      setPage(1)
    }

    const handlePrevPage = () => {
      setPage((prev) => Math.max(prev - 1, 1))
    }

    const handleNextPage = () => {
      setPage((prev) => Math.min(prev + 1, totalPages))
    }

    return (
      <div className="page">
        <header className="topbar">
          <div className="brand">
            <img src={logo} alt="logo" className="logo-img" />
            <div className="brand-text">
              <div className="brand-title">
                <span className="brand-orange">UNI</span>MENTOR
              </div>
              <div className="brand-subtitle">
                TRƯỜNG ĐH KINH TẾ - ĐH ĐÀ NẴNG
              </div>
            </div>
          </div>

          <nav className="nav">
            <a href="#home">Trang chủ</a>
            <a href="#profile" className="active">
              Mentor
            </a>
            <a href="#mentor">Hồ sơ</a>
            <a href="#chat" className="chat-link">
              Nhắn tin
              {unreadCount > 0 && (
                <span className="badge">
                  <span className="badge-text">{unreadCount}</span>
                </span>
              )}
            </a>
          </nav>

          <div className="topbar-right">
            <svg className="bell-icon" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 17H20L18.595 15.595C18.2139 15.2139 17.9999 14.697 18 14.158V11C18.0003 8.45671 16.3976 6.18933 14 5.341V5C14 3.89617 13.1038 3 12 3C10.8962 3 10 3.89617 10 5V5.341C7.67 6.165 6 8.388 6 11V14.159C6 14.697 5.786 15.214 5.405 15.595L4 17H9M15 17V18C15 19.6557 13.6557 21 12 21C10.3443 21 9 19.6557 9 18V17M15 17H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="divider"></div>

            <div className="user-mini">
              <img
                src={
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt={user?.name || 'user'}
              />
            </div>

            <button className="logout-btn">Đăng xuất</button>
          </div>
        </header>

        <div className="content-wrapper">
          <aside className="sidebar">
            <FilterSidebar
              fields={fields}
              selectedFields={selectedFields}
              onToggleField={toggleField}
              ratingOrder={ratingOrder}
              onChangeRating={setRatingOrder}
              ratingFilter={ratingFilter}
              onChangeRatingFilter={setRatingFilter}
              onReset={resetFilters}
              onOpenAddField={() => setIsAddFieldOpen(true)}
            />
          </aside>

          <main className="main-content">
            <SearchBar
              value={inputValue}
              onChange={(value) => setInputValue(value)}
              onSearch={() => {
                setSearch(inputValue)
                setPage(1)
              }}
            />

            {loading && <p>Đang tải mentor...</p>}

            <p className="result-count">
              {filteredMentors.length === 0 ? (
                'Không tìm thấy mentor phù hợp'
              ) : (
                <>
                  Đang hiển thị <strong>{filteredMentors.length}</strong> mentor
                  sẵn có tại trường của bạn.
                </>
              )}
            </p>

            <div className="card-grid">
              {paginatedMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            <div className="pagination">
              <button
                className="page-btn page-nav"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1
                return (
                  <button
                    key={pageNumber}
                    className={`page-btn ${page === pageNumber ? 'active' : ''}`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                )
              })}

              <button
                className="page-btn page-nav"
                onClick={handleNextPage}
                disabled={page === totalPages}
              >
                Tiếp
              </button>
            </div>
          </main>
        </div>

        {isAddFieldOpen && (
          <div
            className="modal-overlay"
            onClick={() => {
              setIsAddFieldOpen(false)
              setNewField('')
            }}
          >
            <div className="add-field-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-icon-wrap">
                <div className="modal-icon">
                  <img src={icon} alt="icon" />
                </div>
              </div>

              <h2 className="modal-title">Thêm lĩnh vực mới</h2>
              <p className="modal-subtitle">
                Điền tên lĩnh vực bạn muốn lọc theo.
              </p>

              <label className="modal-label">TÊN LĨNH VỰC MỚI</label>

              <input
                type="text"
                className="modal-input"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddField()
                }}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {
                    setIsAddFieldOpen(false)
                    setNewField('')
                  }}
                >
                  Hủy
                </button>

                <button
                  type="button"
                  className="modal-submit"
                  onClick={handleAddField}
                >
                  <span className="modal-submit-plus">+</span> Thêm lĩnh vực
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }