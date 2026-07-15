import { Product, User, Review, BlogArticle, Dispute } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-buyer-1',
    name: 'Andi Pratama',
    email: 'andi.pratama@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'BUYER',
    balance: 15000000, // Rp 15.000.000
    kycInfo: {
      status: 'APPROVED',
      fullName: 'Andi Pratama',
      idNumber: '3174091212950002',
      idType: 'KTP',
      npwp: '81.234.567.8-012.000',
      submittedAt: '2026-06-01T10:00:00Z',
      verifiedAt: '2026-06-02T09:00:00Z'
    },
    trustRating: 95,
    feedbackCount: 12,
    referralCode: 'ANDI95',
    earnings: 0
  },
  {
    id: 'user-seller-1',
    name: 'Rian Wijaya (PT DevKreasi)',
    email: 'rian.wijaya@devkreasi.co.id',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'SELLER',
    balance: 28500000, // Rp 28.500.000
    kycInfo: {
      status: 'APPROVED',
      fullName: 'Rian Wijaya',
      idNumber: '3273051408910003',
      idType: 'KTP',
      npwp: '74.987.654.3-405.000',
      companyName: 'PT DevKreasi Digital Indonesia',
      submittedAt: '2026-05-10T14:30:00Z',
      verifiedAt: '2026-05-11T11:15:00Z'
    },
    trustRating: 98,
    feedbackCount: 48,
    referralCode: 'RIANDEVS',
    earnings: 45000000
  },
  {
    id: 'user-seller-unverified',
    name: 'Budi Santoso',
    email: 'budi.developer@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'SELLER',
    balance: 0,
    kycInfo: {
      status: 'PENDING',
      fullName: 'Budi Santoso',
      idNumber: '3374112204960005',
      idType: 'KTP',
      npwp: '92.111.222.3-503.000',
      submittedAt: '2026-07-12T16:45:00Z'
    },
    trustRating: 0,
    feedbackCount: 0,
    referralCode: 'BUDIDV',
    earnings: 0
  },
  {
    id: 'user-admin-1',
    name: 'Admin PT Fas Technology Solutions',
    email: 'admin@fastechsolutions.co.id',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'ADMIN',
    balance: 2450000, // Platform fee pool (Rp 2.450.000)
    kycInfo: {
      status: 'APPROVED',
      fullName: 'FasTech Corporate Admin',
      idNumber: '0000000000000000',
      idType: 'KTP',
      npwp: '01.002.003.0-004.000'
    },
    trustRating: 100,
    feedbackCount: 150,
    referralCode: 'FASTECH',
    earnings: 0
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'E-Commerce SaaS Starter Kit - Next.js & Go Microservices',
    description: 'Sistem e-commerce SaaS multi-tenant dengan setup Docker, payment gateway ready (Stripe & Midtrans), dan dashboard analitik real-time.',
    detailedDescription: 'Sistem marketplace SaaS kelas enterprise yang dirancang untuk performa tinggi, skalabilitas, dan kemudahan kustomisasi. Memanfaatkan Next.js 14 App Router untuk rendering secepat kilat dan Go (Golang) untuk performa backend microservices yang efisien.\n\n### Fitur Utama:\n- **Multi-Tenant Architecture**: Setiap merchant mendapatkan subdomain tersendiri.\n- **Payment Gateway Integrated**: Integrasi bawaan dengan Midtrans (Bank Transfer, GoPay, Qris) dan Stripe.\n- **Docker Containerized**: Memudahkan proses deployment lokal maupun cloud (AWS, GCP, DigitalOcean).\n- **SEO Optimized**: Struktur SSR dinamis dengan sitemap otomatis.\n- **Real-time Analytics**: WebSocket dashboard untuk melacak pesanan masuk, pendapatan, dan traffic secara instan.\n\n### Stack Teknologi:\n- **Frontend**: Next.js (TypeScript), Tailwind CSS, Shadcn/ui\n- **Backend Microservices**: Go (Golang), GORM, Gin Web Framework\n- **Database & Cache**: PostgreSQL, Redis\n- **Message Broker**: RabbitMQ untuk async email & invoice queuing',
    category: 'source-code',
    price: 3750000, // Rp 3.750.000
    languages: ['TypeScript', 'Go', 'SQL'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    demoUrl: 'https://demo-saas.devkreasi.co.id',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sourceCodeFile: 'saas_ecommerce_nextjs_go.zip',
    licenseType: 'Extended Commercial',
    isFeatured: true,
    status: 'APPROVED',
    sellerId: 'user-seller-1',
    sellerName: 'Rian Wijaya (PT DevKreasi)',
    rating: 4.9,
    reviewCount: 18,
    createdAt: '2026-06-15T08:30:00Z',
    serialKeys: ['FAS-NEXTGO-8849-012X', 'FAS-NEXTGO-3392-948A', 'FAS-NEXTGO-4421-220B'],
    programmingLanguages: ['TypeScript', 'Golang', 'PostgreSQL']
  },
  {
    id: 'prod-2',
    title: 'Aplikasi Kasir (POS) Desktop - Electron & React Offline-First',
    description: 'Software Point of Sale (POS) handal dengan sinkronisasi cloud otomatis, manajemen stok cerdas, dan pencetakan struk printer thermal Bluetooth.',
    detailedDescription: 'Solusi kasir offline-first modern yang sangat cocok untuk ritel, restoran, dan UMKM. Berjalan sebagai aplikasi desktop ringan namun tangguh.\n\n### Fitur Utama:\n- **Offline-First**: Kasir tetap bisa bertransaksi tanpa koneksi internet, data tersinkronisasi otomatis saat online.\n- **Thermal Receipt Printer**: Kompatibel dengan semua jenis printer thermal via USB atau Bluetooth.\n- **Barcode Scanner**: Support integrasi scanner instan.\n- **Grafik Analitik Keuntungan**: Visualisasi laba rugi bulanan langsung di aplikasi.\n- **Keamanan Data**: Enkripsi basis data SQLite lokal menggunakan SQLCipher.\n\n### Stack Teknologi:\n- **Client**: Electron, React.js, Tailwind CSS, Lucide Icons\n- **Database**: SQLite lokal + PouchDB/CouchDB untuk sinkronisasi cloud\n- **State Management**: Zustand',
    category: 'desktop-software',
    price: 1850000, // Rp 1.850.000
    languages: ['JavaScript', 'HTML5', 'SQL'],
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
    demoUrl: 'https://demo-pos.devkreasi.co.id',
    sourceCodeFile: 'pos_offline_electron_react.zip',
    licenseType: 'Standard',
    isFeatured: true,
    status: 'APPROVED',
    sellerId: 'user-seller-1',
    sellerName: 'Rian Wijaya (PT DevKreasi)',
    rating: 4.7,
    reviewCount: 9,
    createdAt: '2026-06-20T11:45:00Z',
    serialKeys: ['FAS-POSDK-2940-111A', 'FAS-POSDK-7552-332M'],
    programmingLanguages: ['TypeScript', 'Electron', 'SQLite']
  },
  {
    id: 'prod-3',
    title: 'Sistem Informasi HRD & Penggajian (Payroll) - Laravel 11',
    description: 'Sistem Human Resource & Payroll lengkap dengan absensi berbasis geolocation, pengajuan cuti online, dan e-slip gaji otomatis.',
    detailedDescription: 'Platform komprehensif untuk menyederhanakan tugas HRD perusahaan Anda. Mengotomatisasi penggajian, perhitungan BPJS, PPh 21, dan pencatatan presensi karyawan secara akurat.\n\n### Fitur Utama:\n- **Presensi Geolocation**: Absen selfie via HP karyawan dengan validasi radius lokasi GPS kantor.\n- **Manajemen Slip Gaji (E-Slip)**: Generator PDF otomatis untuk slip gaji yang dikirim langsung ke email karyawan.\n- **Pengajuan Cuti & Reimbursement**: Alur persetujuan bertingkat (Manager -> HRD -> Approved).\n- **Laporan Pajak & BPJS**: Ekspor laporan BPJS Kesehatan, Ketenagakerjaan, dan form PPh 21 siap upload.\n\n### Stack Teknologi:\n- **Backend**: PHP 8.3, Laravel 11 (MVC)\n- **Frontend**: Livewire, Alpine.js, Tailwind CSS\n- **Database**: MySQL / MariaDB',
    category: 'web-app',
    price: 2450000, // Rp 2.450.000
    languages: ['PHP', 'JavaScript', 'SQL'],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
    demoUrl: 'https://demo-hr.devkreasi.co.id',
    sourceCodeFile: 'laravel11_hr_payroll.zip',
    licenseType: 'Standard',
    isFeatured: false,
    status: 'APPROVED',
    sellerId: 'user-seller-1',
    sellerName: 'Rian Wijaya (PT DevKreasi)',
    rating: 4.8,
    reviewCount: 14,
    createdAt: '2026-07-02T15:20:00Z',
    serialKeys: ['FAS-LARHR-1093-772L'],
    programmingLanguages: ['PHP', 'Laravel', 'MySQL']
  },
  {
    id: 'prod-4',
    title: 'Aplikasi Ojek Online & Delivery - Flutter Multi-Platform App',
    description: 'Aplikasi driver & customer modern mirip Gojek/Grab. Menggunakan Firebase Firestore real-time tracking, rute Google Maps API, dan payment gateway.',
    detailedDescription: 'Source code aplikasi ride-hailing lengkap untuk Customer dan Driver, serta Admin Panel berbasis web. Dibuat menggunakan Flutter untuk rilis instan di Android & iOS sekaligus.\n\n### Fitur Utama:\n- **Real-time Live Tracking**: Driver dapat melacak pesanan dan pelanggan melihat koordinat driver di peta secara live.\n- **Rute Optimal Google Maps**: Menghitung jarak dan rute pengantaran tercepat untuk efisiensi bahan bakar.\n- **In-App Chat**: Chat terenkripsi antara customer dan driver tanpa memakan pulsa.\n- **Multi-Services**: Layanan Ojek Motor, Taksi Mobil, Pengiriman Makanan, dan Kurir Paket.\n\n### Stack Teknologi:\n- **Mobile Apps**: Flutter (Dart) untuk iOS & Android\n- **Admin Backend**: Node.js, Express, Firebase Admin SDK\n- **Database**: Firebase Firestore (NoSQL)',
    category: 'mobile-app',
    price: 4900000, // Rp 4.900.000
    languages: ['Dart', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600',
    demoUrl: 'https://demo-ride.devkreasi.co.id',
    sourceCodeFile: 'flutter_ojek_ride_hailing.zip',
    licenseType: 'Extended Commercial',
    isFeatured: false,
    status: 'APPROVED',
    sellerId: 'user-seller-1',
    sellerName: 'Rian Wijaya (PT DevKreasi)',
    rating: 4.6,
    reviewCount: 7,
    createdAt: '2026-07-05T09:10:00Z',
    serialKeys: ['FAS-FLUT-RIDE-9930-XPP'],
    programmingLanguages: ['Dart', 'Flutter', 'Firebase']
  }
];

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    reviewerName: 'Farhan Gunawan',
    reviewerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    rating: 5,
    comment: 'Luar biasa bersih kodenya! Microservices di Golang sangat terstruktur dengan pattern clean architecture. Integrasi Midtrans langsung jalan tanpa kendala setelah saya setting client key. Sangat direkomendasikan!',
    createdAt: '2026-06-18T14:35:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    reviewerName: 'Dewi Lestari',
    reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    comment: 'Dokumentasi instalasinya sangat lengkap. Ada video tutorial langkah demi langkah. Script Docker-compose membuat deploy ke VPS Ubuntu saya selesai dalam waktu 10 menit saja.',
    createdAt: '2026-06-25T16:10:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    reviewerName: 'Hendra Wijaya',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 4,
    comment: 'Aplikasi POS bekerja dengan sangat baik di kasir offline toko kami. Sinkronisasi data lancar saat internet tersambung kembali. Bintang 4 karena butuh waktu sedikit lama memahami relasi PouchDB di kodenya, tapi overall mantap!',
    createdAt: '2026-06-22T10:15:00Z'
  }
];

