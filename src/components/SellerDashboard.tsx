import React, { useState } from 'react';
import { Product, User, BlogArticle, WithdrawalRequest } from '../types';
import { 
  Plus, 
  Layers, 
  Coins, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  FileText, 
  BookOpen, 
  Zap, 
  Key, 
  DollarSign, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';

interface SellerDashboardProps {
  currentUser: User;
  products: Product[];
  blogArticles: BlogArticle[];
  withdrawalRequests: WithdrawalRequest[];
  onUploadProduct: (prodData: any) => void;
  onBoostProduct: (productId: string) => void;
  onWithdrawFunds: (withdrawalData: {
    amount: number;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }) => void;
  onCreateBlogArticle: (articleData: {
    title: string;
    content: string;
    productId: string;
    tags: string[];
  }) => void;
  onOpenKYC: () => void;
  currency?: 'IDR' | 'USD';
}

export default function SellerDashboard({
  currentUser,
  products,
  blogArticles,
  withdrawalRequests,
  onUploadProduct,
  onBoostProduct,
  onWithdrawFunds,
  onCreateBlogArticle,
  onOpenKYC,
  currency = 'IDR'
}: SellerDashboardProps) {
  // Tabs within vendor dashboard
  const [vendorSubTab, setVendorSubTab] = useState<'products' | 'upload' | 'withdraw' | 'blog' | 'serial'>('products');

  // Upload Product form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [category, setCategory] = useState<'source-code' | 'web-app' | 'desktop-software' | 'mobile-app'>('source-code');
  const [price, setPrice] = useState<number>(0);
  const [languages, setLanguages] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [sourceCodeFile, setSourceCodeFile] = useState('source_code_archive.zip');
  const [licenseType, setLicenseType] = useState<'Standard' | 'Extended Commercial'>('Standard');
  const [serialKeys, setSerialKeys] = useState('');

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [bankName, setBankName] = useState('Bank Mandiri');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState(currentUser.name);

  // Blog article state
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogProductId, setBlogProductId] = useState('');
  const [blogTags, setBlogTags] = useState('');

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

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || price <= 0 || !languages || !demoUrl) {
      alert('Mohon isi seluruh data form produk.');
      return;
    }
    const productData = {
      title,
      description,
      detailedDescription,
      category,
      price: Number(price),
      languages: languages.split(',').map(l => l.trim()),
      demoUrl,
      sourceCodeFile,
      licenseType,
      serialKeys: serialKeys ? serialKeys.split('\n').map(k => k.trim()).filter(Boolean) : []
    };
    onUploadProduct(productData);
    alert('Produk berhasil diajukan untuk moderasi admin!');
    setVendorSubTab('products');
    setTitle('');
    setDescription('');
    setDetailedDescription('');
    setLanguages('');
    setDemoUrl('');
    setSerialKeys('');
    setPrice(0);
  };

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      alert('Jumlah penarikan harus lebih besar dari nol.');
      return;
    }
    if (withdrawAmount > currentUser.balance) {
      alert('Saldo Anda tidak mencukupi untuk penarikan ini.');
      return;
    }
    if (!accountNumber) {
      alert('Mohon masukkan nomor rekening bank.');
      return;
    }

    onWithdrawFunds({
      amount: withdrawAmount,
      bankName,
      accountNumber,
      accountHolder
    });
    alert('Pengajuan penarikan dana berhasil dikirim ke Admin PT Fas Tech!');
    setWithdrawAmount(0);
    setAccountNumber('');
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !blogProductId) {
      alert('Mohon isi seluruh bidang artikel.');
      return;
    }
    onCreateBlogArticle({
      title: blogTitle,
      content: blogContent,
      productId: blogProductId,
      tags: blogTags ? blogTags.split(',').map(t => t.trim()) : ['Tech']
    });
    alert('Artikel edukasi berhasil diterbitkan di portal FasMarket!');
    setBlogTitle('');
    setBlogContent('');
    setBlogTags('');
    setVendorSubTab('blog');
  };

  // Filter products owned by current seller
  const sellerProducts = products.filter(p => p.sellerId === currentUser.id);
  const sellerArticles = blogArticles.filter(a => a.authorId === currentUser.id);
  const sellerWithdrawals = withdrawalRequests.filter(w => w.sellerId === currentUser.id);

  // KYC validation render guard
  if (currentUser.kycInfo.status !== 'APPROVED') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-left" id="vendor-dashboard-kyc-guard">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6 text-center shadow-sm">
          <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-heading font-extrabold text-lg text-slate-800">Verifikasi KYC Diperlukan</h2>
            {currentUser.kycInfo.status === 'NONE' && (
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda terdaftar sebagai vendor, namun belum menyelesaikan verifikasi identitas resmi (KYC). Sesuai aturan PT Fas Technology Solutions, KYC wajib diisi sebelum mengunggah produk dan mencairkan pendapatan.
              </p>
            )}
            {currentUser.kycInfo.status === 'PENDING' && (
              <p className="text-xs text-slate-500 leading-relaxed">
                Permohonan audit KYC identitas Anda saat ini sedang ditinjau oleh departemen compliance Admin PT Fas Tech. Silakan tunggu atau beralih ke profil Admin untuk menyetujui KYC Anda secara instan.
              </p>
            )}
            {currentUser.kycInfo.status === 'REJECTED' && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-left text-xs text-red-600">
                <span className="font-bold">Ditolak:</span> {currentUser.kycInfo.rejectionReason || 'Dokumen buram atau NIK tidak valid.'}
              </div>
            )}
          </div>

          <div className="pt-2">
            {currentUser.kycInfo.status === 'NONE' || currentUser.kycInfo.status === 'REJECTED' ? (
              <button
                onClick={onOpenKYC}
                className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Mulai Verifikasi KYC Sekarang
              </button>
            ) : (
              <div className="inline-block text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg">
                Status: SEDANG DITINJAU ADMIN
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="seller-dashboard-panel">
      {/* Overview stats header */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-left">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono font-bold text-blue-600">
            PORTAL VENDOR / DEVELOPER
          </span>
          <h1 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
            Dashboard Penjualan: {currentUser.name}
          </h1>
          <p className="text-slate-500 text-xs mt-1 leading-normal font-sans">
            Kelola listing source code, unggah serial lisensi, tarik penghasilan, dan optimalkan pemasaran afiliasi.
          </p>
        </div>

        {/* Balance withdraw shortcut */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center space-x-4 shadow-sm">
          <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl border border-emerald-100">
            <Coins size={18} />
          </div>
          <div className="text-xs text-left">
            <span className="block text-[9px] uppercase font-mono text-slate-400 leading-none">Pendapatan Siap Cair</span>
            <span className="font-mono font-bold text-sm text-slate-900 mt-1 block">{formatIDR(currentUser.balance)}</span>
          </div>
          <button
            onClick={() => setVendorSubTab('withdraw')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-heading font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Tarik Dana
          </button>
        </div>
      </div>

      {/* Sub Tabs control */}
      <div className="flex border-b border-slate-200 space-x-1 font-heading text-xs font-semibold overflow-x-auto pb-0.5">
        <button
          onClick={() => setVendorSubTab('products')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            vendorSubTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>Produk Saya ({sellerProducts.length})</span>
        </button>
        <button
          onClick={() => setVendorSubTab('upload')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            vendorSubTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Plus size={14} />
          <span>Upload Produk Baru</span>
        </button>
        <button
          onClick={() => setVendorSubTab('withdraw')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            vendorSubTab === 'withdraw' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign size={14} />
          <span>Penarikan Saldo</span>
        </button>
        <button
          onClick={() => setVendorSubTab('blog')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            vendorSubTab === 'blog' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen size={14} />
          <span>Pemasaran Blog</span>
        </button>
        <button
          onClick={() => setVendorSubTab('serial')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
            vendorSubTab === 'serial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key size={14} />
          <span>Stok Serial Key</span>
        </button>
      </div>

      {/* Main SubTab Content Panels */}
      <div className="text-left">
        
        {/* TAB 1: Products List */}
        {vendorSubTab === 'products' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-slate-800 text-base">Daftar Portofolio Perangkat Lunak</h3>
              <button 
                onClick={() => setVendorSubTab('upload')}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shadow-sm cursor-pointer"
              >
                <Plus size={12} />
                <span>Tambah Produk</span>
              </button>
            </div>

            {sellerProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center text-slate-500 text-xs font-sans shadow-sm">
                Anda belum mengunggah produk apapun. Klik 'Upload Produk Baru' untuk memulai bisnis Anda!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sellerProducts.map((prod) => (
                  <div key={prod.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 flex-1">
                        <span className={`inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                          prod.status === 'APPROVED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : prod.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-750 border-amber-100'
                              : 'bg-red-50 text-red-650 border-red-100'
                        }`}>
                          {prod.status === 'APPROVED' ? 'LOLOS MODERASI' : prod.status === 'PENDING' ? 'MENUNGGU AUDIT' : 'DITOLAK'}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-slate-800 truncate mt-2">{prod.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-sans">{prod.description}</p>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-900 ml-2">
                        {formatIDR(prod.price)}
                      </span>
                    </div>

                    {prod.status === 'REJECTED' && prod.rejectionReason && (
                      <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-[10px] text-red-650 font-sans">
                        <strong>Alasan Penolakan Admin:</strong> "{prod.rejectionReason}"
                      </div>
                    )}

                    {/* Boosting/Featured & Serial Actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 flex-wrap gap-2">
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        Penjualan: <strong className="text-slate-700">{(prod.reviewCount + 1)} unit</strong>
                      </span>

                      <div className="flex items-center space-x-2">
                        {prod.status === 'APPROVED' && !prod.isFeatured && (
                          <button
                            onClick={() => {
                              if (currentUser.balance < 500000) {
                                alert('Saldo pendapatan Anda tidak mencukupi untuk melakukan Boosting iklan (Biaya Rp 500.000).');
                                return;
                              }
                              if (confirm(`Apakah Anda setuju mendepositkan Rp 500.000 dari saldo Anda untuk memboost '${prod.title}' agar tayang di banner utama halaman depan?`)) {
                                onBoostProduct(prod.id);
                              }
                            }}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-105 text-slate-900 text-[10px] font-heading font-extrabold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 shadow-sm cursor-pointer"
                            title="Tampilkan di Banner Utama (Biaya Rp 500.000)"
                          >
                            <Zap size={11} className="fill-slate-900 text-slate-900" />
                            <span>Boost Featured</span>
                          </button>
                        )}
                        {prod.isFeatured && (
                          <span className="bg-blue-600 text-white text-[9px] font-heading font-bold px-2.5 py-1.5 rounded-lg flex items-center space-x-1">
                            <Zap size={10} className="fill-white" />
                            <span>IKLAN AKTIF</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Upload Product Form */}
        {vendorSubTab === 'upload' && (
          <form onSubmit={handleProductSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-heading font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Plus size={18} className="text-blue-600" />
              <span>Daftarkan Source Code / Software Digital</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Judul Produk Aplikasi (Wajib)
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Aplikasi POS Laundry berbasis Laravel 11"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                      Kategori Produk
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    >
                      <option value="source-code">Source Code</option>
                      <option value="web-app">Aplikasi Web</option>
                      <option value="desktop-software">Software Desktop</option>
                      <option value="mobile-app">Aplikasi Mobile</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                      Harga Jual (IDR)
                    </label>
                    <input
                      type="number"
                      required
                      min={10000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="Masukkan harga"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Bahasa / Framework <span className="text-slate-400">(Pisahkan dengan koma)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                    placeholder="Contoh: PHP, Laravel 11, MySQL, Tailwind CSS"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Deskripsi Singkat (Pencarian & SEO)
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    maxLength={160}
                    placeholder="Jelaskan fitur utama aplikasi secara singkat padat untuk listing..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Link Demo Web Aplikasi (Wajib)
                  </label>
                  <input
                    type="url"
                    required
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="Contoh: https://pos-laundry.demoweb.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Nama File Source Code (Mocking ZIP)
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceCodeFile}
                    onChange={(e) => setSourceCodeFile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Tipe Lisensi Digital
                  </label>
                  <select
                    value={licenseType}
                    onChange={(e) => setLicenseType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Standard">Standard License (Satu Instansi)</option>
                    <option value="Extended Commercial">Extended Commercial (Re-distribusi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Serial Key / CD-Keys Lisensi <span className="text-slate-400">(Satu per baris - Autofill)</span>
                  </label>
                  <textarea
                    value={serialKeys}
                    onChange={(e) => setSerialKeys(e.target.value)}
                    rows={2}
                    placeholder="Contoh:&#13;KEY-POSLAUNDRY-8890&#13;KEY-POSLAUNDRY-1243"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                Dokumentasi & Panduan Instalasi (Markdown ready)
              </label>
              <textarea
                value={detailedDescription}
                onChange={(e) => setDetailedDescription(e.target.value)}
                rows={4}
                placeholder="Tuliskan petunjuk instalasi lengkap, prasyarat server, konfigurasi database, dll..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
              >
                Kirim Pengajuan Produk
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Withdrawals panel */}
        {vendorSubTab === 'withdraw' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <form onSubmit={handleWithdrawalSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <h3 className="font-heading font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center space-x-2">
                <DollarSign size={18} className="text-blue-600" />
                <span>Pengajuan Penarikan Saldo Pendapatan</span>
              </h3>

              <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Ketentuan Kepatuhan Pajak PT Fas Tech</span>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                  Sesuai ketentuan perpajakan, penarikan pendapatan di atas Rp 2.000.000 dikenakan PPh 21 sebesar 2.5% (bagi pemilik NPWP) atau 3% (non-NPWP) yang akan dipotong otomatis oleh keuangan perusahaan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Jumlah Dana Ditarik (IDR)
                  </label>
                  <input
                    type="number"
                    required
                    min={100000}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                    placeholder="Contoh: 5000000"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Saldo maksimal Anda: {formatIDR(currentUser.balance)}</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Nama Bank Penerima
                  </label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Bank Mandiri">Bank Mandiri (IDR)</option>
                    <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                    <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
                    <option value="Kustodia Ledger (USDC)">Kustodia Ledger (USDC Stablecoin)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Nomor Rekening / Wallet Address
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Contoh: 132-00-1234567-9"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Nama Pemilik Rekening (Wajib Sama dengan KYC)
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Ajukan Pencairan Dana
                </button>
              </div>
            </form>

            {/* Withdraw History */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
              <h4 className="font-heading font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm">Riwayat Penarikan</h4>
              
              {sellerWithdrawals.length === 0 ? (
                <p className="text-slate-400 text-center py-4 font-sans">Belum ada riwayat penarikan.</p>
              ) : (
                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {sellerWithdrawals.map((req) => (
                    <div key={req.id} className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-left space-y-2">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-slate-800">{formatIDR(req.amount)}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          req.status === 'APPROVED' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : req.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border-amber-100'
                              : 'bg-red-50 text-red-650 border-red-100'
                        }`}>
                          {req.status === 'APPROVED' ? 'SUKSES TRANSFER' : req.status === 'PENDING' ? 'MENUNGGU TRANSFER' : 'DITOLAK'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 space-y-0.5">
                        <div>Bank: {req.bankName}</div>
                        <div>Tgl Pengajuan: {new Date(req.createdAt).toLocaleDateString('id-ID')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: Write Technical Blog Form */}
        {vendorSubTab === 'blog' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Form */}
            <form onSubmit={handleBlogSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
              <h3 className="font-heading font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center space-x-2">
                <BookOpen size={18} className="text-blue-600" />
                <span>Publikasikan Artikel Edukasi Teknis</span>
              </h3>

              <p className="text-xs text-slate-500 leading-normal font-sans">
                Tulis artikel berkualitas mengenai pemecahan masalah teknis atau desain arsitektur yang Anda pakai pada source code produk Anda. Artikel edukasi berpotensi menaikkan rasa percaya pembeli hingga <strong>80%</strong>!
              </p>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                  Judul Artikel Edukasi (SEO-Friendly)
                </label>
                <input
                  type="text"
                  required
                  value={blogTitle}
                  onChange={(e) => setBlogTitle(e.target.value)}
                  placeholder="Contoh: Rahasia Sinkronisasi Database Kasir Offline-First"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Hubungkan ke Produk Aplikasi Anda
                  </label>
                  <select
                    required
                    value={blogProductId}
                    onChange={(e) => setBlogProductId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Pilih Produk Terkait --</option>
                    {sellerProducts.filter(p => p.status === 'APPROVED').map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                    Tags Artikel <span className="text-slate-400">(Pisahkan dengan koma)</span>
                  </label>
                  <input
                    type="text"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="Contoh: Offline, React, Database, POS"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-1.5">
                  Isi Artikel Edukasi Teknis (Mendukung Teks Paragraf)
                </label>
                <textarea
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  rows={6}
                  placeholder="Ceritakan tantangan teknis, arsitektur folder kodingan, atau strategi optimasi sistem yang Anda selesaikan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Terbitkan Artikel Sekarang
                </button>
              </div>
            </form>

            {/* Published blogs list */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-xs space-y-4 shadow-sm">
              <h4 className="font-heading font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm">Diterbitkan ({sellerArticles.length})</h4>
              
              {sellerArticles.length === 0 ? (
                <p className="text-slate-400 text-center py-4 font-sans">Belum menulis artikel edukasi.</p>
              ) : (
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {sellerArticles.map((art) => (
                    <div key={art.id} className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl text-left space-y-1.5">
                      <h5 className="font-heading font-bold text-slate-800 line-clamp-1">{art.title}</h5>
                      <span className="block text-[9px] font-mono text-blue-600">Terkait: {art.productTitle.substring(0, 30)}...</span>
                      <p className="text-[10px] text-slate-400 font-mono">Tgl: {new Date(art.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 5: Serial Keys Autofill manager */}
        {vendorSubTab === 'serial' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-heading font-bold text-slate-800 text-base border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Key size={18} className="text-blue-600" />
              <span>Manajemen Serial Key / Serial Lisensi Digital</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Setiap kali buyer melakukan pembelian software, sistem FasMarket akan melakukan <strong>autofill pengiriman serial key</strong> secara otomatis dari stok lisensi yang Anda cantumkan di bawah ini. Hal ini memastikan proses penyaluran instant 24 jam tanpa menunggu kehadiran Anda online!
            </p>

            <div className="space-y-4">
              {sellerProducts.length === 0 ? (
                <p className="text-slate-500 text-xs py-4 text-center font-sans">Unggah produk terlebih dahulu.</p>
              ) : (
                sellerProducts.map((prod) => (
                  <div key={prod.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-slate-800">{prod.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">Zip file: {prod.sourceCodeFile}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-mono">
                        <span className="text-slate-400 uppercase text-[9px] block">Sisa Serial Stok</span>
                        <span className={`font-bold text-sm ${prod.serialKeys && prod.serialKeys.length > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {prod.serialKeys ? prod.serialKeys.length : 0} Keys
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const additionalKeys = prompt('Masukkan Serial Key tambahan (pisahkan dengan koma):');
                          if (additionalKeys) {
                            const newKeysArray = additionalKeys.split(',').map(k => k.trim()).filter(Boolean);
                            prod.serialKeys = [...(prod.serialKeys || []), ...newKeysArray];
                            alert(`Berhasil menambahkan ${newKeysArray.length} serial key baru untuk '${prod.title}'!`);
                            setVendorSubTab('products'); // force reload representation
                          }
                        }}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-[11px] px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        + Isi Stok
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
