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
      padding: '24px 16px',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 15% 25%, #2d1408 0%, #170a04 40%, #0c0502 100%)',
    }}>
      {/* Dynamic Ambient Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '10%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
        filter: 'blur(50px)',
        animation: 'pulseGlow 7s infinite ease-in-out',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        bottom: '8%',
        right: '12%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217, 119, 6, 0.14) 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'pulseGlow 9s infinite ease-in-out reverse',
        pointerEvents: 'none',
      }} />

      {/* Floating Coffee Sparkle Icon */}
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '18%',
        animation: 'floatSlow 6s infinite ease-in-out',
        opacity: 0.25,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#fde68a',
      }}>
        <Coffee size={40} />
      </div>

      {/* Main Glassmorphic Card Container */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(251, 191, 36, 0.25)',
        backdropFilter: 'blur(20px)',
        zIndex: 10,
        position: 'relative',
        animation: 'fadeInScale 0.35s ease',
      }}>

        {/* Left Side: Brand Story & Live Features Showcase */}
        <div style={{
          backgroundColor: '#381404',
          padding: '42px 36px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #2c1003 0%, #451a03 50%, #5e2405 100%)',
          borderRight: '1px solid rgba(251, 191, 36, 0.15)',
        }}>
          {/* Subtle gold mesh pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
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
              backgroundColor: 'rgba(254, 243, 199, 0.12)',
              border: '1px solid rgba(253, 230, 138, 0.25)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fef3c7',
              letterSpacing: '0.5px',
              marginBottom: '24px',
              backdropFilter: 'blur(6px)',
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

            {/* Glowing Brand Icon & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: '#78350f',
                background: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(120, 53, 15, 0.45), 0 0 0 1px rgba(253, 230, 138, 0.3)',
              }}>
                <Coffee size={30} color="#fef3c7" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  lineHeight: 1.15,
                  margin: 0,
                  color: '#ffffff',
                }}>
                  Lumbung Kopi <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    dan Roti
                  </span>
                </h1>
              </div>
            </div>

            <p style={{
              fontSize: '12px',
              color: '#fed7aa',
              fontWeight: 600,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}>
              Modern Point of Sale &amp; Inventory Management
            </p>

            {/* 3 Pillars / Feature Highlights with rich glass styling */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24',
                  flexShrink: 0,
                }}>
                  <Store size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    3 Cabang Terpadu
                  </h4>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    Tebet (TBT), Bintaro (BTR), dan Depok (DPK) dengan pemotongan stok bahan resep otomatis.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34d399',
                  flexShrink: 0,
                }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Lumbung AI Engine</span>
                    <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#065f46', color: '#a7f3d0' }}>Gemini 3.5</span>
                  </h4>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    Prediksi cerdas kebutuhan restock bahan baku &amp; asisten konsultasi bisnis Owner.
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(2, 132, 199, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                  flexShrink: 0,
                }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Dynamic QRIS Gateway</span>
                    <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#075985', color: '#bae6fd' }}>Mayar.id</span>
                  </h4>
                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '3px 0 0 0', lineHeight: 1.4 }}>
                    QRIS otomatis per struk Bank Indonesia dengan webhook sinkronisasi kasir &amp; layar pelanggan.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Footnote Badge */}
          <div style={{
            marginTop: '28px',
            padding: '12px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <span>Tahun Ajaran 2026 • Standar Tablet POS</span>
            <span style={{ color: '#fde68a', fontWeight: 700 }}>v2.6.0 Live</span>
          </div>
        </div>

        {/* Right Side: Sleek Login Form & Instant Persona Cards */}
        <div style={{
          padding: '38px 36px',
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
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px', margin: 0 }}>
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
                background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '13px',
                boxShadow: '0 6px 18px rgba(180, 83, 9, 0.35)',
                marginTop: '6px',
                opacity: loading ? 0.75 : 1,
                cursor: 'pointer',
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
