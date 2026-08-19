import React, { useState } from 'react';
import {
  IconX,
  IconMail,
  IconPhone,
  IconLock,
  IconArrowRight,
  IconSparkles,
  IconShieldCheck,
  IconBuildingStore,
  IconMotorbike,
  IconUser,
  IconAlertCircle,
  IconLoader2,
  IconKey,
  IconCalendar,
  IconHeart,
  IconCheck
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import { UserRole } from '../types';
import { GetoraLogo } from './GetoraLogo';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithEmail,
    signInWithPhone,
    verifyOtp,
    signInWithPassword,
    signUpWithPassword,
    updateProfile,
    profile,
    showToast
  } = useGetora();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authMethod, setAuthMethod] = useState<'otp_email' | 'otp_phone' | 'password'>('otp_email');
  const [role, setRole] = useState<UserRole>('customer');

  // Input states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [shopName, setShopName] = useState('');
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

  // 1. Send Email / Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMethod === 'otp_email') {
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
      } else if (authMethod === 'otp_phone') {
        let cleanPhone = phone.trim().replace(/[\s-]/g, '');
        if (!cleanPhone.startsWith('+')) {
          cleanPhone = `+91${cleanPhone}`;
        }

        if (cleanPhone.length < 12) {
          setErrorMessage('Please enter a valid 10-digit mobile number.');
          setLoading(false);
          return;
        }

        const res = await signInWithPhone(cleanPhone);
        if (!res.success) {
          setErrorMessage(res.message || 'Unable to send SMS OTP. Please check phone number or try email.');
        } else {
          setStep('otp');
          showToast('OTP Sent', `SMS verification code sent to ${cleanPhone}`, 'info');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length < 4) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      let cleanPhone = phone.trim().replace(/[\s-]/g, '');
      if (cleanPhone && !cleanPhone.startsWith('+')) cleanPhone = `+91${cleanPhone}`;

      const res = await verifyOtp({
        email: authMethod === 'otp_email' ? email.trim() : undefined,
        phone: authMethod === 'otp_phone' ? cleanPhone : undefined,
        token: otp.trim(),
        type: authMethod === 'otp_email' ? 'email' : 'sms',
        fullName: authMode === 'signup' ? fullName : undefined,
        role: authMode === 'signup' ? role : undefined,
        shopName: authMode === 'signup' && role === 'retailer' ? shopName : undefined
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Invalid or expired OTP. Please try again.');
      } else {
        // Prepare onboarding prefill
        setOnboardingFullName(fullName || (profile?.fullName !== 'GETORA User' ? profile?.fullName || '' : ''));
        setOnboardingPhone(phone || profile?.phone || '');
        setStep('onboarding');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Auth
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      if (authMode === 'login') {
        const res = await signInWithPassword(email.trim(), password);
        if (!res.success) {
          setErrorMessage(res.message || 'Invalid email or password.');
        } else {
          showToast('Welcome Back!', 'Successfully signed in', 'success');
          handleClose();
        }
      } else {
        const res = await signUpWithPassword(email.trim(), password, {
          fullName,
          role,
          shopName: role === 'retailer' ? shopName : undefined
        });
        if (!res.success) {
          setErrorMessage(res.message || 'Signup failed.');
        } else {
          setOnboardingFullName(fullName);
          setOnboardingPhone(phone);
          setStep('onboarding');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Save Customer Onboarding Details (Phone, Date of Birth, Gender)
  const handleSaveOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        fullName: onboardingFullName.trim() || undefined,
        phone: onboardingPhone.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender
      });

      showToast('Profile Complete!', 'Welcome to GETORA Quick Commerce', 'success');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save profile details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '480px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-card)',
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
                Supabase Auth
              </span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px', fontFamily: 'Outfit' }}>
              {step === 'onboarding'
                ? 'Complete Your Profile'
                : step === 'otp'
                ? 'Enter Verification Code'
                : authMode === 'login'
                ? 'Sign In to GETORA'
                : 'Create an Account'}
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

          {/* ================================================================= */}
          {/* STEP 3: CUSTOMER ONBOARDING (Phone, Date of Birth, Gender)        */}
          {/* ================================================================= */}
          {step === 'onboarding' ? (
            <form onSubmit={handleSaveOnboarding} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Add your details to enable 15-minute doorstep deliveries, birthday specials, and tailored local offers.
              </p>

              {/* Full Name */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    gap: '10px'
                  }}
                >
                  <IconUser size={16} stroke={1.8} color="#22C55E" />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={onboardingFullName}
                    onChange={(e) => setOnboardingFullName(e.target.value)}
                    style={{ width: '100%', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Mobile Phone Number (For Order Delivery & Live Tracking)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    gap: '10px'
                  }}
                >
                  <IconPhone size={16} stroke={1.8} color="#22C55E" />
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={onboardingPhone}
                    onChange={(e) => setOnboardingPhone(e.target.value)}
                    style={{ width: '100%', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Date of Birth (DOB)
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    gap: '10px'
                  }}
                >
                  <IconCalendar size={16} stroke={1.8} color="#22C55E" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    style={{ width: '100%', fontSize: '14px', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Gender Selector Chips */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Gender
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { id: 'male', label: '👨 Male' },
                    { id: 'female', label: '👩 Female' },
                    { id: 'other', label: '🌈 Other' },
                    { id: 'prefer_not_to_say', label: '🔒 Prefer not to say' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGender(g.id as any)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: gender === g.id ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                        border: gender === g.id ? '1px solid #22C55E' : '1px solid var(--border-color)',
                        color: gender === g.id ? '#22C55E' : 'var(--text-secondary)',
                        textAlign: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Skip for Now
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {loading ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : 'Save & Start Shopping →'}
                </button>
              </div>
            </form>
          ) : step === 'otp' ? (
            /* ================================================================= */
            /* STEP 2: OTP VERIFICATION                                          */
            /* ================================================================= */
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ textAlign: 'center', margin: '4px 0 10px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}
                >
                  <IconKey size={26} stroke={1.8} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Enter the 6-digit verification code sent to:
                </p>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {authMethod === 'otp_email' ? email : phone}
                </div>
              </div>

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
                  ← Change {authMethod === 'otp_email' ? 'Email' : 'Phone'}
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
            /* ================================================================= */
            /* STEP 1: INITIAL SIGN IN / SIGN UP FORM                            */
            /* ================================================================= */
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
                  Create Account
                </button>
              </div>

              {/* Role Selection (Customer vs Retailer) for Signup */}
              {authMode === 'signup' && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                    I want to join GETORA as:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div
                      onClick={() => setRole('customer')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: role === 'customer' ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                        border: role === 'customer' ? '1px solid #22C55E' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <IconUser size={18} stroke={1.8} color={role === 'customer' ? '#22C55E' : 'var(--text-secondary)'} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Customer</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Order essentials</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setRole('retailer')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: role === 'retailer' ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-input)',
                        border: role === 'retailer' ? '1px solid #22C55E' : '1px solid var(--border-color)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <IconBuildingStore size={18} stroke={1.8} color={role === 'retailer' ? '#22C55E' : 'var(--text-secondary)'} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Retailer</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sell products</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Form by Method */}
              {authMethod === 'password' ? (
                <form onSubmit={handlePasswordAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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

                  {authMode === 'signup' && role === 'retailer' && (
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Store / Shop Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma Electricals & Hardware"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
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
                    {loading ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : authMode === 'login' ? 'Sign In →' : 'Create Account →'}
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

                  {authMode === 'signup' && role === 'retailer' && (
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Store / Shop Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Sharma Electricals & Hardware"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        required
                        style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email Address for 6-Digit OTP</label>
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
