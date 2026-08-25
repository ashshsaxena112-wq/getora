import React from 'react';
import { Download, DollarSign, CreditCard } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminFinanceView: React.FC = () => {
  const { financeSettlements, kpiData } = useAdmin();

  const pendingPayouts = financeSettlements
    .filter((f) => f.status === 'Pending')
    .reduce((sum, f) => {
      const numeric = Number(f.netPayable.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + numeric;
    }, 0);

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Financial Operations & Settlements</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#14532D] text-[#1DB954] text-xs font-bold font-mono">
              {financeSettlements.length} Settlements Live
            </span>
          </div>
          <p className="text-xs text-[#A7A7A7] mt-1">
            Gross platform volume, 12% GETORA commission, merchant payouts, and instant refunds.
          </p>
        </div>

        <button className="px-3 py-2 bg-[#181818] hover:bg-[#202020] border border-[#292929] rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
          <Download className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>Export Supabase Ledger CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Gross Platform Sales</p>
          <p className="text-2xl font-black text-white font-['Outfit',sans-serif] mt-1">{kpiData.todayRevenue.value}</p>
          <span className="text-[10px] text-[#A7A7A7] mt-1 block">Live order volume</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Net GETORA Commission (12%)</p>
          <p className="text-2xl font-black text-[#1DB954] font-['Outfit',sans-serif] mt-1">{kpiData.getoraCommission.value}</p>
          <span className="text-[10px] text-[#39D353] font-semibold mt-1 block">Realized platform revenue</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Retailer Payouts Pending</p>
          <p className="text-2xl font-black text-[#F59E0B] font-['Outfit',sans-serif] mt-1">₹{pendingPayouts.toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-[#A7A7A7] mt-1 block">Awaiting bank settlement</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#181818] border border-[#292929]">
          <p className="text-xs text-[#A7A7A7]">Processed UPI Refunds</p>
          <p className="text-2xl font-black text-[#3B82F6] font-['Outfit',sans-serif] mt-1">₹0</p>
          <span className="text-[10px] text-[#A7A7A7] mt-1 block">0 active refund claims</span>
        </div>
      </div>

      <div className="bg-[#181818] border border-[#292929] rounded-2xl overflow-hidden shadow-lg p-4">
        <h3 className="text-sm font-bold text-white font-['Outfit',sans-serif] mb-3">Live Merchant Payout Batches (Supabase)</h3>
        <div className="overflow-x-auto">
          {financeSettlements.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#A7A7A7]">
              <CreditCard className="w-8 h-8 mx-auto text-[#6F6F6F] mb-2 opacity-50" />
              <p className="font-bold text-white text-sm">No settlement batches recorded</p>
              <p className="text-[11px] text-[#6F6F6F] mt-1">Settlement batches are automatically computed upon order completion.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
                <tr>
                  <th className="pb-2">Settlement Ref</th>
                  <th className="pb-2">Merchant Store</th>
                  <th className="pb-2">Gross Sales</th>
                  <th className="pb-2">Commission Deducted</th>
                  <th className="pb-2">Net Payable</th>
                  <th className="pb-2">UTR / Mode</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292929] text-[11px]">
                {financeSettlements.map((b) => (
                  <tr key={b.id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-2.5 font-bold font-mono text-white">{b.settlementRef}</td>
                    <td className="py-2.5 font-medium text-white">{b.entityName}</td>
                    <td className="py-2.5 font-mono text-white">{b.grossSales}</td>
                    <td className="py-2.5 text-[#A7A7A7] font-mono">{b.commissionDeducted}</td>
                    <td className="py-2.5 font-bold text-[#1DB954] font-mono">{b.netPayable}</td>
                    <td className="py-2.5 text-[#A7A7A7] font-mono">{b.utrNumber || b.payoutMode}</td>
                    <td className="py-2.5 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Paid' ? 'bg-[#1DB954]/20 text-[#1DB954]' : 'bg-[#F59E0B]/20 text-[#F59E0B]'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
