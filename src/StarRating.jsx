const STAR_PATH = "M10 1l2.39 4.84 5.34.78-3.86 3.76.91 5.32L10 13.27l-4.78 2.51.91-5.32L2.27 6.62l5.34-.78z";

export default function StarRating({ rating, size = 16, id = "sr" }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          {[1, 2, 3, 4, 5].map((star) => {
            const fill = Math.min(1, Math.max(0, rating - (star - 1)));
            return (
              <clipPath key={star} id={`${id}-${star}`}>
                <rect x="0" y="0" width={20 * fill} height="20" />
              </clipPath>
            );
          })}
        </defs>
      </svg>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={size} height={size} viewBox="0 0 20 20">
          <path d={STAR_PATH} fill="#d1d5db" />
          <path d={STAR_PATH} fill="#f6b800" clipPath={`url(#${id}-${star})`} />
        </svg>
      ))}
    </span>
  );
}
