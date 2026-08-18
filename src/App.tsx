import React from 'react';
import { GetoraProvider, useGetora } from './context/GetoraContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { MobileBottomNav } from './components/MobileBottomNav';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NearbyStoresPage } from './pages/NearbyStoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchPage } from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LiveTrackingPage } from './pages/LiveTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { RetailerDashboardPage } from './pages/RetailerDashboardPage';
import { SupportPage } from './pages/SupportPage';
import { OffersPage } from './pages/OffersPage';

const MainRouter: React.FC = () => {
  const { currentView } = useGetora();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'categories':
        return <CategoriesPage />;
      case 'stores':
        return <NearbyStoresPage />;
      case 'store':
        return <StoreDetailPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'search':
        return <SearchPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'track-order':
        return <LiveTrackingPage />;
      case 'orders':
        return <OrdersPage />;
      case 'account':
        return <AccountPage />;
      case 'retailer-dashboard':
        return <RetailerDashboardPage />;
      case 'offers':
        return <OffersPage />;
      case 'support':
        return <SupportPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      {/* Global Persistent Header */}
      <Header />

      {/* Main Routed Page Content */}
      <main className="main-content">{renderCurrentView()}</main>

      {/* Footer */}
      <Footer />

      {/* Modals & Portals */}
      <AuthModal />
      <LocationModal />
      <ToastContainer />
      <MobileBottomNav />
    </div>
  );
};

export function App() {
  return (
    <GetoraProvider>
      <MainRouter />
    </GetoraProvider>
  );
}

export default App;
