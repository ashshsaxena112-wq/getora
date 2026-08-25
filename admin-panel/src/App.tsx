import React, { useState, useEffect } from 'react';
import { AdminTab } from './types/admin';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { AdminDashboardHome } from './components/AdminDashboardHome';
import { AdminOrdersView } from './components/AdminOrdersView';
import { AdminRetailersView } from './components/AdminRetailersView';
import { AdminCatalogView } from './components/AdminCatalogView';
import { AdminLiveMapView } from './components/AdminLiveMapView';
import { AdminFinanceView } from './components/AdminFinanceView';
import {
  AdminCustomersView,
  AdminDeliveryView,
  AdminInventoryView,
  AdminCouponsView,
  AdminAuditLogsView,
  AdminSettingsView
} from './components/AdminOtherViews';
import { AdminAiDrawer } from './components/AdminAiDrawer';
import { Sparkles } from 'lucide-react';

const AdminPanelInner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search anything..."]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <AdminDashboardHome
            setActiveTab={setActiveTab}
            onSelectOrder={() => setActiveTab('orders')}
            onSelectRetailer={() => setActiveTab('retailers')}
          />
        );
      case 'orders':
      case 'orders-pending':
      case 'orders-active':
      case 'orders-completed':
      case 'orders-cancelled':
      case 'orders-refunds':
        return <AdminOrdersView filterStatus={activeTab.replace('orders-', '')} />;
      case 'retailers':
      case 'retailers-pending':
      case 'retailers-kyc':
      case 'retailers-settlements':
        return <AdminRetailersView />;
      case 'catalog':
      case 'catalog-categories':
      case 'catalog-brands':
      case 'catalog-variants':
      case 'catalog-upload':
        return <AdminCatalogView />;
      case 'inventory':
      case 'inventory-low':
      case 'inventory-out':
        return <AdminInventoryView />;
      case 'customers':
        return <AdminCustomersView />;
      case 'delivery-partners':
        return <AdminDeliveryView />;
      case 'zones':
        return <AdminLiveMapView />;
      case 'finance':
      case 'finance-transactions':
      case 'finance-revenue':
      case 'finance-retailer-settlement':
      case 'finance-delivery-settlement':
      case 'finance-refunds':
        return <AdminFinanceView />;
      case 'coupons':
      case 'marketing':
        return <AdminCouponsView />;
      case 'security':
        return <AdminAuditLogsView />;
      case 'settings':
      case 'admin-users':
        return <AdminSettingsView />;
      case 'support':
      case 'reviews':
      case 'analytics':
      case 'alerts':
      case 'reports':
      default:
        return (
          <AdminDashboardHome
            setActiveTab={setActiveTab}
            onSelectOrder={() => setActiveTab('orders')}
            onSelectRetailer={() => setActiveTab('retailers')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex font-['Inter',sans-serif]">
      {/* 1. Left Fixed Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        openAiAssistant={() => setIsAiDrawerOpen(true)}
      />

      {/* Backdrop overlay on mobile */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/80 backdrop-blur-xs md:hidden"
        />
      )}

      {/* 2. Main Scrollable Viewport */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen min-w-0 bg-[#0B0B0B]">
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </main>
      </div>

      {/* 3. Floating AI Assistant Drawer */}
      <AdminAiDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
      />

      {/* Floating Bottom-Right AI Assistant Trigger Button */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#1DB954] hover:bg-[#39D353] text-black font-extrabold shadow-2xl shadow-[#1DB954]/50 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
        title="Open GETORA AI Intelligence"
      >
        <Sparkles className="w-5 h-5 fill-current" />
      </button>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AdminProvider>
      <AdminPanelInner />
    </AdminProvider>
  );
};

export default App;
