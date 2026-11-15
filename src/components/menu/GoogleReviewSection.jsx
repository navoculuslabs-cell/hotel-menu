
export default function GoogleReviewSection({ hotel }) {
  const placeId = hotel?.googlePlaceId?.trim();

  if (!placeId) return null;

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;

  return (
    <section className="google-review-section">
      <p className="google-review-title">
        Enjoyed your experience?
      </p>

      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="google-review-button"
      >
        ★ Rate us on Google
      </a>

      <p className="google-review-note">
        Your feedback means a lot to us!
      </p>
    </section>
  );
}
