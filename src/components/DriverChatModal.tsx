import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { IconX, IconPhone, IconSend, IconPhoneOff, IconCheck, IconStar } from '@tabler/icons-react';

export const DriverChatModal: React.FC = () => {
  const { activeDriverChat, closeDriverChat } = useGetora();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'driver'; text: string; time: string }>>([
    {
      sender: 'driver',
      text: "Namaste! I have picked up your order from the store. I'm on my way to your location.",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  if (!activeDriverChat) return null;

  const partner = activeDriverChat.deliveryPartner;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = inputVal.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeNow }]);
    setInputVal('');

    // Simulated driver smart reply
    setTimeout(() => {
      let replyText = "Got it! Arriving in a few minutes. I'll ring your doorbell.";
      if (userMsg.toLowerCase().includes('gate') || userMsg.toLowerCase().includes('guard')) {
        replyText = "Sure, I will mention your flat number at the security gate.";
      } else if (userMsg.toLowerCase().includes('call')) {
        replyText = "Sure, I will call you once I reach your building gate.";
      } else if (userMsg.toLowerCase().includes('where')) {
        replyText = "I'm just taking the turn near the main junction. 3-4 minutes away!";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'driver',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const toggleCall = () => {
    setIsCalling(!isCalling);
  };

  return (
    <div className="modal-overlay" onClick={closeDriverChat}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          height: '560px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={partner?.avatarUrl || partner?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={partner?.name || partner?.fullName || 'Delivery Partner'}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #22C55E' }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{partner?.name || partner?.fullName || 'Delivery Partner'}</div>
              <div style={{ fontSize: '12px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IconStar size={13} stroke={1.8} color="#22C55E" /> {partner?.rating || 4.9} • {(partner?.vehicle || partner?.vehicleType || 'Electric Scooter').split('(')[0]}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={toggleCall}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isCalling ? '#EF4444' : 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-color)',
                cursor: 'pointer'
              }}
              title={isCalling ? 'End Call' : 'Call Partner'}
            >
              {isCalling ? <IconPhoneOff size={17} stroke={1.8} /> : <IconPhone size={17} stroke={1.8} color="#22C55E" />}
            </button>
            <button onClick={closeDriverChat} style={{ color: 'var(--text-secondary)', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <IconX size={20} stroke={1.8} />
            </button>
          </div>
        </div>

        {/* Live Call Mode Overlay */}
        {isCalling ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '30px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}
          >
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '3px solid #22C55E',
                padding: '4px',
                marginBottom: '16px',
                animation: 'beaconPulse 1.5s infinite'
              }}
            >
              <img
                src={partner?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={partner?.name || 'Partner'}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Calling {partner?.name || 'Delivery Partner'}...
            </h3>
            <p style={{ color: '#22C55E', fontSize: '13px', marginBottom: '24px' }}>
              Connected (Encrypted Local Call)
            </p>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '32px' }}>
              Vehicle: {partner?.vehicle || 'Electric Scooter'}
            </div>
            <button
              onClick={toggleCall}
              style={{
                backgroundColor: '#EF4444',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <IconPhoneOff size={18} stroke={1.8} /> End Call
            </button>
          </div>
        ) : (
          /* Live Chat Area */
          <>
            <div
              style={{
                flex: 1,
                padding: '16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                backgroundColor: 'var(--bg-primary)'
              }}
            >
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <span
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '9999px'
                  }}
                >
                  Order #{activeDriverChat.orderNumber}
                </span>
              </div>

              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: m.sender === 'user' ? '#22C55E' : 'var(--bg-card)',
                      color: m.sender === 'user' ? '#000' : 'var(--text-primary)',
                      border: m.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                      fontSize: '13.5px',
                      lineHeight: '1.4'
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '3px', padding: '0 4px' }}>
                    {m.time} {m.sender === 'user' && <IconCheck size={12} stroke={2} style={{ display: 'inline', marginLeft: '2px' }} />}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-card)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <input
                type="text"
                placeholder="Message delivery partner..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '9999px',
                  padding: '10px 16px',
                  color: 'var(--text-primary)',
                  fontSize: '13.5px'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#22C55E',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <IconSend size={17} stroke={1.8} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
