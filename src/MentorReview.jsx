import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./Topbar";
import StarRating from "./StarRating";
import "./MentorReview.css";

const ITEMS_PER_PAGE = 5;

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export default function MentorReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [unreadCount, setUnreadCount] = useState(0);
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [likedIds, setLikedIds] = useState([]);
  const [selectedStar, setSelectedStar] = useState("all");
  const [expandedIds, setExpandedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:3000/messages/unread-count?receiver_id=${user.id}`)
      .then(r => r.json()).then(d => setUnreadCount(d.count || 0)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mentorRes, reviewsRes] = await Promise.all([
          fetch(`http://localhost:3000/mentors/${id}`),
          fetch(`http://localhost:3000/mentors/${id}/reviews`),
        ]);
        const mentorResult = await mentorRes.json();
        const reviewsResult = await reviewsRes.json();
        if (mentorResult.error) throw new Error(mentorResult.error);
        if (reviewsResult.error) throw new Error(reviewsResult.error);
        setMentor(mentorResult.data || null);
        setReviews(reviewsResult.data || []);

        if (user?.id) {
          const helpfulRes = await fetch(`http://localhost:3000/reviews/helpful-by-user?user_id=${user.id}`);
          const helpfulResult = await helpfulRes.json();
          setLikedIds(helpfulResult.data || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleHelpful = async (reviewId) => {
    if (!user?.id) { alert("Vui lòng đăng nhập."); return; }
    const res = await fetch(`http://localhost:3000/reviews/${reviewId}/helpful`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });
    const result = await res.json();
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: result.helpful_count } : r));
    setLikedIds(prev => result.liked ? [...prev, reviewId] : prev.filter(x => x !== reviewId));
  };

  const toggleExpand = (reviewId) => {
    setExpandedIds(prev => prev.includes(reviewId) ? prev.filter(x => x !== reviewId) : [...prev, reviewId]);
  };

  const filteredReviews = useMemo(() => {
    if (selectedStar === "all") return reviews;
    return reviews.filter(r => r.rating === Number(selectedStar));
  }, [reviews, selectedStar]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / ITEMS_PER_PAGE));
  const paginatedReviews = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, page]);

  const ratingStats = useMemo(() => {
    const total = reviews.length || 1;
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => { if (counts[r.rating] !== undefined) counts[r.rating]++; });
    return Object.fromEntries(
      Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)])
    );
  }, [reviews]);

  const handleStarFilter = (star) => {
    setSelectedStar(star);
    setPage(1);
  };

  if (loading) return <><Topbar user={user} unreadCount={unreadCount} /><div className="review-page-loading">Đang tải...</div></>;
  if (error) return <><Topbar user={user} unreadCount={unreadCount} /><div className="review-page-loading"><p>{error}</p></div></>;

  const displayRating = mentor?.rating != null ? Number(mentor.rating).toFixed(1) : "0.0";
  const totalReviews = mentor?.review_count || reviews.length;

  return (
    <>
      <Topbar user={user} unreadCount={unreadCount} />
      <div className="review-page">
        <div className="review-page-container">
          <button className="review-back-btn" onClick={() => navigate(`/mentor/${id}`)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: "middle"}}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Quay lại chi tiết Mentor
          </button>

          {/* Summary card */}
          <div className="review-summary-card">
            <div className="summary-left">
              <h2 className="summary-title">Đánh giá từ Sinh viên</h2>
              <p className="summary-mentor-name">{mentor?.name || mentor?.title || "Mentor"}</p>
              <div className="summary-score">{displayRating}</div>
              {mentor?.rating > 0 ? (
                <StarRating rating={Number(mentor?.rating || 0)} size={18} id="review-summary" />
              ) : (
                <p className="summary-total" style={{marginBottom: 4}}>Chưa có đánh giá</p>
              )}
              <p className="summary-total">{totalReviews} ĐÁNH GIÁ</p>
            </div>
            <div className="summary-right">
              {[5, 4, 3, 2, 1].map(star => (
                <div className="rating-bar-row" key={star}>
                  <span className="bar-label">{star} sao</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${ratingStats[star] || 0}%` }} />
                  </div>
                  <span className="bar-percent">{ratingStats[star] || 0}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="review-filter-row">
            {["all", 5, 4, 3, 2, 1].map(item => (
              <button
                key={item}
                className={`review-filter-btn ${selectedStar === item ? "active" : ""}`}
                onClick={() => handleStarFilter(item)}
              >
                {item === "all" ? "Tất cả" : `${item} sao`}
              </button>
            ))}
          </div>

          {/* Review list */}
          <div className="review-list-section">
            {paginatedReviews.length === 0 ? (
              <p className="review-empty">Chưa có đánh giá nào cho mức sao này.</p>
            ) : paginatedReviews.map(review => {
              const isLong = (review.comment || "").length > 500;
              const isExpanded = expandedIds.includes(review.id);
              const isLiked = likedIds.includes(review.id);
              const initials = (review.student_name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

              return (
                <div className="review-card" key={review.id}>
                  <div className="review-card-top">
                    <div className="review-card-user">
                      {review.reviewer_avatar ? (
                        <img className="review-card-avatar" src={review.reviewer_avatar} alt={review.student_name}
                          onError={e => { e.target.style.display = "none"; }} />
                      ) : (
                        <div className="review-card-avatar review-card-avatar-fallback">{initials}</div>
                      )}
                      <div>
                        <div className="review-card-name">{review.student_name || "Người dùng"}</div>
                        <div className="review-card-meta">
                          <StarRating rating={review.rating} size={13} id={`review-${review.id}`} />
                          <span className="review-card-time">{timeAgo(review.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    {review.subject && (
                      <span className="review-subject-tag">{review.subject}</span>
                    )}
                  </div>

                  <p className="review-card-content">
                    {isLong && !isExpanded
                      ? (review.comment || "").slice(0, 500) + "..."
                      : (review.comment || "Không có nội dung đánh giá")}
                  </p>
                  {isLong && (
                    <button className="review-expand-btn" onClick={() => toggleExpand(review.id)}>
                      {isExpanded ? "Thu gọn" : "Xem thêm"}
                    </button>
                  )}

                  <button
                    className={`review-helpful-btn ${isLiked ? "liked" : ""}`}
                    onClick={() => handleHelpful(review.id)}
                  >
                    👍 Hữu ích ({review.helpful_count || 0})
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="review-pagination">
              <button className="rpag-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => p === "..." ? (
                  <span key={`dot-${idx}`} className="rpag-dots">...</span>
                ) : (
                  <button key={p} className={`rpag-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                ))}
              <button className="rpag-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
