import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  MessageSquare,
  Calendar,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Settings,
  ExternalLink
} from 'lucide-react';
import { AdminTab, AdminNotification } from '../types/admin';
import { ALERTS_NOTIFICATIONS_DATA } from '../data/adminMockData';

interface AdminHeaderProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  toggleSidebar,
  searchQuery,
  setSearchQuery
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(ALERTS_NOTIFICATIONS_DATA);
  const [selectedDateRange, setSelectedDateRange] = useState('25 May 2026 - 25 May 2026');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard';
      case 'orders':
      case 'orders-pending':
      case 'orders-active':
      case 'orders-completed':
      case 'orders-cancelled':
      case 'orders-refunds':
        return 'Orders Management';
      case 'retailers':
      case 'retailers-pending':
      case 'retailers-kyc':
      case 'retailers-settlements':
        return 'Retailer & Store Network';
      case 'catalog':
      case 'catalog-categories':
      case 'catalog-brands':
      case 'catalog-variants':
      case 'catalog-upload':
        return 'Central Product Catalog';
      case 'inventory':
      case 'inventory-low':
      case 'inventory-out':
        return 'Inventory & Stock Monitor';
      case 'customers':
        return 'Customer Profiles';
      case 'delivery-partners':
        return 'Delivery Fleet & Riders';
      case 'zones':
        return 'Zones & Live Operational Map';
      case 'finance':
      case 'finance-transactions':
      case 'finance-revenue':
      case 'finance-retailer-settlement':
      case 'finance-delivery-settlement':
      case 'finance-refunds':
        return 'Financial Operations & Settlements';
      case 'coupons':
        return 'Coupons & Promotional Offers';
      case 'marketing':
        return 'Marketing & Push Notifications';
      case 'support':
        return 'Support & Dispute Resolution';
      case 'reviews':
        return 'Ratings & Review Moderation';
      case 'analytics':
        return 'Analytics & Search Demand';
      case 'reports':
        return 'Exportable Reports & CSVs';
      case 'admin-users':
        return 'Admin Users & Roles';
      case 'security':
        return 'Security & Audit Logs';
      case 'settings':
        return 'Platform Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-[#0B0B0B] border-b border-[#292929] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-['Inter',sans-serif]">
      {/* Left: Hamburger + Page Title */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-[#181818] hover:bg-[#202020] text-[#A7A7A7] hover:text-[#FFFFFF] border border-[#292929] transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#FFFFFF] font-['Outfit',sans-serif] tracking-tight">
          {getPageTitle(activeTab)}
        </h1>
      </div>

      {/* Right Actions: Global Search, Date Picker, Notifications, Messages, Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search */}
        <div className="relative hidden md:flex items-center w-52 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 text-[#6F6F6F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..."
            className="w-full pl-9 pr-14 py-2 bg-[#121212] border border-[#292929] rounded-xl text-xs text-[#FFFFFF] placeholder-[#6F6F6F] focus:outline-none focus:border-[#1DB954] transition-all"
          />
          <kbd className="absolute right-3 px-1.5 py-0.5 text-[9px] font-mono text-[#6F6F6F] bg-[#181818] border border-[#292929] rounded pointer-events-none">
            ⌘K
          </kbd>
        </div>

        {/* Date Selector Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181818] border border-[#292929] text-xs font-semibold text-[#FFFFFF] cursor-pointer hover:border-[#1DB954]/50 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-[#1DB954]" />
          <span>{selectedDateRange}</span>
          <ChevronDown className="w-3 h-3 text-[#6F6F6F]" />
        </div>

        {/* Notification Bell (Red 12 Badge) */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl bg-[#181818] hover:bg-[#202020] text-[#A7A7A7] hover:text-[#FFFFFF] border border-[#292929] transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 bg-[#EF4444] text-[#FFFFFF] text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
              12
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#181818] border border-[#292929] rounded-2xl shadow-2xl p-3 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-[#292929]">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white font-['Outfit',sans-serif]">
                    Alerts & Notifications
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-[#EF4444]/20 text-[#EF4444] rounded">
                    4 Unread
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('alerts' as any);
                    setIsNotifOpen(false);
                  }}
                  className="text-[10px] text-[#1DB954] hover:underline font-bold"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-[#292929] max-h-80 overflow-y-auto custom-scrollbar my-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.linkTab) setActiveTab(n.linkTab);
                      setIsNotifOpen(false);
                    }}
                    className="py-2.5 px-2 hover:bg-[#202020] rounded-xl cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'critical'
                          ? 'bg-[#EF4444]'
                          : n.type === 'warning'
                          ? 'bg-[#F59E0B]'
                          : n.type === 'info'
                          ? 'bg-[#3B82F6]'
                          : 'bg-[#1DB954]'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{n.title}</p>
                      <p className="text-[10px] text-[#A7A7A7] line-clamp-2 mt-0.5">{n.description}</p>
                      <span className="text-[9px] text-[#6F6F6F] mt-1 block">{n.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message / Support Bubble (Green 5 Badge) */}
        <button
          onClick={() => setActiveTab('support')}
          className="p-2 rounded-xl bg-[#181818] hover:bg-[#202020] text-[#A7A7A7] hover:text-[#FFFFFF] border border-[#292929] transition-colors relative cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 px-1 min-w-4 h-4 bg-[#1DB954] text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
            5
          </span>
        </button>

        {/* Profile / Admin Role Menu */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#181818] border border-transparent hover:border-[#292929] transition-all cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Super Admin"
                className="w-8 h-8 rounded-full object-cover border border-[#1DB954]/50"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#1DB954] border border-[#0B0B0B]" />
            </div>

            <div className="hidden sm:block text-left leading-none">
              <p className="text-xs font-bold text-[#FFFFFF] font-['Outfit',sans-serif]">Super Admin</p>
              <p className="text-[10px] text-[#A7A7A7] mt-0.5">Admin</p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#6F6F6F] hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#181818] border border-[#292929] rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn text-xs">
              <div className="px-3 py-2 border-b border-[#292929] mb-1">
                <p className="font-bold text-white">Super Admin</p>
                <p className="text-[10px] text-[#A7A7A7]">admin@getora.com</p>
                <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#1DB954]/20 text-[#1DB954] text-[9px] font-extrabold rounded">
                  Super Admin
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveTab('admin-users');
                  setIsProfileOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-[#202020] text-[#A7A7A7] hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setIsProfileOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-[#202020] text-[#A7A7A7] hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('security');
                  setIsProfileOpen(false);
                }}
                className="w-full px-3 py-2 rounded-xl text-left hover:bg-[#202020] text-[#A7A7A7] hover:text-white flex items-center gap-2 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Security & Audit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
