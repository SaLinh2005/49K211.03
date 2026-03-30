// src/MentorCard.jsx
import defaultAvatar from "./assets/Background+Border.png";

export default function MentorCard({ mentor }) {
  return (
    <div className="mentor-card">
      <img
        className="mentor-image"
        src={mentor.avatar_url || defaultAvatar}
        alt={mentor.name}
        onError={(e) => {
          e.target.src = defaultAvatar;
        }}
      />

      <div className="mentor-body">
        <h3 className="mentor-name">{mentor.name}</h3>
        <p className="mentor-major">{mentor.major}</p>

        <div className="mentor-rating">
          <p className="rating">
            <p className="rating">
  {typeof mentor.rating === "number" && mentor.rating > 0
    ? `⭐ ${mentor.rating.toFixed(1)}/5.0`
    : "Chưa có đánh giá"}
</p>
          </p>
        </div>

    <p className="mentor-description">
      {mentor.description && mentor.description !== 'Chưa có mô tả'
        ? `"${mentor.description}"`
        : 'Chưa có mô tả'}
    </p>

        <button className="profile-btn">Xem hồ sơ</button>
      </div>
    </div>
  );
}