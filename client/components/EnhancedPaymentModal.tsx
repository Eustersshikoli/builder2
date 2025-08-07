import { useState, useEffect } from "react";
import { useInvestment } from "@/contexts/InvestmentContext";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { nowPaymentsService, PaymentCurrency } from "@/lib/nowpayments";
import { supabase } from "@/integrations/supabase/client";
import { investmentService } from "@/lib/investment-service";
import {
  X,
  Copy,
  CheckCircle,
  Clock,
  Wallet,
  QrCode,
  ExternalLink,
  TrendingUp,
  Shield,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface PaymentStep {
  step: "select" | "payment" | "confirmation" | "error";
  data?: any;
}

export default function EnhancedPaymentModal() {
  const {
    currentOffer,
    showPaymentModal,
    setShowPaymentModal,
    selectedCrypto,
    setSelectedCrypto,
  } = useInvestment();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<PaymentStep>({
    step: "select",
  });
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<PaymentCurrency[]>(
    [],
  );
  const [paymentStatus, setPaymentStatus] = useState<string>("waiting");
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (showPaymentModal) {
      loadAvailableCurrencies();
    }
  }, [showPaymentModal]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (paymentData && paymentStep.step === "payment") {
      interval = setInterval(() => {
        checkPaymentStatus();
      }, 30000); // Check every 30 seconds
    }
    return () => clearInterval(interval);
  }, [paymentData, paymentStep.step]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const loadAvailableCurrencies = async () => {
    try {
      setLoading(true);
      const currencies = nowPaymentsService.getPopularCryptoCurrencies();
      setCryptoCurrencies(currencies);
    } catch (error) {
      console.error("Error loading currencies:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: "Failed to load payment methods. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handleClose = () => {
    setShowPaymentModal(false);
    setPaymentStep({ step: "select" });
    setPaymentData(null);
    setTimeLeft(0);
  };

  const handleCryptoSelect = async (cryptoSymbol: string) => {
    if (!user || !currentOffer) return;

    try {
      setLoading(true);
      setSelectedCrypto(cryptoSymbol);

      // Create investment record using investment service
      const investmentResult = await investmentService.createInvestment({
        user_id: user.id,
        plan_name: currentOffer.plan,
        amount: currentOffer.amount,
        expected_return: currentOffer.expectedReturn,
        roi_percentage: parseFloat(
          currentOffer.roi.replace("%", "").replace(",", ""),
        ),
        duration_days:
          currentOffer.duration === "24 hours"
            ? 1
            : currentOffer.duration === "3 days"
              ? 3
              : 7,
        payment_method: cryptoSymbol,
      });

      if (!investmentResult.success) {
        throw new Error(
          `Failed to create investment: ${investmentResult.error}`,
        );
      }

      const investment = investmentResult.data;

      // Create payment with NOWPayments
      const { payment, dbPayment } =
        await nowPaymentsService.createInvestmentPayment(
          user.id,
          investment.id,
          currentOffer.amount,
          cryptoSymbol,
          `Investment in ${currentOffer.name} - $${currentOffer.amount}`,
        );

      setPaymentData({ payment, dbPayment, investment });
      setPaymentStep({ step: "payment", data: payment });
      setTimeLeft(3600); // 1 hour payment window

      toast({
        title: "Payment Created",
        description: "Please send the exact amount to the provided address.",
      });
    } catch (error) {
      console.error("Error creating payment:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setPaymentStep({
        step: "error",
        data: {
          message:
            error instanceof Error ? error.message : "Failed to create payment",
        },
      });
      toast({
        title: "Payment Error",
        description: "Failed to create payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!paymentData?.payment?.payment_id) return;

    try {
      const status = await nowPaymentsService.updatePaymentStatus(
        paymentData.payment.payment_id,
      );
      setPaymentStatus(status.payment_status);

      if (status.payment_status === "finished") {
        setPaymentStep({ step: "confirmation", data: status });
        toast({
          title: "Payment Confirmed!",
          description: "Your investment has been activated successfully.",
        });
      } else if (
        status.payment_status === "failed" ||
        status.payment_status === "expired"
      ) {
        setPaymentStep({
          step: "error",
          data: {
            message: `Payment ${status.payment_status}. Please try again.`,
          },
        });
      }
    } catch (error) {
      console.error("Error checking payment status:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: {
        color: "bg-yellow-500",
        text: "Waiting for Payment",
        icon: Clock,
      },
      confirming: { color: "bg-blue-500", text: "Confirming", icon: RefreshCw },
      confirmed: {
        color: "bg-green-500",
        text: "Confirmed",
        icon: CheckCircle,
      },
      sending: { color: "bg-blue-500", text: "Processing", icon: RefreshCw },
      partially_paid: {
        color: "bg-orange-500",
        text: "Partially Paid",
        icon: AlertCircle,
      },
      finished: { color: "bg-green-500", text: "Completed", icon: CheckCircle },
      failed: { color: "bg-red-500", text: "Failed", icon: AlertCircle },
      refunded: { color: "bg-gray-500", text: "Refunded", icon: AlertCircle },
      expired: { color: "bg-red-500", text: "Expired", icon: AlertCircle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  if (!currentOffer) return null;

  const selectedCryptoData = cryptoCurrencies.find(
    (crypto) => crypto.currency === selectedCrypto,
  );

  return (
    <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-gray-50 via-white to-forex-50 border-0 overflow-hidden">
        <DialogTitle className="sr-only">
          Enhanced Investment Payment Process
        </DialogTitle>

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Investment
            </h1>
            <p className="text-gray-600">
              Secure cryptocurrency payment processing powered by NOWPayments
            </p>
          </div>

          {/* Investment Summary */}
          <Card className="mb-8 bg-gradient-to-r from-forex-50 to-blue-50 border-2 border-forex-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Investment Amount</div>
                  <div className="text-2xl font-bold text-forex-600">
                    ${currentOffer.amount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Expected Return</div>
                  <div className="text-2xl font-bold text-success-600">
                    ${currentOffer.expectedReturn.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">ROI</div>
                  <div className="text-2xl font-bold text-gold-600">
                    {currentOffer.roi}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {currentOffer.duration}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              <div
                className={`flex items-center space-x-2 ${paymentStep.step === "select" ? "text-forex-600" : ["payment", "confirmation"].includes(paymentStep.step) ? "text-success-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep.step === "select" ? "bg-forex-600 text-white" : ["payment", "confirmation"].includes(paymentStep.step) ? "bg-success-600 text-white" : "bg-gray-200"}`}
                >
                  {["payment", "confirmation"].includes(paymentStep.step) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    "1"
                  )}
                </div>
                <span className="font-medium">Select Crypto</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${paymentStep.step === "payment" ? "text-forex-600" : paymentStep.step === "confirmation" ? "text-success-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep.step === "payment" ? "bg-forex-600 text-white" : paymentStep.step === "confirmation" ? "bg-success-600 text-white" : "bg-gray-200"}`}
                >
                  {paymentStep.step === "confirmation" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : paymentStep.step === "payment" ? (
                    <Clock className="h-4 w-4" />
                  ) : (
                    "2"
                  )}
                </div>
                <span className="font-medium">Payment</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${paymentStep.step === "confirmation" ? "text-success-600" : "text-gray-400"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentStep.step === "confirmation" ? "bg-success-600 text-white" : "bg-gray-200"}`}
                >
                  {paymentStep.step === "confirmation" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    "3"
                  )}
                </div>
                <span className="font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          {/* Content based on step */}
          {paymentStep.step === "select" && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center text-gray-900">
                Choose Your Cryptocurrency
              </h3>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-forex-600" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {cryptoCurrencies.map((crypto) => (
                    <Card
                      key={crypto.currency}
                      className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-forex-300"
                      onClick={() => handleCryptoSelect(crypto.currency)}
                    >
                      <CardContent className="p-4 text-center">
                        <img
                          src={crypto.logo_url}
                          alt={crypto.name}
                          className="w-12 h-12 mx-auto mb-3"
                        />
                        <h4 className="font-semibold text-sm mb-1">
                          {crypto.name}
                        </h4>
                        <p className="text-xs text-gray-600 uppercase">
                          {crypto.currency}
                        </p>
                        <Badge className="mt-2 text-xs">Select</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {paymentStep.step === "payment" && paymentData && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Send Payment
                </h3>
                <p className="text-gray-600">
                  Send exactly{" "}
                  <strong>
                    {paymentData.payment.pay_amount}{" "}
                    {paymentData.payment.pay_currency.toUpperCase()}
                  </strong>{" "}
                  to complete your investment
                </p>
                {timeLeft > 0 && (
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-orange-600 font-mono">
                      {formatTime(timeLeft)} remaining
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedCryptoData && (
                          <img
                            src={selectedCryptoData.logo_url}
                            alt={selectedCryptoData.name}
                            className="w-8 h-8"
                          />
                        )}
                        <span>
                          {paymentData.payment.pay_currency.toUpperCase()}{" "}
                          Payment
                        </span>
                      </div>
                      {getPaymentStatusBadge(paymentStatus)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Payment Address:
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-white p-2 rounded border flex-1 break-all font-mono">
                          {paymentData.payment.pay_address}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            copyToClipboard(
                              paymentData.payment.pay_address,
                              "Payment address",
                            )
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="bg-forex-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Exact Amount to Send:
                      </div>
                      <div className="text-2xl font-bold text-forex-600">
                        {paymentData.payment.pay_amount}{" "}
                        {paymentData.payment.pay_currency.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">
                        ≈ ${paymentData.payment.price_amount} USD
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-2">
                        Payment ID:
                      </div>
                      <div className="font-mono text-sm">
                        {paymentData.payment.payment_id}
                      </div>
                    </div>

                    <Button
                      onClick={checkPaymentStatus}
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      Check Payment Status
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Instructions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          1
                        </div>
                        <div>
                          <div className="font-medium">
                            Copy the payment address
                          </div>
                          <div className="text-sm text-gray-600">
                            Use the copy button to avoid mistakes
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          2
                        </div>
                        <div>
                          <div className="font-medium">
                            Send the exact amount
                          </div>
                          <div className="text-sm text-gray-600">
                            {paymentData.payment.pay_amount}{" "}
                            {paymentData.payment.pay_currency.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-forex-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          3
                        </div>
                        <div>
                          <div className="font-medium">
                            Wait for confirmation
                          </div>
                          <div className="text-sm text-gray-600">
                            Payment will be automatically verified
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-yellow-800">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Important</span>
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">
                        Send only{" "}
                        {paymentData.payment.pay_currency.toUpperCase()} to this
                        address. Sending other cryptocurrencies will result in
                        loss of funds.
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-blue-800">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">Processing Time</span>
                      </div>
                      <div className="text-sm text-blue-700 mt-1">
                        Payments typically confirm within 10-30 minutes. You'll
                        be notified once your investment is activated.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {paymentStep.step === "confirmation" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-success-500 to-success-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Investment Activated!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your payment has been confirmed and your investment is now
                  active. You can track your progress in the dashboard.
                </p>
              </div>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment:</span>
                      <span className="font-semibold">
                        ${currentOffer.amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold text-success-600">
                        ${currentOffer.expectedReturn.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">
                        {currentOffer.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-success-600">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleClose}
                  className="bg-forex-600 hover:bg-forex-700"
                >
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

          {paymentStep.step === "error" && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-10 w-10 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Payment Error
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {paymentStep.data?.message ||
                    "Something went wrong with your payment. Please try again."}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setPaymentStep({ step: "select" })}
                  className="bg-forex-600 hover:bg-forex-700"
                >
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
