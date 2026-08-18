import React from 'react';
import { useGetora } from '../context/GetoraContext';

export const Footer: React.FC = () => {
  const { navigate } = useGetora();

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        {/* Brand Info */}
        <div className="footer-col" style={{ paddingRight: '20px' }}>
          <div
            style={{
              marginBottom: '14px',
              cursor: 'pointer',
              display: 'inline-block'
            }}
            onClick={() => navigate('home')}
          >
            <div
              style={{
                height: '44px',
                width: '150px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <img
                src="/getora-logo.png"
                alt="GETORA"
                style={{
                  height: '115px',
                  width: '150px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scale(1.15)'
                }}
              />
            </div>
          </div>
          <p style={{ color: '#A7A7A7', fontSize: '13.5px', marginBottom: '14px', maxWidth: '280px' }}>
            High-speed local commerce delivered to your door in minutes from your favorite neighborhood stores.
          </p>
          <div style={{ color: '#6B6B6B', fontSize: '12px' }}>
            © {new Date().getFullYear()} GETORA. All rights reserved.
          </div>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li>
              <a href="#categories" onClick={(e) => { e.preventDefault(); navigate('categories'); }}>
                All Categories
              </a>
            </li>
            <li>
              <a href="#stores" onClick={(e) => { e.preventDefault(); navigate('stores'); }}>
                Nearby Stores
              </a>
            </li>
            <li>
              <a href="#offers" onClick={(e) => { e.preventDefault(); navigate('offers'); }}>
                Active Offers
              </a>
            </li>
            <li>
              <a href="#orders" onClick={(e) => { e.preventDefault(); navigate('orders'); }}>
                Track Order
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul className="footer-links">
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                About GETORA
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Help & Support
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Contact Us
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Store Partner Inquiries
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h4>Legal</h4>
          <ul className="footer-links">
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Refund & Cancellation
              </a>
            </li>
            <li>
              <a href="#support" onClick={(e) => { e.preventDefault(); navigate('support'); }}>
                Local Delivery Policy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>Shop local. Get it fast. Made with pride for Indian neighborhoods.</div>
        <div>100% Verified Local Retailers • Hyperlocal Delivery</div>
      </div>
    </footer>
  );
};
