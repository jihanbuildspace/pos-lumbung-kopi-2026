import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Receipt, Package, Users, BarChart3, Clock, Coffee, Sparkles, Settings } from 'lucide-react';

export type TabKey = 'pos' | 'transaksi' | 'stok' | 'shift' | 'shift_saya' | 'produk' | 'laporan' | 'pengaturan';

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { profile } = useAuth();
  const peran = profile?.peran || 'kasir';

  interface NavItem {
    key: TabKey;
    label: string;
    icon: React.ReactNode;
    roles: ('kasir' | 'kepala_toko' | 'owner')[];
  }

  const navItems: NavItem[] = [
    {
      key: 'pos',
      label: 'Kasir',
      icon: <ShoppingCart size={18} />,
      roles: ['kasir'],
    },
    {
      key: 'shift_saya',
      label: 'Shift Saya',
      icon: <Clock size={18} />,
      roles: ['kasir'],
    },
    {
      key: 'transaksi',
      label: 'Transaksi',
      icon: <Receipt size={18} />,
      roles: ['kasir', 'kepala_toko', 'owner'],
    },
    {
      key: 'stok',
      label: 'Stok Cabang',
      icon: <Package size={18} />,
      roles: ['kepala_toko', 'owner'],
    },
    {
      key: 'shift',
      label: 'Shift Cabang',
      icon: <Users size={18} />,
      roles: ['kepala_toko', 'owner'],
    },
    {
      key: 'produk',
      label: 'Katalog Produk',
      icon: <Coffee size={18} />,
      roles: ['kepala_toko', 'owner'],
    },
    {
      key: 'laporan',
      label: 'Laporan',
      icon: <BarChart3 size={18} />,
      roles: ['kepala_toko', 'owner'],
    },
    {
      key: 'pengaturan',
      label: 'Pengaturan & Audit',
      icon: <Settings size={18} />,
      roles: ['owner'],
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(peran));

  return (
    <aside style={{
      width: '210px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 12px',
      gap: '4px',
      flexShrink: 0,
    }}>
      <div style={{
        padding: '0 8px 10px 8px',
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
      }}>
        Menu Navigasi
      </div>

      {visibleItems.map((item) => {
        const isActive = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onTabChange(item.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? '#ffffff' : '#475569',
              backgroundColor: isActive ? '#78350f' : 'transparent',
              transition: 'all 0.15s ease',
              textAlign: 'left',
              width: '100%',
              boxShadow: isActive ? '0 2px 8px rgba(120, 53, 15, 0.22)' : 'none',
            }}
            onMouseOver={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseOut={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ color: isActive ? '#ffffff' : '#64748b' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Sleek Minimalist Footer */}
      <div style={{
        marginTop: 'auto',
        padding: '12px 10px 6px 10px',
        borderTop: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 0 2px #d1fae5',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>
            Sistem Terhubung
          </span>
        </div>
        <div style={{ fontSize: '10px', color: '#94a3b8', paddingLeft: '12px' }}>
          Lumbung POS • v2.6.0
        </div>
      </div>
    </aside>
  );
};
