import React, { useState } from 'react';
import { Dispute, User, DisputeMessage } from '../types';
import { 
  AlertTriangle, 
  Send, 
  Paperclip, 
  CheckCircle, 
  User as UserIcon, 
  Clock, 
  MessageCircle,
  FileText,
  Hammer,
  ChevronRight
} from 'lucide-react';

interface DisputePanelProps {
  dispute: Dispute;
  currentUser: User;
  onSendMessage: (disputeId: string, text: string, evidenceUrl?: string) => void;
  onUploadEvidence: (disputeId: string, fileName: string, fileUrl: string) => void;
  onAdminResolve: (disputeId: string, action: 'REFUND' | 'RELEASE', notes: string) => void;
}

export default function DisputePanel({
  dispute,
  currentUser,
  onSendMessage,
  onUploadEvidence,
  onAdminResolve
}: DisputePanelProps) {
  const [inputText, setInputText] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600');
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(dispute.id, inputText.trim());
    setInputText('');
  };

  const handleEvidenceUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceName.trim()) return;
    onUploadEvidence(dispute.id, evidenceName.trim(), evidenceUrl);
    setEvidenceName('');
    setUploadOpen(false);
    onSendMessage(dispute.id, `[Bukti Baru Diunggah]: ${evidenceName.trim()}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm text-left" id={`dispute-panel-${dispute.id}`}>
      
      {/* Dispute Summary Header */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">PUSAT SENGKETA ESCROW</span>
          </div>
          <h2 className="font-heading font-extrabold text-base text-slate-800 tracking-tight">
            Sengketa: {dispute.productTitle}
          </h2>
          <p className="text-[11px] text-slate-500 font-sans">
            Penggugat (Buyer): <strong className="text-slate-700">{dispute.buyerName}</strong> • Tergugat (Vendor): <strong className="text-slate-700">{dispute.sellerName}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
            dispute.status === 'OPEN' 
              ? 'bg-red-50 text-red-655 border-red-100' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {dispute.status === 'OPEN' ? 'PROSES MEDIASI' : 'SENGKETA SELESAI'}
          </span>
        </div>
      </div>

      {/* Admin Arbitration Workspace */}
      {currentUser.role === 'ADMIN' && dispute.status === 'OPEN' && (
        <div className="bg-blue-50/40 border-b border-blue-100 p-5 space-y-4">
          <div className="flex items-center space-x-2 text-blue-600 font-heading font-bold text-xs">
            <Hammer size={16} />
            <span>KONTROL MODERASI & ARBITRASE ADMIN</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-normal font-sans">
            Sebagai moderator PT Fas Technology Solutions, Anda berhak mengambil keputusan mengikat. Tinjau obrolan sengketa dan bukti yang diunggah di bawah sebelum mengambil keputusan akhir.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] uppercase font-mono text-slate-500 mb-1">
                Catatan Keputusan Resolusi Sengketa (Wajib Diisi)
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Tulis alasan penutupan sengketa (misal: Buyer terbukti kodenya bermasalah, atau Seller tidak membalas chat)..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white font-sans"
              />
            </div>

            <div className="flex space-x-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!resolutionNotes.trim()) {
                    alert('Mohon tulis catatan keputusan resolusi sengketa terlebih dahulu.');
                    return;
                  }
                  onAdminResolve(dispute.id, 'REFUND', resolutionNotes.trim());
                }}
                className="bg-amber-600 hover:bg-amber-500 text-white font-heading font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Selesaikan & Refund Pembeli</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!resolutionNotes.trim()) {
                    alert('Mohon tulis catatan keputusan resolusi sengketa terlebih dahulu.');
                    return;
                  }
                  onAdminResolve(dispute.id, 'RELEASE', resolutionNotes.trim());
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Selesaikan & Cairkan ke Vendor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout: Chat Feed and Evidence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-250">
        
        {/* Chat Feed Column */}
        <div className="lg:col-span-2 flex flex-col h-[450px]">
          {/* Reason Card */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs">
            <span className="block text-[10px] uppercase font-mono text-slate-400 mb-1 font-semibold">Alasan Sengketa</span>
            <p className="text-slate-800 font-medium">"{dispute.reason}"</p>
            <p className="text-slate-500 mt-1 leading-relaxed font-sans">{dispute.description}</p>
          </div>

          {/* Messages display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {dispute.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl p-3 text-xs leading-normal font-sans ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : msg.senderRole === 'ADMIN'
                        ? 'bg-blue-50 text-blue-800 border border-blue-100 rounded-tl-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between space-x-4 mb-1 text-[9px] opacity-75 font-semibold">
                      <span className="font-heading">{msg.senderName} ({msg.senderRole === 'ADMIN' ? 'Moderator' : msg.senderRole})</span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input text box */}
          {dispute.status === 'OPEN' ? (
            <form onSubmit={handleSendMessageSubmit} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tulis pesan penjelasan sengketa..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-sans"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 text-slate-400 text-center text-xs font-heading font-medium border-t border-slate-200">
              Obrolan ditutup karena sengketa telah selesai dimediasi admin.
            </div>
          )}
        </div>

        {/* Evidence files Column */}
        <div className="p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Berkas Bukti Sengketa</span>
            {dispute.status === 'OPEN' && (
              <button
                onClick={() => setUploadOpen(!uploadOpen)}
                className="text-blue-600 hover:text-blue-500 text-[10px] font-heading font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Paperclip size={12} />
                <span>Unggah Bukti</span>
              </button>
            )}
          </div>

          {/* New Evidence Mock Upload Form */}
          {uploadOpen && (
            <form onSubmit={handleEvidenceUploadSubmit} className="bg-slate-50 p-3.5 border border-slate-200 rounded-xl space-y-3 shadow-inner">
              <div>
                <label className="block text-[9px] uppercase font-mono text-slate-500 mb-1 font-bold">
                  Nama Berkas Bukti (Wajib)
                </label>
                <input
                  type="text"
                  required
                  value={evidenceName}
                  onChange={(e) => setEvidenceName(e.target.value)}
                  placeholder="Contoh: console_error_log.txt"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono text-slate-500 mb-1 font-bold">
                  URL Ilustrasi Bukti / Screenshot
                </label>
                <input
                  type="text"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-heading font-semibold text-[10px] py-1.5 rounded transition-colors cursor-pointer"
              >
                Kirim Bukti Baru ke Ruang Mediasi
              </button>
            </form>
          )}

          {/* Evidence List */}
          <div className="space-y-3">
            {dispute.evidenceFiles.length === 0 ? (
              <p className="text-slate-400 text-[11px] text-center py-4 font-sans">Belum ada lampiran bukti visual.</p>
            ) : (
              dispute.evidenceFiles.map((file, i) => (
                <div 
                  key={i} 
                  className="bg-slate-50 p-3 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                      <FileText size={15} />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                      <span className="block text-[9px] text-slate-400 mt-0.5">Oleh {file.uploadedBy.split(' ')[0]}</span>
                    </div>
                  </div>
                  <a 
                    href={file.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-blue-600 hover:text-blue-500 p-1 transition-colors cursor-pointer"
                    title="Lihat Gambar"
                  >
                    <ChevronRight size={16} />
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Resolution notes show if RESOLVED */}
          {dispute.status !== 'OPEN' && dispute.resolutionNotes && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-heading font-bold text-xs">
                <CheckCircle size={14} />
                <span>Keputusan Mediator:</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-normal font-sans italic">
                "{dispute.resolutionNotes}"
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
