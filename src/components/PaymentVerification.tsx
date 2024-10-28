import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, ArrowRight, Timer } from 'lucide-react';

interface PaymentVerificationProps {
  network: string;
  receivingAddress: string;
}

const COOLDOWN_PERIOD = 10000; // 10 seconds in milliseconds

const PaymentVerification: React.FC<PaymentVerificationProps> = ({ 
  network, 
  receivingAddress 
}) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [platformAccount, setPlatformAccount] = useState('');
  const [payerAccount, setPayerAccount] = useState('');
  const [hash, setHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [lastVerification, setLastVerification] = useState(0);

  useEffect(() => {
    let timer: number;
    if (cooldown > 0) {
      timer = window.setInterval(() => {
        setCooldown(prev => Math.max(0, prev - 1000));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  const verifyTransaction = async () => {
    const now = Date.now();
    if (now - lastVerification < COOLDOWN_PERIOD) {
      const remainingTime = Math.ceil((COOLDOWN_PERIOD - (now - lastVerification)) / 1000);
      setCooldown(remainingTime * 1000);
      return;
    }

    setIsVerifying(true);
    setError('');
    setLastVerification(now);
    setCooldown(COOLDOWN_PERIOD);

    try {
      // First verify the transaction on the blockchain
      const verificationEndpoint = network === 'ERC20' 
        ? `https://mainnet.infura.io/v3/ed20ce37eca04afe85d62bd1e3c54b6d`
        : `https://apilist.tronscan.org/api/transaction-info?hash=${hash}`;

      const verificationResponse = await fetch(verificationEndpoint);
      if (!verificationResponse.ok) {
        throw new Error('Transaction verification failed');
      }

      // If verification successful, submit to the backend
      const paymentData = {
        amount,
        platform_account: platformAccount,
        payer_account: payerAccount,
        hash,
        network,
        receiving_address: receivingAddress
      };

      const response = await fetch('https://moda.boutique/check/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment details');
      }

      // Redirect on success
      window.location.href = 'https://moda.boutique/';
    } catch (err) {
      setError(t('verificationFailed'));
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">
          {t('amount')}
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('platformAccount')}
        </label>
        <input
          type="text"
          value={platformAccount}
          onChange={(e) => setPlatformAccount(e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('payerAccount')}
        </label>
        <input
          type="text"
          value={payerAccount}
          onChange={(e) => setPayerAccount(e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {t('transactionHash')}
        </label>
        <input
          type="text"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder={network === 'ERC20' ? '0x...' : ''}
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={verifyTransaction}
        disabled={isVerifying || !amount || !platformAccount || !payerAccount || !hash || cooldown > 0}
        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
          isVerifying || !amount || !platformAccount || !payerAccount || !hash || cooldown > 0
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {cooldown > 0 ? (
          <>
            <Timer className="w-5 h-5" />
            {Math.ceil(cooldown / 1000)}s
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            {isVerifying ? t('verifying') : t('verifyPayment')}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentVerification;