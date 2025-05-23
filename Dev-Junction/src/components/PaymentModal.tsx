import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import { ethService } from '../services/ethService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  amount: number;
  developerAddress: string;
  developerName: string;
}

export const PaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  developerAddress,
  developerName,
}: PaymentModalProps) => {
  const [status, setStatus] = useState<'initial' | 'processing' | 'success' | 'error'>('initial');
  const [error, setError] = useState<string>('');
  const [ethAmount, setEthAmount] = useState<string>('0');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setStatus('initial');
      setError('');
      setIsProcessing(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchEthAmount = async () => {
      try {
        const eth = await ethService.convertUSDToETH(amount);
        setEthAmount(eth);
      } catch (error) {
        setError('Failed to fetch ETH conversion rate');
      }
    };

    if (isOpen) {
      fetchEthAmount();
    }
  }, [amount, isOpen]);

  const handlePayment = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setStatus('processing');
      await ethService.init();
      const txHash = await ethService.sendPayment(developerAddress, amount);
      setStatus('success');
      
      // Add a slight delay before closing modal and triggering success
      setTimeout(() => {
        onSuccess(txHash);
      }, 1500);
    } catch (error: any) {
      setError(error.message || 'Payment failed');
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-100 rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Confirm Payment
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {status === 'initial' && (
                  <>
                    <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-xl space-y-2">
                      <p className="text-gray-600 dark:text-primary-100">
                        You are about to pay:
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${amount}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          ≈ {parseFloat(ethAmount).toFixed(6)} ETH
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        To: {developerName}
                      </p>
                    </div>

                    <button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Wallet className="w-5 h-5" />
                          <span>Pay with MetaMask</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {status === 'processing' && (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-primary-100">
                      Processing payment...
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Please confirm the transaction in MetaMask
                    </p>
                  </div>
                )}

                {status === 'success' && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-900 dark:text-white font-semibold">
                      Payment Successful!
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Your session has been booked
                    </p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-900 dark:text-white font-semibold">
                      Payment Failed
                    </p>
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                    <button
                      onClick={() => setStatus('initial')}
                      className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
