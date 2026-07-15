import React, { useState } from 'react';
import { Product, User, Dispute, WithdrawalRequest } from '../types';
import { 
  ShieldCheck, 
  Layers, 
  Users, 
  Coins, 
  CheckCircle, 
  XCircle, 
  FileText, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Landmark
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  users: User[];
  disputes: Dispute[];
  withdrawalRequests: WithdrawalRequest[];
  onApproveProduct: (productId: string) => void;
  onRejectProduct: (productId: string, reason: string) => void;
  onApproveKYC: (userId: string) => void;
  onRejectKYC: (userId: string, reason: string) => void;
  onApproveWithdrawal: (requestId: string) => void;
  onRejectWithdrawal: (requestId: string) => void;
  onSelectDispute: (disputeId: string) => void;
  currency?: 'IDR' | 'USD';
}

export default function AdminDashboard({
  products,
  users,
  disputes,
  withdrawalRequests,
  onApproveProduct,
  onRejectProduct,
  onApproveKYC,
  onRejectKYC,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onSelectDispute,
  currency = 'IDR'
}: AdminDashboardProps) {
  const [rejectProdId, setRejectProdId] = useState<string | null>(null);
  const [rejectProdReason, setRejectProdReason] = useState('');
  const [rejectUserId, setRejectUserId] = useState<string | null>(null);
  const [rejectUserReason, setRejectUserReason] = useState('');

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

  // Metrics calculations
  const pendingProducts = products.filter(p => p.status === 'PENDING');
  const activeKYCRequests = users.filter(u => u.kycInfo.status === 'PENDING');
  const activeDisputes = disputes.filter(d => d.status === 'OPEN');
  const pendingWithdrawals = withdrawalRequests.filter(w => w.status === 'PENDING');

  const totalSalesVolume = products.reduce((acc, curr) => acc + (curr.price * (curr.reviewCount + 2)), 25000000); // base estimation
  const platformRevenue = users.find(u => u.role === 'ADMIN')?.balance || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-panel">
      {/* Overview Headings */}
      <div className="text-left">
        <span className="text-xs uppercase tracking-widest font-mono font-bold text-blue-600">
          PT FAS TECHNOLOGY SOLUTIONS
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-slate-900 mt-1">
          Konsol Sistem Moderasi & Keuangan FasMarket
        </h1>
        <p className="text-slate-500 text-xs mt-1 leading-normal font-sans">
          Kelola kepatuhan lisensi digital, moderasi source code, verifikasi KYC penarikan, dan penengah sengketa transaksi.
        </p>
      </div>

      {/* Grid Cards Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 text-left shadow-sm">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Volume Transaksi</span>
            <span className="text-lg font-mono font-bold text-slate-900 mt-0.5">{formatIDR(totalSalesVolume)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 text-left shadow-sm">
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100">
            <Coins size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-medium">Fee Platform (5%)</span>
            <span className="text-lg font-mono font-bold text-emerald-600 mt-0.5">{formatIDR(platformRevenue)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 text-left shadow-sm">
          <div className="bg-amber-50 text-amber-750 p-3 rounded-xl border border-amber-100">
            <AlertTriangle size={20} className="animate-pulse text-amber-600" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">Sengketa Terbuka</span>
            <span className="text-lg font-mono font-bold text-amber-700 mt-0.5">{activeDisputes.length} Kasus</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 text-left shadow-sm">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl border border-blue-100">
            <Layers size={20} />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-400">KYC Verifikasi Antrian</span>
            <span className="text-lg font-mono font-bold text-blue-600 mt-0.5">{activeKYCRequests.length} Vendor</span>
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Product Moderation queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-blue-600 font-heading font-extrabold text-sm">
              <Layers size={18} />
              <span>Antrian Moderasi Produk ({pendingProducts.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Verifikasi standar lisensi digital</span>
          </div>

          {pendingProducts.length === 0 ? (
            <p className="text-slate-500 text-xs py-8 text-center font-sans">Semua produk digital telah ditinjau dan lolos moderasi.</p>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {pendingProducts.map((prod) => (
                <div key={prod.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{prod.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Oleh Vendor: <strong className="text-blue-600">{prod.sellerName}</strong></p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-600 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                      {formatIDR(prod.price)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed font-sans line-clamp-2">
                    {prod.description}
                  </p>

                  <div className="text-[10px] font-mono text-slate-400 space-y-1">
                    <div>Kategori: <span className="text-slate-600 font-sans">{prod.category}</span></div>
                    <div>Zip file: <span className="text-blue-600 font-mono">{prod.sourceCodeFile}</span></div>
                    <div>Demo URL: <a href={prod.demoUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline">{prod.demoUrl}</a></div>
                  </div>

                  {rejectProdId === prod.id ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        required
                        placeholder="Alasan penolakan source code..."
                        value={rejectProdReason}
                        onChange={(e) => setRejectProdReason(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex justify-end space-x-1.5">
                        <button
                          onClick={() => setRejectProdId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => {
                            if (!rejectProdReason.trim()) return;
                            onRejectProduct(prod.id, rejectProdReason);
                            setRejectProdId(null);
                            setRejectProdReason('');
                          }}
                          className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer"
                        >
                          Kirim Tolak
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setRejectProdId(prod.id)}
                        className="border border-slate-200 hover:border-red-250 hover:bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => onApproveProduct(prod.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Setujui & Rilis
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Vendor KYC Audits queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-blue-600 font-heading font-extrabold text-sm">
              <Users size={18} />
              <span>Pemeriksaan Identitas KYC Vendor ({activeKYCRequests.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Regulasi Anti-Pencucian Uang</span>
          </div>

          {activeKYCRequests.length === 0 ? (
            <p className="text-slate-500 text-xs py-8 text-center font-sans">Belum ada vendor baru yang mengajukan verifikasi identitas.</p>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
              {activeKYCRequests.map((user) => (
                <div key={user.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3.5">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-slate-200 object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{user.kycInfo.fullName || user.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-150 text-[10px] font-mono text-slate-500">
                    <div>ID Type: <span className="text-slate-800 font-sans">{user.kycInfo.idType}</span></div>
                    <div>NIK: <span className="text-slate-800">{user.kycInfo.idNumber}</span></div>
                    <div>NPWP Pajak: <span className="text-slate-800">{user.kycInfo.npwp}</span></div>
                    <div>Instansi: <span className="text-slate-800 font-sans">{user.kycInfo.companyName || 'Pribadi / Freelance'}</span></div>
                  </div>

                  {/* ID Image Mockup */}
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-100 text-center text-[10px] text-blue-600 flex items-center justify-center space-x-1 shadow-sm">
                    <FileText size={12} />
                    <span>Dokumen_Identitas_KTP.jpg (1.4MB - AES Encrypted)</span>
                  </div>

                  {rejectUserId === user.id ? (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <input
                        type="text"
                        required
                        placeholder="Alasan penolakan KYC..."
                        value={rejectUserReason}
                        onChange={(e) => setRejectUserReason(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-blue-500"
                      />
                      <div className="flex justify-end space-x-1.5">
                        <button
                          onClick={() => setRejectUserId(null)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 px-2 py-1 font-semibold cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => {
                            if (!rejectUserReason.trim()) return;
                            onRejectKYC(user.id, rejectUserReason);
                            setRejectUserId(null);
                            setRejectUserReason('');
                          }}
                          className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded cursor-pointer"
                        >
                          Tolak KYC
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setRejectUserId(user.id)}
                        className="border border-slate-200 hover:border-red-250 hover:bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Tolak KYC
                      </button>
                      <button
                        onClick={() => onApproveKYC(user.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Setujui KYC Vendor
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Active Disputes & Withdrawals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Disputes Medias Queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-blue-600 font-heading font-extrabold text-sm">
              <AlertTriangle size={18} />
              <span>Sengketa Transaksi Terbuka ({activeDisputes.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Mediasi & Resolusi Escrow</span>
          </div>

          {activeDisputes.length === 0 ? (
            <p className="text-slate-500 text-xs py-8 text-center font-sans">Tidak ada sengketa transaksi yang aktif saat ini.</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activeDisputes.map((disp) => (
                <div key={disp.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3 flex items-center justify-between shadow-sm">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{disp.productTitle}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Alasan: <strong className="text-red-550">"{disp.reason}"</strong></p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Penggugat: {disp.buyerName} • Tergugat: {disp.sellerName}</p>
                  </div>

                  <button
                    onClick={() => onSelectDispute(disp.id)}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-heading font-bold px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Masuk Ruang Mediasi</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Withdrawals queue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2 text-blue-600 font-heading font-extrabold text-sm">
              <Landmark size={18} />
              <span>Persetujuan Penarikan Dana ({pendingWithdrawals.length})</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Verifikasi kepatuhan bank transfer</span>
          </div>

          {pendingWithdrawals.length === 0 ? (
            <p className="text-slate-500 text-xs py-8 text-center font-sans">Belum ada pengajuan pencairan saldo pendapatan dari vendor.</p>
          ) : (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {pendingWithdrawals.map((req) => (
                <div key={req.id} className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-3.5 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{req.sellerName}</h4>
                      <span className="text-[9px] font-mono text-slate-400 font-medium">Diajukan: {new Date(req.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-600">
                      {formatIDR(req.amount)}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[10px] font-mono text-slate-500 space-y-0.5">
                    <div>Bank: <span className="text-slate-800 font-sans">{req.bankName}</span></div>
                    <div>No Rekening: <span className="text-slate-800">{req.accountNumber}</span></div>
                    <div>Nama Pemilik: <span className="text-slate-800 font-sans">{req.accountHolder}</span></div>
                  </div>

                  <div className="flex justify-end space-x-1.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onRejectWithdrawal(req.id)}
                      className="border border-slate-200 hover:border-red-250 hover:bg-red-50 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => onApproveWithdrawal(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Setujui & Transfer Dana
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
