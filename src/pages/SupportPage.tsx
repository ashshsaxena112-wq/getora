import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  RotateCcw,
  Truck,
  CreditCard,
  Package,
  Send,
  CheckCircle2
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { orders, showToast } = useGetora();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string>(orders[0]?.id || '');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const issueCategories = [
    { id: 'delivery', label: 'Delivery Issue / Delay', icon: Truck },
    { id: 'product', label: 'Damaged / Wrong Product', icon: Package },
    { id: 'refund', label: 'Refund & Returns', icon: RotateCcw },
    { id: 'payment', label: 'Payment & Billing Issue', icon: CreditCard },
    { id: 'account', label: 'Account & Location Help', icon: HelpCircle }
  ];

  const faqs = [
    {
      q: 'How does GETORA deliver within 15 to 30 minutes?',
      a: 'GETORA partners directly with verified neighborhood retail stores within a 1 to 3 km radius of your location. When you order, the merchant immediately packs the items and our nearest electric delivery rider picks it up within minutes.'
    },
    {
      q: 'Can I order items from multiple local stores simultaneously?',
      a: 'Yes! Your cart groups items by each store. Each store packs and dispatches their items directly to your address, with separate live tracking routes for absolute freshness and speed.'
    },
    {
      q: 'What is the return policy for damaged or incorrect goods?',
      a: 'We offer an instant 24-hour return or replacement guarantee for any damaged, defective, or incorrect items delivered by local stores. Simply submit an issue here or contact our support team.'
    },
    {
      q: 'What payment methods are supported on GETORA?',
      a: 'We support all major Indian UPI apps (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking, and Cash on Delivery (COD).'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSubmitted(true);
    showToast('Support Ticket Raised', 'Our team will assist you within 5 minutes', 'success');
  };

  return (
    <div className="support-page-container" style={{ maxWidth: '820px', margin: '0 auto', padding: '0 16px 60px' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '6px' }}>
          Customer Help & Support
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          We are here to assist you with fast resolution for orders, deliveries, and local store queries.
        </p>
      </div>

      {/* Quick Category Issue Picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '36px' }}>
        {issueCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedIssue === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedIssue(cat.id)}
              style={{
                backgroundColor: isSelected ? 'rgba(29, 185, 84, 0.12)' : 'var(--bg-card)',
                border: '1px solid',
                borderColor: isSelected ? '#1DB954' : 'var(--border-color)',
                borderRadius: '14px',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '8px',
                color: isSelected ? '#1DB954' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <Icon size={22} color={isSelected ? '#1DB954' : 'var(--text-muted)'} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#1DB954' : 'var(--text-primary)' }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Issue Form */}
      {selectedIssue && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            padding: '24px',
            marginBottom: '36px'
          }}
        >
          <h3 style={{ fontSize: '17px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '16px' }}>
            Report Issue
          </h3>

          {ticketSubmitted ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle2 size={40} color="#1DB954" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                Support Ticket Created (#TKT-{Math.floor(10000 + Math.random() * 90000)})
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
                A dedicated support specialist is reviewing your issue and will respond via SMS & app notification shortly.
              </p>
              <button
                className="btn-secondary"
                onClick={() => {
                  setTicketSubmitted(false);
                  setTicketMessage('');
                  setSelectedIssue(null);
                }}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Close Issue
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {orders.length > 0 && (
                <div className="input-field-group">
                  <label style={{ color: 'var(--text-primary)' }}>Select Related Order</label>
                  <select
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="input-styled"
                    style={{ cursor: 'pointer', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        Order #{o.orderNumber} ({o.retailer?.shopName || o.storeName || 'Store'}) - ₹{o.totalAmount || o.grandTotal || 0}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="input-field-group">
                <label style={{ color: 'var(--text-primary)' }}>Describe the issue in detail</label>
                <textarea
                  rows={4}
                  placeholder="Please describe what happened so our support team can resolve it immediately..."
                  className="input-styled"
                  style={{ resize: 'none', lineHeight: '1.4', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px' }}>
                  <Send size={15} /> Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  className="btn-secondary"
                  style={{ padding: '10px 16px', borderRadius: '8px', fontSize: '13px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Frequently Asked Questions */}
      <section style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '16px' }}>
          Frequently Asked Questions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp size={18} color="#1DB954" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                </div>

                {isOpen && (
                  <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: '1.6', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Channels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Mail size={22} color="#1DB954" />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Email Support</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>support@getora.in</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Phone size={22} color="#1DB954" />
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>Toll Free Helpline</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>1800-419-GETORA (9 AM - 11 PM)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
