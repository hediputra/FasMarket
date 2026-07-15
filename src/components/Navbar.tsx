import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck, 
  Briefcase, 
  Wallet, 
  ChevronDown, 
  LogOut, 
  RefreshCw, 
  BookOpen, 
  Coins,
  AlertCircle
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  activeTab: 'marketplace' | 'blogs' | 'my-purchases' | 'seller-dashboard' | 'admin-dashboard';
  setActiveTab: (tab: 'marketplace' | 'blogs' | 'my-purchases' | 'seller-dashboard' | 'admin-dashboard') => void;
  onOpenTopUp: () => void;
  onOpenKYC: () => void;
  currency: 'IDR' | 'USD';
  onToggleCurrency: () => void;
}

export default function Navbar({
  currentUser,
  allUsers,
  onSwitchUser,
  activeTab,
  setActiveTab,
  onOpenTopUp,
  onOpenKYC,
  currency,
  onToggleCurrency
}: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getRoleLabel = (role: UserRole, status?: string) => {
    if (role === 'ADMIN') return 'Admin (PT Fas Tech)';
    if (role === 'SELLER') {
      return status === 'APPROVED' ? 'Vendor Terverifikasi' : 'Vendor (Pending KYC)';
    }
    return 'Pembeli';
  };

  const formatIDR = (value: number) => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value / 16000);
    }
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 text-slate-800 shadow-sm" id="fasmarket-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Brand and Navigation Links */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer group"
              onClick={() => setActiveTab('marketplace')}
              id="navbar-logo"
            >
              <div className="bg-blue-600 p-2 rounded-lg text-white font-bold shadow-md shadow-blue-600/10 group-hover:scale-105 transition-transform">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  Fas<span className="text-blue-600">Market</span>
                </span>
                <span className="block text-[9px] text-blue-600 tracking-widest uppercase font-mono leading-none -mt-0.5">
                  by PT FAS TECH
                </span>
              </div>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center space-x-1 font-heading text-sm font-medium">
              <button
                id="nav-marketplace-btn"
                onClick={() => setActiveTab('marketplace')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'marketplace' 
                    ? 'text-blue-600 bg-blue-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Marketplace
              </button>
              <button
                id="nav-blogs-btn"
                onClick={() => setActiveTab('blogs')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeTab === 'blogs' 
                    ? 'text-blue-600 bg-blue-50/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Blog & Edukasi
              </button>
              {currentUser.role === 'BUYER' && (
                <button
                  id="nav-purchases-btn"
                  onClick={() => setActiveTab('my-purchases')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'my-purchases' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Pembelian Saya
                </button>
              )}
              {currentUser.role === 'SELLER' && (
                <button
                  id="nav-seller-btn"
                  onClick={() => setActiveTab('seller-dashboard')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'seller-dashboard' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard Vendor
                </button>
              )}
              {currentUser.role === 'ADMIN' && (
                <button
                  id="nav-admin-btn"
                  onClick={() => setActiveTab('admin-dashboard')}
                  className={`px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'admin-dashboard' 
                      ? 'text-blue-600 bg-blue-50/80' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard Admin
                </button>
              )}
            </div>
          </div>

          {/* Right: Balance, Profile & Role switcher */}
          <div className="flex items-center space-x-4">
            {/* Currency Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-0.5" id="currency-toggle-container">
              <button
                id="currency-toggle-idr"
                type="button"
                onClick={() => currency !== 'IDR' && onToggleCurrency()}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  currency === 'IDR'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to IDR (Rupiah)"
              >
                IDR
              </button>
              <button
                id="currency-toggle-usd"
                type="button"
                onClick={() => currency !== 'USD' && onToggleCurrency()}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Switch to USD (US Dollar)"
              >
                USD
              </button>
            </div>

            {/* Balance Widget */}
            {currentUser.role !== 'ADMIN' && (
              <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 space-x-2.5">
                <div className="bg-blue-50 text-blue-600 p-1 rounded-full">
                  <Wallet size={14} />
                </div>
                <div className="text-xs text-left">
                  <span className="block text-[9px] uppercase text-slate-500 font-mono leading-none">Saldo Akun</span>
                  <span className="font-mono font-bold text-sm text-slate-950">{formatIDR(currentUser.balance)}</span>
                </div>
                {currentUser.role === 'BUYER' && (
                  <button 
                    onClick={onOpenTopUp}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-semibold text-[11px] px-2.5 py-1 rounded-full transition-colors shadow-sm cursor-pointer"
                    id="top-up-badge-btn"
                  >
                    Top Up
                  </button>
                )}
              </div>
            )}

            {/* Administrative Escrow Pool for Admin */}
            {currentUser.role === 'ADMIN' && (
              <div className="hidden sm:flex items-center bg-emerald-50 border border-emerald-200 rounded-full px-3.5 py-1.5 space-x-2.5">
                <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full">
                  <Coins size={14} />
                </div>
                <div className="text-xs text-left">
                  <span className="block text-[9px] uppercase text-emerald-600 font-mono leading-none">Pendapatan Platform (5%)</span>
                  <span className="font-mono font-bold text-sm text-emerald-700">{formatIDR(currentUser.balance)}</span>
                </div>
              </div>
            )}

            {/* Profile Selector Trigger */}
            <div className="relative">
              <button
                id="role-switcher-trigger"
                onClick={() => {
                  setRoleSwitcherOpen(!roleSwitcherOpen);
                  setDropdownOpen(false);
                }}
                className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/85 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Ganti Profil Simulasi Jual-Beli"
              >
                <RefreshCw size={13} className="text-blue-600 animate-spin-slow" />
                <span className="text-slate-600 hidden md:inline">Simulasi:</span>
                <span className="text-slate-800 max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown size={12} className="text-slate-500" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-slate-100">
                  <div className="px-4 py-2">
                    <span className="block text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                      Uji Peran & Alur Transaksi
                    </span>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Ganti profil untuk menguji proses: Pembelian &rarr; Penahanan Escrow &rarr; Moderasi Admin &rarr; Sengketa/Resolusi.
                    </p>
                  </div>
                  <div className="py-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user.id);
                          setRoleSwitcherOpen(false);
                          // Redirect based on role to ease testing
                          if (user.role === 'ADMIN') setActiveTab('admin-dashboard');
                          else if (user.role === 'SELLER') setActiveTab('seller-dashboard');
                          else setActiveTab('marketplace');
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 transition-colors cursor-pointer ${
                          currentUser.id === user.id 
                            ? 'bg-slate-100 text-slate-900' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover" 
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-xs font-bold truncate text-slate-800">{user.name}</p>
                          <span className={`inline-block text-[9px] font-mono px-1.5 py-0.5 rounded-md mt-0.5 ${
                            user.role === 'ADMIN' 
                              ? 'bg-red-50 text-red-600 border border-red-100' 
                              : user.role === 'SELLER' 
                                ? user.kycInfo.status === 'APPROVED'
                                  ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-cyan-50 text-cyan-600 border border-cyan-100'
                          }`}>
                            {getRoleLabel(user.role, user.kycInfo.status)}
                          </span>
                        </div>
                        {currentUser.id === user.id && (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown / User Details */}
            <div className="relative">
              <button
                id="profile-dropdown-trigger"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                  setRoleSwitcherOpen(false);
                }}
                className="flex items-center space-x-2 focus:outline-none cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-500 hover:border-blue-400 transition-colors"
                  />
                  {currentUser.kycInfo.status === 'APPROVED' && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full" title="Identitas KYC Terverifikasi">
                      <ShieldCheck size={10} />
                    </div>
                  )}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 text-slate-700">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
                      ID: {currentUser.id}
                    </span>
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-1.5 flex justify-between items-center text-xs text-slate-500">
                      <span>Trust Score:</span>
                      <span className="font-semibold text-emerald-600">{currentUser.trustRating}%</span>
                    </div>
                    {currentUser.kycInfo.status === 'NONE' && (
                      <button
                        onClick={() => {
                          onOpenKYC();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-600 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                      >
                        <AlertCircle size={14} />
                        <span>Verifikasi KYC (Vendor)</span>
                      </button>
                    )}
                    {currentUser.kycInfo.status === 'PENDING' && (
                      <div className="px-4 py-2 text-xs text-amber-600 bg-amber-50 flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                        <span>KYC Sedang Ditinjau</span>
                      </div>
                    )}
                    {currentUser.kycInfo.status === 'APPROVED' && (
                      <div className="px-4 py-2 text-xs text-blue-600 bg-blue-50 flex items-center space-x-2">
                        <ShieldCheck size={14} />
                        <span>KYC Terverifikasi</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1.5">
                    <div className="px-4 py-1 text-[9px] uppercase font-mono text-slate-400 tracking-wider">
                      Kode Referral
                    </div>
                    <div className="px-4 py-1 flex items-center justify-between text-xs font-mono text-blue-700 bg-blue-50/50 mx-3 my-1 rounded border border-blue-100/30">
                      <span>{currentUser.referralCode}</span>
                      <span className="text-[9px] text-slate-500">3% komisi</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile navigation links */}
      <div className="md:hidden flex justify-around border-t border-slate-200 bg-white/95 py-2 text-xs font-medium font-heading">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center py-1 px-3 ${
            activeTab === 'marketplace' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag size={18} />
          <span className="mt-1">Market</span>
        </button>
        <button
          onClick={() => setActiveTab('blogs')}
          className={`flex flex-col items-center py-1 px-3 ${
            activeTab === 'blogs' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <BookOpen size={18} />
          <span className="mt-1">Edukasi</span>
        </button>
        {currentUser.role === 'BUYER' && (
          <button
            onClick={() => setActiveTab('my-purchases')}
            className={`flex flex-col items-center py-1 px-3 ${
              activeTab === 'my-purchases' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <UserIcon size={18} />
            <span className="mt-1">Beli Saya</span>
          </button>
        )}
        {currentUser.role === 'SELLER' && (
          <button
            onClick={() => setActiveTab('seller-dashboard')}
            className={`flex flex-col items-center py-1 px-3 ${
              activeTab === 'seller-dashboard' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <Briefcase size={18} />
            <span className="mt-1">Vendor</span>
          </button>
        )}
        {currentUser.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className={`flex flex-col items-center py-1 px-3 ${
              activeTab === 'admin-dashboard' ? 'text-blue-600' : 'text-slate-500'
            }`}
          >
            <ShieldCheck size={18} />
            <span className="mt-1">Admin</span>
          </button>
        )}
      </div>
    </nav>
  );
}
