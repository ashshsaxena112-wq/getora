import React, { useState } from 'react';
import {
  IconX,
  IconMail,
  IconLock,
  IconAlertCircle,
  IconLoader2,
  IconCalendar,
  IconHeart,
  IconCheck
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import { GetoraLogo } from './GetoraLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    verifyOtp,
    signInWithPassword,
    signUpWithPassword,
    updateProfile,
    profile,
    showToast
  } = useGetora();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'otp_email' | 'password'>('otp_email');

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');

  // Onboarding profile states (Phone, DOB, Gender)
  const [onboardingFullName, setOnboardingFullName] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer_not_to_say'>('male');

  // Step state ('input' | 'otp' | 'onboarding')
  const [step, setStep] = useState<'input' | 'otp' | 'onboarding'>('input');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setStep('input');
    setOtp('');
    setErrorMessage(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  // 1. Send Email OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const res = await signInWithEmail(email.trim());
      if (!res.success) {
        setErrorMessage(res.message || 'Unable to send OTP. Please check email address.');
      } else {
        setStep('otp');
        showToast('OTP Sent', `Verification code sent to ${email}`, 'info');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await verifyOtp({
        email: email.trim(),
        token: otp.trim(),
        type: 'email',
        fullName: fullName.trim() || undefined,
        role: 'customer'
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Invalid or expired OTP code.');
      } else {
        showToast('Welcome to GETORA!', 'You have successfully signed in', 'success');
        setOnboardingFullName(fullName.trim() || profile?.fullName || '');
        setStep('onboarding');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login / Signup
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await signInWithPassword(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.message || 'Invalid email or password.');
        } else {
          showToast('Welcome Back!', 'Signed in successfully', 'success');
          handleClose();
        }
      } else {
        const res = await signUpWithPassword(email.trim(), password, {
          fullName: fullName.trim(),
          role: 'customer'
        });

        if (!res.success) {
          setErrorMessage(res.message || 'Unable to create customer account.');
        } else {
          showToast('Account Created!', 'Welcome to GETORA marketplace', 'success');
          setOnboardingFullName(fullName.trim());
          setStep('onboarding');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Customer Onboarding Details
  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        fullName: onboardingFullName.trim() || undefined,
        phone: onboardingPhone.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender
      });

      showToast('Profile Saved', 'Your account details have been updated', 'success');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not update profile info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '22px 26px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GetoraLogo size="sm" />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '6px' }}>
                Customer Portal
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'Outfit' }}>
              {step === 'onboarding'
                ? 'Complete Your Profile'
                : step === 'otp'
                ? 'Enter Verification Code'
                : authMode === 'login'
                ? 'Sign In to GETORA'
                : 'Create Customer Account'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              border: 'none'
            }}
          >
            <IconX size={18} stroke={1.8} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 26px 26px' }}>
          {/* Error Banner */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '18px',
                color: '#EF4444',
                fontSize: '13px'
              }}
            >
              <IconAlertCircle size={16} stroke={1.8} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* STEP 3: CUSTOMER ONBOARDING */}
          {step === 'onboarding' ? (
            <form onSubmit={handleSaveOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Add your details to enable 15-minute doorstep deliveries and personalized offers.
              </p>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={onboardingFullName}
                  onChange={(e) => setOnboardingFullName(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Delivery Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 98290 12345"
                  value={onboardingPhone}
                  onChange={(e) => setOnboardingPhone(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Gender
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: gender === g ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                        border: gender === g ? '1px solid #22C55E' : '1px solid var(--border-color)',
                        color: gender === g ? '#22C55E' : 'var(--text-secondary)',
                        textTransform: 'capitalize',
                        cursor: 'pointer'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: 'var(--bg-elevated)',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px', borderRadius: '12px', fontSize: '13px', fontWeight: 700 }}
                >
                  {loading ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : 'Save Profile & Start'}
                </button>
              </div>
            </form>
          ) : step === 'otp' ? (
            /* STEP 2: OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.4 }}>
                Enter the 6-digit verification code sent to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </p>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  autoFocus
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '14px',
                    padding: '14px',
                    fontSize: '24px',
                    letterSpacing: '8px',
                    textAlign: 'center',
                    fontWeight: 800,
                    color: '#22C55E'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading ? <IconLoader2 size={18} stroke={1.8} className="spin" /> : 'Verify Code & Continue →'}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  style={{ background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer' }}
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{ background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer' }}
                >
                  Resend Code
                </button>
              </div>
            </form>
          ) : (
            /* STEP 1: INITIAL SIGN IN / SIGN UP FORM */
            <div>
              {/* Mode Toggle (Login vs Sign Up) */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: '12px',
                  padding: '4px',
                  marginBottom: '20px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    backgroundColor: authMode === 'login' ? 'var(--bg-card)' : 'transparent',
                    color: authMode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: authMode === 'login' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    backgroundColor: authMode === 'signup' ? 'var(--bg-card)' : 'transparent',
                    color: authMode === 'signup' ? 'var(--text-primary)' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: authMode === 'signup' ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  Create Customer Account
                </button>
              </div>

              {/* Auth Method Selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                <button
                  type="button"
                  onClick={() => setAuthMethod('otp_email')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: authMethod === 'otp_email' ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                    border: authMethod === 'otp_email' ? '1px solid #22C55E' : '1px solid var(--border-color)',
                    color: authMethod === 'otp_email' ? '#22C55E' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <IconMail size={15} stroke={1.8} /> Email OTP
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backgroundColor: authMethod === 'password' ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                    border: authMethod === 'password' ? '1px solid #22C55E' : '1px solid var(--border-color)',
                    color: authMethod === 'password' ? '#22C55E' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <IconLock size={15} stroke={1.8} /> Password
                </button>
              </div>

              {/* Forms */}
              {authMethod === 'password' ? (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {authMode === 'signup' && (
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, marginTop: '8px' }}
                  >
                    {loading ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : authMode === 'login' ? 'Sign In →' : 'Create Customer Account →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {authMode === 'signup' && (
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address for 6-Digit Code</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, marginTop: '8px' }}
                  >
                    {loading ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : 'Send 6-Digit Verification Code →'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
