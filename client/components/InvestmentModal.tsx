import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { investmentService } from "@/lib/investment-service";
import { nowPaymentsService } from "@/lib/nowpayments";
import { supabase } from "@/integrations/supabase/client";
import investmentPlansService, {
  InvestmentPlan,
} from "@/lib/investment-plans-service";
import {
  X,
  DollarSign,
  TrendingUp,
  Clock,
  CreditCard,
  Wallet,
  CheckCircle,
  Loader2,
  Target,
  Calendar,
  Award,
} from "lucide-react";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: InvestmentPlan;
  onInvestmentComplete?: () => void;
}

export default function InvestmentModal({
  isOpen,
  onClose,
  plan,
  onInvestmentComplete,
}: InvestmentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [amount, setAmount] = useState(plan.min_amount);
  const [paymentMethod, setPaymentMethod] = useState<"balance" | "nowpayments">(
    "balance",
  );
  const [loading, setLoading] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  // Calculate expected returns
  const profit = (amount * plan.roi_percentage) / 100;
  const totalReturn = amount + profit;
  const dailyReturn = profit / plan.duration_days;

  useEffect(() => {
    if (user && isOpen) {
      loadUserBalance();
    }
  }, [user, isOpen]);

  const loadUserBalance = async () => {
    try {
      // Get user balance from user_balances table
      const { data, error } = await supabase
        .from('user_balances')
        .select('balance')
        .eq('user_id', user?.id || "")
        .single();
      
      if (!error && data) {
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to load user balance");
    }
  };

  const handleInvestment = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to make an investment",
        variant: "destructive",
      });
      return;
    }

    // Validate amount
    const validation = investmentPlansService.validateAmount(plan, amount);
    if (!validation.isValid) {
      toast({
        title: "Invalid Amount",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "balance") {
        // Check if user has sufficient balance
        if (userBalance < amount) {
          toast({
            title: "Insufficient Balance",
            description: `You need $${amount - userBalance} more to make this investment`,
            variant: "destructive",
          });
          return;
        }

        // Process investment with account balance
        const result = await investmentService.createInvestment({
          user_id: user.id,
          plan_name: plan.name,
          amount,
          expected_return: totalReturn,
          roi_percentage: plan.roi_percentage,
          duration_days: plan.duration_days,
          payment_method: "balance",
        });

        if (result.success) {
          toast({
            title: "Investment Successful!",
            description: `You have successfully invested $${amount} in ${plan.name}`,
          });
          onClose();
          onInvestmentComplete?.();
        } else {
          throw new Error(result.error || "Investment failed");
        }
      } else {
        // Create investment record first
        const investmentResult = await investmentService.createInvestment({
          user_id: user.id,
          plan_name: plan.name,
          amount,
          expected_return: totalReturn,
          roi_percentage: plan.roi_percentage,
          duration_days: plan.duration_days,
          payment_method: "crypto",
        });

        if (!investmentResult.success) {
          throw new Error(investmentResult.error || "Failed to create investment");
        }

        // Process with NowPayments
        const paymentData = await nowPaymentsService.createInvestmentPayment(
          user.id,
          investmentResult.data.id,
          amount,
          "btc",
          `Investment in ${plan.name}`
        );

        if (paymentData && paymentData.payment) {
          toast({
            title: "Payment Created",
            description: "Please complete the crypto payment to activate your investment.",
          });

          // Store payment info for the user to complete
          onClose();
        } else {
          throw new Error("Failed to create payment");
        }
      }
    } catch (error) {
      toast({
        title: "Investment Failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <p className="text-gray-600 mt-1">{plan.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-xl font-bold text-green-600">
                {plan.roi_percentage / 100}x
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold text-blue-600">
                {plan.duration_days} day{plan.duration_days !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Range</p>
              <p className="text-lg font-bold text-purple-600">
                ${plan.min_amount} - ${plan.max_amount}
              </p>
            </div>
          </div>

          {/* Investment Amount */}
          <div>
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Investment Amount ($)
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={plan.min_amount}
              max={plan.max_amount}
              className="mt-1"
              placeholder={`Min: $${plan.min_amount}`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum: ${plan.min_amount} • Maximum: ${plan.max_amount}
            </p>
          </div>

          {/* Profit Calculation */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="h-5 w-5 text-green-600 mr-2" />
              Investment Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Your Investment</p>
                <p className="text-lg font-bold text-gray-900">
                  ${amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Expected Profit</p>
                <p className="text-lg font-bold text-green-600">
                  +${profit.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Return</p>
                <p className="text-xl font-bold text-green-700">
                  ${totalReturn.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Daily Earnings</p>
                <p className="text-lg font-bold text-blue-600">
                  ${dailyReturn.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Choose Payment Method
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("balance")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "balance"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Wallet
                    className={`h-6 w-6 ${paymentMethod === "balance" ? "text-blue-600" : "text-gray-400"}`}
                  />
                  <div className="text-left">
                    <p
                      className={`font-medium ${paymentMethod === "balance" ? "text-blue-900" : "text-gray-700"}`}
                    >
                      Account Balance
                    </p>
                    <p className="text-sm text-gray-500">
                      Available: ${userBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
                {paymentMethod === "balance" && (
                  <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("nowpayments")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  paymentMethod === "nowpayments"
                    ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CreditCard
                    className={`h-6 w-6 ${paymentMethod === "nowpayments" ? "text-green-600" : "text-gray-400"}`}
                  />
                  <div className="text-left">
                    <p
                      className={`font-medium ${paymentMethod === "nowpayments" ? "text-green-900" : "text-gray-700"}`}
                    >
                      Crypto Payment
                    </p>
                    <p className="text-sm text-gray-500">Bitcoin, USDT, etc.</p>
                  </div>
                </div>
                {paymentMethod === "nowpayments" && (
                  <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Warnings */}
          {paymentMethod === "balance" && userBalance < amount && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                ⚠️ Insufficient balance. You need $
                {(amount - userBalance).toLocaleString()} more.
              </p>
            </div>
          )}

          {/* Features List */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <Button
              onClick={handleInvestment}
              disabled={
                loading || (paymentMethod === "balance" && userBalance < amount)
              }
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <DollarSign className="h-4 w-4 mr-2" />
              )}
              {paymentMethod === "balance"
                ? "Invest Now"
                : "Proceed to Crypto Payment"}
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
