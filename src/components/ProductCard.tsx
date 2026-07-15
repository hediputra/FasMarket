import React from 'react';
import { Product } from '../types';
import { Star, Eye, Code, Zap, FileText, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  isSellerVerified?: boolean;
  currency?: 'IDR' | 'USD';
}

export default function ProductCard({ product, onViewDetails, isSellerVerified = false, currency = 'IDR' }: ProductCardProps) {
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

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product.id)}
      className={`group relative flex flex-col bg-white border ${
        product.isFeatured 
          ? 'border-blue-500/40 shadow-lg shadow-blue-500/5' 
          : 'border-slate-200 hover:border-slate-300'
      } rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5`}
    >
      {/* Featured Accent Line / Badge */}
      {product.isFeatured && (
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 z-10"></div>
      )}

      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
        
        {/* Badges on Thumbnail */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-heading font-semibold bg-white/95 text-slate-800 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-200/80 shadow-sm">
            {getCategoryLabel(product.category)}
          </span>
          {product.isFeatured && (
            <span className="text-[10px] font-heading font-bold bg-blue-600 text-white flex items-center space-x-1 px-2 py-0.5 rounded-md shadow-lg shadow-blue-500/25">
              <Zap size={10} className="fill-white" />
              <span>FEATURED</span>
            </span>
          )}
        </div>

        {/* Verified Security Badge (Top Right of Thumbnail) */}
        {isSellerVerified && (
          <div className="absolute top-3 right-3 z-10 bg-emerald-600 text-white flex items-center space-x-1 px-2.5 py-0.5 rounded-md shadow-lg shadow-emerald-500/30 text-[9px] font-heading font-bold uppercase tracking-wider">
            <ShieldCheck size={11} className="fill-white text-emerald-600" />
            <span>TERVERIFIKASI</span>
          </div>
        )}

        {/* Floating Developer Tag */}
        <div className="absolute bottom-3 left-3 text-xs text-slate-700 flex items-center space-x-1">
          <span className="text-[10px] font-medium bg-white/90 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-200 shadow-sm flex items-center space-x-1">
            <span>by {product.sellerName.split(' ')[0]}</span>
            {isSellerVerified && (
              <ShieldCheck size={10} className="text-emerald-600 fill-emerald-50" />
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Programming Languages Tag */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {product.languages.map((lang) => (
              <span 
                key={lang} 
                className="text-[9px] font-mono font-medium text-blue-600 bg-blue-50 border border-blue-100/50 px-1.5 py-0.5 rounded"
              >
                {lang}
              </span>
            ))}
          </div>

          <h3 className="font-heading font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Bottom Panel */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 leading-none">Harga</span>
            <span className="text-base font-mono font-bold text-slate-900 mt-0.5">
              {formatIDR(product.price)}
            </span>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <div className="flex items-center space-x-2.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <div className="flex items-center text-amber-500 space-x-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-mono font-bold">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
            </div>
            {isSellerVerified && (
              <span className="text-[8px] font-sans font-bold text-emerald-600 flex items-center space-x-0.5">
                <ShieldCheck size={10} className="text-emerald-600 fill-emerald-50" />
                <span>Verified Seller</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
