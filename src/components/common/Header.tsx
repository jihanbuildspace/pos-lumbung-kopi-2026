import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePOS } from '../../context/POSContext';
import { Coffee, MapPin, Clock, LogOut, ChevronDown, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenShiftModal: () => void;
  onCloseShiftModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShiftModal, onCloseShiftModal }) => {
  const { profile, cabang, logout, allProfiles, loginAsDemoUser } = useAuth();
  const { activeShift } = usePOS();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleBadge = (peran?: string) => {
    switch (peran) {
      case 'owner':
        return { label: 'Owner', bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'kepala_toko':
        return { label: 'Kepala Toko', bg: '#e0e7ff', text: '#3730a3', border: '#c7d2fe' };
      case 'kasir':
      default:
        return { label: 'Kasir', bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' };
    }
  };

  const roleStyle = getRoleBadge(profile?.peran);

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Brand & Branch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#78350f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(120, 53, 15, 0.25)',
          }}>
            <Coffee size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
              Lumbung POS
            </h1>
            <p style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, letterSpacing: '0.5px' }}>
              KOPI DAN ROTI
            </p>
          </div>
        </div>

        {/* Branch Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          fontSize: '13px',
          fontWeight: 600,
          color: '#334155',
        }}>
          <MapPin size={15} color="#b45309" />
          <span>{cabang ? `${cabang.nama} (${cabang.kode})` : 'Semua Cabang (Pusat)'}</span>
        </div>
      </div>

      {/* Center/Shift Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {profile?.peran === 'kasir' && (
          activeShift ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#ecfdf5',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid #a7f3d0',
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 0 2px #d1fae5',
                display: 'inline-block',
              }} />
              <div style={{ fontSize: '12px', color: '#065f46', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} />
                <span>
                  Shift Aktif (sejak {new Date(activeShift.waktu_buka || activeShift.dibuka_pada as any).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })})
                </span>
              </div>
              <button
                onClick={onCloseShiftModal}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#b91c1c',
                  backgroundColor: '#fee2e2',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fecaca')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              >
                Tutup Shift
              </button>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#fffbeb',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid #fde68a',
            }}>
              <span style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                Shift Belum Dibuka
              </span>
              <button
                onClick={onOpenShiftModal}
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#ffffff',
                  backgroundColor: '#b45309',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(180, 83, 9, 0.3)',
                }}
              >
                Buka Shift Sekarang
              </button>
            </div>
          )
        )}
      </div>

      {/* User Info & Switcher */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            borderRadius: '10px',
            backgroundColor: showUserMenu ? '#f1f5f9' : 'transparent',
            transition: 'background 0.2s',
          }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            fontWeight: 700,
            fontSize: '13px',
          }}>
            {profile?.nama_lengkap?.substring(0, 2).toUpperCase() || <User size={16} />}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
              {profile?.nama_lengkap || 'Pengguna'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px',
                backgroundColor: roleStyle.bg,
                color: roleStyle.text,
                border: `1px solid ${roleStyle.border}`,
                textTransform: 'uppercase',
              }}>
                {roleStyle.label}
              </span>
            </div>
          </div>
          <ChevronDown size={14} color="#64748b" />
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div style={{
            position: 'absolute',
            right: 0,
            top: '50px',
            width: '260px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            padding: '8px',
            zIndex: 50,
          }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Login sebagai:</p>
              <p style={{ fontSize: '12px', color: '#1e293b', fontWeight: 700, wordBreak: 'break-all' }}>
                {profile?.email}
              </p>
            </div>

            {/* Quick Demo Switcher Section */}
            <div style={{ padding: '8px 4px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '11px', color: '#b45309', fontWeight: 700 }}>
                <ShieldCheck size={14} />
                <span>Ganti Akun Demo (Uji Role):</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '180px', overflowY: 'auto' }}>
                {allProfiles.filter(p => p.aktif).map((p) => (
                  <button
                    key={p.id}
                    onClick={async () => {
                      await loginAsDemoUser(p.id);
                      setShowUserMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      backgroundColor: p.id === profile?.id ? '#fef3c7' : 'transparent',
                      color: '#334155',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => {
                      if (p.id !== profile?.id) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      if (p.id !== profile?.id) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>{p.nama_lengkap}</span>
                      <span style={{ color: '#94a3b8', marginLeft: '4px' }}>({p.cabang?.kode || 'HQ'})</span>
                    </div>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      backgroundColor: p.peran === 'owner' ? '#fef3c7' : p.peran === 'kepala_toko' ? '#e0e7ff' : '#ecfdf5',
                      color: p.peran === 'owner' ? '#92400e' : p.peran === 'kepala_toko' ? '#3730a3' : '#065f46',
                    }}>
                      {p.peran}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false);
                logout();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '12px',
                fontWeight: 600,
                transition: 'background 0.2s',
                marginTop: '4px',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={14} />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
