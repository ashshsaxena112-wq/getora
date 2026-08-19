import React from 'react';
import { IconHome, IconLayoutGrid, IconShoppingBag, IconClock, IconUser } from '@tabler/icons-react';
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
        <IconHome size={20} stroke={1.8} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'categories' ? 'active' : ''}`}
        onClick={() => navigate('categories')}
      >
        <IconLayoutGrid size={20} stroke={1.8} />
        <span>Categories</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'cart' ? 'active' : ''}`}
        onClick={() => navigate('cart')}
      >
        <IconShoppingBag size={20} stroke={1.8} />
        <span>Cart</span>
        {totalCartItems > 0 && <span className="mobile-badge">{totalCartItems}</span>}
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'orders' ? 'active' : ''}`}
        onClick={() => navigate('orders')}
      >
        <IconClock size={20} stroke={1.8} />
        <span>Orders</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'account' ? 'active' : ''}`}
        onClick={() => navigate('account')}
      >
        <IconUser size={20} stroke={1.8} />
        <span>Account</span>
      </button>
    </nav>
  );
};
