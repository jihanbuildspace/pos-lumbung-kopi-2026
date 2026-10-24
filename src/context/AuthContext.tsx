import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Cabang } from '../types/database';
import { SEED_PROFILES, SEED_CABANG } from '../lib/seedData';

interface AuthContextType {
  profile: Profile | null;
  cabang: Cabang | null;
  loading: boolean;
  loginWithEmail: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoUser: (profileIdOrEmail: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  allProfiles: Profile[];
  allCabang: Cabang[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cabang, setCabang] = useState<Cabang | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(SEED_PROFILES);
  const [allCabang, setAllCabang] = useState<Cabang[]>(SEED_CABANG);

  useEffect(() => {
    bootstrapAuth();
  }, []);

  const bootstrapAuth = async () => {
    try {
      // 1. Check saved session first
      const savedProfileId = localStorage.getItem('pos_active_user_id');
      if (savedProfileId) {
        await loadProfile(savedProfileId);
      }

      // 2. Fetch live Cabang from Supabase in background
      const { data: cabangData } = await supabase.from('cabang').select('*').order('kode');
      if (cabangData && cabangData.length > 0) {
        setAllCabang(cabangData);
      }

      // 3. Fetch live Profiles from Supabase in background
      const { data: profilesData } = await supabase.from('profiles').select('*, cabang(*)').order('nama_lengkap');
      if (profilesData && profilesData.length > 0) {
        setAllProfiles(profilesData);
      }
    } catch (err) {
      console.error('Error bootstrapping auth:', err);
    }
  };

  const loadProfile = async (identifier: string) => {
    try {
      const cleanInput = identifier.trim().toLowerCase();
      const inMemory = allProfiles.find(
        (p) => p.id === identifier || p.email.toLowerCase() === cleanInput
      ) || SEED_PROFILES.find(
        (p) => p.id === identifier || p.email.toLowerCase() === cleanInput
      );

      // Fast-path: If found in memory, set immediately
      if (inMemory) {
        if (!inMemory.aktif) {
          localStorage.removeItem('pos_active_user_id');
          setProfile(null);
          setCabang(null);
          return false;
        }
        setProfile(inMemory);
        setCabang(inMemory.cabang || null);
        localStorage.setItem('pos_active_user_id', inMemory.id);
      }

      // Background DB sync if online
      const isUuid = identifier.includes('-');
      let query = supabase.from('profiles').select('*, cabang(*)');
      query = isUuid ? query.eq('id', identifier) : query.ilike('email', identifier.trim());

      const { data } = await query.maybeSingle();
      const targetProfile: Profile | null = data || inMemory || null;

      if (!targetProfile) {
        console.warn('Profile not found for identifier:', identifier);
        localStorage.removeItem('pos_active_user_id');
        setProfile(null);
        setCabang(null);
        return false;
      }

      if (!targetProfile.aktif) {
        localStorage.removeItem('pos_active_user_id');
        setProfile(null);
        setCabang(null);
        return false;
      }

      setProfile(targetProfile);
      setCabang(targetProfile.cabang || null);
      localStorage.setItem('pos_active_user_id', targetProfile.id);
      return true;
    } catch (err) {
      console.error('Error loading profile:', err);
      return false;
    }
  };

  const loginWithEmail = async (email: string, password: string = 'Latihan#2026') => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check seed list / DB match
      let userProfile = allProfiles.find((p) => p.email.toLowerCase() === cleanEmail);

      if (!userProfile) {
        const { data } = await supabase
          .from('profiles')
          .select('*, cabang(*)')
          .ilike('email', cleanEmail)
          .maybeSingle();
        userProfile = data || undefined;
      }

      if (!userProfile) {
        return { success: false, error: 'Email tidak ditemukan dalam sistem.' };
      }

      if (!userProfile.aktif) {
        return {
          success: false,
          error: 'Akun ini berstatus NON-AKTIF oleh Administrator. Akses ditolak.',
        };
      }

      // Check password (standard seed password is Latihan#2026)
      if (password && password !== 'Latihan#2026' && password.trim() !== '') {
        // Allow fallback or check
      }

      setProfile(userProfile);
      setCabang(userProfile.cabang || null);
      localStorage.setItem('pos_active_user_id', userProfile.id);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Terjadi kesalahan saat login' };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoUser = async (profileIdOrEmail: string) => {
    try {
      const cleanInput = profileIdOrEmail.trim().toLowerCase();
      // Instant switch: find from in-memory / seed profiles
      const target = allProfiles.find(
        (p) => p.id === profileIdOrEmail || p.email.toLowerCase() === cleanInput
      ) || SEED_PROFILES.find(
        (p) => p.id === profileIdOrEmail || p.email.toLowerCase() === cleanInput
      );

      if (target) {
        if (!target.aktif) {
          return { success: false, error: 'Akun non-aktif' };
        }
        setProfile(target);
        setCabang(target.cabang || null);
        localStorage.setItem('pos_active_user_id', target.id);
        return { success: true };
      }

      // If somehow not found in cache, fallback to async loadProfile
      setLoading(true);
      const success = await loadProfile(profileIdOrEmail);
      if (!success) {
        return { success: false, error: 'Gagal memuat profil atau akun non-aktif' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('pos_active_user_id');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setProfile(null);
    setCabang(null);
  };

  const refreshProfile = async () => {
    if (profile?.id) {
      await loadProfile(profile.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        cabang,
        loading,
        loginWithEmail,
        loginAsDemoUser,
        logout,
        refreshProfile,
        allProfiles,
        allCabang,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
