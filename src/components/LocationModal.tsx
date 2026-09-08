import React, { useState, useEffect } from 'react';
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
import { OlaMap, MapMarkerItem } from './OlaMap';
import { LocationSearchInput } from './LocationSearchInput';
import { OlaMapsService, PlacePrediction } from '../services/olaMapsService';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    closeLocationModal,
    savedAddresses,
    selectedAddress,
    selectLocation,
    detectCurrentLocation,
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
  const [city, setCity] = useState('Jaipur');
  const [state, setState] = useState('Rajasthan');
  const [pincode, setPincode] = useState('302001');
  const [latitude, setLatitude] = useState<number>(26.9124);
  const [longitude, setLongitude] = useState<number>(75.7873);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize modal position from existing selectedAddress if available
  useEffect(() => {
    if (selectedAddress?.latitude && selectedAddress?.longitude) {
      setLatitude(selectedAddress.latitude);
      setLongitude(selectedAddress.longitude);
      setAddressLine1(selectedAddress.addressLine1 || '');
      setAddressLine2(selectedAddress.addressLine2 || '');
      setLandmark(selectedAddress.landmark || '');
      setCity(selectedAddress.city || 'Jaipur');
      setState(selectedAddress.state || 'Rajasthan');
      setPincode(selectedAddress.pincode || '302001');
    }
  }, [selectedAddress]);

  if (!isLocationModalOpen) return null;

  // Handles updating address fields when coordinates change (drag pin or GPS)
  const handleCoordinatesChange = async (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
    setIsReverseGeocoding(true);
    try {
      const geo = await OlaMapsService.reverseGeocode(newLat, newLng);
      if (geo) {
        if (!addressLine1 || addressLine1.length < 5) {
          setAddressLine1(geo.formattedAddress);
        }
        if (geo.streetArea) setAddressLine2(geo.streetArea);
        if (geo.landmark) setLandmark(geo.landmark);
        if (geo.city) setCity(geo.city);
        if (geo.state) setState(geo.state);
        if (geo.pincode) setPincode(geo.pincode);
      }
    } catch (err) {
      console.warn('Reverse geocode failed:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Autocomplete place selection
  const handleSelectPrediction = async (place: PlacePrediction) => {
    if (place.latitude && place.longitude) {
      handleCoordinatesChange(place.latitude, place.longitude);
    } else {
      // Geocode description if lat/lng not in prediction
      const coords = await OlaMapsService.geocode(place.description);
      if (coords) {
        handleCoordinatesChange(coords.latitude, coords.longitude);
      }
    }
    setAddressLine1(place.mainText);
    if (place.secondaryText) {
      setAddressLine2(place.secondaryText);
    }
  };

  // Browser GPS detection
  const handleDetectCurrentLocation = async () => {
    setIsDetectingGps(true);
    const success = await detectCurrentLocation(false);
    setIsDetectingGps(false);
    if (success) {
      closeLocationModal();
    }
  };

  // Direct autocomplete place selection from main modal view
  const handleDirectSelectPrediction = async (place: PlacePrediction) => {
    let lat = place.latitude;
    let lng = place.longitude;
    let city = 'Jaipur';
    let state = 'Rajasthan';
    let pincode = '';
    let streetArea = place.mainText || place.description.split(',')[0];

    if (!lat || !lng) {
      const coords = await OlaMapsService.geocode(place.description);
      if (coords) {
        lat = coords.latitude;
        lng = coords.longitude;
      }
    }

    if (lat && lng) {
      try {
        const rev = await OlaMapsService.reverseGeocode(lat, lng);
        if (rev) {
          if (rev.city) city = rev.city;
          if (rev.state) state = rev.state;
          if (rev.pincode) pincode = rev.pincode;
          if (rev.streetArea) streetArea = rev.streetArea;
        }
      } catch (e) {
        console.warn('Reverse geocode failed for prediction:', e);
      }
    }

    const newAddr: CustomerAddress = {
      id: `addr-${Date.now()}`,
      customerId: user?.id || 'guest',
      addressType: 'Selected Area',
      streetArea: streetArea,
      addressLine1: place.description,
      addressLine2: place.secondaryText || streetArea,
      city,
      state,
      pincode,
      latitude: lat || 26.9124,
      longitude: lng || 75.7873,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    selectLocation(newAddr);
    closeLocationModal();
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!addressLine1.trim() || !city.trim()) {
      return;
    }

    setSubmitting(true);
    const addrData: any = {
      id: `addr-${Date.now()}`,
      customerId: user?.id || 'guest',
      addressType,
      fullName: fullName.trim() || undefined,
      phone: phone.trim() || undefined,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      latitude,
      longitude,
      isDefault
    };

    if (user) {
      await addAddress(addrData);
    } else {
      selectLocation(addrData as CustomerAddress);
    }

    setSubmitting(false);
    setIsAddingNew(false);
    setAddressLine1('');
    setAddressLine2('');
    setLandmark('');
  };

  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'selected-pin',
      latitude,
      longitude,
      title: 'Drag to Pin Exactly',
      type: 'customer',
      isDraggable: true,
      onDragEnd: (coords) => handleCoordinatesChange(coords.latitude, coords.longitude),
    },
  ];

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
          maxWidth: '540px',
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
            padding: '18px 24px',
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
                {isAddingNew ? 'Add New Delivery Address' : 'Select Delivery Location'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isAddingNew ? 'Powered by Ola Maps India' : 'Choose where to deliver your order'}
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
        <div style={{ padding: '20px 24px', maxHeight: '72vh', overflowY: 'auto' }}>
          {isAddingNew ? (
            <form onSubmit={handleSaveAddress}>
              {/* Autocomplete Search & Current Location GPS */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <LocationSearchInput
                      placeholder="Search apartment, road, locality..."
                      onSelectPlace={handleSelectPrediction}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleDetectCurrentLocation}
                    disabled={isDetectingGps}
                    style={{
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(34,197,94,0.3)',
                      backgroundColor: 'rgba(34,197,94,0.1)',
                      color: '#4ADE80',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    title="Detect Current GPS Location"
                  >
                    {isDetectingGps ? (
                      <IconLoader2 size={16} className="spin" />
                    ) : (
                      <IconNavigation size={16} />
                    )}
                    <span>Current GPS</span>
                  </button>
                </div>
              </div>

              {/* Interactive Mini Ola Map */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Pin Location on Ola Maps (Drag pin or click map)
                  </span>
                  {isReverseGeocoding && (
                    <span style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <IconLoader2 size={12} className="spin" /> Updating address...
                    </span>
                  )}
                </div>
                <OlaMap
                  center={[latitude, longitude]}
                  zoom={14}
                  height="170px"
                  markers={mapMarkers}
                  onMapClick={(coords) => handleCoordinatesChange(coords.latitude, coords.longitude)}
                  className="rounded-xl overflow-hidden shadow-inner"
                />
              </div>

              {/* Type tags */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
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
                  style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Koramangala"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Landmark</label>
                  <input
                    type="text"
                    placeholder="Near BDA Complex"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
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
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
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
              {/* 1. Quick GPS Detection Banner */}
              <div
                onClick={handleDetectCurrentLocation}
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.09)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  cursor: isDetectingGps ? 'wait' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#22C55E',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isDetectingGps ? (
                      <IconLoader2 size={20} className="spin" />
                    ) : (
                      <IconNavigation size={20} />
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {isDetectingGps ? 'Detecting your device GPS...' : 'Use Current GPS Location'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#22C55E' }}>
                      Auto-detect using device GPS & Ola Maps
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#22C55E', fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {isDetectingGps ? 'Locating...' : 'Detect Now →'}
                </div>
              </div>

              {/* 2. Search Locality with Ola Maps Places Autocomplete */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Or search locality / street across Jaipur:
                </label>
                <LocationSearchInput
                  onSelectPlace={handleDirectSelectPrediction}
                  placeholder="e.g. Vaishali Nagar, Malviya Nagar, Mansarovar..."
                />
              </div>

              {/* 3. Add Custom Pin on Ola Map */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px dashed var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  cursor: 'pointer'
                }}
              >
                <IconPlus size={16} stroke={1.8} /> Set Custom Pin on Ola Map
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
                              {addr.latitude && addr.longitude && (
                                <span style={{ fontSize: '9px', backgroundColor: 'rgba(59,130,246,0.15)', color: '#60A5FA', padding: '1px 5px', borderRadius: '4px', fontWeight: 600 }}>
                                  Ola Maps Verified
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