export const mockArticles: BlogArticle[] = [
  {
    id: 'art-1',
    title: 'Bagaimana Kami Mendesain Arsitektur Golang Microservices Berkinerja Tinggi',
    content: 'Dalam pengembangan aplikasi skala enterprise seperti platform e-commerce SaaS, performa database dan concurrency sangatlah vital. Artikel ini membedah bagaimana kami mengintegrasikan Gin Framework, RabbitMQ, dan PostgreSQL di backend produk SaaS Starter kami untuk memproses hingga 5000 requests per detik pada mesin server single-core.\n\nKami membahas optimasi connection pooling PostgreSQL, implementasi redis-cache decorator pattern di Go, serta penggunaan RabbitMQ untuk memproses email pengiriman invoice agar main server tidak terbebani proses sinkronisasi jaringan.\n\nJika Anda membeli produk Next.js-Go Starter Kit kami, struktur arsitektur inilah yang langsung Anda dapatkan dengan implementasi modular yang siap dikustomisasi sesuai kebutuhan bisnis unik perusahaan Anda.',
    productId: 'prod-1',
    productTitle: 'E-Commerce SaaS Starter Kit - Next.js & Go Microservices',
    authorId: 'user-seller-1',
    authorName: 'Rian Wijaya (PT DevKreasi)',
    createdAt: '2026-06-28T10:15:00Z',
    readTime: '6 Menit Baca',
    tags: ['Microservices', 'Golang', 'SaaS', 'Performance']
  },
  {
    id: 'art-2',
    title: 'Strategi Desain Aplikasi Offline-First Menggunakan Electron, React, & PouchDB',
    content: 'Masalah utama sistem Point-of-Sale (POS) kasir konvensional adalah ketergantungan mutlak pada internet. Ketika koneksi putus, aktivitas transaksi bisnis mandek.\n\nSolusi terbaik adalah arsitektur Offline-First. Di artikel ini kami mendetailkan penerapan basis data RxDB/PouchDB lokal di dalam container desktop Electron. Data transaksi disimpan langsung di file lokal SQLite kasir dan disinkronisasikan ke CouchDB cloud utama di latar belakang secara asinkron (bi-directional replication).\n\nKami juga membagikan tips mengontrol thread Electron agar rendering UI React tetap responsif 60 FPS saat memproses pencetakan struk transaksi berat.',
    productId: 'prod-2',
    productTitle: 'Aplikasi Kasir (POS) Desktop - Electron & React Offline-First',
    authorId: 'user-seller-1',
    authorName: 'Rian Wijaya (PT DevKreasi)',
    createdAt: '2026-07-01T13:40:00Z',
    readTime: '5 Menit Baca',
    tags: ['Offline-First', 'Electron', 'POS', 'Sync']
  }
];

