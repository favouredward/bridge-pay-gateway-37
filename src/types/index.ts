
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  kycStatus: 'pending' | 'under_review' | 'verified' | 'rejected';
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  gbpAmount: number;
  usdtAmount: number;
  exchangeRate: number;
  walletAddress: string;
  status: 'pending' | 'payment_received' | 'usdt_sent' | 'completed' | 'failed';
  paymentReference: string;
  transactionHash?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  paymentDeadline: string;
  fees: {
    bridgePayFee: number;
    networkFee: number;
    totalFees: number;
  };
}

export interface KYCDocument {
  id: string;
  userId: string;
  documentType: 'id' | 'passport' | 'utility_bill' | 'face_photo';
  documentUrl: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: 'GBP';
  toCurrency: 'USDT';
  rate: number;
  timestamp: string;
  source: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface TransactionFilters {
  status?: Transaction['status'] | 'all';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface KYCFormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  documents: {
    idDocument?: File;
    utilityBill?: File;
    facePhoto?: File;
  };
}

export interface PaymentInstructions {
  accountName: string;
  accountNumber: string;
  sortCode: string;
  reference: string;
  amount: number;
  deadline: string;
}

export interface AdminStats {
  totalTransactions: {
    today: number;
    week: number;
    month: number;
  };
  pendingTransactions: number;
  pendingKYC: number;
  revenue: {
    today: number;
    week: number;
    month: number;
  };
}
