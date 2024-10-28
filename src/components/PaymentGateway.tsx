import React, { useState, useEffect } from 'react';
import { Wallet, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NetworkSelector from './NetworkSelector';
import AddressDisplay from './AddressDisplay';
import QRCodeDisplay from './QRCodeDisplay';
import PaymentVerification from './PaymentVerification';

type NetworkType = 'TRC20' | 'ERC20';
type AddressPool = Record<NetworkType, string[]>;

// Test data simulation
const TEST_ADDRESSES: AddressPool = {
  TRC20: ['TPvkTpwGfMXHw7rr6qpZYSjV62Ez58hWrz'],
  ERC20: [
    '0xebC8d3Da74d5Cf995870E24b545b098713C95511',
    '0xF7C8dA79da4CB294C4f55DFeBB1B404E3E38d921'
  ]
};

const PaymentGateway: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [network, setNetwork] = useState<NetworkType>('TRC20');
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' }
  ];

  const getRandomAddress = (addresses: string[]): string => {
    if (!addresses.length) return '';
    const randomIndex = Math.floor(Math.random() * addresses.length);
    return addresses[randomIndex];
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setCurrentAddress(getRandomAddress(TEST_ADDRESSES[network]));
      setIsLoading(false);
    }, 500);
  }, [network]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-400" />
            {t('title')}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Globe className="w-5 h-5" />
            </button>
            {showLanguages && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-gray-700 rounded-lg shadow-xl z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setShowLanguages(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors ${
                      i18n.language === lang.code ? 'bg-gray-600' : ''
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <NetworkSelector 
            selectedNetwork={network} 
            onNetworkChange={setNetwork} 
          />

          <AddressDisplay 
            address={currentAddress} 
            isLoading={isLoading} 
          />

          {!isLoading && currentAddress && (
            <>
              <QRCodeDisplay address={currentAddress} />
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">{t('submitPayment')}</h2>
                <PaymentVerification 
                  network={network}
                  receivingAddress={currentAddress}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;