import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { X, Star, Sparkles } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { activeReviewModal, closeReviewModal, submitReview } = useGetora();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!activeReviewModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(
      activeReviewModal.orderId,
      activeReviewModal.storeId,
      rating,
      comment || 'Great experience with fast delivery and authentic products!'
    );
  };

  return (
    <div className="modal-overlay" onClick={closeReviewModal}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          padding: '28px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#1DB954" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Rate & Review Order
            </h3>
          </div>
          <button onClick={closeReviewModal} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          How was your experience with <strong>{activeReviewModal.storeName}</strong>?
        </p>

        {/* Star Selector */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                style={{
                  padding: '6px',
                  transition: 'transform 0.15s ease',
                  transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)'
                }}
              >
                <Star
                  size={32}
                  fill={isFilled ? '#FFC107' : 'none'}
                  color={isFilled ? '#FFC107' : '#444'}
                />
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-field-group">
            <label>Share your feedback</label>
            <textarea
              rows={3}
              placeholder="Tell others about product quality, packaging and delivery speed..."
              className="input-styled"
              style={{ resize: 'none', lineHeight: '1.4' }}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '12px', borderRadius: '10px' }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};
