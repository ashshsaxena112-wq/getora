import React, { useState } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Percent,
  Store,
  Bike,
  Users,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  FileText,
  AlertTriangle,
  Info,
  Check,
  Plus,
  Minus,
  RotateCcw,
  Package
} from 'lucide-react';
import { AdminTab } from '../types/admin';
import { useAdmin } from '../context/AdminContext';

interface AdminDashboardHomeProps {
  setActiveTab: (tab: AdminTab) => void;
  onSelectOrder?: (orderId: string) => void;
  onSelectRetailer?: (retailerId: string) => void;
}

export const AdminDashboardHome: React.FC<AdminDashboardHomeProps> = ({
  setActiveTab,
  onSelectOrder,
  onSelectRetailer
}) => {
  const {
    kpiData,
    orderDistribution,
    orders,
    retailers,
    notifications,
    mapPins,
    overviewChart,
    openAddShopModal
  } = useAdmin();

  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [chartPeriod, setChartPeriod] = useState('Last 7 Days');
  const [mapZoom, setMapZoom] = useState(1);

  // SVG Chart calculation
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = Math.max(...overviewChart.map((d) => d.orders), 10);
  const points = overviewChart.map((d, index) => {
    const x = overviewChart.length > 1 ? (index / (overviewChart.length - 1)) * chartWidth : 0;
    const y = chartHeight - ((d.orders || 0) / maxVal) * (chartHeight * 0.8) - 10;
    return { x, y, ...d };
  });

  const svgPath = points.reduce((acc, p, i, a) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = a[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${svgPath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto animate-fadeIn font-['Inter',sans-serif] text-[#FFFFFF]">
      
      {/* ========================================================================= */}
      {/* ROW 1: 6 TOP KPI METRIC CARDS (GRID OF 6)                                 */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Total Orders */}
        <div
          onClick={() => setActiveTab('orders')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.totalOrders.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.totalOrders.trend}</span>
          </p>
        </div>

        {/* 2. Today's Revenue */}
        <div
          onClick={() => setActiveTab('finance' as any)}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Today's Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.todayRevenue.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.todayRevenue.trend}</span>
          </p>
        </div>

        {/* 3. GETORA Commission */}
        <div
          onClick={() => setActiveTab('finance')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">GETORA Commission</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.getoraCommission.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.getoraCommission.trend}</span>
          </p>
        </div>

        {/* 4. Active Retailers */}
        <div
          onClick={() => setActiveTab('retailers')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Active Retailers</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.activeRetailers.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.activeRetailers.trend}</span>
          </p>
        </div>

        {/* 5. Active Delivery Partners */}
        <div
          onClick={() => setActiveTab('delivery-partners')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Active Riders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.activeDeliveryPartners.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.activeDeliveryPartners.trend}</span>
          </p>
        </div>

        {/* 6. Active Customers */}
        <div
          onClick={() => setActiveTab('customers')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Registered Customers</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.activeCustomers.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#A7A7A7] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3 text-[#1DB954]" />
            <span>{kpiData.activeCustomers.trend}</span>
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 2: 3 ANALYTICAL WIDGETS (DONUT CHART, LINE CHART, LIVE MAP)           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Widget 1: Order Status Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Order Status Breakdown
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#222222" strokeWidth="14" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-white font-['Outfit',sans-serif] leading-none">
                  {orders.length}
                </span>
                <span className="text-[9px] text-[#A7A7A7] mt-0.5 uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Status Legend */}
            <div className="space-y-1.5 text-[11px] w-full max-w-[170px]">
              {orderDistribution.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#A7A7A7]">{item.label}</span>
                  </div>
                  <span className="font-semibold text-white font-mono text-[10px]">
                    {item.count} <span className="text-[#6F6F6F]">({item.percentage})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('orders')}
            className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors mt-3 pt-2 border-t border-[#292929]/80 cursor-pointer"
          >
            <span>View all orders</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Widget 2: Orders Overview Line Chart (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
                Orders Overview
              </h2>
            </div>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="bg-[#121212] border border-[#292929] rounded-lg px-2 py-1 text-[10px] text-[#A7A7A7] focus:outline-none focus:border-[#1DB954] cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative w-full h-44 my-auto pt-2">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-mono text-[#6F6F6F] pointer-events-none">
              <span>{maxVal}</span>
              <span>{Math.round(maxVal * 0.66)}</span>
              <span>{Math.round(maxVal * 0.33)}</span>
              <span>0</span>
            </div>

            <div className="ml-7 h-36 relative">
              <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="adminGreenAreaLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1DB954" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#1DB954" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#292929" strokeWidth="1" />
                <path d={areaPath} fill="url(#adminGreenAreaLive)" />
                <path d={svgPath} fill="none" stroke="#1DB954" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            <div className="ml-7 flex items-center justify-between text-[9px] font-mono text-[#6F6F6F] pt-1">
              {overviewChart.map((d, i) => (
                <span key={i}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 3: Live Orders Map (Jaipur Vector Map) (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Live Map Dispatch
            </h2>
            <button
              onClick={() => setActiveTab('zones')}
              className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>View full map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative w-full h-44 rounded-xl bg-[#101317] border border-[#292929] overflow-hidden flex items-center justify-center">
            <div className="text-center p-4">
              <Store className="w-6 h-6 text-[#A7A7A7] mx-auto mb-1 opacity-50" />
              <p className="text-xs text-[#A7A7A7] font-bold">Jaipur Live Dispatch Ready</p>
              <p className="text-[10px] text-[#6F6F6F] mt-0.5">Active delivery fleet and store nodes appear here in real-time</p>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* ROW 3: 6 STATUS MINI ACTION CARDS (GRID OF 6)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('orders-pending')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#F59E0B]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Pending Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {orderDistribution.find((d) => d.id === 'pending')?.count || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F59E0B]/15 flex items-center justify-center text-[#F59E0B] flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('orders-active')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#F97316]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Preparing</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {orderDistribution.find((d) => d.id === 'preparing')?.count || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#F97316]/15 flex items-center justify-center text-[#F97316] flex-shrink-0">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('orders-active')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#A855F7]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Out for Delivery</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {orderDistribution.find((d) => d.id === 'out_for_delivery')?.count || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#A855F7]/15 flex items-center justify-center text-[#A855F7] flex-shrink-0">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('orders-completed')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#1DB954]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {orderDistribution.find((d) => d.id === 'delivered')?.count || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('orders-cancelled')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#EF4444]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Cancelled</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {orderDistribution.find((d) => d.id === 'cancelled')?.count || 0}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#EF4444]/15 flex items-center justify-center text-[#EF4444] flex-shrink-0">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => setActiveTab('finance' as any)}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#3B82F6]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Refunds</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">0</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#3B82F6]/15 flex items-center justify-center text-[#3B82F6] flex-shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <span className="text-[10px] text-[#A7A7A7] hover:text-white mt-2 flex items-center gap-1 font-semibold">
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ROW 4: 2 LOWER PANELS (RECENT ORDERS, TOP RETAILERS)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Panel 1: Recent Orders Table (6 Cols) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Recent Orders
            </h2>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A7A7A7]">
                <ShoppingBag className="w-8 h-8 mx-auto text-[#6F6F6F] mb-2 opacity-50" />
                <p className="font-bold text-white">No orders yet</p>
                <p className="text-[11px] text-[#6F6F6F] mt-0.5">New customer orders will automatically appear here in real-time.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]/80">
                  <tr>
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Retailer</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929]/50 text-[11px]">
                  {orders.slice(0, 5).map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => {
                        if (onSelectOrder) onSelectOrder(o.id);
                        else setActiveTab('orders');
                      }}
                      className="hover:bg-[#202020] transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 font-bold font-mono text-[#A7A7A7]">{o.orderNumber}</td>
                      <td className="py-2.5 font-medium text-white truncate max-w-[90px]">{o.customer}</td>
                      <td className="py-2.5 text-[#A7A7A7] truncate max-w-[100px]">{o.retailer}</td>
                      <td className="py-2.5 font-bold text-white font-mono">{o.amount}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] font-extrabold"
                          style={{
                            backgroundColor: `${o.statusColor}22`,
                            color: o.statusColor,
                            border: `1px solid ${o.statusColor}44`
                          }}
                        >
                          {o.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Panel 2: Top Retailers Table (6 Cols) */}
        <div className="lg:col-span-6 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Registered Retailers
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={openAddShopModal}
                className="px-2.5 py-1 rounded bg-[#1DB954] hover:bg-[#39D353] text-black text-[10px] font-black cursor-pointer shadow-sm transition-transform active:scale-95"
              >
                + Add Shop
              </button>
              <button
                onClick={() => setActiveTab('retailers')}
                className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <span>All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {retailers.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#A7A7A7]">
                <Store className="w-8 h-8 mx-auto text-[#6F6F6F] mb-2 opacity-50" />
                <p className="font-bold text-white">No shops registered yet</p>
                <p className="text-[11px] text-[#6F6F6F] mt-0.5">Click "+ Add Shop" above to onboard your first neighborhood merchant.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] font-bold text-[#A7A7A7] uppercase tracking-wider border-b border-[#292929]/80">
                  <tr>
                    <th className="pb-2">Retailer</th>
                    <th className="pb-2 text-center">Orders</th>
                    <th className="pb-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#292929]/50 text-[11px]">
                  {retailers.slice(0, 5).map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => {
                        if (onSelectRetailer) onSelectRetailer(r.id);
                        else setActiveTab('retailers');
                      }}
                      className="hover:bg-[#202020] transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 font-medium text-white truncate max-w-[110px]">{r.retailer}</td>
                      <td className="py-2.5 text-center font-bold font-mono text-[#A7A7A7]">{r.orders}</td>
                      <td className="py-2.5 text-right font-bold text-white font-mono">{r.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
