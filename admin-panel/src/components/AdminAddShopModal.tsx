import React, { useState } from 'react';
import { Store, X, Check, ShieldCheck, MapPin, Phone, Mail, Clock, Percent, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AdminAddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminAddShopModal: React.FC<AdminAddShopModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { addRetailer } = useAdmin();

  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    category: 'Hardware & Tools',
    phone: '',
    email: '',
    locality: 'Vaishali Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302021',
    address: '',
    gstin: '',
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    commissionRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=500&auto=format&fit=crop&q=80',
    isVerified: true,
    isActive: true,
    isOpen: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const categories = [
    'Hardware & Tools',
    'Electrical & Lighting',
    'Grocery & Essentials',
    'Dairy & Bakery',
    'Fresh Fruits & Vegetables',
    'Pharmacy & Health',
    'Electronics & Mobile',
    'Stationery & Books',
    'Home & Kitchen',
    'Personal Care & Beauty'
  ];

  const localities = [
    'Vaishali Nagar',
    'Mansarovar',
    'Malviya Nagar',
    'C-Scheme',
    'Raja Park',
    'Tonk Road',
    'Jagatpura',
    'Vidhyadhar Nagar',
    'Civil Lines',
    'Bani Park',
    'Ajmer Road',
    'Amer'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.shopName.trim()) {
      setErrorMessage('Shop Name is required');
      return;
    }
    if (!formData.ownerName.trim()) {
      setErrorMessage('Owner Name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Phone Number is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addRetailer({
        retailer: formData.shopName.trim(),
        owner: formData.ownerName.trim(),
        category: formData.category,
        phone: formData.phone.trim(),
        locality: formData.locality,
        city: formData.city,
        address: formData.address.trim() || `${formData.locality}, ${formData.city}`,
        gstin: formData.gstin.trim() || '08AABCS1429B1Z',
        commissionRate: Number(formData.commissionRate) || 12,
        status: formData.isActive ? 'Active' : 'Suspended',
        isVerified: formData.isVerified,
        openTime: formData.openingTime,
        closeTime: formData.closingTime,
        logoUrl: formData.imageUrl
      });

      if (success) {
        setSuccessMessage('Shop registered and synced to Supabase database successfully!');
        setTimeout(() => {
          setIsSubmitting(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      } else {
        setErrorMessage('Failed to save to Supabase. Please try again.');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to add shop');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn font-['Inter',sans-serif]">
      <div className="relative w-full max-w-2xl bg-[#181818] border border-[#292929] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#292929] bg-[#141414] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14532D]/80 border border-[#1DB954]/40 flex items-center justify-center text-[#1DB954] shadow-md">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Outfit',sans-serif]">
                Onboard New Retailer Shop
              </h2>
              <p className="text-[11px] text-[#A7A7A7]">
                Add merchant to Supabase database & live Getora customer app
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#202020] hover:bg-[#282828] text-[#A7A7A7] hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-[#292929]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-[#14532D]/40 border border-[#1DB954]/40 text-[#1DB954] flex items-center gap-2 text-xs">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Section 1: Basic Information */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1DB954] block mb-2">
              1. Shop & Owner Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Shop / Store Name *</label>
                <div className="relative">
                  <Store className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                    placeholder="e.g. Royal Hardware & Tools"
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Owner Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g. Ramesh Kumar Sharma"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Category & Contact */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Business Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954] transition-colors cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Location Details */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1DB954] block mb-2 pt-2 border-t border-[#292929]">
              2. Location & Address
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Locality / Landmark *</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="text"
                    required
                    list="localities-list"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Vaishali Nagar"
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                  <datalist id="localities-list">
                    {localities.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="302021"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954] transition-colors font-mono"
                />
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-[#A7A7A7] mb-1 font-medium">Full Shop Address / Road</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Shop 12, Main Amrapali Circle, Vaishali Nagar, Jaipur"
                className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors"
              />
            </div>
          </div>

          {/* Section 4: Operational Settings & Timing */}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1DB954] block mb-2 pt-2 border-t border-[#292929]">
              3. Operational Settings & Commission
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Opening Time</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="text"
                    value={formData.openingTime}
                    onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                    placeholder="08:00 AM"
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Closing Time</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="text"
                    value={formData.closingTime}
                    onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                    placeholder="10:00 PM"
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Commission (%)</label>
                <div className="relative">
                  <Percent className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#1DB954]" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-[#1DB954] font-bold font-mono focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">GSTIN / Tax Registration (Optional)</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="08AABCS1429B1Z"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors font-mono"
                />
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Store Banner / Image URL</label>
                <div className="relative">
                  <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white placeholder-[#555] focus:outline-none focus:border-[#1DB954] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Status Toggles */}
          <div className="p-3.5 rounded-xl bg-[#121212] border border-[#292929] flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 rounded bg-[#181818] border-[#292929] text-[#1DB954] focus:ring-0 cursor-pointer"
              />
              <span className="text-white font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1DB954]" />
                KYC Verified
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded bg-[#181818] border-[#292929] text-[#1DB954] focus:ring-0 cursor-pointer"
              />
              <span className="text-white font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#1DB954]" />
                Active Store Status
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isOpen}
                onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                className="w-4 h-4 rounded bg-[#181818] border-[#292929] text-[#1DB954] focus:ring-0 cursor-pointer"
              />
              <span className="text-white font-medium flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#1DB954]" />
                Open for Instant Orders
              </span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#292929] flex items-center justify-end gap-2.5 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#202020] hover:bg-[#282828] text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#1DB954] hover:bg-[#39D353] active:bg-[#169C46] disabled:opacity-50 text-black font-black rounded-xl shadow-lg shadow-[#1DB954]/25 flex items-center gap-2 cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <span>Saving to Supabase...</span>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save & Add Shop</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
