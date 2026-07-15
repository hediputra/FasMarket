import React, { useState } from 'react';
import { User } from '../types';
import { X, ShieldAlert, Upload, Check, ChevronRight, FileText, Landmark } from 'lucide-react';

interface KYCModalProps {
  currentUser: User;
  onClose: () => void;
  onSubmitKYC: (kycData: {
    fullName: string;
    idNumber: string;
    idType: 'KTP' | 'Paspor' | 'SIM';
    npwp: string;
    companyName?: string;
  }) => void;
}

export default function KYCModal({ currentUser, onClose, onSubmitKYC }: KYCModalProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(currentUser.name);
  const [idType, setIdType] = useState<'KTP' | 'Paspor' | 'SIM'>('KTP');
  const [idNumber, setIdNumber] = useState('');
  const [npwp, setNpwp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const simulateUpload = () => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFileUploaded(true);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber || !npwp || !fileUploaded) {
      alert('Mohon lengkapi semua data dan unggah foto identitas Anda.');
      return;
    }
    onSubmitKYC({
      fullName,
      idNumber,
      idType,
      npwp,
      companyName: companyName || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="kyc-verification-modal">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-lg overflow-hidden text-left align-middle transition-all transform bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Landmark size={20} />
              <h3 className="font-heading font-extrabold text-base text-white tracking-tight">
                Kepatuhan KYC & Identitas Vendor
              </h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            {/* Step Indicators */}
            <div className="flex bg-slate-950/40 px-6 py-3 border-b border-slate-800/60 items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>1</span>
                <span className={step >= 1 ? 'text-slate-200' : 'text-slate-500'}>Form Profil</span>
              </div>
              <ChevronRight size={12} className="text-slate-600" />
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>2</span>
                <span className={step >= 2 ? 'text-slate-200' : 'text-slate-500'}>Unggah KTP</span>
              </div>
              <ChevronRight size={12} className="text-slate-600" />
              <div className="flex items-center space-x-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                  step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500'
                }`}>3</span>
                <span className={step >= 3 ? 'text-slate-200' : 'text-slate-500'}>Selesai</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5">
              
              {/* Step 1: Form Profil */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-1.5">
                    <div className="flex items-start space-x-2 text-amber-400 text-xs leading-relaxed">
                      <ShieldAlert size={16} className="flex-shrink-0 mt-0.5" />
                      <span>
                        Sesuai regulasi Bank Indonesia dan PT Fas Technology Solutions, semua vendor wajib melewati audit KYC (Know Your Customer) & Anti Money Laundering (AML) untuk mendistribusikan lisensi perangkat lunak.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
                      Nama Lengkap (Sesuai Identitas)
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
                        Jenis Identitas
                      </label>
                      <select
                        value={idType}
                        onChange={(e) => setIdType(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="KTP">KTP</option>
                        <option value="Paspor">Paspor</option>
                        <option value="SIM">SIM</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
                        Nomor Identitas (NIK)
                      </label>
                      <input
                        type="text"
                        required
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="Contoh: 3174xxxxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
                      Nomor NPWP Pajak Pribadi / Badan
                    </label>
                    <input
                      type="text"
                      required
                      value={npwp}
                      onChange={(e) => setNpwp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="Contoh: 81.234.567.8-012.000"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">
                      Nama Instansi / PT / CV <span className="text-slate-500">(Opsional jika Corporate)</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                      placeholder="Contoh: PT DevKreasi Digital Indonesia"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Upload Documents */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 leading-relaxed">
                    Unggah foto berwarna dokumen identitas asli Anda ({idType}). Dokumen harus terbaca jelas, tidak terpotong, dan tidak tertutup cahaya pantulan.
                  </div>

                  <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-2xl p-8 text-center bg-slate-950/40 transition-colors">
                    {fileUploaded ? (
                      <div className="space-y-3">
                        <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                          <Check size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-200">Dokumen_Identitas_{idType}.jpg</p>
                          <p className="text-[10px] text-slate-500 font-mono">1.4 MB • Berhasil Diunggah</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFileUploaded(false)}
                          className="text-[10px] text-red-400 hover:underline font-semibold"
                        >
                          Hapus & Ganti File
                        </button>
                      </div>
                    ) : uploadProgress > 0 ? (
                      <div className="space-y-3">
                        <div className="text-xs text-slate-300 font-medium">Mengunggah file enkripsi AES-256...</div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{uploadProgress}%</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto text-slate-500" size={32} />
                        <div>
                          <p className="text-xs font-bold text-slate-200">
                            Tarik dokumen ke sini atau <span className="text-indigo-400 hover:underline cursor-pointer">cari file</span>
                          </p>
                          <p className="text-[10px] text-slate-500 mt-1">Mendukung format JPG, PNG, atau PDF (Maks. 5MB)</p>
                        </div>
                        <button
                          type="button"
                          onClick={simulateUpload}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-4 py-2 rounded-lg transition-colors font-semibold"
                        >
                          Simulasi Unggah Foto Identitas
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-slate-500 text-[10px]">
                    <FileText size={12} className="flex-shrink-0" />
                    <span>Data Anda dienkripsi lokal menggunakan standard keamanan industri PT Fas Tech.</span>
                  </div>
                </div>
              )}

              {/* Step 3: Selesai */}
              {step === 3 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Check size={32} />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-heading font-extrabold text-base text-white">Data Siap Dikirim!</h4>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                      Formulir profil {fullName} dan foto identitas ({idType}) telah disiapkan. Klik submit di bawah untuk mendaftarkan permohonan lisensi vendor Anda.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Buttons */}
            <div className="flex bg-slate-950 px-6 py-4 border-t border-slate-800 justify-between items-center">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-slate-400 hover:text-white font-heading font-semibold transition-colors"
                >
                  Kembali
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (step === 1) {
                      if (!fullName || !idNumber || !npwp) {
                        alert('Mohon isi seluruh data form terlebih dahulu.');
                        return;
                      }
                      setStep(2);
                    } else if (step === 2) {
                      if (!fileUploaded) {
                        alert('Mohon unggah dokumen identitas Anda.');
                        return;
                      }
                      setStep(3);
                    }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  Lanjut
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-heading font-extrabold px-5 py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/10"
                >
                  Kirim Pengajuan KYC
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
