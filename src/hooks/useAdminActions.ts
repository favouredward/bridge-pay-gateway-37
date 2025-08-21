
import { useState } from 'react';
import { toast } from 'sonner';
import { mockTransactions, mockUsers, mockKYCDocuments } from '@/data/mockData';

export function useAdminActions() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApproveTransaction = async (transactionId: string) => {
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find transaction
      const transaction = mockTransactions.find(tx => tx.id === transactionId);
      if (transaction) {
        // Update transaction status
        transaction.status = 'usdt_sent';
        transaction.updatedAt = new Date().toISOString();
        
        toast.success(`Transaction ${transaction.paymentReference} approved successfully`);
        console.log('Transaction approved:', transactionId);
      }
    } catch (error) {
      toast.error('Failed to approve transaction');
      console.error('Error approving transaction:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectTransaction = async (transactionId: string, reason?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const transaction = mockTransactions.find(tx => tx.id === transactionId);
      if (transaction) {
        transaction.status = 'failed';
        transaction.updatedAt = new Date().toISOString();
        
        toast.success(`Transaction ${transaction.paymentReference} rejected`);
        console.log('Transaction rejected:', transactionId, 'Reason:', reason);
      }
    } catch (error) {
      toast.error('Failed to reject transaction');
      console.error('Error rejecting transaction:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKYCAction = async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        user.kycStatus = action === 'approve' ? 'verified' : 'rejected';
        user.updatedAt = new Date().toISOString();
        
        // Update KYC document status
        const kycDoc = mockKYCDocuments.find(doc => doc.userId === userId);
        if (kycDoc) {
          kycDoc.status = action === 'approve' ? 'approved' : 'rejected';
          kycDoc.reviewedAt = new Date().toISOString();
        }
        
        toast.success(`KYC ${action}d for ${user.firstName} ${user.lastName}`);
        console.log(`KYC ${action}d for user:`, userId, 'Reason:', reason);
      }
    } catch (error) {
      toast.error(`Failed to ${action} KYC`);
      console.error(`Error ${action}ing KYC:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        const user = mockUsers[userIndex];
        mockUsers.splice(userIndex, 1);
        
        // Also remove user's transactions and KYC documents
        const userTransactions = mockTransactions.filter(tx => tx.userId === userId);
        userTransactions.forEach(tx => {
          const txIndex = mockTransactions.indexOf(tx);
          if (txIndex > -1) mockTransactions.splice(txIndex, 1);
        });
        
        const userKYC = mockKYCDocuments.filter(doc => doc.userId === userId);
        userKYC.forEach(doc => {
          const docIndex = mockKYCDocuments.indexOf(doc);
          if (docIndex > -1) mockKYCDocuments.splice(docIndex, 1);
        });
        
        toast.success(`User ${user.firstName} ${user.lastName} deleted successfully`);
        console.log('User deleted:', userId);
      }
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuspendUser = async (userId: string, reason?: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        // Add suspended status (would need to extend User type in real app)
        user.updatedAt = new Date().toISOString();
        
        toast.success(`User ${user.firstName} ${user.lastName} suspended`);
        console.log('User suspended:', userId, 'Reason:', reason);
      }
    } catch (error) {
      toast.error('Failed to suspend user');
      console.error('Error suspending user:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (type: 'transaction' | 'user' | 'kyc', id: string) => {
    console.log(`Viewing ${type} details:`, id);
    toast.info(`Opening ${type} details...`);
    // In a real app, this would navigate to a detailed view or open a modal
  };

  return {
    isProcessing,
    handleApproveTransaction,
    handleRejectTransaction,
    handleKYCAction,
    handleDeleteUser,
    handleSuspendUser,
    handleViewDetails
  };
}
