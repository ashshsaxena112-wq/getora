import React from 'react';
import { Home, Grid, ShoppingBag, Clock, User } from 'lucide-react';
import { useGetora } from '../context/GetoraContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigate, cart } = useGetora();

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => navigate('home')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'categories' ? 'active' : ''}`}
        onClick={() => navigate('categories')}
      >
        <Grid size={20} />
        <span>Categories</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'cart' ? 'active' : ''}`}
        onClick={() => navigate('cart')}
      >
        <ShoppingBag size={20} />
        <span>Cart</span>
        {totalCartItems > 0 && <span className="mobile-badge">{totalCartItems}</span>}
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'orders' ? 'active' : ''}`}
        onClick={() => navigate('orders')}
      >
        <Clock size={20} />
        <span>Orders</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'account' ? 'active' : ''}`}
        onClick={() => navigate('account')}
      >
        <User size={20} />
        <span>Account</span>
      </button>
    </nav>
  );
};
