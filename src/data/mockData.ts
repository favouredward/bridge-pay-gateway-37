
import { User, Transaction, KYCDocument, ExchangeRate, AdminStats } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+44 7700 900123',
    kycStatus: 'verified',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    lastLogin: '2024-01-20T14:30:00Z',
  },
  {
    id: 'user-2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+44 7700 900124',
    kycStatus: 'under_review',
    role: 'user',
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    lastLogin: '2024-01-19T16:45:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@bridgepay.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+44 7700 900000',
    kycStatus: 'verified',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T18:00:00Z',
    lastLogin: '2024-01-20T18:00:00Z',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    userId: 'user-1',
    gbpAmount: 100,
    usdtAmount: 125,
    exchangeRate: 1.25,
    walletAddress: '0x742d35cc6634c0532925a3b8d5c9b567e9c4e8f5',
    status: 'completed',
    paymentReference: 'REF-XY12AB34',
    transactionHash: '0x9f8b...d3c7a',
    createdAt: '2025-01-10T14:23:00Z',
    updatedAt: '2025-01-10T14:26:00Z',
    completedAt: '2025-01-10T14:26:00Z',
    paymentDeadline: '2025-01-10T16:23:00Z',
    fees: {
      bridgePayFee: 2.5,
      networkFee: 1.0,
      totalFees: 3.5,
    },
  },
  {
    id: 'tx-2',
    userId: 'user-1',
    gbpAmount: 50,
    usdtAmount: 62.5,
    exchangeRate: 1.25,
    walletAddress: '0x742d35cc6634c0532925a3b8d5c9b567e9c4e8f5',
    status: 'usdt_sent',
    paymentReference: 'REF-AB34CD56',
    createdAt: '2025-01-08T10:15:00Z',
    updatedAt: '2025-01-08T10:45:00Z',
    paymentDeadline: '2025-01-08T12:15:00Z',
    fees: {
      bridgePayFee: 1.25,
      networkFee: 1.0,
      totalFees: 2.25,
    },
  },
  {
    id: 'tx-3',
    userId: 'user-2',
    gbpAmount: 200,
    usdtAmount: 250,
    exchangeRate: 1.25,
    walletAddress: '0x8a3f6b2e5c9d1a7e4f8b6c3d9e2a5b8c1f4e7a0d',
    status: 'pending',
    paymentReference: 'REF-EF78GH90',
    createdAt: '2025-01-05T09:30:00Z',
    updatedAt: '2025-01-05T09:30:00Z',
    paymentDeadline: '2025-01-05T11:30:00Z',
    fees: {
      bridgePayFee: 5.0,
      networkFee: 1.0,
      totalFees: 6.0,
    },
  },
];

export const mockKYCDocuments: KYCDocument[] = [
  {
    id: 'kyc-1',
    userId: 'user-1',
    documentType: 'id',
    documentUrl: '/mock-documents/id-1.jpg',
    status: 'approved',
    submittedAt: '2024-01-15T11:00:00Z',
    reviewedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'kyc-2',
    userId: 'user-2',
    documentType: 'passport',
    documentUrl: '/mock-documents/passport-2.jpg',
    status: 'under_review',
    submittedAt: '2024-01-18T15:20:00Z',
  },
];

export const mockExchangeRates: ExchangeRate[] = [
  {
    id: 'rate-1',
    fromCurrency: 'GBP',
    toCurrency: 'USDT',
    rate: 1.25,
    timestamp: new Date().toISOString(),
    source: 'binance',
  },
  {
    id: 'rate-2',
    fromCurrency: 'GBP',
    toCurrency: 'USDT',
    rate: 1.24,
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    source: 'binance',
  },
];

export const mockAdminStats: AdminStats = {
  totalTransactions: {
    today: 15,
    week: 89,
    month: 342,
  },
  pendingTransactions: 5,
  pendingKYC: 3,
  revenue: {
    today: 125.50,
    week: 890.25,
    month: 3420.75,
  },
};

export const generatePaymentReference = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'REF-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getCurrentExchangeRate = (): number => {
  return mockExchangeRates[0].rate;
};
