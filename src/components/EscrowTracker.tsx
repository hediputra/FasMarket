import React from 'react';
import { Transaction, EscrowStatus, PaymentMethod } from '../types';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  Database,
  Coins,
  ExternalLink,
  MessageCircle,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface EscrowTrackerProps {
  transaction: Transaction;
  onReleaseFunds: (txId: string) => void;
  onOpenDispute: (txId: string) => void;
  isBuyer: boolean;
  isSeller: boolean;
  onOpenDisputeDiscussion?: (txId: string) => void;
  currency?: 'IDR' | 'USD';
}

export default function EscrowTracker({
  transaction,
  onReleaseFunds,
  onOpenDispute,
  isBuyer,
  isSeller,
  onOpenDisputeDiscussion,
  currency = 'IDR'
}: EscrowTrackerProps) {
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

  const getStatusBadge = (status: EscrowStatus) => {
    switch (status) {
      case 'AWAITING_PAYMENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-sm flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Awaiting Payment</span>
          </span>
        );
      case 'FUNDS_HELD':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-sm flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span>Pending Escrow</span>
          </span>
        );
      case 'DISPUTE_OPENED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/25 shadow-sm flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span>In Dispute</span>
          </span>
        );
      case 'FUNDS_RELEASED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Completed</span>
          </span>
        );
      case 'FUNDS_REFUNDED':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-mono font-bold bg-slate-500/10 text-slate-400 border border-slate-500/25 shadow-sm flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Refunded</span>
          </span>
        );
      default:
        return null;
    }
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    // Color Palette
    const slate900 = [15, 23, 42];
    const emerald500 = [16, 185, 129];
    const slate500 = [100, 116, 139];
    const slate700 = [51, 65, 85];
    const slate50 = [248, 250, 252];
    const slate200 = [226, 232, 240];

    // Title / Brand Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 42, 'F');

    // Title Text
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("FasMarket Escrow Invoice", 15, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("PT Fas Technology Solutions • Kustodia Escrow Ledger", 15, 34);

    // Status Badge
    doc.setFillColor(16, 185, 129);
    doc.rect(145, 16, 50, 11, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PAID / TERBAYAR", 154, 23);

    // Invoice Meta Header
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    // Left meta column
    doc.text("Invoice ID:", 15, 55);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`INV-${transaction.id.toUpperCase()}`, 45, 55);

    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Transaction Date:", 15, 62);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "semibold");
    doc.text(new Date(transaction.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 45, 62);

    if (transaction.releasedAt) {
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text("Completion Date:", 15, 69);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "semibold");
      doc.text(new Date(transaction.releasedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), 45, 69);
    }

    // Right meta column (Billing Info)
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("BILL TO (BUYER):", 120, 55);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(transaction.buyerName, 120, 61);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Buyer ID: ${transaction.buyerId}`, 120, 66);

    // Vendor Info
    doc.setFontSize(9);
    doc.text("VENDOR (SELLER):", 120, 75);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(transaction.sellerName, 120, 81);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Seller ID: ${transaction.sellerId}`, 120, 86);

    // Draw separator line
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 93, 195, 93);

    // Table Header
    doc.setFillColor(248, 250, 252);
    doc.rect(15, 100, 180, 10, 'F');
    
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Item / Description", 20, 106);
    doc.text("License Type", 110, 106);
    doc.text("Total Price", 160, 106);

    // Table Body (Product detail)
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    // Split long titles
    const titleLines = doc.splitTextToSize(transaction.productTitle, 80);
    doc.text(titleLines, 20, 118);

    doc.setFont("helvetica", "semibold");
    doc.setFontSize(9);
    doc.text("Standard License", 110, 118);
    
    doc.setFont("helvetica", "bold");
    doc.text(formatIDR(transaction.amount), 160, 118);

    // Table divider line
    doc.line(15, 135, 195, 135);

    // Financial Breakdown
    let currentY = 145;
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Subtotal:", 120, currentY);
    doc.setFont("helvetica", "semibold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatIDR(transaction.amount), 160, currentY);

    currentY += 7;
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.text("Platform Fee (5%):", 120, currentY);
    doc.setFont("helvetica", "semibold");
    doc.setTextColor(15, 23, 42);
    doc.text(formatIDR(transaction.platformFee), 160, currentY);

    if (transaction.affiliateCommission) {
      currentY += 7;
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text("Affiliate Commission (3%):", 120, currentY);
      doc.setFont("helvetica", "semibold");
      doc.setTextColor(79, 70, 229);
      doc.text(formatIDR(transaction.affiliateCommission), 160, currentY);
    }

    // Double line for Total
    currentY += 5;
    doc.setLineWidth(0.5);
    doc.setDrawColor(79, 70, 229);
    doc.line(120, currentY, 195, currentY);
    
    currentY += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text("Grand Total:", 120, currentY);
    doc.text(formatIDR(transaction.amount), 160, currentY);

    // Legal & Compliance Note Footer
    currentY = 200;
    doc.setLineWidth(0.1);
    doc.setDrawColor(226, 232, 240);
    doc.line(15, currentY, 195, currentY);

    currentY += 10;
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PT Fas Technology Solutions Security & Compliance", 15, currentY);

    currentY += 5;
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const termsText = [
      "1. Ini adalah bukti resmi pembayaran digital yang diproses melalui Kustodia Escrow Protocol.",
      "2. Seluruh dana telah dicairkan ke rekening bank berwenang milik developer setelah melewati masa inspeksi.",
      "3. Sengketa tidak dapat diajukan kembali setelah dana secara sah dicairkan dari Brankas Escrow.",
      "4. PT Fas Technology Solutions menjamin legalitas lisensi penggunaan source code yang tercatat di atas."
    ];
    termsText.forEach((line) => {
      doc.text(line, 15, currentY);
      currentY += 4.5;
    });

    // Decorative Verification Stamp
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.rect(145, 235, 45, 20);
    doc.setTextColor(16, 185, 129);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ESCROW VERIFIED", 147.5, 244);
    doc.setFontSize(7);
    doc.text("PT FAS TECH SOLUTIONS", 148, 250);

    // Save
    doc.save(`invoice-transaction-${transaction.id}.pdf`);
  };

  const getMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Bank Transfer (Mandiri Escrow)';
      case 'CREDIT_CARD': return 'Visa / MasterCard Gateway';
      case 'E_WALLET': return 'GoPay / QRIS Escrow';
      case 'CRYPTO_USDC': return 'USDC Stablecoin (Kustodia Contract)';
      case 'CRYPTO_BTC': return 'Bitcoin (Multi-sig Vault)';
      default: return method;
    }
  };

  const steps: { status: EscrowStatus; label: string; desc: string }[] = [
    { 
      status: 'AWAITING_PAYMENT', 
      label: 'Pembayaran', 
      desc: 'Buyer melakukan transfer ke rekening escrow PT Fas Tech' 
    },
    { 
      status: 'FUNDS_HELD', 
      label: 'Escrow Ditahan', 
      desc: 'Dana aman didepositkan di vault Kustodia. Produk siap diunduh & diinspeksi' 
    },
    { 
      status: 'DISPUTE_OPENED', 
      label: 'Dispute / Sengketa', 
      desc: 'Ada sengketa kualitas source code, admin sedang melakukan mediasi' 
    },
    { 
      status: 'FUNDS_RELEASED', 
      label: 'Escrow Cair', 
      desc: 'Buyer mengonfirmasi kepuasan. Saldo dicairkan ke vendor minus fee 5%' 
    }
  ];

  const getStepIndex = (current: EscrowStatus) => {
    if (current === 'AWAITING_PAYMENT') return 0;
    if (current === 'FUNDS_HELD') return 1;
    if (current === 'DISPUTE_OPENED') return 2;
    if (current === 'FUNDS_RELEASED' || current === 'FUNDS_REFUNDED') return 3;
    return 1;
  };

  const currentIndex = getStepIndex(transaction.escrowStatus);

  return (
    <div 
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6"
      id={`escrow-tracker-${transaction.id}`}
    >
      {/* Header & SDK logo */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Kustodia Escrow Protocol</span>
          <h4 className="font-heading font-extrabold text-sm text-slate-200 mt-0.5 flex items-center space-x-1.5">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span>ID Transaksi: <span className="font-mono text-cyan-400">{transaction.id}</span></span>
          </h4>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge(transaction.escrowStatus)}
          <div className="bg-cyan-950/40 border border-cyan-800/30 px-3 py-1.5 rounded-xl flex items-center space-x-2">
            <Database size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-300">Vault Ledger: <span className="font-bold text-white">SECURE</span></span>
          </div>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex || transaction.escrowStatus === 'FUNDS_RELEASED';
          const isActive = idx === currentIndex && transaction.escrowStatus !== 'FUNDS_RELEASED' && transaction.escrowStatus !== 'FUNDS_REFUNDED';
          const isDisputed = transaction.escrowStatus === 'DISPUTE_OPENED' && idx === 2;
          const isRefunded = transaction.escrowStatus === 'FUNDS_REFUNDED' && idx === 3;

          return (
            <div 
              key={step.status} 
              className={`p-3.5 rounded-xl border transition-colors ${
                isActive 
                  ? isDisputed 
                    ? 'bg-red-500/5 border-red-500/40' 
                    : 'bg-indigo-500/5 border-indigo-500/40' 
                  : isCompleted 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {isCompleted ? (
                  <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                ) : isActive ? (
                  isDisputed ? (
                    <AlertTriangle size={15} className="text-red-400 flex-shrink-0 animate-pulse" />
                  ) : (
                    <Clock size={15} className="text-indigo-400 flex-shrink-0 animate-spin-slow" />
                  )
                ) : isRefunded && idx === 3 ? (
                  <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0"></div>
                )}
                
                <span className={`text-xs font-bold ${
                  isActive 
                    ? isDisputed ? 'text-red-400' : 'text-indigo-400' 
                    : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                }`}>
                  {isRefunded && idx === 3 ? 'Refund Selesai' : step.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-sans">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Transaction Details Table */}
      <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 text-xs space-y-3 font-sans">
        <div className="flex justify-between flex-wrap gap-2">
          <span className="text-slate-500">Nama Produk:</span>
          <span className="font-bold text-slate-200">{transaction.productTitle}</span>
        </div>
        <div className="flex justify-between flex-wrap gap-2">
          <span className="text-slate-500">Pembeli:</span>
          <span className="font-semibold text-slate-300">{transaction.buyerName}</span>
        </div>
        <div className="flex justify-between flex-wrap gap-2">
          <span className="text-slate-500">Penjual (Vendor):</span>
          <span className="font-semibold text-slate-300">{transaction.sellerName}</span>
        </div>
        <div className="flex justify-between flex-wrap gap-2">
          <span className="text-slate-500">Metode Transaksi:</span>
          <span className="font-mono text-slate-300">{getMethodLabel(transaction.paymentMethod)}</span>
        </div>
        <div className="border-t border-slate-800 pt-2.5 flex justify-between items-center flex-wrap gap-2">
          <span className="text-slate-400 font-medium">Total Dana Ditahan:</span>
          <span className="font-mono font-bold text-slate-100 text-sm">{formatIDR(transaction.amount)}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>Fee Platform PT Fas Tech (5%):</span>
          <span className="font-mono">{formatIDR(transaction.platformFee)}</span>
        </div>
        {transaction.affiliateCommission && (
          <div className="flex justify-between items-center text-[10px] text-indigo-400 bg-indigo-950/20 px-2 py-1 rounded">
            <span>Komisi Afiliasi (3%):</span>
            <span className="font-mono font-semibold">+{formatIDR(transaction.affiliateCommission)}</span>
          </div>
        )}
      </div>

      {/* Contextual Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/60">
        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
          <Info size={12} className="text-cyan-400" />
          <span>Aturan: Inspeksi kode 1-3 hari sebelum melakukan konfirmasi pelepasan escrow.</span>
        </div>

        <div className="flex space-x-2">
          {/* Dispute Discussions Button (if dispute is active) */}
          {transaction.escrowStatus === 'DISPUTE_OPENED' && onOpenDisputeDiscussion && (
            <button
              onClick={() => onOpenDisputeDiscussion(transaction.id)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl transition-all border border-slate-700/60 font-heading font-semibold flex items-center space-x-1.5"
            >
              <MessageCircle size={14} className="text-red-400" />
              <span>Buka Diskusi Sengketa</span>
            </button>
          )}

          {/* Buyer Controls when funds are held */}
          {isBuyer && transaction.escrowStatus === 'FUNDS_HELD' && (
            <>
              <button
                onClick={() => onOpenDispute(transaction.id)}
                className="bg-slate-800 hover:bg-slate-700 text-red-400 hover:text-red-300 text-xs px-4 py-2 rounded-xl transition-all border border-slate-700/50 font-heading font-semibold"
              >
                Ajukan Sengketa
              </button>
              <button
                onClick={() => onReleaseFunds(transaction.id)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2 rounded-xl transition-all font-heading font-bold shadow-lg shadow-emerald-600/10 flex items-center space-x-1.5"
              >
                <span>Konfirmasi & Cairkan Saldo</span>
                <ArrowRight size={13} />
              </button>
            </>
          )}

          {/* Seller pending notes */}
          {isSeller && transaction.escrowStatus === 'FUNDS_HELD' && (
            <div className="text-[11px] text-amber-500 bg-amber-500/5 border border-amber-500/20 px-3.5 py-1.5 rounded-lg flex items-center space-x-2">
              <Clock size={12} className="animate-pulse" />
              <span>Menunggu konfirmasi Buyer untuk pencairan dana escrow (fee 5% otomatis dikurangi)</span>
            </div>
          )}

          {/* Released Status indicators */}
          {transaction.escrowStatus === 'FUNDS_RELEASED' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5">
                <CheckCircle size={13} />
                <span>Transaksi Selesai & Dana Telah Ditransfer</span>
              </div>
              <button
                onClick={handleDownloadInvoice}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3.5 py-1.5 rounded-xl transition-all font-heading font-bold flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-600/10 active:scale-95"
                title="Unduh Invoice Resmi PDF"
              >
                <Download size={13} />
                <span>Unduh Invoice PDF</span>
              </button>
            </div>
          )}

          {/* Refunded Status indicators */}
          {transaction.escrowStatus === 'FUNDS_REFUNDED' && (
            <div className="text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 px-3.5 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5">
              <AlertTriangle size={13} />
              <span>Dana Berhasil Direfund ke Pembeli</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
