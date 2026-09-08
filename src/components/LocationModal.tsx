// ==============================================================================
// GETORA LOCATION MODAL COMPONENT (Powered by Ola Maps & High-Accuracy GPS)
// Features:
// 1. Live Interactive Map (Street & Satellite view with house rooftops)
// 2. Real-time reverse geocoding on pin drag/click
// 3. Quick 'Deliver Here' confirmation
// 4. Ola Places Autocomplete Search
// 5. Full address saving form
// ==============================================================================

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
  IconLoader2,
  IconEdit
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
    user,
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
      setAddressLine2(selectedAddress.addressLine2 || selectedAddress.streetArea || '');
      setLandmark(selectedAddress.landmark || '');
      setCity(selectedAddress.city || 'Jaipur');
      setState(selectedAddress.state || 'Rajasthan');
      setPincode(selectedAddress.pincode || '302001');
    }
  }, [selectedAddress, isLocationModalOpen]);

  if (!isLocationModalOpen) return null;

  // Handles updating address fields when coordinates change (drag pin or GPS)
  const handleCoordinatesChange = async (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
    setIsReverseGeocoding(true);
    try {
      const geo = await OlaMapsService.reverseGeocode(newLat, newLng);
      if (geo) {
        setAddressLine1(geo.formattedAddress);
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
      const coords = await OlaMapsService.geocode(place.description);
      if (coords) {
        handleCoordinatesChange(coords.latitude, coords.longitude);
      }
    }
    setAddressLine1(place.mainText || place.description);
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

  // Confirm currently pinned location directly without filling full form
  const handleConfirmCurrentPin = () => {
    const newAddr: CustomerAddress = {
      id: `addr-${Date.now()}`,
      customerId: user?.id || 'guest',
      addressType: addressType || 'Live Location',
      fullName: fullName.trim() || undefined,
      phone: phone.trim() || undefined,
      streetArea: addressLine2 || city,
      addressLine1: addressLine1 || `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      addressLine2: addressLine2 || undefined,
      landmark: landmark || undefined,
      city: city || 'Jaipur',
      state: state || 'Rajasthan',
      pincode: pincode || '302001',
      latitude,
      longitude,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      isDefault,
    };

    if (user) {
      await addAddress(addrData);
    } else {
      selectLocation(addrData as CustomerAddress);
    }

    setSubmitting(false);
    setIsAddingNew(false);
  };

  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'live-customer-pin',
      latitude,
      longitude,
      title: 'Aapki Delivery Location',
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
        padding: '16px',
      }}
      onClick={closeLocationModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '24px',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22C55E', padding: '8px', borderRadius: '10px' }}>
              <IconMapPin size={18} stroke={1.8} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                {isAddingNew ? 'Complete Address Details' : 'Choose Delivery Location'}
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Live GPS • Streets & Real Satellite Rooftops View
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
              cursor: 'pointer',
            }}
          >
            <IconX size={16} stroke={1.8} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '16px 20px', maxHeight: '76vh', overflowY: 'auto' }}>
          {/* ALWAYS VISIBLE LIVE INTERACTIVE MAP */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📍 Pin Location (Drag pin ya map pr click karein)
              </span>
              {isReverseGeocoding && (
                <span style={{ fontSize: '11px', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconLoader2 size={12} className="spin" /> Updating address...
                </span>
              )}
            </div>

            <OlaMap
              center={[latitude, longitude]}
              zoom={15}
              height="230px"
              markers={mapMarkers}
              showLayerSwitcher={true}
              showGpsButton={true}
              onLocationDetected={(coords) => handleCoordinatesChange(coords.latitude, coords.longitude)}
              onMapClick={(coords) => handleCoordinatesChange(coords.latitude, coords.longitude)}
              className="rounded-2xl overflow-hidden shadow-inner border border-[rgba(34,197,94,0.3)]"
            />
          </div>

          {/* Real-time Reverse-Geocoded Address Display Card */}
          <div
            style={{
              backgroundColor: 'rgba(34, 197, 94, 0.08)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, textTransform: 'uppercase' }}>
                  Aapki Selected Location
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.3 }}>
                  {addressLine1 || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                </div>
                {addressLine2 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {addressLine2}, {city}
                  </div>
                )}
              </div>

              {!isAddingNew && (
                <button
                  type="button"
                  onClick={handleConfirmCurrentPin}
                  className="btn-primary"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                  }}
                >
                  <IconCheck size={14} /> Deliver Here
                </button>
              )}
            </div>
          </div>

          {/* Form or Search + Saved Addresses Section */}
          {isAddingNew ? (
            <form onSubmit={handleSaveAddress}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <LocationSearchInput
                    placeholder="Search apartment, road, locality..."
                    onSelectPlace={handleSelectPrediction}
                  />
                </div>
              </div>

              {/* Address Type selector */}
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
                      cursor: 'pointer',
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Receiver Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
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
                <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>House / Flat / Block No. & Street *</label>
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
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Area / Locality</label>
                  <input
                    type="text"
                    placeholder="e.g. Malviya Nagar"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Landmark</label>
                  <input
                    type="text"
                    placeholder="Near City Mall"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    style={{ width: '100%', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Pincode *</label>
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
                  style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ flex: 2, padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {submitting ? <IconLoader2 size={16} stroke={1.8} className="spin" /> : 'Save Address'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {/* Locality search with Ola autocomplete */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Search any street, apartment or locality in Jaipur:
                </label>
                <LocationSearchInput
                  onSelectPlace={handleSelectPrediction}
                  placeholder="e.g. Vaishali Nagar, Malviya Nagar, Mansarovar..."
                />
              </div>

              {/* Action Buttons: Add More Details or Use Current Device GPS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(true)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px dashed var(--border-color)',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <IconPlus size={15} /> Add House No / Details
                </button>

                <button
                  type="button"
                  onClick={handleDetectCurrentLocation}
                  disabled={isDetectingGps}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(34,197,94,0.35)',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    color: '#4ADE80',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: isDetectingGps ? 'wait' : 'pointer',
                  }}
                >
                  {isDetectingGps ? (
                    <IconLoader2 size={15} className="spin" />
                  ) : (
                    <IconNavigation size={15} />
                  )}
                  <span>Auto-Detect GPS</span>
                </button>
              </div>

              {/* Saved Addresses List */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Saved Addresses ({savedAddresses.length})
                </div>

                {savedAddresses.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <IconMapPin size={28} stroke={1.8} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>No saved addresses yet</p>
                    <p style={{ fontSize: '11px', marginTop: '2px' }}>Use the map pin above or click 'Add House No / Details'</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => {
                            selectLocation(addr);
                            closeLocationModal();
                          }}
                          style={{
                            backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.08)' : 'var(--bg-secondary)',
                            border: isSelected ? '1px solid #22C55E' : '1px solid var(--border-color)',
                            borderRadius: '12px',
                            padding: '12px 14px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '8px',
                                backgroundColor: isSelected ? '#22C55E' : 'var(--bg-elevated)',
                                color: isSelected ? '#000' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {addr.addressType === 'Home' ? <IconHome size={15} stroke={1.8} /> : <IconBriefcase size={15} stroke={1.8} />}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{addr.addressType}</span>
                                {addr.isDefault && (
                                  <span style={{ fontSize: '9px', backgroundColor: 'rgba(34,197,94,0.2)', color: '#22C55E', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                    DEFAULT
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                                {addr.addressLine1}
                                {addr.addressLine2 && `, ${addr.addressLine2}`}
                              </p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => deleteAddress(addr.id)}
                              style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                              title="Delete Address"
                            >
                              <IconTrash size={14} stroke={1.8} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
