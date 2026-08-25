import React from 'react';
import { IconHome, IconLayoutGrid, IconClock, IconUser, IconShoppingBag } from '@tabler/icons-react';
import { useGetora } from '../context/GetoraContext';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigate, cart, orders } = useGetora();

  const totalCartItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'out_for_delivery' || o.status === 'preparing').length;

  return (
    <nav className="mobile-bottom-nav">
      <button
        className={`mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
        onClick={() => navigate('home')}
      >
        <IconHome size={21} stroke={1.8} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'categories' ? 'active' : ''}`}
        onClick={() => navigate('categories')}
      >
        <IconLayoutGrid size={21} stroke={1.8} />
        <span>Categories</span>
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'orders' ? 'active' : ''}`}
        onClick={() => navigate('orders')}
      >
        <IconClock size={21} stroke={1.8} />
        <span>Orders</span>
        {activeOrdersCount > 0 && <span className="mobile-badge">{activeOrdersCount}</span>}
      </button>

      <button
        className={`mobile-nav-item ${currentView === 'account' ? 'active' : ''}`}
        onClick={() => navigate('account')}
      >
        <IconUser size={21} stroke={1.8} />
        <span>Profile</span>
      </button>
    </nav>
  );
};
