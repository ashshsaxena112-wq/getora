import React, { useState } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Eye,
  ShieldCheck,
  Percent,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Store,
  Clock,
  Download,
  LayoutGrid,
  List
} from 'lucide-react';
import { useAdmin, RetailerItem } from '../context/AdminContext';

export const AdminRetailersView: React.FC = () => {
  const {
    retailers,
    addRetailer,
    updateRetailer,
    deleteRetailer,
    toggleRetailerStatus,
    approveRetailerKYC
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedRetailer, setSelectedRetailer] = useState<RetailerItem | null>(null);
  const [editingRetailer, setEditingRetailer] = useState<RetailerItem | null>(null);
  const [deletingRetailer, setDeletingRetailer] = useState<RetailerItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    retailer: '',
    owner: '',
    category: 'Hardware & Tools',
    phone: '',
    locality: 'Vaishali Nagar',
    city: 'Jaipur',
    address: '',
    gstin: '08AABCS1429B1Z',
    commissionRate: 12,
    status: 'Active' as 'Active' | 'Suspended',
    isVerified: true,
    openTime: '09:00 AM',
    closeTime: '10:00 PM'
  });

  const resetForm = () => {
    setFormData({
      retailer: '',
      owner: '',
      category: 'Hardware & Tools',
      phone: '',
      locality: 'Vaishali Nagar',
      city: 'Jaipur',
      address: '',
      gstin: '08AABCS1429B1Z',
      commissionRate: 12,
      status: 'Active',
      isVerified: true,
      openTime: '09:00 AM',
      closeTime: '10:00 PM'
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (ret: RetailerItem) => {
    setEditingRetailer(ret);
    setFormData({
      retailer: ret.retailer,
      owner: ret.owner,
      category: ret.category,
      phone: ret.phone || '+91 98290 12345',
      locality: ret.locality,
      city: ret.city,
      address: ret.address || '',
      gstin: ret.gstin || '08AABCS1429B1Z',
      commissionRate: ret.commissionRate || 12,
      status: ret.status,
      isVerified: ret.isVerified,
      openTime: ret.openTime || '09:00 AM',
      closeTime: ret.closeTime || '10:00 PM'
    });
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRetailer({
      retailer: formData.retailer,
      owner: formData.owner,
      category: formData.category,
      phone: formData.phone,
      locality: formData.locality,
      city: formData.city,
      address: formData.address,
      gstin: formData.gstin,
      commissionRate: Number(formData.commissionRate),
      status: formData.status,
      isVerified: formData.isVerified,
      openTime: formData.openTime,
      closeTime: formData.closeTime
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRetailer) return;
    await updateRetailer(editingRetailer.id, {
      retailer: formData.retailer,
      owner: formData.owner,
      category: formData.category,
      phone: formData.phone,
      locality: formData.locality,
      city: formData.city,
      address: formData.address,
      gstin: formData.gstin,
      commissionRate: Number(formData.commissionRate),
      status: formData.status,
      isVerified: formData.isVerified,
      openTime: formData.openTime,
      closeTime: formData.closeTime
    });
    setEditingRetailer(null);
    resetForm();
  };

  const handleConfirmDelete = async () => {
    if (deletingRetailer) {
      await deleteRetailer(deletingRetailer.id);
      setDeletingRetailer(null);
    }
  };

  const filteredRetailers = retailers.filter((r) => {
    const matchSearch =
      r.retailer.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase()) ||
      r.locality.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      selectedCategory === 'all' ||
      r.category.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      
      {/* Top Banner with High-Visibility "Add New Shop" Button */}
      <div className="p-4 rounded-2xl bg-[#14532D]/30 border border-[#1DB954]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-xl font-black font-['Outfit',sans-serif] text-white">
              Retailer & Merchant Shops Control
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#1DB954] text-black font-black text-[10px]">
              {retailers.length} Active Stores
            </span>
          </div>
          <p className="text-xs text-[#A7A7A7] mt-1">
            Complete store authority: Add new merchant, edit details, delete stores, approve KYC, and configure 12% commission.
          </p>
        </div>

        {/* PROMINENT ADD SHOP BUTTON */}
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-[#1DB954] hover:bg-[#39D353] active:bg-[#169C46] text-black font-black text-sm rounded-xl shadow-lg shadow-[#1DB954]/30 transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>+ Add New Shop</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-[#181818] border border-[#292929] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {['all', 'Hardware', 'Electrical', 'Grocery', 'Electronics', 'Mobile'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-[#14532D] text-white border border-[#1DB954]/50'
                  : 'text-[#A7A7A7] hover:text-white hover:bg-[#202020]'
              }`}
            >
              {cat === 'all' ? `All Shops (${retailers.length})` : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shop, owner, locality..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#292929] rounded-xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954]"
            />
          </div>

          <div className="flex items-center bg-[#121212] border border-[#292929] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer ${viewMode === 'table' ? 'bg-[#202020] text-[#1DB954]' : 'text-[#6F6F6F]'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs cursor-pointer ${viewMode === 'grid' ? 'bg-[#202020] text-[#1DB954]' : 'text-[#6F6F6F]'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-[#181818] border border-[#292929] rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            {filteredRetailers.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#A7A7A7]">
                <Store className="w-8 h-8 mx-auto text-[#6F6F6F] mb-2 opacity-50" />
                <p className="font-bold text-white text-sm">No merchant shops found in database</p>
                <p className="text-[11px] text-[#6F6F6F] mt-1">Click "+ Add New Shop" above to register your first store.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121212] text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
                  <tr>
                    <th className="py-3 px-4">Shop Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Owner & Phone</th>
                    <th className="py-3 px-4">Locality</th>
                    <th className="py-3 px-4">Orders</th>
                    <th className="py-3 px-4">Gross Revenue</th>
                    <th className="py-3 px-4">KYC Status</th>
                    <th className="py-3 px-4">Shop Status</th>
                    <th className="py-3 px-4 text-center bg-[#14532D]/20">Actions (Edit / Delete)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929] text-[11px]">
                  {filteredRetailers.map((r) => (
                    <tr key={r.id} className="hover:bg-[#202020] transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#14532D]/40 text-[#1DB954] flex items-center justify-center font-black text-xs flex-shrink-0">
                          {r.retailer.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white leading-none">{r.retailer}</p>
                          <p className="text-[10px] text-[#A7A7A7] mt-0.5">{r.openTime || '9 AM'} - {r.closeTime || '10 PM'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#A7A7A7]">{r.category}</td>
                      <td className="py-3 px-4">
                        <p className="text-white font-medium">{r.owner}</p>
                        <p className="text-[10px] text-[#6F6F6F]">{r.phone || '+91 98290 12345'}</p>
                      </td>
                      <td className="py-3 px-4 text-[#A7A7A7]">{r.locality}, {r.city}</td>
                      <td className="py-3 px-4 font-bold font-mono text-white">{r.orders}</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#1DB954]">{r.revenue}</td>
                      <td className="py-3 px-4">
                        {r.isVerified ? (
                          <span className="px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] font-extrabold text-[10px] flex items-center gap-1 w-fit border border-[#1DB954]/40">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => approveRetailerKYC(r.id)}
                            className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] hover:bg-[#F59E0B] hover:text-black font-extrabold text-[10px] transition-colors cursor-pointer border border-[#F59E0B]/40"
                          >
                            Approve KYC
                          </button>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleRetailerStatus(r.id)}
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold cursor-pointer transition-colors ${
                            r.status === 'Active'
                              ? 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40 hover:bg-[#EF4444]/20 hover:text-[#EF4444]'
                              : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#1DB954]/20 hover:text-[#1DB954]'
                          }`}
                          title="Click to toggle status"
                        >
                          {r.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center bg-[#14532D]/10">
                        {/* PROMINENT LABELED ACTION BUTTONS */}
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedRetailer(r)}
                            className="p-1.5 px-2 rounded-lg bg-[#202020] hover:bg-[#14532D] text-[#A7A7A7] hover:text-white border border-[#292929] text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3 text-[#1DB954]" />
                            <span>View</span>
                          </button>
                          
                          <button
                            onClick={() => handleOpenEdit(r)}
                            className="p-1.5 px-2.5 rounded-lg bg-[#3B82F6]/20 hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white border border-[#3B82F6]/40 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Edit Shop Information"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => setDeletingRetailer(r)}
                            className="p-1.5 px-2.5 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white border border-[#EF4444]/40 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Delete Shop Permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        filteredRetailers.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#A7A7A7] bg-[#181818] border border-[#292929] rounded-2xl">
            <Store className="w-8 h-8 mx-auto text-[#6F6F6F] mb-2 opacity-50" />
            <p className="font-bold text-white text-sm">No merchant shops found in database</p>
            <p className="text-[11px] text-[#6F6F6F] mt-1">Click "+ Add New Shop" above to register your first store.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRetailers.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#14532D]/60 text-[#1DB954] flex items-center justify-center font-bold text-base flex-shrink-0">
                        {r.retailer.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{r.retailer}</h3>
                        <p className="text-[11px] text-[#A7A7A7]">{r.category}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        r.status === 'Active' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="my-3 p-3 rounded-xl bg-[#121212] border border-[#292929] space-y-1 text-xs">
                    <p className="text-[#A7A7A7] flex items-center justify-between">
                      <span>Owner:</span>
                      <strong className="text-white">{r.owner}</strong>
                    </p>
                    <p className="text-[#A7A7A7] flex items-center justify-between">
                      <span>Locality:</span>
                      <strong className="text-white">{r.locality}, {r.city}</strong>
                    </p>
                    <p className="text-[#A7A7A7] flex items-center justify-between">
                      <span>Orders:</span>
                      <strong className="text-white font-mono">{r.orders}</strong>
                    </p>
                    <p className="text-[#A7A7A7] flex items-center justify-between">
                      <span>Revenue:</span>
                      <strong className="text-[#1DB954] font-mono">{r.revenue}</strong>
                    </p>
                  </div>
                </div>

                {/* Grid Card Action Buttons */}
                <div className="pt-2 border-t border-[#292929] flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedRetailer(r)}
                    className="flex-1 py-1.5 bg-[#202020] hover:bg-[#292929] text-white text-xs font-bold rounded-xl border border-[#292929] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#1DB954]" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="flex-1 py-1.5 bg-[#3B82F6]/20 hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white text-xs font-extrabold rounded-xl border border-[#3B82F6]/40 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingRetailer(r)}
                    className="p-1.5 px-3 bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white text-xs font-extrabold rounded-xl border border-[#EF4444]/40 flex items-center justify-center cursor-pointer transition-colors"
                    title="Delete Shop"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT RETAILER MODAL                                                 */}
      {/* ========================================================================= */}
      {(isAddModalOpen || editingRetailer) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-xl bg-[#181818] border border-[#292929] rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#1DB954]" />
                <h3 className="text-base font-bold text-white font-['Outfit',sans-serif]">
                  {isAddModalOpen ? 'Add New Retailer Shop' : `Edit ${editingRetailer?.retailer}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingRetailer(null);
                }}
                className="w-7 h-7 rounded-lg bg-[#202020] text-white flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleSaveAdd : handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Shop / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.retailer}
                    onChange={(e) => setFormData({ ...formData, retailer: e.target.value })}
                    placeholder="e.g. Royal Electricals & Hardware"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Business Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  >
                    <option>Hardware & Tools</option>
                    <option>Electrical & Lighting</option>
                    <option>Grocery & Essentials</option>
                    <option>Electronics</option>
                    <option>Mobile Accessories</option>
                    <option>Stationery & Office</option>
                    <option>Pharmacy & Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +91 98290 12345"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Locality / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    placeholder="e.g. Vaishali Nagar"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jaipur"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A7A7A7] mb-1 font-medium">Full Shop Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Shop 14, Main Market, Vaishali Nagar, Jaipur"
                  className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">GSTIN Number</label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    placeholder="e.g. 08AABCS1429B1Z"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">GETORA Commission Rate (%) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-[#1DB954] font-bold focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Opening Time</label>
                  <input
                    type="text"
                    value={formData.openTime}
                    onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div>
                  <label className="block text-[#A7A7A7] mb-1 font-medium">Closing Time</label>
                  <input
                    type="text"
                    value={formData.closeTime}
                    onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                    placeholder="10:00 PM"
                    className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="rounded bg-[#121212] border-[#292929] text-[#1DB954]"
                  />
                  <span className="text-white font-medium">KYC Verified</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'Active' : 'Suspended' })}
                    className="rounded bg-[#121212] border-[#292929] text-[#1DB954]"
                  />
                  <span className="text-white font-medium">Shop Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#292929] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingRetailer(null);
                  }}
                  className="px-4 py-2 bg-[#202020] text-white rounded-xl font-bold cursor-pointer hover:bg-[#292929]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold rounded-xl shadow-xs cursor-pointer"
                >
                  {isAddModalOpen ? 'Create & Add Shop' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {deletingRetailer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#181818] border border-[#EF4444]/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#EF4444]">
              <div className="w-10 h-10 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Retailer Shop?</h3>
                <p className="text-[11px] text-[#A7A7A7]">Permanent database removal</p>
              </div>
            </div>

            <p className="text-xs text-[#A7A7A7] leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">{deletingRetailer.retailer}</strong> owned by <strong className="text-white">{deletingRetailer.owner}</strong>? This will remove all their store settings and inventory listings from GETORA.
            </p>

            <div className="pt-3 border-t border-[#292929] flex items-center justify-end gap-2">
              <button
                onClick={() => setDeletingRetailer(null)}
                className="px-4 py-2 bg-[#202020] hover:bg-[#292929] text-white rounded-xl font-bold cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-[#EF4444] hover:bg-red-600 text-white font-extrabold rounded-xl shadow-xs cursor-pointer text-xs"
              >
                Yes, Delete Shop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW DETAILS DRAWER                                                       */}
      {/* ========================================================================= */}
      {selectedRetailer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-md bg-[#181818] border-l border-[#292929] h-full overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#14532D] text-[#1DB954] flex items-center justify-center font-bold text-lg">
                  {selectedRetailer.retailer.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedRetailer.retailer}</h3>
                  <p className="text-[11px] text-[#A7A7A7]">{selectedRetailer.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRetailer(null)}
                className="w-8 h-8 rounded-xl bg-[#202020] text-white flex items-center justify-center cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#121212] border border-[#292929]">
                <p className="text-[10px] text-[#A7A7A7]">Lifetime Orders</p>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{selectedRetailer.orders}</p>
              </div>
              <div className="p-3 rounded-xl bg-[#121212] border border-[#292929]">
                <p className="text-[10px] text-[#A7A7A7]">Gross Revenue</p>
                <p className="text-lg font-bold text-[#1DB954] font-mono mt-0.5">{selectedRetailer.revenue}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Owner & Contact</p>
              <p className="font-bold text-white">{selectedRetailer.owner}</p>
              <p className="text-[#A7A7A7] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>{selectedRetailer.phone || '+91 98290 12345'}</span>
              </p>
              <p className="text-[#A7A7A7] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{selectedRetailer.address || `${selectedRetailer.locality}, ${selectedRetailer.city}`}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Tax & Commission</p>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">GSTIN:</span>
                <span className="font-mono text-white font-bold">{selectedRetailer.gstin || '08AABCS1429B1Z'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">Commission Rate:</span>
                <span className="font-bold text-[#1DB954]">{selectedRetailer.commissionRate || 12}% per order</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">Store Status:</span>
                <span className={`font-bold ${selectedRetailer.status === 'Active' ? 'text-[#1DB954]' : 'text-[#EF4444]'}`}>
                  {selectedRetailer.status}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#292929] flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedRetailer(null);
                  handleOpenEdit(selectedRetailer);
                }}
                className="flex-1 py-2 bg-[#3B82F6]/20 hover:bg-[#3B82F6] text-[#3B82F6] hover:text-white font-bold text-xs rounded-xl border border-[#3B82F6]/40 cursor-pointer transition-colors"
              >
                Edit Shop Details
              </button>
              <button
                onClick={() => {
                  setSelectedRetailer(null);
                  setDeletingRetailer(selectedRetailer);
                }}
                className="py-2 px-4 bg-[#EF4444]/20 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-bold text-xs rounded-xl border border-[#EF4444]/40 cursor-pointer transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
