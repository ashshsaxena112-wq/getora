import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Building,
  RotateCcw,
  CheckCircle2,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

export const AdminFinanceView: React.FC = () => {
  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Financial Operations & Settlements</h2>
          <p className="text-xs text-[#A7A7A7]">Gross volume, platform commission, merchant payouts, and instant refunds</p>
        </div>

        <button className="px-3 py-2 bg-[#181818] hover:bg-[#202020] border border-[#292929] rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
          <Download className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>Download Financial Ledger</span>
        </button>
      </div>

      {/* Finance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Gross Platform Sales</p>
          <p className="text-2xl font-black text-white font-['Outfit',sans-serif] mt-1">₹48,92,450</p>
          <span className="text-[10px] text-[#39D353] font-semibold mt-1 block">↑ 18.4% month-over-month</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Net GETORA Commission (12%)</p>
          <p className="text-2xl font-black text-[#1DB954] font-['Outfit',sans-serif] mt-1">₹5,87,094</p>
          <span className="text-[10px] text-[#39D353] font-semibold mt-1 block">Realized platform revenue</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Retailer Payouts Pending</p>
          <p className="text-2xl font-black text-[#F59E0B] font-['Outfit',sans-serif] mt-1">₹1,42,800</p>
          <span className="text-[10px] text-[#A7A7A7] mt-1 block">Next batch: Tomorrow 10:00 AM</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Processed Refunds</p>
          <p className="text-2xl font-black text-[#3B82F6] font-['Outfit',sans-serif] mt-1">₹18,450</p>
          <span className="text-[10px] text-[#A7A7A7] mt-1 block">0.37% refund rate (Healthy)</span>
        </div>
      </div>

      {/* Payout Batches Table */}
      <div className="bg-[#181818] border border-[#292929] rounded-2xl overflow-hidden shadow-lg p-4">
        <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif] mb-3">Recent Merchant Payout Batches</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
              <tr>
                <th className="pb-2">Batch ID</th>
                <th className="pb-2">Merchant Retailer</th>
                <th className="pb-2">Bank & Account</th>
                <th className="pb-2">Net Payable</th>
                <th className="pb-2">Commission Deducted</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-[11px]">
              {[
                { id: 'PAY-8821', store: 'Sharma Hardware', bank: 'HDFC Bank •••• 4012', amount: '₹1,13,036', comm: '₹15,414', status: 'Completed' },
                { id: 'PAY-8820', store: 'Gupta Electricals', bank: 'ICICI Bank •••• 9821', amount: '₹86,909', comm: '₹11,851', status: 'Completed' },
                { id: 'PAY-8819', store: 'Mobile Hub', bank: 'SBI Bank •••• 1184', amount: '₹67,356', comm: '₹9,184', status: 'Processing' },
                { id: 'PAY-8818', store: 'Stationery Point', bank: 'Axis Bank •••• 3042', amount: '₹39,785', comm: '₹5,425', status: 'Completed' }
              ].map((b) => (
                <tr key={b.id} className="hover:bg-[#202020] transition-colors">
                  <td className="py-2.5 font-bold font-mono text-white">{b.id}</td>
                  <td className="py-2.5 font-medium text-white">{b.store}</td>
                  <td className="py-2.5 text-[#A7A7A7] font-mono">{b.bank}</td>
                  <td className="py-2.5 font-bold text-[#1DB954] font-mono">{b.amount}</td>
                  <td className="py-2.5 text-[#A7A7A7] font-mono">{b.comm}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Completed' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
