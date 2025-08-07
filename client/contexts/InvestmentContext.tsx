import { createContext, useContext, useState, ReactNode } from 'react';

interface InvestmentOffer {
  id?: string;
  isActive: boolean;
  plan: string;
  name: string;
  amount: number;
  expectedReturn: number;
  duration: string;
  roi: string;
}

interface InvestmentContextType {
  currentOffer: InvestmentOffer | null;
  setCurrentOffer: (offer: InvestmentOffer | null) => void;
  showPaymentModal: boolean;
  setShowPaymentModal: (show: boolean) => void;
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
}

const InvestmentContext = createContext<InvestmentContextType | undefined>(undefined);

export function useInvestment() {
  const context = useContext(InvestmentContext);
  if (context === undefined) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
}

interface InvestmentProviderProps {
  children: ReactNode;
}

export function InvestmentProvider({ children }: InvestmentProviderProps) {
  const [currentOffer, setCurrentOffer] = useState<InvestmentOffer | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const value = {
    currentOffer,
    setCurrentOffer,
    showPaymentModal,
    setShowPaymentModal,
    selectedCrypto,
    setSelectedCrypto
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
}
