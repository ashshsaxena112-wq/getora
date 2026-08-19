import React, { useState } from 'react';
import {
  IconX,
  IconMapPin,
  IconPlus,
  IconHome,
  IconBriefcase,
  IconNavigation,
  IconCheck,
  IconTrash,
  IconAlertCircle,
  IconLoader2
} from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';
import { CustomerAddress } from '../types';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    savedAddresses,
    selectedAddress,
    selectLocation,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    user,
    openAuthModal
  } = useGetora();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [addressType, setAddressType] = useState<string>('Home');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560034');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isLocationModalOpen) return null;

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      closeLocationModal();
      openAuthModal();
      return;
    }

    if (!addressLine1.trim() || !city.trim() || !pincode.trim()) {
      return;
    }

    setSubmitting(true);
    const ok = await addAddress({
      addressType,
      fullName: fullName.trim() || undefined,
      phone: phone.trim() || undefined,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault
    });

    setSubmitting(false);
    if (ok) {
      setIsAddingNew(false);
      setAddressLine1('');
      setAddressLine2('');
      setLandmark('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={closeLocationModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', padding: '8px', borderRadius: '10px' }}>
              <IconMapPin size={18} stroke={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                {isAddingNew ? 'Add New Address' : 'Select Delivery Location'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isAddingNew ? 'Enter delivery details' : 'Choose where to deliver your order'}
              </p>
            </div>
          </div>

          <button
            onClick={closeLocationModal}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-elevated)',
              border: 'none',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <IconX size={16} stroke={1.8} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {isAddingNew ? (
            <form onSubmit={handleSaveAddress}>
              {/* Type tags */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                {['Home', 'Work', 'Other'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAddressType(type)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      border: addressType === type ? '1px solid #22C55E' : '1px solid var(--border-color)',
                      backgroundColor: addressType === type ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-secondary)',
                      color: addressType === type ? '#22C55E' : 'var(--text-secondary)',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>House / Flat / Block No. & Street *</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Green Valley Apts, 10th Cross"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Koramangala"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Landmark</label>
                  <input
                    type="text"
                    placeholder="Near BDA Complex"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '10px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {submitting ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : 'Save Address'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Add New Address Button */}
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    closeLocationModal();
                    openAuthModal();
                  } else {
                    setIsAddingNew(true);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px dashed #22C55E',
                  backgroundColor: 'rgba(34, 197, 94, 0.08)',
                  color: '#22C55E',
                  fontSize: '14px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
              >
                <IconPlus size={16} stroke={1.8} /> Add New Delivery Address
              </button>

              {/* Saved Addresses List */}
              {savedAddresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
                  <IconMapPin size={36} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>No saved addresses found</p>
                  <p style={{ fontSize: '12px', marginTop: '4px' }}>Add your address to view neighborhood store inventory</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => selectLocation(addr)}
                        style={{
                          backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                          border: isSelected ? '1px solid #22C55E' : '1px solid var(--border-color)',
                          borderRadius: '14px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: isSelected ? '#22C55E' : 'var(--bg-elevated)',
                              color: isSelected ? '#000' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {addr.addressType === 'Home' ? <IconHome size={16} stroke={1.8} /> : <IconBriefcase size={16} stroke={1.8} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{addr.addressType}</span>
                              {addr.isDefault && (
                                <span style={{ fontSize: '10px', backgroundColor: 'rgba(34,197,94,0.2)', color: '#22C55E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                            title="Delete Address"
                          >
                            <IconTrash size={15} stroke={1.8} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
