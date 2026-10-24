import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Coffee, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithEmail, loginAsDemoUser, allProfiles } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Latihan#2026');
  const [loading, setLoading] = useState(false);
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 10% 20%, #fef3c7 0%, #f8fafc 40%, #f1f5f9 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '920px',
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
      }}>
        {/* Left Side: Brand Visual & Info */}
        <div style={{
          backgroundColor: '#451a03',
          padding: '40px 32px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle decorative glow */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
          }} />

          <div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#78350f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              marginBottom: '20px',
            }}>
              <Coffee size={28} color="#fef3c7" />
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Lumbung Kopi <br />dan Roti
            </h1>
            <p style={{ fontSize: '13px', color: '#fde68a', fontWeight: 600, marginTop: '6px', letterSpacing: '1px' }}>
              POINT OF SALE MULTI-CABANG
            </p>

            <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>•</span>
                <p style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  <strong>3 Cabang Terpadu:</strong> Tebet (TBT), Bintaro (BTR), dan Depok (DPK).
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>•</span>
                <p style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  <strong>Row-Level Security & Atomic RPC:</strong> Stok anti-minus dan nomor struk urut anti-race condition.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>•</span>
                <p style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  <strong>Hak Akses Bertingkat:</strong> Kasir, Kepala Toko, dan Owner (Harga Modal rahasia).
                </p>
              </div>
            </div>
          </div>

          <div style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            backdropFilter: 'blur(8px)',
            fontSize: '11px',
            color: '#cbd5e1',
          }}>
            Tahun Ajaran 2026 • Standar Tablet 10" (1024px+)
          </div>
        </div>

        {/* Right Side: Form & Quick Demo Users */}
        <div style={{ padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b' }}>
              Masuk ke Aplikasi
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Gunakan email & kata sandi atau klik akun uji di bawah
            </p>
          </div>

          {errorMsg && (
            <div style={{
              marginTop: '16px',
              padding: '10px 14px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#991b1b',
              fontSize: '12px',
              fontWeight: 500,
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
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
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#b45309')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Kata Sandi
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    transition: 'border 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#b45309')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#78350f',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(120, 53, 15, 0.25)',
                marginTop: '4px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <span>{loading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ShieldCheck size={16} color="#b45309" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                Pilih Akun Demo Uji Cepat:
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {/* Preset 1: Kasir Tebet */}
              <button
                type="button"
                disabled={loading}
                onClick={() => loginAsDemoUser('dimas.kasir.tebet@lumbung.test')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                  KASIR TEBET
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  Dimas Arya
                </div>
              </button>

              {/* Preset 2: Kepala Toko Tebet */}
              <button
                type="button"
                disabled={loading}
                onClick={() => loginAsDemoUser('bayu.kt.tebet@lumbung.test')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#e0e7ff',
                  border: '1px solid #c7d2fe',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#3730a3', textTransform: 'uppercase' }}>
                  KEPALA TOKO
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  Bayu Prasetyo
                </div>
              </button>

              {/* Preset 3: Owner */}
              <button
                type="button"
                disabled={loading}
                onClick={() => loginAsDemoUser('ratna.owner@lumbung.test')}
                style={{
                  padding: '8px 10px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                  OWNER (PUSAT)
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                  Ratna K.
                </div>
              </button>
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', textAlign: 'center' }}>
              Kata sandi standar seluruh akun: <code>Latihan#2026</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
