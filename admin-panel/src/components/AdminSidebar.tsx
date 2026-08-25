import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Store,
  Package,
  Boxes,
  Users,
  Bike,
  MapPin,
  CircleDollarSign,
  Ticket,
  Megaphone,
  Headphones,
  Star,
  BarChart3,
  FileText,
  UserCog,
  Settings,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Headset
} from 'lucide-react';
import { AdminTab } from '../types/admin';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  openAiAssistant: () => void;
}

interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  subItems?: { id: AdminTab; label: string }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  openAiAssistant
}) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    orders: false,
    retailers: false,
    catalog: false,
    finance: false
  });

  const toggleMenu = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <ClipboardList className="w-4 h-4" />,
      badge: 27,
      subItems: [
        { id: 'orders', label: 'All Orders' },
        { id: 'orders-pending', label: 'Pending' },
        { id: 'orders-active', label: 'Active' },
        { id: 'orders-completed', label: 'Completed' },
        { id: 'orders-cancelled', label: 'Cancelled' },
        { id: 'orders-refunds', label: 'Refunds' }
      ]
    },
    {
      id: 'retailers',
      label: 'Retailers',
      icon: <Store className="w-4 h-4" />,
      badge: 12,
      subItems: [
        { id: 'retailers', label: 'All Retailers' },
        { id: 'retailers-pending', label: 'Pending Approval' },
        { id: 'retailers-kyc', label: 'KYC Verification' },
        { id: 'retailers-settlements', label: 'Settlements' }
      ]
    },
    {
      id: 'catalog',
      label: 'Products',
      icon: <Package className="w-4 h-4" />,
      subItems: [
        { id: 'catalog', label: 'Central Catalog' },
        { id: 'catalog-categories', label: 'Categories' },
        { id: 'catalog-brands', label: 'Brands' },
        { id: 'catalog-variants', label: 'Variants' },
        { id: 'catalog-upload', label: 'Bulk Upload' }
      ]
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Boxes className="w-4 h-4" />,
      subItems: [
        { id: 'inventory', label: 'Stock Levels' },
        { id: 'inventory-low', label: 'Low Stock (<5)' },
        { id: 'inventory-out', label: 'Out of Stock' }
      ]
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: 'delivery-partners',
      label: 'Delivery Partners',
      icon: <Bike className="w-4 h-4" />,
      badge: 178
    },
    {
      id: 'zones',
      label: 'Zones & Areas',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <CircleDollarSign className="w-4 h-4" />,
      subItems: [
        { id: 'finance', label: 'Transactions' },
        { id: 'finance-revenue', label: 'Revenue Overview' },
        { id: 'finance-retailer-settlement', label: 'Retailer Settlement' },
        { id: 'finance-delivery-settlement', label: 'Delivery Settlement' },
        { id: 'finance-refunds', label: 'Refunds Ledger' }
      ]
    },
    {
      id: 'coupons',
      label: 'Coupons & Offers',
      icon: <Ticket className="w-4 h-4" />
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: <Megaphone className="w-4 h-4" />
    },
    {
      id: 'support',
      label: 'Support / Tickets',
      icon: <Headphones className="w-4 h-4" />,
      badge: 4
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: <Star className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'admin-users',
      label: 'Admin Users',
      icon: <UserCog className="w-4 h-4" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    },
    {
      id: 'security',
      label: 'Audit Logs',
      icon: <ShieldCheck className="w-4 h-4" />
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 w-60 bg-[#0B0B0B] border-r border-[#292929] flex flex-col justify-between transition-transform duration-200 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Top Header / Logo Section */}
      <div className="p-4 border-b border-[#292929]/80 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#121212] border border-[#292929] flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13c3.6 0 6.87-1.46 9.24-3.83l-3.2-3.2C20.35 23.66 18.28 24.6 16 24.6c-4.75 0-8.6-3.85-8.6-8.6s3.85-8.6 8.6-8.6c2.28 0 4.35.94 6.04 2.63l3.2-3.2C22.87 4.46 19.6 3 16 3z"
              fill="#1DB954"
            />
            <path
              d="M16 11.6v4.4h8.8c.13-.71.2-1.45.2-2.2 0-1.22-.21-2.39-.6-3.48l-4.2 1.28H16z"
              fill="#39D353"
            />
            <circle cx="16" cy="16" r="3.2" fill="#FFFFFF" />
          </svg>
        </div>

        <div>
          <span className="text-base font-black tracking-tight text-[#FFFFFF] font-['Outfit',sans-serif]">
            GETORA
          </span>
          <span className="text-[11px] text-[#A7A7A7] font-medium leading-none block mt-0.5">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Links (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive =
            activeTab === item.id ||
            (item.subItems && item.subItems.some((sub) => sub.id === activeTab));
          const isExpanded = expandedMenus[item.id] || false;

          return (
            <div key={item.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (item.subItems) {
                    setExpandedMenus((prev) => ({ ...prev, [item.id]: !prev[item.id] }));
                  }
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#14532D] text-[#FFFFFF] font-bold shadow-xs'
                    : 'text-[#A7A7A7] hover:text-[#FFFFFF] hover:bg-[#181818]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#1DB954]' : 'text-[#A7A7A7]'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                        isActive
                          ? 'bg-[#1DB954] text-black font-extrabold'
                          : 'bg-[#202020] text-[#A7A7A7] border border-[#292929]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.subItems && (
                    <span
                      onClick={(e) => toggleMenu(item.id, e)}
                      className="p-0.5 hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-[#6F6F6F]" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-[#6F6F6F]" />
                      )}
                    </span>
                  )}
                </div>
              </button>

              {/* Expandable Submenu */}
              {item.subItems && isExpanded && (
                <div className="pl-8 pr-2 py-1 space-y-1 border-l border-[#292929] ml-4 my-1 animate-fadeIn">
                  {item.subItems.map((sub) => {
                    const isSubActive = activeTab === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveTab(sub.id);
                          setIsMobileOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                          isSubActive
                            ? 'text-[#1DB954] font-bold bg-[#1DB954]/10'
                            : 'text-[#A7A7A7] hover:text-[#FFFFFF] hover:bg-[#181818]'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Help / AI Support Box */}
      <div className="p-3 border-t border-[#292929] bg-[#0B0B0B]">
        <div className="p-3 rounded-2xl bg-[#181818] border border-[#292929] flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1DB954]/15 flex items-center justify-center text-[#1DB954]">
              <Headset className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFFFFF] leading-none">Need Help?</p>
              <p className="text-[10px] text-[#6F6F6F] mt-0.5 leading-none">Contact support team</p>
            </div>
          </div>

          <button
            onClick={openAiAssistant}
            className="w-full py-2 bg-[#1DB954] hover:bg-[#39D353] active:bg-[#169C46] text-black font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Chat Now</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
