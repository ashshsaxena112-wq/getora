import React from 'react';
import {
  Bike
} from 'lucide-react';
import { AUDIT_LOGS_MOCK } from '../data/adminMockData';

// 1. CUSTOMERS VIEW
export const AdminCustomersView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Customer Profiles</h2>
        <p className="text-xs text-[#A7A7A7]">3,218 registered buyers with spending history, address book, and repeat frequency</p>
      </div>
    </div>
    <div className="bg-[#181818] border border-[#292929] rounded-2xl p-4 overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
          <tr>
            <th className="pb-2">Customer Name</th>
            <th className="pb-2">Contact</th>
            <th className="pb-2">Locality</th>
            <th className="pb-2">Total Orders</th>
            <th className="pb-2">Total Spent</th>
            <th className="pb-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#292929] text-[11px]">
          {[
            { name: 'Rahul Sharma', phone: '+91 98290 12345', loc: 'Vaishali Nagar, Jaipur', orders: 14, spent: '₹18,420', status: 'Active' },
            { name: 'Priya Verma', phone: '+91 97841 55678', loc: 'Malviya Nagar, Jaipur', orders: 22, spent: '₹34,890', status: 'Active' },
            { name: 'Amit Kumar', phone: '+91 96102 33490', loc: 'Mansarovar, Jaipur', orders: 8, spent: '₹12,650', status: 'Active' },
            { name: 'Neha Singh', phone: '+91 98280 66723', loc: 'Jagatpura, Jaipur', orders: 19, spent: '₹28,110', status: 'Active' }
          ].map((c, i) => (
            <tr key={i} className="hover:bg-[#202020] transition-colors">
              <td className="py-2.5 font-bold text-white">{c.name}</td>
              <td className="py-2.5 text-[#A7A7A7]">{c.phone}</td>
              <td className="py-2.5 text-[#A7A7A7]">{c.loc}</td>
              <td className="py-2.5 font-bold font-mono text-white">{c.orders}</td>
              <td className="py-2.5 font-bold font-mono text-[#1DB954]">{c.spent}</td>
              <td className="py-2.5 text-right">
                <span className="px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold">
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// 2. DELIVERY FLEET VIEW
export const AdminDeliveryView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Delivery Partners & Fleet</h2>
        <p className="text-xs text-[#A7A7A7]">178 active riders across Jaipur with live vehicle assignments and rating</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {[
        { name: 'Vikram Gurjar', phone: '+91 94140 88231', vehicle: 'Hero Splendor (RJ-14-EA-4412)', status: 'On Delivery', deliveries: 342, rating: 4.9 },
        { name: 'Sunil Kumar', phone: '+91 99281 44512', vehicle: 'Ather 450X EV (RJ-14-EB-1082)', status: 'Going to Pickup', deliveries: 289, rating: 4.8 },
        { name: 'Manish Saini', phone: '+91 93510 77123', vehicle: 'TVS iQube (RJ-14-EC-7721)', status: 'Available (Idle)', deliveries: 410, rating: 4.95 }
      ].map((d, i) => (
        <div key={i} className="p-4 rounded-2xl bg-[#181818] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#14532D] text-[#1DB954] flex items-center justify-center font-bold">
                <Bike className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">{d.name}</p>
                <p className="text-[10px] text-[#A7A7A7]">{d.phone}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold">
              {d.status}
            </span>
          </div>
          <p className="text-[11px] text-[#A7A7A7]">{d.vehicle}</p>
          <div className="pt-2 border-t border-[#292929] flex items-center justify-between text-[11px]">
            <span>Total Deliveries: <strong className="text-white">{d.deliveries}</strong></span>
            <span className="text-[#F59E0B] font-bold">★ {d.rating}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 3. INVENTORY VIEW
export const AdminInventoryView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Inventory & Low Stock Center</h2>
        <p className="text-xs text-[#A7A7A7]">Automated low-stock threshold monitoring (&le; 5 units) across merchant stores</p>
      </div>
    </div>
    <div className="bg-[#181818] border border-[#292929] rounded-2xl p-4 overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
          <tr>
            <th className="pb-2">Product Name</th>
            <th className="pb-2">Merchant Store</th>
            <th className="pb-2">Current Stock</th>
            <th className="pb-2">Min Threshold</th>
            <th className="pb-2">Selling Price</th>
            <th className="pb-2 text-right">Status Alert</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#292929] text-[11px]">
          {[
            { name: 'Stanley 13mm Impact Drill Bit Set', store: 'Sharma Hardware', stock: 2, min: 5, price: '₹650', alert: 'Critical Low' },
            { name: 'Havells 10W B22 LED Cool Day Light (Pack 4)', store: 'Gupta Electricals', stock: 3, min: 8, price: '₹720', alert: 'Low Stock' },
            { name: 'boAt 65W GaN Fast Dual Charger', store: 'Mobile Hub', stock: 0, min: 5, price: '₹1,499', alert: 'Out of Stock' }
          ].map((inv, i) => (
            <tr key={i} className="hover:bg-[#202020] transition-colors">
              <td className="py-2.5 font-bold text-white">{inv.name}</td>
              <td className="py-2.5 text-[#A7A7A7]">{inv.store}</td>
              <td className="py-2.5 font-mono font-bold text-[#EF4444]">{inv.stock} units</td>
              <td className="py-2.5 font-mono text-[#A7A7A7]">{inv.min} units</td>
              <td className="py-2.5 font-mono font-bold text-white">{inv.price}</td>
              <td className="py-2.5 text-right">
                <span className="px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] text-[10px] font-extrabold">
                  {inv.alert}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// 4. COUPONS & OFFERS VIEW
export const AdminCouponsView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Coupons & Promotional Discounts</h2>
        <p className="text-xs text-[#A7A7A7]">Manage customer promo codes, discount budgets, and acquisition campaigns</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {[
        { code: 'GETORA10', discount: 'Flat 10% OFF (Max ₹100)', minOrder: 'Min ₹299', used: '1,420 uses', active: true },
        { code: 'FREEDEL', discount: 'Free Delivery', minOrder: 'Min ₹199', used: '3,890 uses', active: true },
        { code: 'WELCOME50', discount: 'Flat ₹50 OFF', minOrder: 'Min ₹399', used: '812 uses', active: true }
      ].map((c, i) => (
        <div key={i} className="p-4 rounded-2xl bg-[#181818] border border-[#292929] space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-xl bg-[#14532D] text-[#1DB954] font-black font-mono text-sm tracking-wider">
              {c.code}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-bold">Active</span>
          </div>
          <p className="text-xs font-bold text-white">{c.discount}</p>
          <p className="text-[10px] text-[#A7A7A7]">{c.minOrder} &bull; {c.used}</p>
        </div>
      ))}
    </div>
  </div>
);

// 5. AUDIT LOGS VIEW
export const AdminAuditLogsView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Security & Audit Trail</h2>
        <p className="text-xs text-[#A7A7A7]">Immutable log of sensitive admin operations, payouts, and commission updates</p>
      </div>
    </div>
    <div className="bg-[#181818] border border-[#292929] rounded-2xl p-4 overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
          <tr>
            <th className="pb-2">Admin User</th>
            <th className="pb-2">Action Performed</th>
            <th className="pb-2">Entity ID</th>
            <th className="pb-2">Audit Details</th>
            <th className="pb-2">IP Address</th>
            <th className="pb-2 text-right">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#292929] text-[11px]">
          {AUDIT_LOGS_MOCK.map((log) => (
            <tr key={log.id} className="hover:bg-[#202020] transition-colors">
              <td className="py-2.5 font-bold text-white">{log.adminName}</td>
              <td className="py-2.5 text-[#1DB954] font-semibold">{log.action}</td>
              <td className="py-2.5 font-mono text-[#A7A7A7]">{log.entityId}</td>
              <td className="py-2.5 text-[#A7A7A7] max-w-xs truncate">{log.details}</td>
              <td className="py-2.5 font-mono text-[#6F6F6F]">{log.ipAddress}</td>
              <td className="py-2.5 text-right text-[#A7A7A7]">{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// 6. PLATFORM SETTINGS VIEW
export const AdminSettingsView: React.FC = () => (
  <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn max-w-3xl">
    <div>
      <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Platform Operating Settings</h2>
      <p className="text-xs text-[#A7A7A7]">Fee thresholds, delivery commission, and business contact information</p>
    </div>
    <div className="p-5 rounded-2xl bg-[#181818] border border-[#292929] space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#A7A7A7] mb-1 font-semibold">Standard Platform Commission (%)</label>
          <input type="number" defaultValue={12} className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white font-mono font-bold" />
        </div>
        <div>
          <label className="block text-[#A7A7A7] mb-1 font-semibold">Free Delivery Threshold (₹)</label>
          <input type="number" defaultValue={499} className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white font-mono font-bold" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#A7A7A7] mb-1 font-semibold">Base Delivery Fee (₹)</label>
          <input type="number" defaultValue={30} className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white font-mono font-bold" />
        </div>
        <div>
          <label className="block text-[#A7A7A7] mb-1 font-semibold">Per-KM Additional Rate (₹)</label>
          <input type="number" defaultValue={10} className="w-full px-3 py-2 bg-[#121212] border border-[#292929] rounded-xl text-white font-mono font-bold" />
        </div>
      </div>
      <button className="px-4 py-2 bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold rounded-xl cursor-pointer">
        Save Settings
      </button>
    </div>
  </div>
);
