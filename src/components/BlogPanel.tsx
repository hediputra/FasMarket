import React, { useState } from 'react';
import { BlogArticle, Product } from '../types';
import { BookOpen, Calendar, Clock, User as UserIcon, Tag, ShoppingCart, ArrowRight } from 'lucide-react';

interface BlogPanelProps {
  articles: BlogArticle[];
  products: Product[];
  onSelectProduct: (productId: string) => void;
  currency?: 'IDR' | 'USD';
}

export default function BlogPanel({ articles, products, onSelectProduct, currency = 'IDR' }: BlogPanelProps) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeArticle = articles.find(a => a.id === selectedArticleId);

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

  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="blog-education-panel">
      
      {/* Title */}
      <div className="text-left border-b border-slate-800 pb-5 mb-8">
        <span className="text-xs uppercase tracking-widest font-mono font-bold text-indigo-400">
          PORTAL EDUKASI & PROMOSI TEKNIKAL
        </span>
        <h1 className="font-heading font-extrabold text-2xl text-white mt-1">
          FasMarket Technical Journal
        </h1>
        <p className="text-slate-400 text-xs mt-1 leading-normal font-sans">
          Artikel teknik dari para developer top mengenai optimalisasi kodingan, desain arsitektur database, dan implementasi modul siap pakai.
        </p>
      </div>

      {activeArticle ? (
        // Detailed Article View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Main article content */}
          <div className="lg:col-span-2 space-y-6">
            <button
              onClick={() => setSelectedArticleId(null)}
              className="text-indigo-400 hover:text-indigo-300 text-xs font-heading font-bold flex items-center space-x-1.5 transition-colors mb-4"
            >
              <span>&larr; Kembali ke Daftar Artikel</span>
            </button>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags.map(t => (
                    <span key={t} className="text-[10px] font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded">
                      {t.toUpperCase()}
                    </span>
                  ))}
                </div>

                <h2 className="font-heading font-extrabold text-xl md:text-2xl text-white leading-tight">
                  {activeArticle.title}
                </h2>

                <div className="flex flex-wrap items-center text-[10px] text-slate-500 gap-4 pt-1.5 border-t border-b border-slate-800/60 py-2">
                  <span className="flex items-center space-x-1">
                    <UserIcon size={12} />
                    <strong className="text-slate-300">{activeArticle.authorName}</strong>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(activeArticle.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{activeArticle.readTime}</span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {activeArticle.content}
              </p>
            </div>
          </div>

          {/* Connected product sidebar promotion card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 text-left space-y-4 shadow-xl shadow-indigo-500/5 relative">
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                PRODUK TERKAIT
              </div>
              
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Source Code yang Dibahas:</span>
              
              <h4 className="font-heading font-extrabold text-sm text-slate-100 leading-snug">
                {activeArticle.productTitle}
              </h4>

              <div className="text-slate-400 text-xs leading-relaxed font-sans line-clamp-3">
                Dapatkan implementasi arsitektur coding lengkap dan fungsional dari pembahasan artikel ini secara instan di bawah jaminan sistem escrow FasMarket.
              </div>

              <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500 leading-none font-medium">Investasi</span>
                  <span className="text-sm font-mono font-bold text-slate-100 mt-1">
                    {formatIDR(products.find(p => p.id === activeArticle.productId)?.price || 0)}
                  </span>
                </div>

                <button
                  onClick={() => onSelectProduct(activeArticle.productId)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center space-x-1"
                >
                  <span>Dapatkan Source</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        // Articles list grid view
        <div className="space-y-6 text-left">
          {/* Search filter row */}
          <div className="flex max-w-md bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel teknis (misal: microservices, database)..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full font-sans"
            />
          </div>

          {filteredArticles.length === 0 ? (
            <p className="text-slate-500 text-xs py-12 text-center font-sans">Tidak ditemukan artikel edukasi yang sesuai dengan pencarian Anda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((art) => (
                <div 
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700/80 cursor-pointer transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span className="text-cyan-400 font-semibold">{art.readTime}</span>
                      <span>{new Date(art.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>

                    <h3 className="font-heading font-extrabold text-slate-100 text-sm md:text-base group-hover:text-indigo-400 transition-colors leading-snug line-clamp-2">
                      {art.title}
                    </h3>

                    <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed font-sans pt-1">
                      {art.content}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-heading">Oleh: <strong className="text-slate-300">{art.authorName.split(' ')[0]}</strong></span>
                    <span className="text-indigo-400 font-heading font-bold group-hover:underline flex items-center space-x-1">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
