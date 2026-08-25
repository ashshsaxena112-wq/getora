import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  ArrowUpDown,
  Download,
  Phone,
  MapPin,
  Store,
  User,
  RotateCcw,
  Bike
} from 'lucide-react';
import { RECENT_ORDERS_DATA } from '../../data/adminMockData';

interface AdminOrdersViewProps {
  filterStatus?: string;
}

export const AdminOrdersView: React.FC<AdminOrdersViewProps> = ({ filterStatus }) => {
  const [orders, setOrders] = useState(RECENT_ORDERS_DATA);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(filterStatus || 'all');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        search === '' ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.retailer.toLowerCase().includes(search.toLowerCase());

      if (activeTab === 'all') return matchSearch;
      if (activeTab === 'pending') return matchSearch && (o.status as string) === 'pending';
      if (activeTab === 'active') return matchSearch && ((o.status as string) === 'preparing' || (o.status as string) === 'out_for_delivery' || (o.status as string) === 'confirmed');
      if (activeTab === 'completed') return matchSearch && (o.status as string) === 'delivered';
      if (activeTab === 'cancelled') return matchSearch && (o.status as string) === 'cancelled';
      if (activeTab === 'refunds') return matchSearch && o.numericAmount < 1000;
      return matchSearch;
    });
  }, [orders, search, activeTab]);

  const updateOrderStatus = (orderId: string, newStatus: any, newLabel: string, newColor: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, statusLabel: newLabel, statusColor: newColor } : o
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev: any) => ({
        ...prev,
        status: newStatus,
        statusLabel: newLabel,
        statusColor: newColor
      }));
    }
  };

  return (
    <div className="space-y-4 font-['Inter',sans-serif] text-white animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-['Outfit',sans-serif]">Orders Management</h2>
          <p className="text-xs text-[#A7A7A7]">Live platform orders across all merchant shops in Jaipur</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-[#181818] hover:bg-[#202020] border border-[#292929] rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5 text-[#1DB954]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="p-3 bg-[#181818] border border-[#292929] rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending (27)' },
            { id: 'active', label: 'Active (518)' },
            { id: 'completed', label: 'Completed (598)' },
            { id: 'cancelled', label: 'Cancelled (31)' },
            { id: 'refunds', label: 'Refunds (17)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#14532D] text-white border border-[#1DB954]/50'
                  : 'text-[#A7A7A7] hover:text-white hover:bg-[#202020]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6F6F]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer, shop..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-[#292929] rounded-xl text-xs text-white placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954]"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-[#181818] border border-[#292929] rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121212] text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Merchant Retailer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Delivery Partner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292929] text-[11px]">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-4 font-bold font-mono text-white">{o.orderNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{o.customer}</p>
                    <p className="text-[10px] text-[#A7A7A7]">{o.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-[#A7A7A7] font-medium">{o.retailer}</td>
                  <td className="py-3 px-4 text-[#A7A7A7]">{o.itemsCount} items</td>
                  <td className="py-3 px-4 font-bold text-white font-mono">{o.amount}</td>
                  <td className="py-3 px-4 text-[#A7A7A7]">{o.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-white">
                      <Bike className="w-3.5 h-3.5 text-[#1DB954]" />
                      <span>{o.deliveryPartner}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2.5 py-1 rounded-md text-[10px] font-extrabold"
                      style={{
                        backgroundColor: `${o.statusColor}22`,
                        color: o.statusColor,
                        border: `1px solid ${o.statusColor}44`
                      }}
                    >
                      {o.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="px-2.5 py-1 rounded-lg bg-[#202020] hover:bg-[#14532D] text-white hover:text-[#1DB954] border border-[#292929] text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end animate-fadeIn">
          <div className="w-full max-w-lg bg-[#181818] border-l border-[#292929] h-full overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col justify-between">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#292929]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#1DB954] tracking-wider">
                    Order Details
                  </span>
                  <h3 className="text-xl font-bold font-mono text-white mt-0.5">
                    #{selectedOrder.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-xl bg-[#202020] hover:bg-[#292929] text-white flex items-center justify-center cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {/* Status Timeline */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#292929] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Live Tracking Timeline</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${selectedOrder.statusColor}22`,
                      color: selectedOrder.statusColor
                    }}
                  >
                    {selectedOrder.statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg bg-[#14532D]/40 text-[#1DB954] font-bold border border-[#1DB954]/40">
                    1. Placed ✓
                  </div>
                  <div className="p-2 rounded-lg bg-[#14532D]/40 text-[#1DB954] font-bold border border-[#1DB954]/40">
                    2. Preparing ✓
                  </div>
                  <div className="p-2 rounded-lg bg-[#202020] text-white font-bold border border-[#292929]">
                    3. On Delivery
                  </div>
                  <div className="p-2 rounded-lg bg-[#121212] text-[#6F6F6F]">
                    4. Delivered
                  </div>
                </div>
              </div>

              {/* Customer & Delivery Address */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Customer & Destination</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <User className="w-4 h-4 text-[#1DB954]" />
                  <span>{selectedOrder.customer} ({selectedOrder.phone})</span>
                </div>
                <div className="flex items-start gap-2 text-[#A7A7A7] text-[11px]">
                  <MapPin className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              {/* Retailer Info */}
              <div className="p-4 rounded-2xl bg-[#121212] border border-[#292929] space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Fulfilling Retailer</p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Store className="w-4 h-4 text-[#1DB954]" />
                  <span>{selectedOrder.retailer}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#A7A7A7]">Ordered Items</p>
                <div className="divide-y divide-[#292929] bg-[#121212] rounded-2xl border border-[#292929] p-3 text-xs">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-[#A7A7A7]">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <span className="font-bold text-white font-mono">₹{item.quantity * item.price}</span>
                    </div>
                  ))}
                  <div className="pt-3 mt-1 flex items-center justify-between font-bold text-white text-sm">
                    <span>Total Bill:</span>
                    <span className="text-[#1DB954] font-mono">{selectedOrder.amount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-[#292929] grid grid-cols-2 gap-2">
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'delivered', 'Delivered', '#1DB954')}
                className="py-2.5 bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Mark Delivered
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled', 'Cancelled', '#EF4444')}
                className="py-2.5 bg-[#202020] hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#292929] font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel / Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
