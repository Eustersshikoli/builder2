import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import WelcomeOfferModal from "@/components/WelcomeOfferModal";
import PaymentModal from "@/components/PaymentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  MessageCircle, 
  Users, 
  Copy,
  ExternalLink,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Target,
  Clock,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  PieChart,
  BarChart3,
  CreditCard,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const userStats = {
    balance: 4850.00,
    totalInvested: 3500.00,
    totalProfit: 1847.50,
    totalROI: 52.8,
    activeInvestments: 3,
    completedInvestments: 12,
    pendingPayouts: 2,
    referralEarnings: 327.80
  };

  const investmentPlans = [
    {
      id: "starter",
      name: "Starter Plan",
      minAmount: 100,
      maxAmount: 999,
      roi: "250%",
      duration: "24 hours",
      description: "Perfect for beginners",
      popular: false
    },
    {
      id: "premium", 
      name: "Premium Plan",
      minAmount: 1000,
      maxAmount: 4999,
      roi: "400%",
      duration: "3 days",
      description: "Most popular choice",
      popular: true
    },
    {
      id: "vip",
      name: "VIP Plan", 
      minAmount: 5000,
      maxAmount: 20000,
      roi: "600%",
      duration: "7 days",
      description: "Maximum returns",
      popular: false
    }
  ];

  const activeInvestments = [
    {
      id: 1,
      plan: "Premium Plan",
      amount: 1500,
      expectedReturn: 6000,
      progress: 72,
      timeLeft: "18 hours",
      status: "active"
    },
    {
      id: 2,
      plan: "Starter Plan",
      amount: 500,
      expectedReturn: 1250,
      progress: 95,
      timeLeft: "2 hours", 
      status: "completing"
    },
    {
      id: 3,
      plan: "VIP Plan",
      amount: 5000,
      expectedReturn: 30000,
      progress: 15,
      timeLeft: "5 days 12 hours",
      status: "active"
    }
  ];

  const investmentHistory = [
    {
      id: 1,
      plan: "Premium Plan",
      amount: 1000,
      profit: 4000,
      roi: "400%",
      date: "2024-01-15",
      status: "completed",
      payout: "paid"
    },
    {
      id: 2,
      plan: "Starter Plan", 
      amount: 300,
      profit: 750,
      roi: "250%",
      date: "2024-01-10",
      status: "completed",
      payout: "paid"
    },
    {
      id: 3,
      plan: "Premium Plan",
      amount: 2000,
      profit: 8000,
      roi: "400%", 
      date: "2024-01-05",
      status: "completed",
      payout: "pending"
    }
  ];

  const pendingPayouts = [
    {
      id: 1,
      amount: 1750,
      plan: "Starter Plan",
      requestDate: "2024-01-20",
      expectedDate: "2024-01-21",
      status: "processing",
      wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    },
    {
      id: 2,
      amount: 8000,
      plan: "Premium Plan",
      requestDate: "2024-01-19",
      expectedDate: "2024-01-22",
      status: "pending",
      wallet: "0x742d35Cc6634C0532925a3b8D5c0B32C"
    }
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-forex-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-forex-100 text-sm">Account Balance</p>
                <p className="text-3xl font-bold">${userStats.balance.toLocaleString()}</p>
              </div>
              <Wallet className="h-12 w-12 text-forex-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Invested</p>
                <p className="text-2xl font-bold text-gray-900">${userStats.totalInvested.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Across {userStats.activeInvestments} active plans</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Profit</p>
                <p className="text-2xl font-bold text-success-600">${userStats.totalProfit.toLocaleString()}</p>
                <p className="text-sm text-success-600 flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{userStats.totalROI}% ROI
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-success-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Referral Earnings</p>
                <p className="text-2xl font-bold text-gold-600">${userStats.referralEarnings}</p>
                <p className="text-sm text-gray-500">From {Math.floor(userStats.referralEarnings / 50)} referrals</p>
              </div>
              <Users className="h-10 w-10 text-gold-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Investment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => {setSelectedPlan("starter"); setInvestmentAmount("100");}}
                variant="outline" 
                className="text-xs"
              >
                $100 Plan
              </Button>
              <Button 
                onClick={() => {setSelectedPlan("premium"); setInvestmentAmount("1000");}}
                variant="outline"
                className="text-xs"
              >
                $1000 Plan
              </Button>
              <Button 
                onClick={() => {setSelectedPlan("vip"); setInvestmentAmount("5000");}}
                variant="outline"
                className="text-xs"
              >
                $5000 Plan
              </Button>
            </div>
            <Button className="w-full bg-forex-600 hover:bg-forex-700">
              Start New Investment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Investments Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeInvestments.slice(0, 2).map(investment => (
              <div key={investment.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{investment.plan}</span>
                  <span>{investment.progress}%</span>
                </div>
                <Progress value={investment.progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${investment.amount}</span>
                  <span>{investment.timeLeft} left</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBalance = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Balance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${userStats.balance.toLocaleString()}
              </div>
              <p className="text-gray-600 mb-6">Available Balance</p>
              
              <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-xl font-semibold text-success-600">
                    ${userStats.totalProfit.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Total Profit</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold text-blue-600">
                    ${userStats.totalInvested.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">Total Invested</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <Label>Crypto Wallet</Label>
              <select className="w-full p-2 border rounded-md">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>Tether (USDT)</option>
              </select>
            </div>
            <Button className="w-full">Request Withdrawal</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPlans = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Investment Plans</h2>
        <p className="text-gray-600">Choose the plan that fits your investment goals</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {investmentPlans.map(plan => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-forex-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-forex-500">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-forex-600">{plan.roi}</div>
              <p className="text-gray-600">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum:</span>
                  <span className="font-semibold">${plan.minAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maximum:</span>
                  <span className="font-semibold">${plan.maxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{plan.duration}</span>
                </div>
              </div>
              <Button 
                className={`w-full ${plan.popular ? 'bg-forex-600 hover:bg-forex-700' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActiveInvestments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Active Investments</h2>
        <Button className="bg-forex-600 hover:bg-forex-700">
          <Plus className="h-4 w-4 mr-2" />
          New Investment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {activeInvestments.map(investment => (
          <Card key={investment.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{investment.plan}</CardTitle>
                <Badge variant={investment.status === "completing" ? "default" : "secondary"}>
                  {investment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invested:</span>
                  <span className="font-semibold">${investment.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Return:</span>
                  <span className="font-semibold text-success-600">${investment.expectedReturn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Left:</span>
                  <span className="font-semibold">{investment.timeLeft}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{investment.progress}%</span>
                </div>
                <Progress value={investment.progress} className="h-3" />
              </div>
              
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Investment History</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ROI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investmentHistory.map(investment => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{investment.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${investment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-success-600 font-semibold">${investment.profit.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="outline" className="text-success-600">{investment.roi}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{investment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-success-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {investment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={investment.payout === "paid" ? "default" : "secondary"}>
                        {investment.payout}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payouts</h2>
        <Button className="bg-forex-600 hover:bg-forex-700">
          Request Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingPayouts.map(payout => (
          <Card key={payout.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">${payout.amount.toLocaleString()}</CardTitle>
                <Badge variant={payout.status === "processing" ? "default" : "secondary"}>
                  {payout.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{payout.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Date:</span>
                  <span>{payout.requestDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Date:</span>
                  <span>{payout.expectedDate}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Wallet Address:</p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs flex-1 break-all">{payout.wallet}</code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(payout.wallet, "Wallet address")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'balance':
        return renderBalance();
      case 'plans':
        return renderPlans();
      case 'active':
        return renderActiveInvestments();
      case 'history':
        return renderHistory();
      case 'payouts':
        return renderPayouts();
      case 'referrals':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Referral Program</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 text-forex-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Earn 10% Commission</h3>
                <p className="text-gray-600 mb-6">Invite friends and earn 10% of their investments</p>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your Referral Link:</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 text-sm bg-white p-2 rounded border">
                      https://forexsignals.com/ref/{user?.id || 'user123'}
                    </code>
                    <Button size="sm" variant="outline">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{Math.floor(userStats.referralEarnings / 50)}</div>
                    <p className="text-sm text-gray-500">Total Referrals</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success-600">${userStats.referralEarnings}</div>
                    <p className="text-sm text-gray-500">Total Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-6">
          {renderContent()}
        </div>
      </DashboardLayout>
      <WelcomeOfferModal />
      <PaymentModal />
    </>
  );
}
