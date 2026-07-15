import React, { useState } from 'react';
import { Product, User, Review } from '../types';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink, 
  Video, 
  ShieldCheck, 
  Copy, 
  Check, 
  Download, 
  Lock, 
  Key, 
  Share2,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  reviews: Review[];
  currentUser: User;
  onBack: () => void;
  onBuy: (productId: string, affiliateCode?: string) => void;
  hasPurchased: boolean;
  purchasedSerialKey?: string;
  isSellerVerified?: boolean;
  onSubmitReview?: (rating: number, comment: string) => void;
  currency?: 'IDR' | 'USD';
}

export default function ProductDetails({
  product,
  reviews,
  currentUser,
  onBack,
  onBuy,
  hasPurchased,
  purchasedSerialKey,
  isSellerVerified = false,
  onSubmitReview,
  currency = 'IDR'
}: ProductDetailsProps) {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [referralApplied, setReferralApplied] = useState('');

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const alreadyReviewed = reviews.some(r => r.reviewerName === currentUser.name);

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

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'source-code': return 'Source Code';
      case 'web-app': return 'Aplikasi Web';
      case 'desktop-software': return 'Software Desktop';
      case 'mobile-app': return 'Aplikasi Mobile';
      default: return cat;
    }
  };

  const getAffiliateLink = () => {
    const origin = window.location.origin;
    return `${origin}/product/${product.id}?ref=${currentUser.referralCode}`;
  };

  const copyToClipboard = (text: string, type: 'ref' | 'serial') => {
    navigator.clipboard.writeText(text);
    if (type === 'ref') {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } else {
      setCopiedSerial(true);
      setTimeout(() => setCopiedSerial(false), 2000);
    }
  };

  const applyReferralCode = () => {
    if (referralInput.trim()) {
      setReferralApplied(referralInput.trim().toUpperCase());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id={`product-details-${product.id}`}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 text-sm font-heading font-semibold cursor-pointer"
        id="back-to-marketplace-btn"
      >
        <ArrowLeft size={16} />
        <span>Kembali ke Marketplace</span>
      </button>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Product Gallery, Info, Details */}
        <div className="lg:col-span-2 space-y-8 text-left">
          {/* Main Card */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Image Banner */}
            <div className="relative aspect-video w-full bg-slate-100 border-b border-slate-200">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] font-mono font-bold text-blue-600 bg-white/95 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                  {getCategoryLabel(product.category).toUpperCase()}
                </span>
                <h1 className="font-heading font-bold text-2xl text-white mt-3 leading-tight drop-shadow-md">
                  {product.title}
                </h1>
              </div>
            </div>

            {/* Language & Metadata row */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-white px-3 py-1 rounded-lg border border-slate-200 text-amber-500">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold font-mono">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-slate-600">({product.reviewCount} ulasan pembeli)</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 font-mono">Tech Stack:</span>
                <div className="flex flex-wrap gap-1">
                  {product.languages.map((lang) => (
                    <span 
                      key={lang} 
                      className="text-[10px] font-mono font-medium text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Body */}
            <div className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-heading font-bold text-slate-800 text-lg mb-3">Deskripsi Produk</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>

              {product.detailedDescription && (
                <div className="border-t border-slate-200 pt-6">
                  <h2 className="font-heading font-bold text-slate-800 text-lg mb-4">Fitur & Arsitektur Teknis</h2>
                  <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50 border border-slate-200 p-5 rounded-xl font-sans">
                    {product.detailedDescription}
                  </div>
                </div>
              )}

              {/* Action Buttons: Demo and Video Preview */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <a
                  href={product.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-heading font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
                >
                  <ExternalLink size={14} />
                  <span>Kunjungi Live Demo</span>
                </a>
                {product.videoUrl && (
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-heading font-semibold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
                  >
                    <Video size={14} />
                    <span>Tonton Video Preview</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="font-heading font-bold text-slate-800 text-lg border-b border-slate-100 pb-4">
              Ulasan Pengguna ({reviews.length})
            </h3>

            {/* Review Submission Form */}
            {hasPurchased && !alreadyReviewed && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4" id="review-submission-form">
                <div className="flex items-center space-x-2 text-indigo-600">
                  <Star size={16} className="fill-indigo-100 text-indigo-600" />
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">Tulis Ulasan Anda</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Sebagai pembeli terverifikasi, silakan berikan rating bintang dan feedback tertulis mengenai kualitas source code atau aplikasi ini.
                </p>

                <div className="space-y-3">
                  {/* Star Selector */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Rating Produk</label>
                    <div className="flex items-center space-x-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform duration-100 hover:scale-125 cursor-pointer"
                        >
                          <Star
                            size={22}
                            className={`${
                              star <= (hoverRating || reviewRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-slate-600 ml-2">
                        {reviewRating} dari 5 Bintang
                      </span>
                    </div>
                  </div>

                  {/* Comment Text Area */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Feedback Tertulis</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Bagikan pengalaman Anda mengenai kualitas kode, arsitektur, atau kemudahan instalasi..."
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={!reviewComment.trim()}
                      onClick={() => {
                        if (onSubmitReview) {
                          onSubmitReview(reviewRating, reviewComment);
                          setReviewComment('');
                          setReviewRating(5);
                        }
                      }}
                      className={`font-heading font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        reviewComment.trim()
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Kirim Ulasan Terverifikasi
                    </button>
                  </div>
                </div>
              </div>
            )}

            {hasPurchased && alreadyReviewed && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center space-x-2 text-emerald-800 text-xs">
                <Check size={14} className="text-emerald-600" />
                <span>Terimakasih! Anda telah memberikan ulasan terverifikasi untuk produk ini.</span>
              </div>
            )}
            
            {reviews.length === 0 ? (
              <p className="text-slate-500 text-xs py-4 text-center">Belum ada ulasan untuk produk ini. Jadilah pembeli pertama!</p>
            ) : (
              <div className="space-y-6 divide-y divide-slate-100">
                {reviews.map((rev, index) => (
                  <div key={rev.id} className={`pt-6 ${index === 0 ? 'pt-0' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={rev.reviewerAvatar} 
                          alt={rev.reviewerName} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.reviewerName}</p>
                          <div className="flex items-center text-amber-450 space-x-0.5 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed mt-3.5 pl-13">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Checkout, Affiliate and License panels */}
        <div className="space-y-6 text-left">
          
          {/* Purchase Pricing card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            {/* Guarantee badge */}
            <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 text-[10px] font-heading font-semibold border border-emerald-200 px-3 py-1.5 rounded-lg mb-5">
              <ShieldCheck size={14} className="flex-shrink-0" />
              <span>Escrow Terproteksi Kustodia SDK</span>
            </div>

            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Harga Source Code</span>
            <div className="text-3xl font-mono font-bold text-slate-900 mt-1">
              {formatIDR(product.price)}
            </div>

            <div className="mt-4 text-xs text-slate-600 space-y-2 border-t border-b border-slate-100 py-3.5 my-4">
              <div className="flex justify-between">
                <span>Lisensi</span>
                <span className="font-semibold text-slate-800">{product.licenseType}</span>
              </div>
              <div className="flex justify-between">
                <span>Fee Platform Escrow</span>
                <span className="text-slate-700 font-semibold font-mono">Gratis (Biaya 5% ditanggung Vendor)</span>
              </div>
              <div className="flex justify-between">
                <span>Update Berkelanjutan</span>
                <span className="text-slate-800 font-semibold">Aktif Selamanya</span>
              </div>
            </div>

            {/* Referral / Promo code field */}
            {!hasPurchased && currentUser.id !== product.sellerId && (
              <div className="mb-5">
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1.5">
                  Gunakan Kode Referral Afiliasi
                </label>
                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    placeholder="Contoh: RIANDV"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 uppercase font-mono"
                  />
                  <button
                    onClick={applyReferralCode}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs px-3.5 py-1.5 rounded-lg transition-colors font-heading font-semibold cursor-pointer"
                  >
                    Gunakan
                  </button>
                </div>
                {referralApplied && (
                  <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center space-x-1 font-semibold">
                    <Check size={10} />
                    <span>Kode referral <strong>{referralApplied}</strong> diterapkan!</span>
                  </p>
                )}
              </div>
            )}

            {/* Purchase / Status Button */}
            {currentUser.id === product.sellerId ? (
              <div className="bg-slate-50 text-slate-500 text-xs p-3.5 rounded-xl border border-slate-200 text-center flex items-center justify-center space-x-2">
                <Briefcase size={14} />
                <span>Ini adalah Produk Anda</span>
              </div>
            ) : hasPurchased ? (
              <div className="space-y-3">
                <div className="bg-blue-50 text-blue-600 text-xs p-3.5 rounded-xl border border-blue-100 text-center font-semibold flex items-center justify-center space-x-2">
                  <Check size={14} />
                  <span>Anda Telah Membeli Produk Ini</span>
                </div>
                
                {/* Source code file mock download */}
                <a
                  href={`#download-${product.sourceCodeFile}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Simulasi Pengunduhan file: ${product.sourceCodeFile}\nTerimakasih telah menggunakan FasMarket!`);
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-heading font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/15"
                >
                  <Download size={14} />
                  <span>Unduh Source Code (ZIP)</span>
                </a>

                {/* Delivered CD-Key / Serial Key */}
                {purchasedSerialKey && (
                  <div className="mt-4 p-4 bg-slate-50 border border-blue-100 rounded-xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-blue-600 font-heading font-bold text-xs">
                      <Key size={13} />
                      <span>Serial Key Lisensi Anda:</span>
                    </div>
                    <div className="flex items-center justify-between bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 shadow-sm">
                      <span className="select-all tracking-wider font-semibold">{purchasedSerialKey}</span>
                      <button 
                        onClick={() => copyToClipboard(purchasedSerialKey, 'serial')}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Salin Serial"
                      >
                        {copiedSerial ? <Check size={13} className="text-emerald-600 animate-pulse" /> : <Copy size={13} />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Gunakan lisensi key di atas untuk mengaktifkan modul software atau aplikasi.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="buy-product-btn"
                onClick={() => onBuy(product.id, referralApplied)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs py-3.5 rounded-xl transition-colors shadow-md shadow-blue-600/10 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock size={13} />
                <span>Beli Source Code Aman via Escrow</span>
              </button>
            )}

            <p className="text-[10px] text-slate-400 text-center mt-3 leading-normal">
              Keamanan Anda dijamin. Dana ditahan di escrow FasMarket sampai Anda memverifikasi kodenya.
            </p>
          </div>

          {/* Affiliate Program Commission Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center space-x-2 text-blue-600 font-heading font-bold text-xs">
              <Share2 size={14} />
              <span>Program Afiliasi Rekomendasi</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              Rekomendasikan produk ini ke kolega Anda dan dapatkan komisi sebesar <strong>3%</strong> (senilai <strong>{formatIDR(product.price * 0.03)}</strong>) dari setiap pembelian sukses melalui link Anda!
            </p>

            <div className="mt-3.5 space-y-1.5">
              <span className="block text-[9px] uppercase font-mono tracking-wider text-slate-400">Link Afiliasi Anda</span>
              <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 font-mono text-[10px] text-slate-600">
                <span className="truncate max-w-[170px]">{getAffiliateLink()}</span>
                <button
                  onClick={() => copyToClipboard(getAffiliateLink(), 'ref')}
                  className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                  title="Salin Link Afiliasi"
                >
                  {copiedRef ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>

          {/* Developer Credentials Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <span className="block text-[10px] uppercase font-mono text-slate-400">Informasi Developer / Vendor</span>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-600 font-bold border border-slate-200">
                {product.sellerName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{product.sellerName}</h4>
                {isSellerVerified ? (
                  <div className="flex items-center text-emerald-600 text-[10px] font-semibold mt-0.5">
                    <ShieldCheck size={11} className="mr-1" />
                    <span>Verified Vendor (KYC Lulus)</span>
                  </div>
                ) : (
                  <div className="flex items-center text-amber-600 text-[10px] font-semibold mt-0.5">
                    <ShieldCheck size={11} className="mr-1 text-amber-500" />
                    <span>Belum Verifikasi KYC</span>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[9px] font-mono text-slate-400 uppercase">Trust Rating</span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {isSellerVerified ? '98% Aman' : 'Proses KYC'}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[9px] font-mono text-slate-400 uppercase">Respon Chat</span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {isSellerVerified ? '< 2 Jam' : '-'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
