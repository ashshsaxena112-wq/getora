import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  Smartphone,
  CreditCard,
  Building,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  QrCode
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { viewParams, placeOrder, getCartSummary, selectedAddress, cart, navigate, showToast } = useGetora();
  const storeId = viewParams.storeId;
  const instructions = viewParams.instructions;

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'COD'>('UPI');
  const [upiOption, setUpiOption] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const { grandTotal } = getCartSummary();

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    const targetRetailerId = storeId || (cart.length > 0 ? cart[0].product.retailerId : '');
    const res = await placeOrder({
      retailerId: targetRetailerId,
      addressId: selectedAddress?.id || '',
      paymentMethod,
      items: cart
    });
    setIsProcessing(false);
    if (res.success && res.orderId) {
      navigate('order-confirmation', { orderId: res.orderId });
    }
  };

  return (
    <div className="payment-page-container" style={{ maxWidth: '780px', margin: '0 auto', padding: '0 16px 60px' }}>
      <button
        onClick={() => navigate('checkout', { storeId })}
        className="btn-secondary"
        style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
      >
        <ArrowLeft size={16} /> Back to Checkout
      </button>

      <h1 style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '6px' }}>
        Select Payment Method
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
        All transactions are secured with 256-bit bank grade encryption.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '28px'
        }}
        className="payment-grid-layout"
      >
        {/* Payment Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* UPI */}
          <div
            onClick={() => setPaymentMethod('UPI')}
            style={{
              backgroundColor: paymentMethod === 'UPI' ? 'rgba(29, 185, 84, 0.08)' : 'var(--bg-card)',
              border: '1px solid',
              borderColor: paymentMethod === 'UPI' ? '#1DB954' : 'var(--border-color)',
              borderRadius: '14px',
              padding: '16px 18px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: paymentMethod === 'UPI' ? '12px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Smartphone size={22} color={paymentMethod === 'UPI' ? '#1DB954' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    UPI / Instant Pay
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Google Pay, PhonePe, Paytm, QR
                  </div>
                </div>
              </div>
              {paymentMethod === 'UPI' && <CheckCircle2 size={20} color="#1DB954" />}
            </div>

            {paymentMethod === 'UPI' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setUpiOption('gpay')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: upiOption === 'gpay' ? '#1DB954' : 'var(--bg-secondary)',
                    color: upiOption === 'gpay' ? '#000' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  Google Pay
                </button>
                <button
                  type="button"
                  onClick={() => setUpiOption('phonepe')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: upiOption === 'phonepe' ? '#1DB954' : 'var(--bg-secondary)',
                    color: upiOption === 'phonepe' ? '#000' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  PhonePe
                </button>
                <button
                  type="button"
                  onClick={() => setUpiOption('paytm')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: upiOption === 'paytm' ? '#1DB954' : 'var(--bg-secondary)',
                    color: upiOption === 'paytm' ? '#000' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  Paytm UPI
                </button>
                <button
                  type="button"
                  onClick={() => setUpiOption('qr')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: upiOption === 'qr' ? '#1DB954' : 'var(--bg-secondary)',
                    color: upiOption === 'qr' ? '#000' : 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <QrCode size={13} /> Scan QR
                </button>
              </div>
            )}
          </div>

          {/* Cards */}
          <div
            onClick={() => setPaymentMethod('CARD')}
            style={{
              backgroundColor: paymentMethod === 'CARD' ? 'rgba(29, 185, 84, 0.08)' : 'var(--bg-card)',
              border: '1px solid',
              borderColor: paymentMethod === 'CARD' ? '#1DB954' : 'var(--border-color)',
              borderRadius: '14px',
              padding: '16px 18px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={22} color={paymentMethod === 'CARD' ? '#1DB954' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Credit / Debit Card
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Visa, MasterCard, RuPay, Amex
                  </div>
                </div>
              </div>
              {paymentMethod === 'CARD' && <CheckCircle2 size={20} color="#1DB954" />}
            </div>
          </div>

          {/* Net Banking */}
          <div
            onClick={() => setPaymentMethod('NETBANKING')}
            style={{
              backgroundColor: paymentMethod === 'NETBANKING' ? 'rgba(29, 185, 84, 0.08)' : 'var(--bg-card)',
              border: '1px solid',
              borderColor: paymentMethod === 'NETBANKING' ? '#1DB954' : 'var(--border-color)',
              borderRadius: '14px',
              padding: '16px 18px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building size={22} color={paymentMethod === 'NETBANKING' ? '#1DB954' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Net Banking
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    HDFC, ICICI, SBI, Axis & all Indian banks
                  </div>
                </div>
              </div>
              {paymentMethod === 'NETBANKING' && <CheckCircle2 size={20} color="#1DB954" />}
            </div>
          </div>

          {/* Cash on Delivery */}
          <div
            onClick={() => setPaymentMethod('COD')}
            style={{
              backgroundColor: paymentMethod === 'COD' ? 'rgba(29, 185, 84, 0.08)' : 'var(--bg-card)',
              border: '1px solid',
              borderColor: paymentMethod === 'COD' ? '#1DB954' : 'var(--border-color)',
              borderRadius: '14px',
              padding: '16px 18px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Banknote size={22} color={paymentMethod === 'COD' ? '#1DB954' : 'var(--text-muted)'} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Cash on Delivery (COD)
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Pay cash or UPI at your doorstep on delivery
                  </div>
                </div>
              </div>
              {paymentMethod === 'COD' && <CheckCircle2 size={20} color="#1DB954" />}
            </div>
          </div>
        </div>

        {/* Order Amount & Confirm Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Total Payable Amount
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Outfit', color: '#1DB954', marginBottom: '16px' }}>
              ₹{grandTotal.toLocaleString('en-IN')}
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', fontSize: '12.5px', color: 'var(--text-primary)', marginBottom: '20px' }}>
              Selected: <strong>{paymentMethod}</strong>
            </div>

            <button
              className="btn-primary"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700
              }}
            >
              {isProcessing ? 'Processing Secure Payment...' : `Place Order (₹${grandTotal})`}
            </button>

            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '11.5px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Lock size={13} color="#1DB954" /> 256-Bit Encrypted Payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
