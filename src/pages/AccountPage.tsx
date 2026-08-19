import React, { useState } from 'react';
import { useGetora } from '../context/GetoraContext';
import {
  IconUser,
  IconShoppingBag,
  IconMapPin,
  IconTag,
  IconHelpCircle,
  IconShieldCheck,
  IconFileText,
  IconLogout,
  IconChevronRight,
  IconSparkles,
  IconPhone,
  IconBuildingStore,
  IconEdit,
  IconCheck,
  IconLoader2,
  IconSun,
  IconMoon,
  IconDeviceDesktop
} from '@tabler/icons-react';

export const AccountPage: React.FC = () => {
  const {
    user,
    profile,
    role,
    savedAddresses,
    openLocationModal,
    openAuthModal,
    signOut,
    updateProfile,
    orders,
    themeMode,
    resolvedTheme,
    setThemeMode,
    navigate
  } = useGetora();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div style={{ maxWidth: '560px', margin: '40px auto', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <IconUser size={32} stroke={1.8} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Sign In to Your Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
          View orders, manage delivery addresses, and track real-time dispatches with Supabase Auth.
        </p>
        <button
          className="btn-primary"
          onClick={openAuthModal}
          style={{ padding: '12px 32px', fontSize: '15px' }}
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ fullName, phone });
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="account-page-container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 16px 60px' }}>
      {/* Profile Header */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          padding: '28px',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#22C55E',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 900,
                fontFamily: 'Outfit'
              }}
            >
              {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {profile?.fullName || user.email?.split('@')[0]}
                </h1>
                <span
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22C55E',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}
                >
                  {role}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
                {user.email} {profile?.phone ? `• ${profile.phone}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => {
                setFullName(profile?.fullName || '');
                setPhone(profile?.phone || '');
                setIsEditing(!isEditing);
              }}
              style={{ padding: '8px 14px', borderRadius: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconEdit size={14} stroke={1.8} /> {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={signOut}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'transparent',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <IconLogout size={14} stroke={1.8} /> Sign Out
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {saving ? <IconLoader2 size={15} stroke={1.8} className="spin" /> : 'Save Changes'}
            </button>
          </form>
        )}
      </div>

      {/* Retailer Dashboard Shortcut */}
      {role === 'retailer' && (
        <div
          onClick={() => navigate('retailer-dashboard')}
          style={{
            backgroundColor: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid #22C55E',
            borderRadius: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ backgroundColor: '#22C55E', color: '#000', padding: '10px', borderRadius: '12px' }}>
              <IconBuildingStore size={22} stroke={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>Retailer Management Portal</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manage shop inventory, add new products & fulfill orders</p>
            </div>
          </div>
          <IconChevronRight size={20} stroke={1.8} color="#22C55E" />
        </div>
      )}

      {/* Appearance & Theme Settings */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <IconSparkles size={18} stroke={1.8} color="#22C55E" />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Appearance & Theme Settings
          </h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Customize your interface color palette. Choose Auto to follow your device theme, or select Dark / Light mode manually.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {/* Option 1: Auto */}
          <div
            onClick={() => setThemeMode('auto')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: themeMode === 'auto' ? 'var(--color-green-dim)' : 'var(--bg-primary)',
              border: themeMode === 'auto' ? '2px solid var(--color-green)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: themeMode === 'auto' ? '#22C55E' : 'var(--text-secondary)' }}>
                <IconDeviceDesktop size={22} stroke={1.8} />
              </div>
              {themeMode === 'auto' && (
                <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#22C55E', color: '#000', padding: '2px 8px', borderRadius: '9999px' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Auto (System)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Follows device settings ({resolvedTheme} right now)
              </div>
            </div>
          </div>

          {/* Option 2: Dark */}
          <div
            onClick={() => setThemeMode('dark')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: themeMode === 'dark' ? 'var(--color-green-dim)' : 'var(--bg-primary)',
              border: themeMode === 'dark' ? '2px solid var(--color-green)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: themeMode === 'dark' ? '#22C55E' : 'var(--text-secondary)' }}>
                <IconMoon size={22} stroke={1.8} />
              </div>
              {themeMode === 'dark' && (
                <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#22C55E', color: '#000', padding: '2px 8px', borderRadius: '9999px' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Dark Theme</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Classic Black & Signature Neon Green
              </div>
            </div>
          </div>

          {/* Option 3: Light */}
          <div
            onClick={() => setThemeMode('light')}
            style={{
              padding: '16px',
              borderRadius: '14px',
              backgroundColor: themeMode === 'light' ? 'var(--color-green-dim)' : 'var(--bg-primary)',
              border: themeMode === 'light' ? '2px solid var(--color-green)' : '1px solid var(--border-color)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: themeMode === 'light' ? '#22C55E' : 'var(--text-secondary)' }}>
                <IconSun size={22} stroke={1.8} />
              </div>
              {themeMode === 'light' && (
                <span style={{ fontSize: '11px', fontWeight: 800, backgroundColor: '#22C55E', color: '#000', padding: '2px 8px', borderRadius: '9999px' }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Light Theme</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Crisp White & Emerald Green
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div
          onClick={() => navigate('orders')}
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit', marginTop: '4px' }}>
            {orders.length}
          </div>
        </div>

        <div
          onClick={openLocationModal}
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saved Addresses</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit', marginTop: '4px' }}>
            {savedAddresses.length}
          </div>
        </div>
      </div>

      {/* Manage Locations */}
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
            Saved Delivery Addresses
          </h3>
          <button
            onClick={openLocationModal}
            style={{ background: 'none', border: 'none', color: '#22C55E', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            + Add New Address
          </button>
        </div>

        {savedAddresses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No saved addresses yet. Click above to add one.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {savedAddresses.map((a) => (
              <div key={a.id} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{a.addressType}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>{a.addressLine1}, {a.city} ({a.pincode})</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
