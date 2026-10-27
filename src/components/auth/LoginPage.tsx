import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Coffee, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Store, 
  Bot, 
  CreditCard, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginAsDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Latihan#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Masukkan alamat email');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || 'Login gagal, periksa email dan password.');
    }
  };

  const handleQuickDemoClick = async (demoEmail: string) => {
    setSelectedDemoUser(demoEmail);
    setLoading(true);
    setErrorMsg('');
    await loginAsDemoUser(demoEmail);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#faf7f2',
      backgroundImage: `
        radial-gradient(circle at 15% 15%, rgba(245, 158, 11, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 85% 85%, rgba(217, 119, 6, 0.10) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(254, 243, 199, 0.40) 0%, transparent 65%)
      `,
      fontFamily: '"Plus Jakarta Sans", "Outfit", -apple-system, sans-serif',
    }}>
      {/* Keyframe Styles for Ambient Animation */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.4; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.98) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .hover-lift {
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(180, 83, 9, 0.12);
        }
        .hover-glow:hover {
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.35);
        }
      `}</style>

      {/* Dynamic Ambient Glow Orbs in Bright Warm Gold & Honey */}
      <div style={{
        position: 'absolute',
        top: '6%',
        left: '12%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'pulseGlow 8s infinite ease-in-out',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '8%',
        right: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
        filter: 'blur(70px)',
        animation: 'pulseGlow 10s infinite ease-in-out reverse',
        pointerEvents: 'none',
      }} />

      {/* Floating Coffee Sparkle Icon (Soft Warm Accent) */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '16%',
        animation: 'floatSlow 6s infinite ease-in-out',
        opacity: 0.3,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#d97706',
      }}>
        <Coffee size={42} />
      </div>

      {/* Main Bright Artisan Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '1020px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        backgroundColor: '#ffffff',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px -15px rgba(180, 83, 9, 0.14), 0 0 0 1px #fae8d2',
        zIndex: 10,
        position: 'relative',
        animation: 'fadeInScale 0.35s ease',
      }}>

        {/* Left Side: Bright Warm Artisan Brand Showcase */}
        <div style={{
          padding: '42px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(150deg, #fffdfa 0%, #fef7ee 45%, #ffedd5 100%)',
          borderRight: '1.5px solid #fed7aa',
        }}>
          {/* Subtle honey glow ornament */}
          <div style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div>
            {/* Live Status Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '24px',
              backgroundColor: '#ecfdf5',
              border: '1.5px solid #a7f3d0',
              fontSize: '11px',
              fontWeight: 800,
              color: '#065f46',
              letterSpacing: '0.6px',
              marginBottom: '22px',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)',
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
              }} />
              <span>SISTEM AKTIF • MULTI-CABANG 2026</span>
            </div>

            {/* Brand Logo & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: '1.5px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(180, 83, 9, 0.28)',
                flexShrink: 0,
              }}>
                <Coffee size={28} color="#ffffff" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '25px',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                  margin: 0,
                  color: '#29180c',
                }}>
                  Lumbung Kopi <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    dan Roti
                  </span>
                </h1>
              </div>
            </div>

            <p style={{
              fontSize: '11px',
              color: '#9a3412',
              fontWeight: 800,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '26px',
            }}>
              Modern Point of Sale &amp; Inventory Management
            </p>

            {/* 3 Value Pillars (Crisp Bright Cards) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Feature 1 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.05)',
              }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#b45309',
                  flexShrink: 0,
                }}>
                  <Store size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                    3 Cabang Terpadu
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    Tebet (TBT), Bintaro (BTR), dan Depok (DPK) dengan proteksi stok anti-minus real-time.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.05)',
              }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#d1fae5',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#059669',
                  flexShrink: 0,
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Lumbung AI Engine</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' }}>Gemini AI</span>
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    Prediksi cerdas kebutuhan restock stok &amp; asisten konsultasi bisnis Owner.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.88)',
                border: '1.5px solid #fed7aa',
                boxShadow: '0 4px 12px rgba(180, 83, 9, 0.05)',
              }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7',
                  flexShrink: 0,
                }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Dual Screen Customer Display</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px', backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' }}>0ms Sync</span>
                  </h4>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    Sinkronisasi instan layar kasir &amp; monitor pelanggan via BroadcastChannel API.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Footnote Badge */}
          <div style={{
            marginTop: '26px',
            padding: '10px 14px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#64748b',
            border: '1px solid #fed7aa',
            boxShadow: '0 2px 6px rgba(180, 83, 9, 0.04)',
          }}>
            <span style={{ fontWeight: 600 }}>Tahun Ajaran 2026 • Standar Tablet POS</span>
            <span style={{ color: '#b45309', fontWeight: 800, backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '6px' }}>v2.6.0 Live</span>
          </div>
        </div>

        {/* Right Side: Clean Bright Login Form & Instant Persona Cards */}
        <div style={{
          padding: '42px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b45309', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
              <Sparkles size={14} />
              <span>Portal Otoritas POS</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.5px', margin: 0 }}>
              Masuk ke Aplikasi
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Pilih akun uji coba cepat di bawah atau masukkan email kasir
            </p>
          </div>

          {errorMsg && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Switcher - 3 Gorgeous Persona Cards */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="#b45309" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>
                  Akses Cepat 1-Klik (Akun Uji):
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>Klik langsung login</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {/* Persona 1: Kasir */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemoClick('dimas.kasir.tebet@lumbung.test')}
                className="hover-lift"
                style={{
                  padding: '12px 10px',
                  backgroundColor: selectedDemoUser === 'dimas.kasir.tebet@lumbung.test' ? '#dcfce7' : '#f0fdf4',
                  border: '1.5px solid',
                  borderColor: selectedDemoUser === 'dimas.kasir.tebet@lumbung.test' ? '#16a34a' : '#bbf7d0',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#15803d', letterSpacing: '0.5px' }}>
                    KASIR TEBET
                  </span>
                  <span style={{ fontSize: '14px' }}>☕</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  Dimas Arya
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  Shift &amp; Transaksi
                </div>
              </button>

              {/* Persona 2: Kepala Toko */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemoClick('bayu.kt.tebet@lumbung.test')}
                className="hover-lift"
                style={{
                  padding: '12px 10px',
                  backgroundColor: selectedDemoUser === 'bayu.kt.tebet@lumbung.test' ? '#e0e7ff' : '#eef2ff',
                  border: '1.5px solid',
                  borderColor: selectedDemoUser === 'bayu.kt.tebet@lumbung.test' ? '#4f46e5' : '#c7d2fe',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(99, 102, 241, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#4338ca', letterSpacing: '0.5px' }}>
                    KEPALA TOKO
                  </span>
                  <span style={{ fontSize: '14px' }}>📋</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  Bayu Prasetyo
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  Audit, Stok, Void
                </div>
              </button>

              {/* Persona 3: Owner */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleQuickDemoClick('ratna.owner@lumbung.test')}
                className="hover-lift"
                style={{
                  padding: '12px 10px',
                  backgroundColor: selectedDemoUser === 'ratna.owner@lumbung.test' ? '#fef3c7' : '#fffbeb',
                  border: '1.5px solid',
                  borderColor: selectedDemoUser === 'ratna.owner@lumbung.test' ? '#d97706' : '#fde68a',
                  borderRadius: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(217, 119, 6, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', fontWeight: 900, color: '#b45309', letterSpacing: '0.5px' }}>
                    OWNER PUSAT
                  </span>
                  <span style={{ fontSize: '14px' }}>👑</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  Ratna K.
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                  Laporan &amp; AI
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '18px 0 14px 0',
            color: '#94a3b8',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span>atau login manual</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Alamat Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  placeholder="dimas.kasir.tebet@lumbung.test"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d97706';
                    e.target.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Kata Sandi
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d97706';
                    e.target.style.boxShadow = '0 0 0 3px rgba(217, 119, 6, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="hover-lift hover-glow"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 6px 18px rgba(180, 83, 9, 0.25)',
                marginTop: '6px',
                opacity: loading ? 0.75 : 1,
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span>{loading ? 'Memverifikasi Akses...' : 'Masuk Sekarang'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '14px', textAlign: 'center' }}>
            Kata sandi standar seluruh akun: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>Latihan#2026</code>
          </p>
        </div>

      </div>
    </div>
  );
};
