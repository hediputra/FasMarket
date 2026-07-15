export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export interface KYCInfo {
  status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  fullName: string;
  idNumber: string;
  idType: 'KTP' | 'Paspor' | 'SIM';
  npwp: string; // Tax identification for PT Fas compliance
  companyName?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  balance: number;
  kycInfo: KYCInfo;
  trustRating: number; // 0 - 100
  feedbackCount: number;
  referralCode: string;
  referredBy?: string;
  earnings: number; // For seller tracking
}

export type Category = 'source-code' | 'web-app' | 'desktop-software' | 'mobile-app';

export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Product {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: Category;
  price: number;
  languages: string[];
  thumbnail: string;
  demoUrl: string;
  videoUrl?: string;
  sourceCodeFile: string; // Sim file name
  licenseType: 'Standard' | 'Extended Commercial';
  isFeatured: boolean;
  status: ProductStatus;
  sellerId: string;
  sellerName: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  serialKeys?: string[]; // cd-key autofill
  programmingLanguages: string[];
  rejectionReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  productId: string;
  productTitle: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  readTime: string;
  tags: string[];
}

export type EscrowStatus = 
  | 'AWAITING_PAYMENT' 
  | 'FUNDS_HELD' 
  | 'DISPUTE_OPENED' 
  | 'FUNDS_RELEASED' 
  | 'FUNDS_REFUNDED';

export type PaymentMethod = 'BANK_TRANSFER' | 'CREDIT_CARD' | 'E_WALLET' | 'CRYPTO_USDC' | 'CRYPTO_BTC';

export interface Transaction {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  platformFee: number; // 5% for PT Fas Technology Solutions
  affiliateCommission?: number; // 3%
  affiliateReferrerId?: string;
  paymentMethod: PaymentMethod;
  escrowStatus: EscrowStatus;
  createdAt: string;
  releasedAt?: string;
  serialKeyDelivered?: string;
}

export interface DisputeMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  createdAt: string;
  evidenceUrl?: string;
}

export interface Dispute {
  id: string;
  transactionId: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  reason: string;
  description: string;
  status: 'OPEN' | 'RESOLVED_REFUNDED' | 'RESOLVED_RELEASED';
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  messages: DisputeMessage[];
  evidenceFiles: {
    name: string;
    uploadedBy: string;
    url: string;
  }[];
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  processedAt?: string;
}
