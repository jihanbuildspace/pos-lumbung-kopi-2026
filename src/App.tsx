import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { POSProvider, usePOS } from './context/POSContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import type { TabKey } from './components/common/Sidebar';
import { POSView } from './components/pos/POSView';
import { ShiftModal } from './components/pos/ShiftModal';
import { TransaksiView } from './components/transaksi/TransaksiView';
import { StokView } from './components/stok/StokView';
import { ShiftManagementView } from './components/shift/ShiftManagementView';
import { ProdukView } from './components/produk/ProdukView';
import { LaporanView } from './components/laporan/LaporanView';
import { PengaturanView } from './components/pengaturan/PengaturanView';
import { ReceiptModal } from './components/common/ReceiptModal';
import { CustomerDisplayView } from './components/pos/CustomerDisplayView';
import { Coffee } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { profile, loading } = useAuth();
  const { showReceipt, setShowReceipt, lastTransaksi } = usePOS();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabKey>('pos');

  // Shift Modal State
  const [showShiftModal, setShowShiftModal] = useState<boolean>(false);
  const [shiftModalMode, setShiftModalMode] = useState<'buka' | 'tutup'>('buka');

  // Receipt Modal State for manual viewing from Transaksi
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  // Default redirect per PRD Section 7
  useEffect(() => {
    if (profile) {
      if (profile.peran === 'kasir') {
        setActiveTab('pos');
      } else if (profile.peran === 'kepala_toko') {
        setActiveTab('transaksi');
      } else if (profile.peran === 'owner') {
        setActiveTab('laporan');
      }
    }
  }, [profile?.peran, profile?.id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        gap: '16px',
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#78350f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 16px rgba(120, 53, 15, 0.25)',
          animation: 'pulse 1.5s infinite',
        }}>
          <Coffee size={28} />
        </div>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
          Menyiapkan Lumbung POS...
        </p>
      </div>
    );
  }

  if (!profile) {
    return <LoginPage />;
  }

  const handleOpenBukaShift = () => {
    setShiftModalMode('buka');
    setShowShiftModal(true);
  };

  const handleOpenTutupShift = () => {
    setShiftModalMode('tutup');
    setShowShiftModal(true);
  };

  const handleViewReceiptFromList = (trx: any) => {
    setSelectedReceipt(trx);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Application Bar */}
      <Header
        onOpenShiftModal={handleOpenBukaShift}
        onCloseShiftModal={handleOpenTutupShift}
      />

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f8fafc' }}>
          {activeTab === 'pos' && <POSView onOpenShiftModal={handleOpenBukaShift} />}
          {activeTab === 'transaksi' && <TransaksiView onViewReceipt={handleViewReceiptFromList} />}
          {activeTab === 'stok' && <StokView />}
          {activeTab === 'shift_saya' && profile.peran === 'kasir' && <ShiftManagementView />}
          {activeTab === 'shift' && (profile.peran === 'kepala_toko' || profile.peran === 'owner') && <ShiftManagementView />}
          {activeTab === 'produk' && <ProdukView />}
          {activeTab === 'laporan' && (profile.peran === 'kepala_toko' || profile.peran === 'owner') && <LaporanView />}
          {activeTab === 'pengaturan' && profile.peran === 'owner' && <PengaturanView />}
        </main>
      </div>

      {/* Shift Modal */}
      <ShiftModal
        mode={shiftModalMode}
        show={showShiftModal}
        onClose={() => setShowShiftModal(false)}
      />

      {/* Checkout Receipt Modal */}
      <ReceiptModal
        show={showReceipt}
        transaksi={lastTransaksi}
        onClose={() => setShowReceipt(false)}
      />

      {/* Historical Receipt Modal from Transaksi */}
      <ReceiptModal
        show={Boolean(selectedReceipt)}
        transaksi={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export function App() {
  const isCustomerDisplay = typeof window !== 'undefined' && (
    window.location.search.includes('mode=customer-display') ||
    window.location.hash.includes('customer-display')
  );

  if (isCustomerDisplay) {
    return <CustomerDisplayView />;
  }

  return (
    <AuthProvider>
      <POSProvider>
        <MainLayout />
      </POSProvider>
    </AuthProvider>
  );
}

export default App;