export const mockDisputes: Dispute[] = [
  {
    id: 'disp-1',
    transactionId: 'tx-old-1',
    productId: 'prod-4',
    productTitle: 'Aplikasi Ojek Online & Delivery - Flutter Multi-Platform App',
    buyerId: 'user-buyer-1',
    buyerName: 'Andi Pratama',
    sellerId: 'user-seller-1',
    sellerName: 'Rian Wijaya (PT DevKreasi)',
    reason: 'Fitur Map tracking tidak berjalan',
    description: 'Saya sudah mengikuti panduan setup Google Maps API Key, namun peta di aplikasi customer tetap blank abu-abu dan driver tracking tidak memunculkan marker mobil di peta. Saya mohon seller membantu troubleshoot atau refund dana escrow saya.',
    status: 'OPEN',
    createdAt: '2026-07-10T14:00:00Z',
    messages: [
      {
        id: 'msg-1',
        senderId: 'user-buyer-1',
        senderName: 'Andi Pratama',
        senderRole: 'BUYER',
        text: 'Halo seller, saya sudah coba generate API key baru dari Google Cloud Console dengan pembatasan Android & iOS API, namun maps tetap tidak mau load. Mohon dibantu solusinya.',
        createdAt: '2026-07-10T14:05:00Z'
      },
      {
        id: 'msg-2',
        senderId: 'user-seller-1',
        senderName: 'Rian Wijaya (PT DevKreasi)',
        senderRole: 'SELLER',
        text: 'Halo Pak Andi. Dari kendala blank abu-abu, biasanya itu karena Google Maps SDK belum diaktifkan di konsol Google Cloud untuk project bersangkutan (Maps SDK for Android & Maps SDK for iOS wajib berstatus ENABLED). Apakah bapak sudah mengaktifkan library SDK tersebut di dashboard GCP?',
        createdAt: '2026-07-11T09:30:00Z'
      }
    ],
    evidenceFiles: [
      {
        name: 'blank_map_screenshot.png',
        uploadedBy: 'Andi Pratama',
        url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'
      }
    ]
  }
];
