import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          title: 'USDT Payment',
          selectNetwork: 'Select Network',
          address: 'USDT Address',
          copy: 'Copy',
          copied: 'Copied!',
          scanToPay: 'Scan QR code to pay',
          amount: 'Amount (USDT)',
          platformAccount: 'Platform Account',
          payerAccount: 'Your Payment Account',
          transactionHash: 'Transaction Hash',
          verifyPayment: 'Verify Payment',
          verifying: 'Verifying...',
          invalidTransaction: 'Invalid transaction. Please check the details.',
          verificationFailed: 'Verification failed. Please try again.',
          trc20: 'USDT (TRC20)',
          erc20: 'USDT (ERC20)',
          loading: 'Loading...',
          submitPayment: 'Payment Details',
          uploadScreenshot: 'Upload Payment Screenshot',
          submit: 'Submit Payment',
          uploading: 'Uploading...',
          dragDrop: 'Drag and drop image or click to upload',
          hashRequired: 'Transaction hash is required',
          screenshotRequired: 'Payment screenshot is required',
          maxFileSize: 'File size must be less than 5MB'
        }
      },
      // Add translations for other languages...
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;