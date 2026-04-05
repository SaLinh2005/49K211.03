import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./MentorDetail.css";
import defaultAvatar from "./assets/Background+Border.png";
import Topbar from "./Topbar";
import StarRating from "./StarRating";

export default function MentorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [unreadCount, setUnreadCount] = useState(0);
  const [mentor, setMentor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:3000/messages/unread-count?receiver_id=${user.id}`)
      .then((res) => res.json())
      .then((data) => setUnreadCount(data.count || 0))
      .catch(() => setUnreadCount(0));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const requests = [
          fetch(`http://localhost:3000/mentors/${id}`),
          fetch(`http://localhost:3000/mentors/${id}/reviews`),
        ];
        if (user?.id) {
          requests.push(fetch(`http://localhost:3000/mentors/${id}/can-review?student_id=${user.id}`));
        }

        const responses = await Promise.all(requests);
        const [mentorResult, reviewsResult] = await Promise.all(responses.map((r) => r.json()));

        if (mentorResult.error) throw new Error(mentorResult.error);
        if (reviewsResult.error) throw new Error(reviewsResult.error);

        setMentor(mentorResult.data || null);
        setReviews(reviewsResult.data || []);

        if (user?.id && responses[2]) {
          const canReviewResult = await responses[2].json();
          setCanReview(canReviewResult.canReview || false);
        }
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleReviewClick = () => {
    navigate(`/mentor/${id}/reviews`);
  };

  if (loading) {
    return (
      <>
        <Topbar user={user} unreadCount={unreadCount} />
        <div className="mentor-detail-loading">Đang tải...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar user={user} unreadCount={unreadCount} />
        <div className="mentor-detail-loading">
          <p>Lỗi: {error}</p>
          <button className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </>
    );
  }

  if (!mentor) {
    return (
      <>
        <Topbar user={user} unreadCount={unreadCount} />
        <div className="mentor-detail-loading">Không có dữ liệu mentor</div>
      </>
    );
  }

  const displayName = mentor.name || mentor.title || "Chưa có tên";
  const displayBio = mentor.bio || "Chưa có mô tả";
  const displaySubjects = Array.isArray(mentor.subjects) && mentor.subjects.length > 0
    ? mentor.subjects.join(", ") : "Chưa cập nhật";
  const displayRating = mentor.rating != null ? Number(mentor.rating).toFixed(1) : "0.0";
  const reviewCount = mentor.review_count ?? reviews.length;
  const expYears = mentor.experience_years ?? 0;
  const experiences = Array.isArray(mentor.experiences) ? mentor.experiences : [];
  const documents = Array.isArray(mentor.documents) ? mentor.documents : [];
  const mentorAvatar = mentor.avatar_url || defaultAvatar;

  const feeDisplay = mentor.fee_per_session > 0
    ? `${Number(mentor.fee_per_session).toLocaleString("vi-VN")} VND/buổi`
    : "Miễn phí";

  return (
    <>
      <Topbar user={user} unreadCount={unreadCount} />
      <div className="mentor-detail-page">
        <div className="mentor-detail-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: "middle"}}><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Quay lại
          </button>

          {/* US8.2 */}
          <div className="mentor-top-card">
            <div className="mentor-top-left">
              <img className="mentor-avatar" src={mentorAvatar} alt={displayName}
                onError={(e) => { e.target.src = defaultAvatar; }} />
              <div className="mentor-top-info">
                <h1>{displayName}</h1>
                <p className="mentor-subtitle">{mentor.major || "Mentor"}</p>
                <div className="mentor-rating-row">
                  {mentor.rating > 0 ? (
                    <>
                      <StarRating rating={Number(mentor.rating || 0)} size={16} id="mentor-detail" />
                      <span className="mentor-score">{displayRating}</span>
                      <span className="mentor-review-count">({reviewCount} Đánh giá)</span>
                    </>
                  ) : (
                    <span className="mentor-review-count">Chưa có đánh giá</span>
                  )}
                </div>
                <div className="mentor-tags">
                  {mentor.is_verified && <span className="mentor-tag">Đã xác minh</span>}
                  {expYears > 0 && <span className="mentor-tag">{expYears} năm kinh nghiệm</span>}
                </div>
              </div>
            </div>
            <div className="mentor-top-actions">
              <button className="orange-btn">★ Đánh giá Mentor</button>
              <button className="outline-btn" onClick={() => navigate(`/chat/${id}`)}>Nhắn tin</button>
            </div>
          </div>

          <div className="mentor-main-grid">
            <div className="mentor-left-column">

              {/* US8.3 */}
              <section className="detail-card">
                <h3 className="section-title blue">Giới thiệu hồ sơ</h3>
                <p className="section-text">{displayBio}</p>
              </section>

              {/* US8.4 */}
              <section className="detail-card">
                <h3 className="section-title blue">Kinh nghiệm & Thành tích</h3>
                <div className="experience-list">
                  {experiences.length > 0 ? experiences.map((item, index) => (
                    <div className="experience-item" key={index}>
                      <div className="experience-icon">🏢</div>
                      <div>
                        <h4>{item.position || "Chưa cập nhật"}</h4>
                        <p>{item.organization || ""}</p>
                        {item.achievement && <p className="achievement">{item.achievement}</p>}
                      </div>
                    </div>
                  )) : (
                    <p className="section-text">Chưa có thông tin kinh nghiệm.</p>
                  )}
                </div>
              </section>

              {/* US8.7 + US8.8 */}
              <section className="detail-card">
                <div className="section-header-row">
                  <h3 className="section-title orange">Đánh giá từ sinh viên</h3>
                  <button className="see-all-btn" onClick={() => navigate(`/mentor/${id}/reviews`)}>
                    Xem tất cả
                  </button>
                </div>
                <div className="review-list">
                  {reviews.length > 0 ? reviews.slice(0, 3).map((review) => {
                    const initials = (review.student_name || "U").split(" ")
                      .map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <div className="review-item" key={review.id}>
                        <div className="review-header">
                          <div className="review-user">
                            {review.reviewer_avatar ? (
                              <img className="review-avatar" src={review.reviewer_avatar}
                                alt={review.student_name} onError={(e) => { e.target.style.display = "none"; }} />
                            ) : (
                              <div className="review-avatar">{initials}</div>
                            )}
                            <div>
                              <h4>{review.student_name}</h4>
                              {review.student_major && review.student_major !== "Chưa cập nhật" && (
                                <p>{review.student_major}</p>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div className="review-stars">
                              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                            </div>
                          </div>
                        </div>
                        <p className="review-content">"{review.comment || "Không có nội dung đánh giá"}"</p>
                      </div>
                    );
                  }) : <p className="section-text">Chưa có đánh giá nào.</p>}
                </div>
              </section>
            </div>

            <div className="mentor-right-column">

              {/* US8.5 */}
              <section className="detail-card">
                <h3 className="section-title blue">Minh chứng năng lực</h3>
                <div className="certificate-list">
                  {documents.length > 0 ? documents.map((doc, index) => (
                    <a className="certificate-item" key={index} href={doc.file_url} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                      <div className={`file-badge ${doc.file_type?.toLowerCase() === "pdf" ? "pdf" : doc.file_type?.toLowerCase() === "img" ? "img" : "doc"}`}>
                        {doc.file_type || "FILE"}
                      </div>
                      <div>
                        <h4>{doc.file_name || "Tài liệu"}</h4>
                        <p>{doc.file_size || ""}</p>
                      </div>
                    </a>
                  )) : <p className="section-text">Chưa có minh chứng.</p>}
                </div>
              </section>

              {/* US8.6 */}
              <section className="price-card">
                <p className="price-label">CHI PHÍ HƯỚNG DẪN</p>
                <h2>{feeDisplay}</h2>
                <p className="price-sub">Mỗi buổi hướng dẫn</p>
                {mentor.support_online && <div className="support-method">🌐 Hỗ trợ Online (Teams/Zoom)</div>}
                {mentor.support_offline && <div className="support-method">📍 Hỗ trợ Offline (Thư viện DUE)</div>}
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
