import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { exportReportToExcel } from '../../lib/exportUtils';
import { askLumbungAI, getGeminiApiKey, saveGeminiApiKey, hasGeminiApiKey } from '../../lib/aiService';
import { SEED_TRANSAKSI, SEED_SHIFTS, SEED_HARGA_MODAL } from '../../lib/seedTransactions';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Ban,
  PieChart,
  BarChart2,
  AlertTriangle,
  ShieldAlert,
  Download,
  Printer,
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  Key,
  Settings
} from 'lucide-react';

export const LaporanView: React.FC = () => {
  const { profile, cabang, allCabang } = useAuth();
  const isOwner = profile?.peran === 'owner';

  const [transaksi, setTransaksi] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [modalPrices, setModalPrices] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCabangId, setSelectedCabangId] = useState<string>(
    isOwner ? 'semua' : profile?.cabang_id || ''
  );

  const userGreetingName = profile?.nama_lengkap || 'Owner';

  // AI Chat Drawer State
  const [showAIChat, setShowAIChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [showApiKeySetting, setShowApiKeySetting] = useState<boolean>(false);
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState<string>(getGeminiApiKey());
  const [isGeminiActive, setIsGeminiActive] = useState<boolean>(hasGeminiApiKey());

  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          sender: 'ai',
          text: `Halo ${userGreetingName}! Saya Lumbung AI, asisten konsultan bisnis Anda. Ada yang ingin dianalisis mengenai performa cabang, laba kotor, atau kejanggalan kasir hari ini?`,
        },
      ]);
    }
  }, [userGreetingName]);

  useEffect(() => {
    if (isOwner) {
      setSelectedCabangId('semua');
    } else if (profile?.cabang_id) {
      setSelectedCabangId(profile.cabang_id);
    }
  }, [profile?.id, isOwner]);

  useEffect(() => {
    fetchReportData();
  }, [selectedCabangId, profile?.id, isOwner]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let trxQuery = supabase
        .from('transaksi')
        .select(`
          *,
          cabang:cabang(*),
          kasir:profiles!transaksi_kasir_id_fkey(*),
          items:transaksi_item(*)
        `);

      if (!isOwner && profile?.cabang_id) {
        trxQuery = trxQuery.eq('cabang_id', profile.cabang_id);
      } else if (isOwner && selectedCabangId !== 'semua') {
        trxQuery = trxQuery.eq('cabang_id', selectedCabangId);
      }

      let shiftQuery = supabase
        .from('shift_kasir')
        .select(`
          *,
          cabang:cabang(*),
          kasir:profiles!shift_kasir_kasir_id_fkey(*)
        `)
        .order('dibuka_pada', { ascending: false });

      if (!isOwner && profile?.cabang_id) {
        shiftQuery = shiftQuery.eq('cabang_id', profile.cabang_id);
      } else if (isOwner && selectedCabangId !== 'semua') {
        shiftQuery = shiftQuery.eq('cabang_id', selectedCabangId);
      }

      const promises: Promise<any>[] = [trxQuery, shiftQuery];
      if (isOwner) {
        promises.push(
          supabase
            .from('riwayat_harga_modal')
            .select('produk_id, harga_modal, berlaku_mulai')
            .order('berlaku_mulai', { ascending: false })
        );
      }

      const results = await Promise.all(promises);
      const trxResult = results[0];
      const shiftResult = results[1];
      const modalResult = results[2];

      if (trxResult?.data && trxResult.data.length > 0) {
        setTransaksi(trxResult.data);
      } else {
        let fallbackTrx = SEED_TRANSAKSI;
        if (!isOwner && profile?.cabang_id) {
          fallbackTrx = fallbackTrx.filter((t) => t.cabang_id === profile.cabang_id);
        } else if (isOwner && selectedCabangId !== 'semua') {
          fallbackTrx = fallbackTrx.filter((t) => t.cabang_id === selectedCabangId);
        }
        setTransaksi(fallbackTrx);
      }

      if (shiftResult?.data && shiftResult.data.length > 0) {
        setShifts(shiftResult.data);
      } else {
        let fallbackShifts = SEED_SHIFTS;
        if (!isOwner && profile?.cabang_id) {
          fallbackShifts = fallbackShifts.filter((s) => s.cabang_id === profile.cabang_id);
        } else if (isOwner && selectedCabangId !== 'semua') {
          fallbackShifts = fallbackShifts.filter((s) => s.cabang_id === selectedCabangId);
        }
        setShifts(fallbackShifts);
      }

      if (isOwner) {
        const rawModal = (modalResult?.data && modalResult.data.length > 0) ? modalResult.data : SEED_HARGA_MODAL;
        const mMap = new Map<string, number>();
        rawModal.forEach((m: any) => {
          if (!mMap.has(m.produk_id)) {
            mMap.set(m.produk_id, m.harga_modal);
          }
        });
        setModalPrices(mMap);
      }
    } catch (err) {
      console.error('fetchReportData error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculations
  const lunasTrx = useMemo(() => transaksi.filter((t) => t.status === 'lunas'), [transaksi]);
  const voidTrx = useMemo(() => transaksi.filter((t) => t.status === 'void'), [transaksi]);

  const omzet = useMemo(() => lunasTrx.reduce((acc, t) => acc + (t.total || 0), 0), [lunasTrx]);
  const countLunas = lunasTrx.length;
  const avgTrx = countLunas > 0 ? Math.round(omzet / countLunas) : 0;
  const countVoid = voidTrx.length;

  const paymentStats = useMemo(() => {
    let tunaiTotal = 0;
    let qrisTotal = 0;
    lunasTrx.forEach((t) => {
      if (t.metode_bayar === 'tunai') tunaiTotal += t.total;
      else if (t.metode_bayar === 'qris') qrisTotal += t.total;
    });
    const totalAll = tunaiTotal + qrisTotal;
    const tunaiPct = totalAll > 0 ? Math.round((tunaiTotal / totalAll) * 100) : 0;
    const qrisPct = totalAll > 0 ? Math.round((qrisTotal / totalAll) * 100) : 0;
    return { tunaiTotal, qrisTotal, tunaiPct, qrisPct };
  }, [lunasTrx]);

  const topProducts = useMemo(() => {
    const prodMap = new Map<string, { nama: string; qty: number; omzet: number }>();
    lunasTrx.forEach((t) => {
      t.items?.forEach((it: any) => {
        const exist = prodMap.get(it.produk_id) || { nama: it.nama_produk, qty: 0, omzet: 0 };
        exist.qty += it.jumlah;
        exist.omzet += it.subtotal;
        prodMap.set(it.produk_id, exist);
      });
    });
    return Array.from(prodMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);
  }, [lunasTrx]);

  const profitStats = useMemo(() => {
    if (!isOwner) return { labaKotor: 0, margin: '0' };

    let totalHPP = 0;
    lunasTrx.forEach((t) => {
      t.items?.forEach((it: any) => {
        const modal = modalPrices.get(it.produk_id) || 0;
        totalHPP += modal * it.jumlah;
      });
    });

    const labaKotor = omzet - totalHPP;
    const margin = omzet > 0 ? ((labaKotor / omzet) * 100).toFixed(1) : '0';
    return { labaKotor, margin, totalHPP };
  }, [isOwner, lunasTrx, omzet, modalPrices]);

  const largeDiscrepancies = shifts.filter((s) => s.selisih !== null && Math.abs(s.selisih) > 20000);

  const activeBranchName = useMemo(() => {
    if (selectedCabangId === 'semua') return 'Semua Cabang (Konsolidasi)';
    const found = allCabang.find((c) => c.id === selectedCabangId);
    return found ? `${found.nama} (${found.kode})` : cabang?.nama || 'Cabang';
  }, [selectedCabangId, allCabang, cabang]);

  // Export Excel handler (Fitur Biasa)
  const handleExportExcel = () => {
    exportReportToExcel(lunasTrx, shifts, {
      omzet,
      countLunas,
      avgTrx,
      countVoid,
      labaKotor: profitStats.labaKotor,
      margin: profitStats.margin,
      isOwner,
      branchName: activeBranchName,
    });
  };

  // AI Ask Handler (Fitur AI 1)
  const handleSendAIQuestion = async (customQ?: string) => {
    const q = customQ || inputQuestion;
    if (!q || !q.trim() || aiThinking) return;

    const userMsg = q.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputQuestion('');
    setAiThinking(true);

    const aiReply = await askLumbungAI(userMsg, {
      omzet,
      countLunas,
      avgTrx,
      countVoid,
      labaKotor: profitStats.labaKotor,
      margin: profitStats.margin,
      largeDiscrepancies,
      topProducts,
      branchName: activeBranchName,
      userName: userGreetingName,
    });

    setAiThinking(false);
    setChatMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>
            Laporan &amp; Analitik Penjualan
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
            {isOwner
              ? 'Laporan konsolidasi seluruh cabang Lumbung Kopi dan Roti (WIB)'
              : `${cabang?.nama} • Laporan performa cabang Anda`}
          </p>
        </div>

        {/* Action Controls: Branch Filter, Excel Export, Print, and Ask AI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {isOwner && (
            <select
              value={selectedCabangId}
              onChange={(e) => setSelectedCabangId(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="semua">Semua Cabang (Konsolidasi)</option>
              {allCabang.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama} ({c.kode})
                </option>
              ))}
            </select>
          )}

          {/* Export Excel Button (Fitur Biasa) */}
          <button
            onClick={handleExportExcel}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Download size={15} />
            <span>Unduh Excel (.xlsx)</span>
          </button>

          {/* Print PDF Button */}
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <Printer size={15} />
            <span>Cetak PDF</span>
          </button>

          {/* Ask Lumbung AI Button (Fitur AI 1) */}
          {isOwner && (
            <button
              onClick={() => setShowAIChat(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: '#78350f',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                boxShadow: '0 3px 10px rgba(120, 53, 15, 0.3)',
              }}
            >
              <Sparkles size={15} color="#fde68a" />
              <span>Tanya Lumbung AI</span>
            </button>
          )}
        </div>
      </div>

      {/* AI EXECUTIVE SUMMARY BANNER (FITUR AI 1) */}
      {isOwner && (
        <div style={{
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
          borderRadius: '16px',
          padding: '18px 22px',
          color: '#ffffff',
          boxShadow: '0 8px 20px -4px rgba(69, 26, 3, 0.25)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Bot size={22} color="#fde68a" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Lumbung AI Executive Digest
                </span>
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  Data Real-time
                </span>
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.5, marginTop: '6px', color: '#f8fafc' }}>
                {activeBranchName} mencatatkan omzet <strong>Rp{omzet.toLocaleString('id-ID')}</strong> dengan marjin laba sehat <strong>{profitStats.margin}%</strong>.
                {topProducts[0] ? ` Menu terlaris adalah ${topProducts[0].nama} (${topProducts[0].qty} pcs).` : ''}
                {largeDiscrepancies.length > 0
                  ? ` ⚠️ Terdeteksi ${largeDiscrepancies.length} shift kasir dengan selisih kas > Rp20.000 yang perlu evaluasi.`
                  : ' Seluruh rekonsiliasi kas kasir terpantau tertib.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAIChat(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#78350f',
              fontSize: '12px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            Buka Chat AI &rarr;
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
      }}>
        {/* Omzet */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '18px 20px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Total Omzet (Lunas)</span>
            <DollarSign size={18} color="#b45309" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginTop: '8px' }}>
            Rp{omzet.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '11px', color: '#059669', marginTop: '4px', fontWeight: 600 }}>
            {countLunas} Transaksi Lunas
          </div>
        </div>

        {/* Jumlah Transaksi */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '18px 20px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Volume Transaksi</span>
            <ShoppingBag size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginTop: '8px' }}>
            {countLunas}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Struk Penjualan Terbit
          </div>
        </div>

        {/* Rata-rata per Transaksi */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '18px 20px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Rata-rata Transaksi</span>
            <TrendingUp size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginTop: '8px' }}>
            Rp{avgTrx.toLocaleString('id-ID')}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Rata-rata Nilai Keranjang
          </div>
        </div>

        {/* Transaksi Void */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '18px 20px',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b' }}>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>Transaksi Void</span>
            <Ban size={18} color="#dc2626" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: countVoid > 0 ? '#dc2626' : '#1e293b', marginTop: '8px' }}>
            {countVoid}
          </div>
          <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontWeight: 600 }}>
            Dibatalkan dengan Otorisasi
          </div>
        </div>
      </div>

      {/* EXCLUSIVE OWNER SECTION: GROSS PROFIT & MARGIN (BR-11) */}
      {isOwner && (
        <div style={{
          backgroundColor: '#fef3c7',
          borderRadius: '14px',
          border: '1px solid #fde68a',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="#92400e" />
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rahasia Owner: Laba Kotor &amp; Margin Penjualan (BR-11)
            </h4>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Laba Kotor (Gross Profit)</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>
                Rp{profitStats.labaKotor.toLocaleString('id-ID')}
              </div>
              <span style={{ fontSize: '10px', color: '#92400e' }}>Omzet dikurangi Modal HPP</span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Margin Laba Kotor</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                {profitStats.margin}%
              </div>
              <span style={{ fontSize: '10px', color: '#059669' }}>Persentase Margin Usaha</span>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Beban Modal (HPP)</span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#475569', marginTop: '4px' }}>
                Rp{(profitStats.totalHPP || 0).toLocaleString('id-ID')}
              </div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Berdasarkan riwayat modal</span>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Payment Composition */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <PieChart size={18} color="#b45309" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              Komposisi Metode Pembayaran
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span>Tunai ({paymentStats.tunaiPct}%)</span>
                <span>Rp{paymentStats.tunaiTotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${paymentStats.tunaiPct}%`, height: '100%', backgroundColor: '#059669' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                <span>QRIS ({paymentStats.qrisPct}%)</span>
                <span>Rp{paymentStats.qrisTotal.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: `${paymentStats.qrisPct}%`, height: '100%', backgroundColor: '#3b82f6' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Selling Products */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BarChart2 size={18} color="#b45309" />
            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>
              10 Produk Terlaris (Qty Terjual)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {topProducts.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#475569' }}>
                    {idx + 1}
                  </span>
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>{p.nama}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 700, color: '#b45309' }}>{p.qty} terjual</span>
                  <span style={{ color: '#64748b', fontSize: '11px' }}>Rp{p.omzet.toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discrepancies Alert Table */}
      {largeDiscrepancies.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #fca5a5',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 18px',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#991b1b',
          }}>
            <AlertTriangle size={18} />
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>
              Peringatan Audit: Selisih Kas Shift &gt; Rp20.000 ({largeDiscrepancies.length} Kejadian)
            </h4>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fff5f5', borderBottom: '1px solid #fca5a5', color: '#991b1b', fontSize: '11px' }}>
                <th style={{ padding: '10px 16px' }}>Waktu Buka</th>
                <th style={{ padding: '10px 16px' }}>Kasir</th>
                <th style={{ padding: '10px 16px' }}>Cabang</th>
                <th style={{ padding: '10px 16px' }}>Kas Seharusnya</th>
                <th style={{ padding: '10px 16px' }}>Uang Fisik</th>
                <th style={{ padding: '10px 16px' }}>Selisih</th>
                <th style={{ padding: '10px 16px' }}>Catatan Kasir</th>
              </tr>
            </thead>
            <tbody>
              {largeDiscrepancies.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>
                    {new Date(s.dibuka_pada).toLocaleDateString('id-ID')}
                  </td>
                  <td style={{ padding: '10px 16px' }}>{s.kasir?.nama_lengkap}</td>
                  <td style={{ padding: '10px 16px' }}>{s.cabang?.kode}</td>
                  <td style={{ padding: '10px 16px' }}>Rp{s.kas_seharusnya?.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '10px 16px' }}>Rp{s.uang_fisik?.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '10px 16px', fontWeight: 700, color: '#dc2626' }}>
                    {s.selisih > 0 ? '+' : ''}Rp{s.selisih?.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '10px 16px', fontStyle: 'italic', color: '#475569' }}>
                    "{s.catatan_tutup || '-'}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL / DRAWER CHAT "ASK LUMBUNG AI" (FITUR AI 1) */}
      {showAIChat && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '16px',
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '620px',
            height: '640px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
          }}>
            {/* Header Chat */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#451a03',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#78350f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fde68a',
                }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Ask Lumbung AI</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <p style={{ fontSize: '11px', color: '#fde68a' }}>Konsultan Bisnis &amp; Audit Toko ({activeBranchName})</p>
                    <button
                      onClick={() => setShowApiKeySetting(!showApiKeySetting)}
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: isGeminiActive ? '#10b981' : '#f59e0b',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Klik untuk mengatur Gemini API Key"
                    >
                      <span>{isGeminiActive ? '● Gemini 1.5 Flash' : '⚙️ Atur API Key'}</span>
                    </button>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowAIChat(false)} style={{ color: '#cbd5e1', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Collapsible Gemini API Key Settings Drawer */}
            {showApiKeySetting && (
              <div style={{
                padding: '12px 18px',
                backgroundColor: '#fffbeb',
                borderBottom: '1px solid #fde68a',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
                    Google Gemini API Key (Untuk Analisa AI Real-Time):
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11px', color: '#b45309', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    Dapatkan API Key Gratis ↗
                  </a>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Masukkan Gemini API Key (contoh: AIzaSy...)"
                    value={geminiApiKeyInput}
                    onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                  />
                  <button
                    onClick={() => {
                      saveGeminiApiKey(geminiApiKeyInput);
                      setIsGeminiActive(hasGeminiApiKey());
                      setShowApiKeySetting(false);
                      alert(geminiApiKeyInput.trim() ? '✅ Gemini API Key berhasil disimpan & diaktifkan!' : 'Gemini API Key dihapus, sistem beralih ke mode cerdas bawaan.');
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      backgroundColor: '#78350f',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Simpan
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#78350f', margin: 0 }}>
                  Kunci API ini disimpan aman di browser Anda dan langsung aktif tanpa perlu deploy ulang.
                </p>
              </div>
            )}

            {/* Quick Prompt Pills */}
            <div style={{
              padding: '10px 16px',
              backgroundColor: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
            }}>
              {[
                { label: '📊 Laba & Margin Toko', prompt: 'Analisis Laba & Margin Toko' },
                { label: '⚠️ Cek Selisih Kasir', prompt: 'Cek Selisih Kas & Kasir' },
                { label: '🎯 Ide Promo Penjualan', prompt: 'Saran Promo Penjualan' },
              ].map((qp, i) => (
                <button
                  key={i}
                  disabled={aiThinking}
                  onClick={() => handleSendAIQuestion(qp.prompt)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '9999px',
                    backgroundColor: aiThinking ? '#f1f5f9' : '#ffffff',
                    border: '1px solid #cbd5e1',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: aiThinking ? '#94a3b8' : '#334155',
                    whiteSpace: 'nowrap',
                    cursor: aiThinking ? 'not-allowed' : 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Chat Messages List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#f8fafc',
            }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    backgroundColor: msg.sender === 'user' ? '#78350f' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              ))}

              {aiThinking && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <Sparkles size={14} className="animate-spin" />
                  <span>Lumbung AI sedang menganalisis data toko...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '8px',
            }}>
              <input
                type="text"
                placeholder={aiThinking ? "Lumbung AI sedang menganalisis data toko..." : "Tanyakan analisis penjualan, estimasi laba, atau kasir..."}
                disabled={aiThinking}
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !aiThinking) handleSendAIQuestion();
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: aiThinking ? '#f8fafc' : '#ffffff',
                  color: aiThinking ? '#94a3b8' : '#1e293b',
                  cursor: aiThinking ? 'not-allowed' : 'text',
                }}
              />
              <button
                disabled={aiThinking || !inputQuestion.trim()}
                onClick={() => handleSendAIQuestion()}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#78350f',
                  color: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: aiThinking || !inputQuestion.trim() ? 'not-allowed' : 'pointer',
                  opacity: aiThinking || !inputQuestion.trim() ? 0.5 : 1,
                }}
              >
                <Send size={15} />
                <span>Kirim</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
