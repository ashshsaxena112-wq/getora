import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { IconX, IconStar, IconSparkles } from '@tabler/icons-react';

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
            <IconSparkles size={18} stroke={1.8} color="#22C55E" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
              Rate & Review Order
            </h3>
          </div>
          <button onClick={closeReviewModal} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <IconX size={18} stroke={1.8} />
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
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)'
                }}
              >
                <IconStar
                  size={32}
                  stroke={1.8}
                  color={isFilled ? '#22C55E' : 'var(--text-muted)'}
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
