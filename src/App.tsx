import React, { useState, useEffect } from 'react';
import { 
  User, 
  Product, 
  Transaction, 
  Dispute, 
  BlogArticle, 
  WithdrawalRequest, 
  Category, 
  PaymentMethod,
  Review
} from './types';
import { 
  mockUsers, 
  mockProducts, 
  mockDisputes, 
  mockArticles, 
  mockReviews 
} from './data/mockData';

// Component Imports
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import KYCModal from './components/KYCModal';
import EscrowTracker from './components/EscrowTracker';
import DisputePanel from './components/DisputePanel';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import BlogPanel from './components/BlogPanel';

import { 
  ShieldCheck, 
  Coins, 
  Wallet, 
  TrendingUp, 
  Sparkles, 
  Lock, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  DollarSign, 
  Users, 
  MessageSquare,
  Search,
  Filter,
  Star,
  BookOpen,
  Download,
  FileSpreadsheet
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export default function App() {
  // --- Persistent State Hooks ---
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [blogArticles, setBlogArticles] = useState<BlogArticle[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // --- UI/Navigation State Hooks ---
  const [activeTab, setActiveTab] = useState<'marketplace' | 'blogs' | 'my-purchases' | 'seller-dashboard' | 'admin-dashboard'>('marketplace');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // --- Modals Toggle State Hooks ---
  const [kycOpen, setKycOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number>(5000000);
  const [buyProductOpen, setBuyProductOpen] = useState<string | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [appliedAffiliate, setAppliedAffiliate] = useState('');
  
  // --- Marketplace Filters State Hooks ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(6000000);

  // --- Toast Notification State Hooks ---
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // --- Currency Configuration State ---
  const [currency, setCurrency] = useState<'IDR' | 'USD'>(() => {
    return (localStorage.getItem('fas_currency') as 'IDR' | 'USD') || 'IDR';
  });

  const handleToggleCurrency = () => {
    const nextCurrency = currency === 'IDR' ? 'USD' : 'IDR';
    setCurrency(nextCurrency);
    localStorage.setItem('fas_currency', nextCurrency);
    showToast(`Mata uang diubah ke: ${nextCurrency}`, 'info');
  };

  // --- 1. Initialize & LocalStorage Synchronization ---
  useEffect(() => {
    // Load or Seed Users
    const localUsers = localStorage.getItem('fas_users');
    let loadedUsers: User[] = [];
    if (localUsers) {
      loadedUsers = JSON.parse(localUsers);
    } else {
      loadedUsers = mockUsers;
      localStorage.setItem('fas_users', JSON.stringify(mockUsers));
    }
    setUsers(loadedUsers);

    // Set Current User (Default to Andi - Buyer)
    const activeUserId = localStorage.getItem('fas_active_user_id') || 'user-buyer-1';
    const foundUser = loadedUsers.find(u => u.id === activeUserId) || loadedUsers[0];
    setCurrentUser(foundUser);

    // Load or Seed Products
    const localProducts = localStorage.getItem('fas_products');
    if (localProducts) {
      setProducts(JSON.parse(localProducts));
    } else {
      setProducts(mockProducts);
      localStorage.setItem('fas_products', JSON.stringify(mockProducts));
    }

    // Load or Seed Transactions
    const localTransactions = localStorage.getItem('fas_transactions');
    if (localTransactions) {
      setTransactions(JSON.parse(localTransactions));
    } else {
      // Seed an initial transaction to make the purchases tab feel real
      const initialTx: Transaction[] = [
        {
          id: 'tx-old-1',
          productId: 'prod-4',
          productTitle: 'Aplikasi Ojek Online & Delivery - Flutter Multi-Platform App',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 4900000,
          platformFee: 245000,
          paymentMethod: 'CRYPTO_USDC',
          escrowStatus: 'DISPUTE_OPENED',
          createdAt: '2026-07-10T14:00:00Z'
        },
        {
          id: 'tx-old-2',
          productId: 'prod-2',
          productTitle: 'Aplikasi Kasir (POS) Desktop - Electron & React Offline-First',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 1200000,
          platformFee: 60000,
          paymentMethod: 'BANK_TRANSFER',
          escrowStatus: 'FUNDS_RELEASED',
          createdAt: '2026-06-15T10:00:00Z'
        },
        {
          id: 'tx-old-3',
          productId: 'prod-1',
          productTitle: 'E-Commerce SaaS Starter Kit - Next.js & Go Microservices',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 3500000,
          platformFee: 175000,
          paymentMethod: 'E_WALLET',
          escrowStatus: 'FUNDS_RELEASED',
          createdAt: '2026-05-20T08:30:00Z'
        },
        {
          id: 'tx-old-4',
          productId: 'prod-3',
          productTitle: 'Sistem Keamanan API - OAuth2 & JWT Shield Server',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 800000,
          platformFee: 40000,
          paymentMethod: 'BANK_TRANSFER',
          escrowStatus: 'FUNDS_RELEASED',
          createdAt: '2026-04-12T11:45:00Z'
        },
        {
          id: 'tx-old-5',
          productId: 'prod-5',
          productTitle: 'Template Portfolio Developer Minimalis - Astro & Tailwind',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 2800000,
          platformFee: 140000,
          paymentMethod: 'CRYPTO_USDC',
          escrowStatus: 'FUNDS_RELEASED',
          createdAt: '2026-03-18T11:45:00Z'
        },
        {
          id: 'tx-old-6',
          productId: 'prod-6',
          productTitle: 'Sistem Kehadiran Karyawan Berbasis Geofencing - Laravel & React Native',
          buyerId: 'user-buyer-1',
          buyerName: 'Andi Pratama',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 1500000,
          platformFee: 75000,
          paymentMethod: 'BANK_TRANSFER',
          escrowStatus: 'FUNDS_RELEASED',
          createdAt: '2026-02-05T09:15:00Z'
        }
      ];
      setTransactions(initialTx);
      localStorage.setItem('fas_transactions', JSON.stringify(initialTx));
    }

    // Load or Seed Disputes
    const localDisputes = localStorage.getItem('fas_disputes');
    if (localDisputes) {
      setDisputes(JSON.parse(localDisputes));
    } else {
      setDisputes(mockDisputes);
      localStorage.setItem('fas_disputes', JSON.stringify(mockDisputes));
    }

    // Load or Seed Blogs
    const localBlogs = localStorage.getItem('fas_blogs');
    if (localBlogs) {
      setBlogArticles(JSON.parse(localBlogs));
    } else {
      setBlogArticles(mockArticles);
      localStorage.setItem('fas_blogs', JSON.stringify(mockArticles));
    }

    // Load or Seed Withdrawals
    const localWithdrawals = localStorage.getItem('fas_withdrawals');
    if (localWithdrawals) {
      setWithdrawalRequests(JSON.parse(localWithdrawals));
    } else {
      const initialWithdrawals: WithdrawalRequest[] = [
        {
          id: 'wdr-1',
          sellerId: 'user-seller-1',
          sellerName: 'Rian Wijaya (PT DevKreasi)',
          amount: 15000000,
          bankName: 'Bank Mandiri',
          accountNumber: '132-00-1234567-9',
          accountHolder: 'Rian Wijaya',
          status: 'APPROVED',
          createdAt: '2026-06-28T09:00:00Z',
          processedAt: '2026-06-29T11:00:00Z'
        }
      ];
      setWithdrawalRequests(initialWithdrawals);
      localStorage.setItem('fas_withdrawals', JSON.stringify(initialWithdrawals));
    }

    // Load or Seed Reviews
    const localReviews = localStorage.getItem('fas_reviews');
    if (localReviews) {
      setReviews(JSON.parse(localReviews));
    } else {
      setReviews(mockReviews);
      localStorage.setItem('fas_reviews', JSON.stringify(mockReviews));
    }
  }, []);

  // --- Helper to trigger professional feedback toasts ---
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- 2. Synchronize State changes back to LocalStorage ---
  const saveUsersState = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('fas_users', JSON.stringify(updatedUsers));
    if (currentUser) {
      const freshMe = updatedUsers.find(u => u.id === currentUser.id);
      if (freshMe) setCurrentUser(freshMe);
    }
  };

  const saveProductsState = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('fas_products', JSON.stringify(updatedProducts));
  };

  const saveTransactionsState = (updatedTxs: Transaction[]) => {
    setTransactions(updatedTxs);
    localStorage.setItem('fas_transactions', JSON.stringify(updatedTxs));
  };

  const saveDisputesState = (updatedDisputes: Dispute[]) => {
    setDisputes(updatedDisputes);
    localStorage.setItem('fas_disputes', JSON.stringify(updatedDisputes));
  };

  const saveBlogsState = (updatedBlogs: BlogArticle[]) => {
    setBlogArticles(updatedBlogs);
    localStorage.setItem('fas_blogs', JSON.stringify(updatedBlogs));
  };

  const saveWithdrawalsState = (updatedWithdrawals: WithdrawalRequest[]) => {
    setWithdrawalRequests(updatedWithdrawals);
    localStorage.setItem('fas_withdrawals', JSON.stringify(updatedWithdrawals));
  };

  const saveReviewsState = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('fas_reviews', JSON.stringify(updatedReviews));
  };

  // --- 3. Interaction Actions & Handlers ---

  // User switcher helper
  const handleSwitchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('fas_active_user_id', userId);
      setSelectedProductId(null);
      setSelectedDisputeId(null);
      showToast(`Beralih peran ke: ${user.name}`, 'info');
    }
  };

  // KYC Submission handler
  const handleSubmitKYC = (kycData: {
    fullName: string;
    idNumber: string;
    idType: 'KTP' | 'Paspor' | 'SIM';
    npwp: string;
    companyName?: string;
  }) => {
    if (!currentUser) return;
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          kycInfo: {
            ...kycData,
            status: 'PENDING' as const,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return u;
    });
    saveUsersState(updatedUsers);
    setKycOpen(false);
    showToast('Identitas KYC berhasil diajukan! Admin PT Fas akan segera mengaudit berkas.', 'success');
  };

  // Buyer Top Up Simulation
  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (topUpAmount <= 0) return;

    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          balance: u.balance + topUpAmount
        };
      }
      return u;
    });
    saveUsersState(updatedUsers);
    setTopUpOpen(false);
    showToast(`Berhasil Top Up ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(topUpAmount)}! Saldo bertambah.`, 'success');
  };

  // Admin approval: KYC verification
  const handleApproveKYC = (userId: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          kycInfo: {
            ...u.kycInfo,
            status: 'APPROVED' as const,
            verifiedAt: new Date().toISOString()
          }
        };
      }
      return u;
    });
    saveUsersState(updatedUsers);
    showToast('Identitas KYC Vendor disetujui! Akun sekarang berstatus Terverifikasi.', 'success');
  };

  // Admin rejection: KYC verification
  const handleRejectKYC = (userId: string, reason: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          kycInfo: {
            ...u.kycInfo,
            status: 'REJECTED' as const,
            rejectionReason: reason
          }
        };
      }
      return u;
    });
    saveUsersState(updatedUsers);
    showToast(`Permohonan KYC ditolak dengan alasan: "${reason}"`, 'error');
  };

  // Seller uploading a new source code product
  const handleUploadProduct = (prodData: {
    title: string;
    description: string;
    detailedDescription: string;
    category: Category;
    price: number;
    languages: string[];
    demoUrl: string;
    sourceCodeFile: string;
    licenseType: 'Standard' | 'Extended Commercial';
    serialKeys?: string[];
  }) => {
    if (!currentUser) return;
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      status: 'PENDING',
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      isFeatured: false,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      programmingLanguages: prodData.languages
    };
    saveProductsState([newProduct, ...products]);
    showToast('Source Code berhasil didaftarkan! Status: Menunggu Moderasi Admin.', 'info');
  };

  // Admin approval: Product listing
  const handleApproveProduct = (productId: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'APPROVED' as const };
      }
      return p;
    });
    saveProductsState(updatedProducts);
    showToast('Listing produk berhasil disetujui! Produk kini tayang di marketplace.', 'success');
  };

  // Admin rejection: Product listing
  const handleRejectProduct = (productId: string, reason: string) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, status: 'REJECTED' as const, rejectionReason: reason };
      }
      return p;
    });
    saveProductsState(updatedProducts);
    showToast(`Listing produk ditolak dengan alasan: "${reason}"`, 'error');
  };

  // Seller Boosting product to featured slot (Costs Rp 500.000)
  const handleBoostProduct = (productId: string) => {
    if (!currentUser) return;
    
    // Deduct cost from vendor balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - 500000 };
      }
      return u;
    });

    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, isFeatured: true };
      }
      return p;
    });

    saveUsersState(updatedUsers);
    saveProductsState(updatedProducts);
    showToast('Iklan Boost diaktifkan! Produk Anda sekarang dipromosikan di landing page utama.', 'success');
  };

  // Seller initiating withdrawal request
  const handleWithdrawFunds = (withdrawalData: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }) => {
    if (!currentUser) return;
    
    // Create withdrawal log
    const newRequest: WithdrawalRequest = {
      id: `wdr-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      amount: withdrawalData.amount,
      bankName: withdrawalData.bankName,
      accountNumber: withdrawalData.accountNumber,
      accountHolder: withdrawalData.accountHolder,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    saveWithdrawalsState([newRequest, ...withdrawalRequests]);
    showToast('Permohonan transfer penarikan telah masuk antrian admin keuangan.', 'info');
  };

  // Admin approves withdrawal: deducts from seller balance & updates status
  const handleApproveWithdrawal = (requestId: string) => {
    const req = withdrawalRequests.find(w => w.id === requestId);
    if (!req) return;

    // Deduct from seller balance
    const updatedUsers = users.map(u => {
      if (u.id === req.sellerId) {
        return { ...u, balance: Math.max(0, u.balance - req.amount) };
      }
      return u;
    });

    const updatedWithdrawals = withdrawalRequests.map(w => {
      if (w.id === requestId) {
        return { ...w, status: 'APPROVED' as const, processedAt: new Date().toISOString() };
      }
      return w;
    });

    saveUsersState(updatedUsers);
    saveWithdrawalsState(updatedWithdrawals);
    showToast(`Pencairan saldo Rp ${new Intl.NumberFormat('id-ID').format(req.amount)} ke rekening vendor disetujui!`, 'success');
  };

  const handleRejectWithdrawal = (requestId: string) => {
    const updatedWithdrawals = withdrawalRequests.map(w => {
      if (w.id === requestId) {
        return { ...w, status: 'REJECTED' as const, processedAt: new Date().toISOString() };
      }
      return w;
    });
    saveWithdrawalsState(updatedWithdrawals);
    showToast('Pencairan saldo ditolak admin keuangan.', 'error');
  };

  // Seller creates a technical blog article
  const handleCreateBlogArticle = (articleData: {
    title: string;
    content: string;
    productId: string;
    tags: string[];
  }) => {
    if (!currentUser) return;
    const connectedProd = products.find(p => p.id === articleData.productId);
    
    const newArticle: BlogArticle = {
      id: `art-${Date.now()}`,
      title: articleData.title,
      content: articleData.content,
      productId: articleData.productId,
      productTitle: connectedProd ? connectedProd.title : 'Produk Terkait',
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: new Date().toISOString(),
      readTime: '5 Menit Baca',
      tags: articleData.tags
    };

    saveBlogsState([newArticle, ...blogArticles]);
  };

  // Escrow Checkout: Buy product
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !buyProductOpen) return;
    
    const prod = products.find(p => p.id === buyProductOpen);
    if (!prod) return;

    if (currentUser.balance < prod.price) {
      alert('Saldo Anda tidak mencukupi untuk melakukan transaksi ini. Silakan Top Up terlebih dahulu.');
      return;
    }

    // 5% Platform fee calculation (PT Fas Tech profit)
    const platformFee = prod.price * 0.05;

    // Affiliate Commission tracking (3% for referral code match)
    let affiliateCommission = 0;
    let referrerId: string | undefined = undefined;

    if (appliedAffiliate) {
      // Find user with matching referral code
      const referrer = users.find(u => u.referralCode.toUpperCase() === appliedAffiliate.toUpperCase());
      if (referrer && referrer.id !== currentUser.id && referrer.id !== prod.sellerId) {
        affiliateCommission = prod.price * 0.03;
        referrerId = referrer.id;
      }
    }

    // Generate/pop a serial key if available
    let deliveredKey: string | undefined = undefined;
    const updatedProducts = products.map(p => {
      if (p.id === prod.id) {
        if (p.serialKeys && p.serialKeys.length > 0) {
          const keys = [...p.serialKeys];
          deliveredKey = keys.shift();
          return { ...p, serialKeys: keys };
        }
      }
      return p;
    });

    if (!deliveredKey) {
      // Create a fallback key if none exists
      deliveredKey = `FAS-KEY-${Math.floor(1000 + Math.random() * 9000)}-${currentUser.referralCode}`;
    }

    // Create Escrow Transaction (held status)
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      productId: prod.id,
      productTitle: prod.title,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: prod.sellerId,
      sellerName: prod.sellerName,
      amount: prod.price,
      platformFee: platformFee,
      paymentMethod: checkoutPaymentMethod,
      escrowStatus: 'FUNDS_HELD', // Held in escrow safety
      createdAt: new Date().toISOString(),
      serialKeyDelivered: deliveredKey,
      ...(referrerId && { affiliateCommission, affiliateReferrerId: referrerId })
    };

    // Deduct price from buyer's account balance
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, balance: u.balance - prod.price };
      }
      return u;
    });

    saveUsersState(updatedUsers);
    saveProductsState(updatedProducts);
    saveTransactionsState([newTx, ...transactions]);

    setBuyProductOpen(null);
    setAppliedAffiliate('');
    setActiveTab('my-purchases');
    showToast(`Sukses Membeli! Dana Rp ${new Intl.NumberFormat('id-ID').format(prod.price)} didepositkan ke Escrow Kustodia. Serial key dikirimkan.`, 'success');
  };

  // Buyer releases funds from escrow to seller (Selesai transaksi)
  const handleReleaseEscrow = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    // Distribute cash:
    // Seller gets: Transaction amount - 5% platform fee
    const payoutToSeller = tx.amount - tx.platformFee;

    const updatedUsers = users.map(u => {
      // 1. Give money to Seller
      if (u.id === tx.sellerId) {
        return { 
          ...u, 
          balance: u.balance + payoutToSeller,
          earnings: (u.earnings || 0) + payoutToSeller
        };
      }
      // 2. Give platform fee to Admin
      if (u.role === 'ADMIN') {
        return {
          ...u,
          balance: u.balance + tx.platformFee
        };
      }
      // 3. Give affiliate commission if exists
      if (tx.affiliateReferrerId && u.id === tx.affiliateReferrerId && tx.affiliateCommission) {
        return {
          ...u,
          balance: u.balance + tx.affiliateCommission
        };
      }
      return u;
    });

    const updatedTxs = transactions.map(t => {
      if (t.id === txId) {
        return { ...t, escrowStatus: 'FUNDS_RELEASED' as const, releasedAt: new Date().toISOString() };
      }
      return t;
    });

    saveUsersState(updatedUsers);
    saveTransactionsState(updatedTxs);
    showToast('Escrow sukses dicairkan! Saldo dikreditkan ke vendor, 5% fee dialokasikan ke platform.', 'success');
  };

  // Download transaction history for current buyer as a CSV file
  const handleDownloadCSV = () => {
    if (!currentUser) return;
    const buyerTxs = transactions.filter(t => t.buyerId === currentUser.id);
    if (buyerTxs.length === 0) {
      showToast('Tidak ada transaksi pembelian untuk diunduh.', 'error');
      return;
    }

    const headers = ['Transaction ID', 'Date', 'Product Title', 'Vendor (Seller)', 'Price (IDR)', 'Payment Method', 'Escrow Status', 'Serial Key'];
    const rows = buyerTxs.map(tx => [
      tx.id,
      new Date(tx.createdAt).toISOString().split('T')[0],
      `"${tx.productTitle.replace(/"/g, '""')}"`,
      `"${tx.sellerName.replace(/"/g, '""')}"`,
      tx.amount,
      tx.paymentMethod,
      tx.escrowStatus,
      tx.serialKeyDelivered || '-'
    ]);

    const csvRows = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `riwayat-pembelian-${currentUser.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berhasil mengunduh rekap transaksi CSV!', 'success');
  };

  // Submit review for a product, updating the rating and count
  const handleSubmitReview = (productId: string, rating: number, comment: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews];
    saveReviewsState(updatedReviews);

    // Calculate new average rating for the product
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          rating: Number(avgRating.toFixed(1)),
          reviewCount: productReviews.length
        };
      }
      return p;
    });
    saveProductsState(updatedProducts);

    showToast('Terimakasih! Ulasan Anda berhasil disimpan.', 'success');
  };

  // Prepare spending trends for last 6 months
  const getSpendingDataForLast6Months = () => {
    if (!currentUser) return [];
    const buyerTxs = transactions.filter(t => t.buyerId === currentUser.id);
    
    // Last 6 months based on current local date (July 2026)
    const monthsData: { name: string; year: number; month: number; amount: number }[] = [];
    const today = new Date(); // 2026-07-14
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthLabel = d.toLocaleDateString('id-ID', { month: 'short' });
      monthsData.push({
        name: `${monthLabel} ${d.getFullYear().toString().substring(2)}`,
        year: d.getFullYear(),
        month: d.getMonth(),
        amount: 0
      });
    }

    buyerTxs.forEach(tx => {
      const txDate = new Date(tx.createdAt);
      const txYear = txDate.getFullYear();
      const txMonth = txDate.getMonth();
      
      const match = monthsData.find(m => m.year === txYear && m.month === txMonth);
      if (match) {
        match.amount += tx.amount;
      }
    });

    return monthsData.map(m => ({
      name: m.name,
      'Pengeluaran': m.amount
    }));
  };

  // Buyer opens a sengketa / dispute
  const handleOpenDispute = (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;

    const reason = prompt('Masukkan alasan singkat sengketa Anda (misal: "Kodingan error / Blank screen"):');
    if (!reason) return;

    const description = prompt('Jelaskan rincian sengketa serta apa yang sudah Anda lakukan untuk mencoba menjalankan kodingan:');
    if (!description) return;

    // Create dispute
    const newDispute: Dispute = {
      id: `disp-${Date.now()}`,
      transactionId: tx.id,
      productId: tx.productId,
      productTitle: tx.productTitle,
      buyerId: tx.buyerId,
      buyerName: tx.buyerName,
      sellerId: tx.sellerId,
      sellerName: tx.sellerName,
      reason: reason,
      description: description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: tx.buyerId,
          senderName: tx.buyerName,
          senderRole: 'BUYER',
          text: `Halo Seller, saya mengajukan sengketa karena: "${reason}". Penjelasan tambahan: ${description}. Mohon bantuannya.`,
          createdAt: new Date().toISOString()
        }
      ],
      evidenceFiles: []
    };

    // Update Transaction status to DISPUTED
    const updatedTxs = transactions.map(t => {
      if (t.id === txId) {
        return { ...t, escrowStatus: 'DISPUTE_OPENED' as const };
      }
      return t;
    });

    saveDisputesState([newDispute, ...disputes]);
    saveTransactionsState(updatedTxs);
    setSelectedDisputeId(newDispute.id);
    showToast('Sengketa transaksi dibuka! Anda masuk ke Ruang Mediasi bersama Seller & Admin.', 'info');
  };

  // Sengketa message sender
  const handleSendDisputeMessage = (disputeId: string, text: string) => {
    if (!currentUser) return;
    const updatedDisputes = disputes.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          messages: [
            ...d.messages,
            {
              id: `msg-${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              senderRole: currentUser.role,
              text: text,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return d;
    });
    saveDisputesState(updatedDisputes);
  };

  // Uploading evidence within mediation discussion
  const handleUploadDisputeEvidence = (disputeId: string, fileName: string, fileUrl: string) => {
    if (!currentUser) return;
    const updatedDisputes = disputes.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          evidenceFiles: [
            ...d.evidenceFiles,
            {
              name: fileName,
              uploadedBy: currentUser.name,
              url: fileUrl
            }
          ]
        };
      }
      return d;
    });
    saveDisputesState(updatedDisputes);
    showToast('Lampiran bukti berhasil ditambahkan ke berkas sengketa.', 'success');
  };

  // Admin resolves dispute: releasing funds to seller or refunding buyer
  const handleAdminResolveDispute = (disputeId: string, action: 'REFUND' | 'RELEASE', notes: string) => {
    const disp = disputes.find(d => d.id === disputeId);
    if (!disp) return;

    const tx = transactions.find(t => t.id === disp.transactionId);
    if (!tx) return;

    if (action === 'REFUND') {
      // Refund entire transaction amount to Buyer balance
      const updatedUsers = users.map(u => {
        if (u.id === tx.buyerId) {
          return { ...u, balance: u.balance + tx.amount };
        }
        return u;
      });

      const updatedTxs = transactions.map(t => {
        if (t.id === tx.id) {
          return { ...t, escrowStatus: 'FUNDS_REFUNDED' as const };
        }
        return t;
      });

      const updatedDisputes = disputes.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: 'RESOLVED_REFUNDED' as const,
            resolvedAt: new Date().toISOString(),
            resolutionNotes: notes
          };
        }
        return d;
      });

      saveUsersState(updatedUsers);
      saveTransactionsState(updatedTxs);
      saveDisputesState(updatedDisputes);
      showToast('Sengketa ditutup: Keputusan memenangkan Pembeli, dana penuh direfund.', 'success');
    } else {
      // Release funds to Seller (Amount - 5% fee), and platform fee to Admin
      const payoutToSeller = tx.amount - tx.platformFee;
      
      const updatedUsers = users.map(u => {
        if (u.id === tx.sellerId) {
          return { ...u, balance: u.balance + payoutToSeller, earnings: (u.earnings || 0) + payoutToSeller };
        }
        if (u.role === 'ADMIN') {
          return { ...u, balance: u.balance + tx.platformFee };
        }
        if (tx.affiliateReferrerId && u.id === tx.affiliateReferrerId && tx.affiliateCommission) {
          return { ...u, balance: u.balance + tx.affiliateCommission };
        }
        return u;
      });

      const updatedTxs = transactions.map(t => {
        if (t.id === tx.id) {
          return { ...t, escrowStatus: 'FUNDS_RELEASED' as const, releasedAt: new Date().toISOString() };
        }
        return t;
      });

      const updatedDisputes = disputes.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status: 'RESOLVED_RELEASED' as const,
            resolvedAt: new Date().toISOString(),
            resolutionNotes: notes
          };
        }
        return d;
      });

      saveUsersState(updatedUsers);
      saveTransactionsState(updatedTxs);
      saveDisputesState(updatedDisputes);
      showToast('Sengketa ditutup: Keputusan memenangkan Vendor, dana dicairkan.', 'success');
    }

    setSelectedDisputeId(null);
  };

  // --- 4. Filtering Marketplace Logic ---
  const filteredProducts = products.filter(prod => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || prod.languages.some(l => l.toLowerCase() === selectedLanguage.toLowerCase());
    const matchesPrice = prod.price <= priceRange;
    const matchesModeration = prod.status === 'APPROVED'; // must be approved for buyers

    return matchesSearch && matchesCategory && matchesLanguage && matchesPrice && matchesModeration;
  });

  const featuredProducts = products.filter(p => p.isFeatured && p.status === 'APPROVED');

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

  // View Details selector
  const handleViewDetails = (productId: string) => {
    setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white" id="fasmarket-application-root">
      
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce-short">
          <div className={`px-5 py-3 rounded-xl border shadow-2xl flex items-center space-x-2.5 text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-slate-900 text-emerald-400 border-emerald-500/30' 
              : toast.type === 'error'
                ? 'bg-slate-900 text-red-400 border-red-500/30'
                : 'bg-slate-900 text-cyan-400 border-cyan-500/30'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-red-400' : 'bg-cyan-400'
            }`}></div>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar component */}
      {currentUser && (
        <Navbar 
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedProductId(null);
            setSelectedDisputeId(null);
          }}
          onOpenTopUp={() => setTopUpOpen(true)}
          onOpenKYC={() => setKycOpen(true)}
          currency={currency}
          onToggleCurrency={handleToggleCurrency}
        />
      )}

      {/* Main Body Layout */}
      <main className="flex-1">
        
        {/* VIEW 1: PRODUCT DETAILS PANEL */}
        {selectedProductId && (
          (() => {
            const prod = products.find(p => p.id === selectedProductId);
            const prodReviews = reviews.filter(r => r.productId === selectedProductId);
            const myTxs = transactions.filter(t => t.productId === selectedProductId && t.buyerId === currentUser?.id);
            const hasBought = myTxs.length > 0;
            const keyDelivered = myTxs[0]?.serialKeyDelivered;

            if (!prod || !currentUser) return null;
            return (
              <ProductDetails
                product={prod}
                reviews={prodReviews}
                currentUser={currentUser}
                onBack={() => setSelectedProductId(null)}
                onBuy={(id, code) => {
                  setBuyProductOpen(id);
                  if (code) setAppliedAffiliate(code);
                }}
                hasPurchased={hasBought}
                purchasedSerialKey={keyDelivered}
                isSellerVerified={users.find(u => u.id === prod.sellerId)?.kycInfo.status === 'APPROVED'}
                onSubmitReview={(rating, comment) => handleSubmitReview(prod.id, rating, comment)}
                currency={currency}
              />
            );
          })()
        )}

        {/* VIEW 2: ACTIVE DISPUTE MEDIATION PANEL */}
        {selectedDisputeId && currentUser && (
          (() => {
            const disp = disputes.find(d => d.id === selectedDisputeId);
            if (!disp) return null;
            return (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <button
                  onClick={() => setSelectedDisputeId(null)}
                  className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-heading font-bold"
                >
                  <span>&larr; Keluar Ruang Mediasi Sengketa</span>
                </button>
                <DisputePanel
                  dispute={disp}
                  currentUser={currentUser}
                  onSendMessage={handleSendDisputeMessage}
                  onUploadEvidence={handleUploadDisputeEvidence}
                  onAdminResolve={handleAdminResolveDispute}
                />
              </div>
            );
          })()
        )}

        {/* GENERAL TAB PAGES */}
        {!selectedProductId && !selectedDisputeId && currentUser && (
          <>
            {/* TAB A: MARKETPLACE HOME */}
            {activeTab === 'marketplace' && (
              <div className="space-y-12 pb-16">
                {/* Hero section */}
                <section className="relative overflow-hidden bg-slate-900 border-b border-slate-800 py-16 md:py-24 text-left">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_50%)]"></div>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
                        <Sparkles size={13} className="animate-spin-slow" />
                        <span>Keamanan Escrow 100% Terjamin</span>
                      </div>

                      <h1 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-tight md:leading-none">
                        Pasar Digital <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                          Source Code & Software
                        </span>
                      </h1>

                      <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-lg font-sans">
                        FasMarket mempertemukan perusahaan, profesional, dan developer independen untuk jual-beli source code aplikasi siap deploy, dilindungi sistem escrow andalan dari PT Fas Technology Solutions.
                      </p>

                      <div className="flex flex-wrap gap-3.5 pt-2">
                        <a 
                          href="#all-products"
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5"
                        >
                          <span>Jelajahi Source Code</span>
                          <ArrowRight size={14} />
                        </a>
                        <button
                          onClick={() => {
                            if (currentUser.role === 'SELLER') setActiveTab('seller-dashboard');
                            else {
                              // Auto KYC trigger to show how easy to switch role
                              setKycOpen(true);
                            }
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-heading font-semibold px-5 py-3 rounded-xl transition-colors"
                        >
                          Mulai Berjualan
                        </button>
                      </div>
                    </div>

                    {/* Bento visual teaser */}
                    <div className="hidden md:grid grid-cols-2 gap-4">
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2.5">
                        <Lock className="text-cyan-400" size={24} />
                        <h4 className="font-heading font-bold text-xs text-slate-100">Escrow Protektif</h4>
                        <p className="text-[10px] text-slate-500 font-sans leading-normal">Dana pembeli aman didepositkan di vault kustodia sebelum pelepasan.</p>
                      </div>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2.5 translate-y-6">
                        <Coins className="text-indigo-400" size={24} />
                        <h4 className="font-heading font-bold text-xs text-slate-100">Hanya 5% Fee</h4>
                        <p className="text-[10px] text-slate-500 font-sans leading-normal">PT Fas Tech menyajikan infrastruktur premium dengan komisi kompetitif.</p>
                      </div>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2.5">
                        <ShieldCheck className="text-emerald-400" size={24} />
                        <h4 className="font-heading font-bold text-xs text-slate-100">Audit KYC Lulus</h4>
                        <p className="text-[10px] text-slate-500 font-sans leading-normal">Seluruh developer diuji identitas legalitas perusahaan guna mencegah malware.</p>
                      </div>
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2.5 translate-y-6">
                        <BookOpen className="text-purple-400" size={24} />
                        <h4 className="font-heading font-bold text-xs text-slate-100">Edukasi Pemasaran</h4>
                        <p className="text-[10px] text-slate-500 font-sans leading-normal">Maksimalkan penjualan dengan artikel edukasi terintegrasi produk.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Products Carousel look */}
                {featuredProducts.length > 0 && (
                  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 text-left">
                    <div className="flex items-center space-x-2 text-amber-400 font-heading font-extrabold text-sm uppercase tracking-wider">
                      <Sparkles size={16} />
                      <span>PRODUK SPONSOR / BOOSTED FEATURED</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredProducts.map((prod) => (
                        <div 
                          key={prod.id} 
                          onClick={() => handleViewDetails(prod.id)}
                          className="bg-slate-900 border-2 border-indigo-500/50 rounded-2xl p-6 flex flex-col md:flex-row gap-5 hover:border-indigo-400 transition-colors cursor-pointer group shadow-xl shadow-indigo-500/5"
                        >
                          <img 
                            src={prod.thumbnail} 
                            alt={prod.title} 
                            className="w-full md:w-44 h-28 object-cover rounded-xl border border-slate-800 group-hover:scale-102 transition-transform" 
                          />
                          <div className="flex-1 flex flex-col justify-between text-left">
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/20">
                                {prod.category.toUpperCase()}
                              </span>
                              <h3 className="font-heading font-bold text-white text-sm group-hover:text-indigo-400 transition-colors line-clamp-2 mt-1">
                                {prod.title}
                              </h3>
                              <p className="text-slate-400 text-[11px] font-sans line-clamp-1">{prod.description}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-3.5 mt-3">
                              <span className="font-mono font-bold text-xs text-white">{formatIDR(prod.price)}</span>
                              <span className="text-[10px] text-indigo-400 font-heading font-semibold flex items-center space-x-0.5">
                                <span>Lihat Selengkapnya</span>
                                <ArrowRight size={12} />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* All products listing grid with filters */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6" id="all-products">
                  
                  {/* Filters bar */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md text-left">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2 text-slate-300 font-heading font-extrabold text-sm">
                        <Filter size={16} />
                        <span>Filter Produk Jual-Beli</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">Ditemukan {filteredProducts.length} produk siap pakai</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                      {/* Search */}
                      <div className="space-y-1.5 relative" id="marketplace-search-container">
                        <label className="block text-[10px] uppercase font-mono text-slate-500">Pencarian Kata Kunci</label>
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 transition-colors">
                          <Search size={14} className="text-slate-500 mr-2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setSuggestionsOpen(true);
                            }}
                            onFocus={() => setSuggestionsOpen(true)}
                            onBlur={() => setTimeout(() => setSuggestionsOpen(false), 250)}
                            placeholder="Cari POS, Next.js, Flutter..."
                            className="bg-transparent text-white focus:outline-none w-full placeholder-slate-600 animate-none"
                          />
                        </div>

                        {/* Suggestion Dropdown */}
                        {suggestionsOpen && searchQuery.trim().length > 0 && (
                          <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800/60 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            {(() => {
                              const matching = products.filter(prod => {
                                const isApproved = prod.status === 'APPROVED';
                                const matchTitle = prod.title.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchDesc = prod.description.toLowerCase().includes(searchQuery.toLowerCase());
                                const matchLang = prod.languages.some(lang => lang.toLowerCase().includes(searchQuery.toLowerCase()));
                                return isApproved && (matchTitle || matchDesc || matchLang);
                              }).slice(0, 5);

                              if (matching.length === 0) {
                                return (
                                  <div className="px-4 py-3 text-slate-500 text-[11px] text-center font-sans">
                                    Tidak ada produk yang cocok
                                  </div>
                                );
                              }

                              return matching.map((prod) => (
                                <button
                                  key={prod.id}
                                  type="button"
                                  onMouseDown={() => {
                                    handleViewDetails(prod.id);
                                    setSuggestionsOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-slate-800/70 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer group"
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0">
                                    <img
                                      src={prod.thumbnail}
                                      alt={prod.title}
                                      className="w-8 h-8 rounded object-cover border border-slate-800 flex-shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="min-w-0">
                                      <span className="font-heading font-bold text-slate-200 group-hover:text-indigo-400 transition-colors block truncate">
                                        {prod.title}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-500 block mt-0.5 uppercase">
                                        {prod.category} • {prod.languages?.join(', ')}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                                    {formatIDR(prod.price)}
                                  </span>
                                </button>
                              ));
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Category */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono text-slate-500">Kategori Aplikasi</label>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value as any)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 h-9"
                        >
                          <option value="all">Semua Kategori</option>
                          <option value="source-code">Source Code</option>
                          <option value="web-app">Aplikasi Web</option>
                          <option value="desktop-software">Software Desktop</option>
                          <option value="mobile-app">Aplikasi Mobile</option>
                        </select>
                      </div>

                      {/* Language */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-mono text-slate-500">Bahasa Pemrograman</label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 h-9"
                        >
                          <option value="all">Semua Bahasa</option>
                          <option value="TypeScript">TypeScript</option>
                          <option value="Go">Go / Golang</option>
                          <option value="PHP">PHP / Laravel</option>
                          <option value="Dart">Dart / Flutter</option>
                        </select>
                      </div>

                      {/* Price limit */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] uppercase font-mono text-slate-500">
                          <span>Batas Harga</span>
                          <span className="font-mono text-slate-300">{formatIDR(priceRange)}</span>
                        </div>
                        <input
                          type="range"
                          min={500000}
                          max={6000000}
                          step={100000}
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer h-9"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  {filteredProducts.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
                      Tidak ada produk digital yang sesuai dengan filter pencarian Anda. Silakan ubah opsi saringan di atas.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {filteredProducts.map((prod) => (
                        <div key={prod.id}>
                          <ProductCard 
                            product={prod} 
                            onViewDetails={handleViewDetails} 
                            isSellerVerified={users.find(u => u.id === prod.sellerId)?.kycInfo.status === 'APPROVED'}
                            currency={currency}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                </section>
              </div>
            )}

            {/* TAB B: BLOGS JOURNAL */}
            {activeTab === 'blogs' && (
              <BlogPanel
                articles={blogArticles}
                products={products}
                onSelectProduct={handleViewDetails}
                currency={currency}
              />
            )}

            {/* TAB C: PURCHASES MY ORDERS & ACTIVE ESCROWS */}
            {activeTab === 'my-purchases' && currentUser && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-mono font-bold text-indigo-400">
                      TRANSAKSI PEMBELI
                    </span>
                    <h1 className="font-heading font-extrabold text-2xl text-white mt-1">
                      Pesanan & Brankas Escrow Saya
                    </h1>
                    <p className="text-slate-400 text-xs mt-1 leading-normal font-sans">
                      Inspeksi source code yang sudah Anda beli, unduh zip, lihat serial key lisensi, atau cairkan saldo escrow ke developer jika Anda puas.
                    </p>
                  </div>

                  {/* CSV Export Button */}
                  {transactions.filter(t => t.buyerId === currentUser.id).length > 0 && (
                    <button
                      onClick={handleDownloadCSV}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-2 shadow-lg shadow-indigo-600/10 cursor-pointer hover:shadow-indigo-600/25 active:scale-95 flex-shrink-0"
                    >
                      <FileSpreadsheet size={14} />
                      <span>Ekspor Riwayat CSV</span>
                    </button>
                  )}
                </div>

                {transactions.filter(t => t.buyerId === currentUser.id).length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs font-sans">
                    Anda belum pernah melakukan pembelian perangkat lunak apapun. Jelajahi marketplace untuk transaksi pertama Anda!
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* FINANCIAL SUMMARY CARD */}
                    {(() => {
                      const buyerTxs = transactions.filter(t => t.buyerId === currentUser.id);
                      const totalSpent = buyerTxs.reduce((sum, tx) => sum + tx.amount, 0);
                      const activeEscrows = buyerTxs.filter(tx => tx.escrowStatus === 'FUNDS_HELD' || tx.escrowStatus === 'DISPUTE_OPENED').length;
                      const activeDisputes = buyerTxs.filter(tx => tx.escrowStatus === 'DISPUTE_OPENED').length;
                      const chartData = getSpendingDataForLast6Months();

                      return (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="buyer-financial-summary">
                          {/* Card Title */}
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="text-indigo-400" size={18} />
                              <h3 className="font-heading font-bold text-sm text-white">Ringkasan Finansial & Tren Pengeluaran</h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">6 Bulan Terakhir</span>
                          </div>

                          {/* Stats Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Akumulasi Belanja</span>
                              <div className="mt-2">
                                <span className="text-xl font-mono font-extrabold text-emerald-400">
                                  {formatIDR(totalSpent)}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-500 mt-1">Meliputi semua status transaksi</span>
                            </div>

                            <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">Dana Tertahan di Escrow</span>
                              <div className="mt-2 flex items-center justify-between">
                                <span className="text-xl font-mono font-extrabold text-indigo-400">
                                  {activeEscrows} <span className="text-xs font-normal text-slate-400">Transaksi</span>
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-500 mt-1">Aman tersimpan di Kustodia</span>
                            </div>

                            <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 flex flex-col justify-between">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">Sengketa Terbuka (Dispute)</span>
                              <div className="mt-2">
                                <span className={`text-xl font-mono font-extrabold ${activeDisputes > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                  {activeDisputes} <span className="text-xs font-normal text-slate-400">Sengketa</span>
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-500 mt-1">Memerlukan resolusi admin</span>
                            </div>
                          </div>

                          {/* Trend Chart (Recharts) */}
                          <div className="h-64 w-full bg-slate-950/40 rounded-xl border border-slate-800/60 p-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={chartData}
                                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                  dataKey="name" 
                                  stroke="#64748b" 
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false}
                                />
                                <YAxis 
                                  stroke="#64748b" 
                                  fontSize={10}
                                  tickLine={false}
                                  axisLine={false}
                                  tickFormatter={(value) => value === 0 ? '0' : `${(value / 1000000).toFixed(1)}jt`}
                                />
                                <Tooltip
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl font-sans text-xs">
                                          <p className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">{label}</p>
                                          <p className="text-indigo-400 font-mono font-bold mt-1 text-sm">
                                            {formatIDR(payload[0].value as number)}
                                          </p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Area 
                                  type="monotone" 
                                  dataKey="Pengeluaran" 
                                  stroke="#6366f1" 
                                  strokeWidth={2.5}
                                  fillOpacity={1} 
                                  fill="url(#spendingGradient)" 
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      );
                    })()}

                    {/* TRANSACTION LIST */}
                    <div className="space-y-4">
                      <div className="border-b border-slate-800 pb-2">
                        <h4 className="font-heading font-bold text-sm text-slate-300">Daftar Jaminan Escrow Aktif & Riwayat</h4>
                      </div>
                      <div className="space-y-8">
                        {transactions
                          .filter(t => t.buyerId === currentUser.id)
                          .map((tx) => (
                            <div key={tx.id}>
                              <EscrowTracker
                                transaction={tx}
                                onReleaseFunds={handleReleaseEscrow}
                                onOpenDispute={handleOpenDispute}
                                isBuyer={true}
                                isSeller={false}
                                onOpenDisputeDiscussion={(id) => {
                                  const disp = disputes.find(d => d.transactionId === id);
                                  if (disp) setSelectedDisputeId(disp.id);
                                }}
                                currency={currency}
                              />
                            </div>
                          ))
                        }
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TAB D: SELLER PORTAL DASHBOARD */}
            {activeTab === 'seller-dashboard' && (
              <SellerDashboard
                currentUser={currentUser}
                products={products}
                blogArticles={blogArticles}
                withdrawalRequests={withdrawalRequests}
                onUploadProduct={handleUploadProduct}
                onBoostProduct={handleBoostProduct}
                onWithdrawFunds={handleWithdrawFunds}
                onCreateBlogArticle={handleCreateBlogArticle}
                onOpenKYC={() => setKycOpen(true)}
                currency={currency}
              />
            )}

            {/* TAB E: ADMIN SECURITY COMPLIANCE DASHBOARD */}
            {activeTab === 'admin-dashboard' && (
              <AdminDashboard
                products={products}
                users={users}
                disputes={disputes}
                withdrawalRequests={withdrawalRequests}
                onApproveProduct={handleApproveProduct}
                onRejectProduct={handleRejectProduct}
                onApproveKYC={handleApproveKYC}
                onRejectKYC={handleRejectKYC}
                onApproveWithdrawal={handleApproveWithdrawal}
                onRejectWithdrawal={handleRejectWithdrawal}
                onSelectDispute={(id) => setSelectedDisputeId(id)}
                currency={currency}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500 font-sans" id="fasmarket-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="font-heading font-extrabold text-slate-300">PT Fas Technology Solutions</span>
            <p className="mt-1">© 2026 FasMarket. Standard Lisensi Digital Terjamin. All rights reserved.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 text-slate-400">
            <a href="#about" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400">EULA Perjanjian</a>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400">Kebijakan Privasi</a>
            <a href="#disclaimer" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400">Regulasi PPN Pajak</a>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400 font-mono text-[10px]">Kustodia Secure SDK v2.4.0</span>
          </div>
        </div>
      </footer>

      {/* --- MODAL 1: ESCROW CHECKOUT / PAYMENT MODAL --- */}
      {buyProductOpen && currentUser && (
        (() => {
          const prod = products.find(p => p.id === buyProductOpen);
          if (!prod) return null;

          const totalTax = prod.price * 0.05; // 5% simulated VAT

          return (
            <div className="fixed inset-0 z-50 overflow-y-auto" id="checkout-gateway-modal">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-slate-950/80 backdrop-blur-sm" onClick={() => setBuyProductOpen(null)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

                <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold">Kustodia Gateway Secure</span>
                    <h3 className="font-heading font-extrabold text-sm text-white">Metode Pembayaran Aman</h3>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300">
                      <div>Membeli: <strong className="text-white">{prod.title}</strong></div>
                      <div className="text-[10px] text-slate-500 mt-1">Vendor: {prod.sellerName}</div>
                    </div>

                    {/* Choose gateway */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-mono text-slate-500 font-semibold">Pilih Gerbang Pembayaran</label>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => setCheckoutPaymentMethod('BANK_TRANSFER')}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-colors ${
                            checkoutPaymentMethod === 'BANK_TRANSFER' 
                              ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500' 
                              : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>Bank Mandiri / BCA (Virtual Account)</span>
                          <span className="text-[9px] uppercase font-mono">FIAT IDR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckoutPaymentMethod('E_WALLET')}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-colors ${
                            checkoutPaymentMethod === 'E_WALLET' 
                              ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500' 
                              : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>GoPay / OVO (QRIS Instant)</span>
                          <span className="text-[9px] uppercase font-mono">E-Wallet</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckoutPaymentMethod('CRYPTO_USDC')}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-colors ${
                            checkoutPaymentMethod === 'CRYPTO_USDC' 
                              ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500' 
                              : 'bg-slate-950/40 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <span>USDC Stablecoin (Ethereum mainnet)</span>
                          <span className="text-[9px] uppercase font-mono">CRYPTO</span>
                        </button>
                      </div>
                    </div>

                    {/* Receipt simulation */}
                    <div className="border-t border-slate-800/80 pt-3 space-y-1 text-[11px] text-slate-400 font-sans">
                      <div className="flex justify-between">
                        <span>Harga Aplikasi</span>
                        <span className="font-mono text-slate-100">{formatIDR(prod.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pajak PPN (5% Terhitung)</span>
                        <span className="font-mono">{formatIDR(totalTax)}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-slate-800/50 pt-1 text-slate-100 text-xs">
                        <span>Grand Total Jaminan</span>
                        <span className="font-mono text-emerald-400">{formatIDR(prod.price)}</span>
                      </div>
                    </div>

                    {/* Submit check button */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setBuyProductOpen(null)}
                        className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-heading font-semibold py-2.5 rounded-xl transition-colors border border-slate-700/60"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-heading font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10"
                      >
                        Bayar & Tahan Escrow
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* --- MODAL 2: BUYER TOP UP DIALOG --- */}
      {topUpOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="top-up-wallet-modal">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-slate-950/80 backdrop-blur-sm" onClick={() => setTopUpOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block w-full max-w-sm overflow-hidden text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-[10px] uppercase font-mono text-cyan-400">Simulasi Top Up Mandiri</span>
                <h3 className="font-heading font-extrabold text-sm text-white">Tambahkan Saldo Simulasi</h3>
              </div>

              <form onSubmit={handleTopUpSubmit} className="space-y-4">
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Masukkan jumlah dana simulasi dalam IDR untuk menguji fungsionalitas pembelian escrow, dispute, dan penarikan saldo.
                </p>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1 font-semibold">Jumlah Dana (IDR)</label>
                  <input
                    type="number"
                    required
                    min={100000}
                    step={100000}
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-bold text-center text-sm"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setTopUpOpen(false)}
                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-heading font-semibold py-2 rounded-xl border border-slate-700/60"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold py-2 rounded-xl transition-colors shadow-sm"
                  >
                    Tambah Saldo
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: KYC MULTI-STEP VERIFICATION --- */}
      {kycOpen && currentUser && (
        <KYCModal
          currentUser={currentUser}
          onClose={() => setKycOpen(false)}
          onSubmitKYC={handleSubmitKYC}
        />
      )}

    </div>
  );
}
