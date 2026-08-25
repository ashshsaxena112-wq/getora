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
  RotateCcw
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
    overviewChart
  } = useAdmin();

  const [selectedPin, setSelectedPin] = useState<any | null>(null);
  const [chartPeriod, setChartPeriod] = useState('Last 7 Days');
  const [mapZoom, setMapZoom] = useState(1);

  // SVG Chart calculation for smooth bezier curve
  const chartHeight = 160;
  const chartWidth = 500;
  const maxVal = 1500;
  const points = overviewChart.map((d, index) => {
    const x = (index / (overviewChart.length - 1)) * chartWidth;
    const y = chartHeight - (d.orders / maxVal) * chartHeight;
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
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>{kpiData.totalOrders.trend}</span>
          </p>
        </div>

        {/* 2. Today's Revenue */}
        <div
          onClick={() => setActiveTab('finance-revenue' as any)}
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
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
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
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
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
                {retailers.length > 0 ? retailers.length : kpiData.activeRetailers.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
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
              <p className="text-[11px] font-medium text-[#A7A7A7]">Active Delivery Partners</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.activeDeliveryPartners.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Bike className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
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
              <p className="text-[11px] font-medium text-[#A7A7A7]">Active Customers</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">
                {kpiData.activeCustomers.value}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#14532D]/60 flex items-center justify-center text-[#1DB954] flex-shrink-0">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-[#39D353] mt-2 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
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
              Order Status
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#121212" strokeWidth="14" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1DB954" strokeWidth="14" strokeDasharray="114 239" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#A855F7" strokeWidth="14" strokeDasharray="68 239" strokeDashoffset="-114" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F97316" strokeWidth="14" strokeDasharray="31 239" strokeDashoffset="-182" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="14" strokeDasharray="14 239" strokeDashoffset="-213" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="14" strokeDasharray="6 239" strokeDashoffset="-227" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#EF4444" strokeWidth="14" strokeDasharray="6 239" strokeDashoffset="-233" />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-black text-white font-['Outfit',sans-serif] leading-none">
                  1,248
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
                Orders Overview <span className="text-[10px] text-[#6F6F6F] font-normal">(Last 7 Days)</span>
              </h2>
            </div>
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              className="bg-[#121212] border border-[#292929] rounded-lg px-2 py-1 text-[10px] text-[#A7A7A7] focus:outline-none focus:border-[#1DB954] cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
            </select>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative w-full h-44 my-auto pt-2">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[9px] font-mono text-[#6F6F6F] pointer-events-none">
              <span>1,500</span>
              <span>1,200</span>
              <span>900</span>
              <span>600</span>
              <span>300</span>
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

                <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#292929" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight * 0.25} x2={chartWidth} y2={chartHeight * 0.25} stroke="#292929" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight * 0.5} x2={chartWidth} y2={chartHeight * 0.5} stroke="#292929" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight * 0.75} x2={chartWidth} y2={chartHeight * 0.75} stroke="#292929" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#292929" strokeWidth="1" />

                <path d={areaPath} fill="url(#adminGreenAreaLive)" />
                <path d={svgPath} fill="none" stroke="#1DB954" strokeWidth="2.5" strokeLinecap="round" />

                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={i === points.length - 1 ? "4" : "3"}
                    fill={i === points.length - 1 ? "#39D353" : "#1DB954"}
                    stroke="#0B0B0B"
                    strokeWidth="1.5"
                    className="hover:r-5 transition-all cursor-pointer"
                  >
                    <title>{`${p.date}: ${p.orders} orders`}</title>
                  </circle>
                ))}
              </svg>
            </div>

            <div className="ml-7 flex items-center justify-between text-[9px] font-mono text-[#6F6F6F] pt-1">
              {overviewChart.map((d) => (
                <span key={d.date}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Widget 3: Live Orders Map (Jaipur Vector Map) (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Live Orders Map
            </h2>
            <button
              onClick={() => setActiveTab('zones')}
              className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>View full map</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="relative w-full h-44 rounded-xl bg-[#101317] border border-[#292929] overflow-hidden">
            <svg className="w-full h-full opacity-40" viewBox="0 0 300 180">
              <path d="M 10 90 Q 80 40 160 90 T 290 80" fill="none" stroke="#2A3441" strokeWidth="2.5" />
              <path d="M 50 10 Q 120 80 180 170" fill="none" stroke="#2A3441" strokeWidth="2" />
              <path d="M 220 10 L 140 170" fill="none" stroke="#2A3441" strokeWidth="1.5" />
              <path d="M 10 140 L 290 120" fill="none" stroke="#2A3441" strokeWidth="1" />
              <circle cx="150" cy="85" r="45" fill="none" stroke="#1DB954" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
            </svg>

            <span className="absolute top-2 left-6 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Amer</span>
            <span className="absolute top-5 right-12 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Mansarovar</span>
            <span className="absolute top-8 right-4 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Malviya Nagar</span>
            <span className="absolute top-16 left-10 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Vaishali Nagar</span>
            <span className="absolute top-20 left-1/2 -translate-x-1/2 text-xs font-black text-white/90 tracking-widest font-['Outfit',sans-serif]">Jaipur</span>
            <span className="absolute bottom-6 left-1/2 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Tonk Road</span>
            <span className="absolute bottom-6 right-6 text-[8px] font-bold text-[#6B7280] uppercase tracking-wider">Jagatpura</span>

            {mapPins.map((pin) => (
              <div
                key={pin.id}
                onClick={() => setSelectedPin(pin)}
                style={{ left: pin.x, top: pin.y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-125"
                  style={{ backgroundColor: pin.color }}
                >
                  {pin.type === 'rider' && <Bike className="w-3 h-3 text-black stroke-[2.5]" />}
                  {pin.type === 'order' && <ShoppingBag className="w-3 h-3 text-white stroke-[2.5]" />}
                  {pin.type === 'shop' && <Store className="w-3 h-3 text-white stroke-[2.5]" />}
                </div>
                <span
                  className="absolute -inset-0.5 rounded-full animate-ping opacity-60 pointer-events-none"
                  style={{ backgroundColor: pin.color }}
                />
              </div>
            ))}

            {selectedPin && (
              <div className="absolute bottom-2 left-2 right-2 p-2 bg-[#181818]/95 border border-[#292929] rounded-lg text-[10px] backdrop-blur-xs flex items-center justify-between z-20 animate-fadeIn">
                <div>
                  <p className="font-bold text-white">{selectedPin.name}</p>
                  <p className="text-[#A7A7A7]">{selectedPin.status} {selectedPin.eta ? `• ETA ${selectedPin.eta}` : ''}</p>
                </div>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-xs text-[#6F6F6F] hover:text-white px-1.5 py-0.5"
                >
                  &times;
                </button>
              </div>
            )}

            <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
              <button
                onClick={() => setMapZoom((z) => Math.min(z + 0.2, 2))}
                className="w-5 h-5 rounded bg-[#181818]/90 border border-[#292929] flex items-center justify-center text-white text-xs hover:bg-[#202020] cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setMapZoom((z) => Math.max(z - 0.2, 0.8))}
                className="w-5 h-5 rounded bg-[#181818]/90 border border-[#292929] flex items-center justify-center text-white text-xs hover:bg-[#202020] cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
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
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">27</p>
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
              <p className="text-[11px] font-medium text-[#A7A7A7]">Preparing Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">162</p>
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
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">356</p>
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
              <p className="text-[11px] font-medium text-[#A7A7A7]">Delivered Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">598</p>
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
              <p className="text-[11px] font-medium text-[#A7A7A7]">Cancelled Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">31</p>
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
          onClick={() => setActiveTab('orders-refunds')}
          className="p-3.5 rounded-2xl bg-[#181818] border border-[#292929] hover:border-[#3B82F6]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium text-[#A7A7A7]">Refunds Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-white font-['Outfit',sans-serif] mt-1">17</p>
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
      {/* ROW 4: 3 DETAILED LOWER PANELS (RECENT ORDERS, TOP RETAILERS, ALERTS)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Panel 1: Recent Orders Table (5 Cols) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
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
          </div>
        </div>

        {/* Panel 2: Top Retailers Table (3 Cols) */}
        <div className="lg:col-span-3 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Top Retailers
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('retailers')}
                className="px-2 py-0.5 rounded bg-[#1DB954] hover:bg-[#39D353] text-black text-[10px] font-black cursor-pointer"
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
          </div>
        </div>

        {/* Panel 3: Alerts & Notifications Feed (4 Cols) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white font-['Outfit',sans-serif]">
              Alerts & Notifications
            </h2>
            <button
              onClick={() => setActiveTab('alerts' as any)}
              className="text-[11px] text-[#A7A7A7] hover:text-[#1DB954] flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((alert) => (
              <div
                key={alert.id}
                onClick={() => {
                  if (alert.linkTab) setActiveTab(alert.linkTab);
                }}
                className="p-2.5 rounded-xl bg-[#121212] border border-[#292929] hover:bg-[#202020] transition-colors cursor-pointer flex items-start gap-2.5"
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    alert.type === 'critical'
                      ? 'bg-[#EF4444]/15 text-[#EF4444]'
                      : alert.type === 'warning'
                      ? 'bg-[#F59E0B]/15 text-[#F59E0B]'
                      : alert.type === 'info'
                      ? 'bg-[#3B82F6]/15 text-[#3B82F6]'
                      : 'bg-[#1DB954]/15 text-[#1DB954]'
                  }`}
                >
                  {alert.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {alert.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {alert.type === 'info' && <Info className="w-3.5 h-3.5" />}
                  {alert.type === 'success' && <Check className="w-3.5 h-3.5" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white truncate">{alert.title}</p>
                    <span className="text-[9px] text-[#6F6F6F] flex-shrink-0">{alert.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-[#A7A7A7] line-clamp-1 mt-0.5">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
