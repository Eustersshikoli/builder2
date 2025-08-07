import { useState } from "react";
import { useInvestment } from "@/contexts/InvestmentContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Copy, 
  CheckCircle, 
  Clock, 
  Wallet, 
  QrCode,
  ExternalLink,
  TrendingUp,
  Shield
} from "lucide-react";

const cryptoOptions = [
  { 
    symbol: "BTC", 
    name: "Bitcoin", 
    wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    icon: "₿",
    color: "from-orange-500 to-orange-600"
  },
  { 
    symbol: "ETH", 
    name: "Ethereum", 
    wallet: "0x742d35Cc6634C0532925a3b8D5c0B32C54Ba8D92",
    icon: "Ξ",
    color: "from-blue-500 to-blue-600"
  },
  { 
    symbol: "USDT", 
    name: "Tether", 
    wallet: "TG2fJ4Co6aP4SPo6FqhQZqCQF6X5XdKx9N8mBtYz",
    icon: "₮",
    color: "from-green-500 to-green-600"
  }
];

export default function PaymentModal() {
  const { currentOffer, showPaymentModal, setShowPaymentModal, selectedCrypto, setSelectedCrypto } = useInvestment();
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'confirmation'>('select');

  const selectedCryptoData = cryptoOptions.find(crypto => crypto.symbol === selectedCrypto) || cryptoOptions[0];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handleClose = () => {
    setShowPaymentModal(false);
    setPaymentStep('select');
  };

  const handleCryptoSelect = (crypto: string) => {
    setSelectedCrypto(crypto);
    setPaymentStep('payment');
  };

  const handlePaymentConfirm = () => {
    setPaymentStep('confirmation');
    toast({
      title: "Payment Submitted!",
      description: "Your investment is being processed. You'll receive confirmation shortly.",
    });
  };

  if (!currentOffer) return null;

  return (
    <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-gray-50 via-white to-forex-50 border-0 overflow-hidden">
        <DialogTitle className="sr-only">Investment Payment Process</DialogTitle>
        
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Investment</h1>
            <p className="text-gray-600">Secure payment processing for your forex investment</p>
          </div>

          {/* Investment Summary */}
          <Card className="mb-8 bg-gradient-to-r from-forex-50 to-blue-50 border-2 border-forex-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Investment Amount</div>
                  <div className="text-2xl font-bold text-forex-600">${currentOffer.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected Return</div>
                  <div className="text-2xl font-bold text-success-600">${currentOffer.expectedReturn.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">ROI</div>
                  <div className="text-2xl font-bold text-gold-600">{currentOffer.roi}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-2xl font-bold text-blue-600">{currentOffer.duration}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <div className={`flex items-center space-x-2 ${paymentStep === 'select' ? 'text-forex-600' : paymentStep === 'payment' || paymentStep === 'confirmation' ? 'text-success-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep === 'select' ? 'bg-forex-600 text-white' : paymentStep === 'payment' || paymentStep === 'confirmation' ? 'bg-success-600 text-white' : 'bg-gray-200'}`}>
                  {paymentStep === 'payment' || paymentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '1'}
                </div>
                <span className="font-medium">Select Crypto</span>
              </div>
              <div className={`flex items-center space-x-2 ${paymentStep === 'payment' ? 'text-forex-600' : paymentStep === 'confirmation' ? 'text-success-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep === 'payment' ? 'bg-forex-600 text-white' : paymentStep === 'confirmation' ? 'bg-success-600 text-white' : 'bg-gray-200'}`}>
                  {paymentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '2'}
                </div>
                <span className="font-medium">Payment</span>
              </div>
              <div className={`flex items-center space-x-2 ${paymentStep === 'confirmation' ? 'text-success-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep === 'confirmation' ? 'bg-success-600 text-white' : 'bg-gray-200'}`}>
                  {paymentStep === 'confirmation' ? <CheckCircle className="h-4 w-4" /> : '3'}
                </div>
                <span className="font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Content based on step */}
          {paymentStep === 'select' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center text-gray-900">Choose Your Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cryptoOptions.map(crypto => (
                  <Card 
                    key={crypto.symbol} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-forex-300"
                    onClick={() => handleCryptoSelect(crypto.symbol)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 bg-gradient-to-r ${crypto.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}>
                        {crypto.icon}
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{crypto.name}</h4>
                      <p className="text-sm text-gray-600">{crypto.symbol}</p>
                      <Badge className="mt-2">Select</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {paymentStep === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Payment</h3>
                <p className="text-gray-600">Send exactly <strong>${currentOffer.amount}</strong> worth of {selectedCryptoData.name} to the address below</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${selectedCryptoData.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {selectedCryptoData.icon}
                      </div>
                      <span>{selectedCryptoData.name} Payment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Wallet Address:</div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-white p-2 rounded border flex-1 break-all font-mono">
                          {selectedCryptoData.wallet}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(selectedCryptoData.wallet, 'Wallet address')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-forex-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">Amount to Send:</div>
                      <div className="text-2xl font-bold text-forex-600">${currentOffer.amount} USD</div>
                      <div className="text-sm text-gray-500">Convert to {selectedCryptoData.symbol} at current market rate</div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        onClick={handlePaymentConfirm}
                        className="flex-1 bg-success-600 hover:bg-success-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Payment Sent
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <QrCode className="h-4 w-4 mr-2" />
                        Show QR
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                        <div>
                          <div className="font-medium">Copy the wallet address</div>
                          <div className="text-sm text-gray-600">Use the copy button to avoid typos</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                        <div>
                          <div className="font-medium">Send the exact amount</div>
                          <div className="text-sm text-gray-600">${currentOffer.amount} worth of {selectedCryptoData.symbol}</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                        <div>
                          <div className="font-medium">Click "Payment Sent"</div>
                          <div className="text-sm text-gray-600">We'll verify and activate your investment</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Security Notice</span>
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">
                        Always verify the wallet address before sending. Payments are processed within 10-30 minutes.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {paymentStep === 'confirmation' && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Submitted!</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your payment is being processed. You'll receive a confirmation email and Telegram notification once verified.
                </p>
              </div>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-semibold">${currentOffer.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold text-success-600">${currentOffer.expectedReturn.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{currentOffer.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Crypto:</span>
                      <span className="font-semibold">{selectedCryptoData.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button onClick={handleClose} className="bg-forex-600 hover:bg-forex-700">
                  Go to Dashboard
                </Button>
                <a 
                  href="https://t.me/forex_traders_signalss" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Join Telegram
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
