import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import { X, Phone, Send, PhoneOff, Check, Star } from 'lucide-react';

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
  const [callDuration, setCallDuration] = useState(0);

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
    if (!isCalling) {
      setIsCalling(true);
      setCallDuration(0);
    } else {
      setIsCalling(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeDriverChat}>
      <div
        style={{
          backgroundColor: '#141414',
          border: '1px solid #292929',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '440px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.85)',
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
            backgroundColor: '#181818',
            borderBottom: '1px solid #292929',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={partner?.avatarUrl || partner?.profileImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={partner?.name || partner?.fullName || 'Delivery Partner'}
              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #1DB954' }}
            />
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{partner?.name || partner?.fullName || 'Delivery Partner'}</div>
              <div style={{ fontSize: '12px', color: '#1DB954', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={12} fill="#FFC107" color="#FFC107" /> {partner?.rating || 4.9} • {(partner?.vehicle || partner?.vehicleType || 'Electric Scooter').split('(')[0]}
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
                backgroundColor: isCalling ? '#ff4d4f' : '#202020',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333'
              }}
              title={isCalling ? 'End Call' : 'Call Partner'}
            >
              {isCalling ? <PhoneOff size={16} /> : <Phone size={16} color="#1DB954" />}
            </button>
            <button onClick={closeDriverChat} style={{ color: '#A7A7A7', padding: '4px' }}>
              <X size={20} />
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
              backgroundColor: '#0E0E0E'
            }}
          >
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                border: '3px solid #1DB954',
                padding: '4px',
                marginBottom: '16px',
                animation: 'beaconPulse 1.5s infinite'
              }}
            >
              <img
                src={partner.avatarUrl}
                alt={partner.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Calling {partner.name}...
            </h3>
            <p style={{ color: '#1DB954', fontSize: '13px', marginBottom: '24px' }}>
              Connected (Encrypted Local Call)
            </p>
            <div style={{ color: '#A7A7A7', fontSize: '12px', marginBottom: '32px' }}>
              Vehicle: {partner.vehicle}
            </div>
            <button
              onClick={toggleCall}
              style={{
                backgroundColor: '#ff4d4f',
                color: '#fff',
                padding: '12px 28px',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PhoneOff size={18} /> End Call
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
                backgroundColor: '#0B0B0B'
              }}
            >
              <div style={{ textAlign: 'center', margin: '8px 0' }}>
                <span
                  style={{
                    backgroundColor: '#181818',
                    border: '1px solid #292929',
                    color: '#6B6B6B',
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
                      backgroundColor: m.sender === 'user' ? '#1DB954' : '#1F1F1F',
                      color: m.sender === 'user' ? '#000' : '#fff',
                      fontSize: '13.5px',
                      lineHeight: '1.4'
                    }}
                  >
                    {m.text}
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#6B6B6B', marginTop: '3px', padding: '0 4px' }}>
                    {m.time} {m.sender === 'user' && <Check size={11} style={{ display: 'inline', marginLeft: '2px' }} />}
                  </span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessage}
              style={{
                padding: '12px 16px',
                backgroundColor: '#141414',
                borderTop: '1px solid #292929',
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
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #333',
                  borderRadius: '9999px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '13.5px'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1DB954',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
