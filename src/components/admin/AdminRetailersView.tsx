import React, { useState } from 'react';
import {
  Store,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Eye,
  Plus,
  ShieldCheck,
  Package,
  Award
} from 'lucide-react';
import { TOP_RETAILERS_DATA } from '../../data/adminMockData';

export const AdminRetailersView: React.FC = () => {
  const [retailers, setRetailers] = useState(TOP_RETAILERS_DATA);
  const [search, setSearch] = useState('');
  const [selectedRetailer, setSelectedRetailer] = useState<any | null>(null);

  const toggleRetailerStatus = (id: string) => {
    setRetailers((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === 'Active' ? 'Suspended' : 'Active' } : r))
    );
  };

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Retailer & Store Network</h2>
          <p className="text-xs text-[#A7A7A7]">Manage verified local merchants, store catalogues, and KYC approvals</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search retailer, category, locality..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#181818] border border-[#292929] rounded-xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954]"
          />
        </div>
      </div>

      {/* Retailers Table */}
      <div className="bg-[#181818] border border-[#292929] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
              <tr>
                <th className="py-3 px-4">Shop Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Owner Name</th>
                <th className="py-3 px-4">Locality</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Revenue</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-[11px]">
              {retailers
                .filter(
                  (r) =>
                    r.retailer.toLowerCase().includes(search.toLowerCase()) ||
                    r.category.toLowerCase().includes(search.toLowerCase()) ||
                    r.locality.toLowerCase().includes(search.toLowerCase())
                )
                .map((r) => (
                  <tr key={r.id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#14532D]/40 text-[#1DB954] flex items-center justify-center font-black text-xs">
                        {r.retailer.charAt(0)}
                      </div>
                      <span>{r.retailer}</span>
                    </td>
                    <td className="py-3 px-4 text-[#A7A7A7]">{r.category}</td>
                    <td className="py-3 px-4 text-white font-medium">{r.owner}</td>
                    <td className="py-3 px-4 text-[#A7A7A7]">{r.locality}, {r.city}</td>
                    <td className="py-3 px-4 font-bold font-mono text-white">{r.orders}</td>
                    <td className="py-3 px-4 font-bold font-mono text-[#1DB954]">{r.revenue}</td>
                    <td className="py-3 px-4 font-mono text-[#A7A7A7]">{r.commissionEarned}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-bold text-[10px]">
                        ★ {r.rating}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          r.status === 'Active'
                            ? 'bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/40'
                            : 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedRetailer(r)}
                          className="p-1.5 rounded-lg bg-[#202020] hover:bg-[#14532D] text-white hover:text-[#1DB954] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleRetailerStatus(r.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            r.status === 'Active'
                              ? 'bg-[#202020] text-[#EF4444] hover:bg-[#EF4444]/20 border border-[#292929]'
                              : 'bg-[#1DB954] text-black font-extrabold'
                          }`}
                        >
                          {r.status === 'Active' ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Retailer Detail Drawer */}
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

            {/* Metrics */}
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

            {/* Owner & Address */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Owner & Contact</p>
              <p className="font-bold text-white">{selectedRetailer.owner}</p>
              <p className="text-[#A7A7A7] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#1DB954]" />
                <span>+91 98290 {Math.floor(10000 + Math.random() * 90000)}</span>
              </p>
              <p className="text-[#A7A7A7] flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{selectedRetailer.locality}, {selectedRetailer.city}, Rajasthan - 302021</span>
              </p>
            </div>

            {/* KYC & GST Details */}
            <div className="p-4 rounded-xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Tax & KYC Verification</p>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">GSTIN:</span>
                <span className="font-mono text-white font-bold">08AABCS1429B1Z</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">Commission Rate:</span>
                <span className="font-bold text-[#1DB954]">12% per fulfilled order</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#A7A7A7]">Bank Status:</span>
                <span className="text-[#1DB954] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified (HDFC Bank)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
