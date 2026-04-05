import { useNavigate } from "react-router-dom";
import defaultAvatar from "./assets/Background+Border.png";

export default function MentorCard({ mentor }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/mentor/${mentor.id}`);
  };

  return (
    <div className="mentor-card">
      <img
        className="mentor-image"
        src={mentor.avatar_url || defaultAvatar}
        alt={mentor.title || "Mentor"}
        onError={(e) => {
          e.target.src = defaultAvatar;
        }}
      />

      <div className="mentor-body">
        <h3 className="mentor-name">{mentor.name || "Chưa có tên"}</h3>

        <p className="mentor-major">{mentor.major || "Chưa có môn hỗ trợ"}</p>

        <div className="mentor-rating">
          <p className="rating">
            {typeof mentor.rating === "number" && mentor.rating > 0
              ? `⭐ ${mentor.rating.toFixed(1)}/5.0`
              : "Chưa có đánh giá"}
          </p>
        </div>

        <p className="mentor-description">
          {mentor.description ? `"${mentor.description}"` : "Chưa có mô tả"}
        </p>

        <button className="profile-btn" onClick={handleViewProfile}>
          Xem hồ sơ
        </button>
      </div>
    </div>
  );
}
