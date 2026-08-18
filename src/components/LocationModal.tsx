import React, { useState } from 'react';
import {
  X,
  MapPin,
  Plus,
  Home,
  Briefcase,
  Navigation,
  Check,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
          backgroundColor: '#121212',
          border: '1px solid #292929',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #202020',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(29, 185, 84, 0.15)', color: '#1DB954', padding: '8px', borderRadius: '10px' }}>
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', fontFamily: 'Outfit' }}>
                {isAddingNew ? 'Add New Address' : 'Select Delivery Location'}
              </h3>
              <p style={{ fontSize: '12px', color: '#8E8E93' }}>
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
              backgroundColor: '#1C1C1E',
              border: 'none',
              color: '#A7A7A7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
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
                      border: addressType === type ? '1px solid #1DB954' : '1px solid #282828',
                      backgroundColor: addressType === type ? 'rgba(29, 185, 84, 0.15)' : '#181818',
                      color: addressType === type ? '#1DB954' : '#A7A7A7',
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
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>House / Flat / Block No. & Street *</label>
                <input
                  type="text"
                  placeholder="e.g. Flat 402, Green Valley Apts, 10th Cross"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                  style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Koramangala"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>Landmark</label>
                  <input
                    type="text"
                    placeholder="Near BDA Complex"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#A7A7A7', display: 'block', marginBottom: '4px' }}>Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: '#181818', border: '1px solid #282828', borderRadius: '10px', padding: '10px 12px', color: '#fff', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #282828', backgroundColor: 'transparent', color: '#A7A7A7', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {submitting ? <Loader2 size={16} className="spin" /> : 'Save Address'}
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
                  border: '1px dashed #1DB954',
                  backgroundColor: 'rgba(29, 185, 84, 0.08)',
                  color: '#1DB954',
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
                <Plus size={16} /> Add New Delivery Address
              </button>

              {/* Saved Addresses List */}
              {savedAddresses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 20px', color: '#8E8E93' }}>
                  <MapPin size={36} color="#333" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>No saved addresses found</p>
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
                          backgroundColor: isSelected ? 'rgba(29, 185, 84, 0.08)' : '#181818',
                          border: isSelected ? '1px solid #1DB954' : '1px solid #282828',
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
                              backgroundColor: isSelected ? '#1DB954' : '#242424',
                              color: isSelected ? '#000' : '#A7A7A7',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            {addr.addressType === 'Home' ? <Home size={16} /> : <Briefcase size={16} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{addr.addressType}</span>
                              {addr.isDefault && (
                                <span style={{ fontSize: '10px', backgroundColor: 'rgba(29,185,84,0.2)', color: '#39D353', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '13px', color: '#D1D5DB', lineHeight: 1.4 }}>
                              {addr.addressLine1}
                              {addr.addressLine2 && `, ${addr.addressLine2}`}
                            </p>
                            <p style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px' }}>
                              {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            style={{ backgroundColor: 'transparent', border: 'none', color: '#6B6B6B', cursor: 'pointer', padding: '4px' }}
                            title="Delete Address"
                          >
                            <Trash2 size={15} />
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
