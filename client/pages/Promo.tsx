import { useState, useEffect } from "react";
import FrontPageLayout from "@/components/FrontPageLayout";
import PaymentModal from "@/components/PaymentModal";
import { useInvestment } from "@/contexts/InvestmentContext";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star, 
  CheckCircle,
  MessageCircle,
  Gift,
  Target,
  Rocket,
  Crown,
  Trophy,
  Sparkles
} from "lucide-react";

export default function Promo() {
  const { setCurrentOffer, setShowPaymentModal } = useInvestment();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleQuickInvest = (amount: number, expectedReturn: number, roi: string, plan: string) => {
    setCurrentOffer({
      isActive: true,
      plan,
      amount,
      expectedReturn,
      duration: amount === 100 ? "24 hours" : amount === 1000 ? "3 days" : "7 days",
      roi
    });
    setShowPaymentModal(true);
  };

  const promoOffers = [
    {
      id: "flash",
      title: "⚡ FLASH OFFER",
      subtitle: "Limited Time Only",
      amount: 100,
      returns: 5000,
      roi: "5,000%",
      duration: "24 Hours",
      color: "from-red-500 to-pink-500",
      badge: "🔥 HOT",
      features: ["Instant Activation", "24/7 Support", "Telegram Alerts", "No Hidden Fees"]
    },
    {
      id: "mega",
      title: "🚀 MEGA BOOST",
      subtitle: "Most Popular",
      amount: 500,
      returns: 15000,
      roi: "3,000%",
      duration: "48 Hours", 
      color: "from-purple-500 to-purple-600",
      badge: "👑 VIP",
      features: ["Priority Processing", "Dedicated Manager", "Exclusive Signals", "Fast Payouts"]
    },
    {
      id: "ultimate",
      title: "💎 ULTIMATE",
      subtitle: "Maximum Returns",
      amount: 1000,
      returns: 25000,
      roi: "2,500%",
      duration: "72 Hours",
      color: "from-gold-500 to-yellow-500",
      badge: "💎 ELITE",
      features: ["Personal Advisor", "Premium Signals", "Risk Insurance", "Instant Withdrawals"]
    }
  ];

  const liveStats = [
    { label: "Active Traders", value: "2,847", icon: "👥" },
    { label: "Today's Profits", value: "$1.2M", icon: "💰" },
    { label: "Success Rate", value: "94.7%", icon: "📈" },
    { label: "Countries", value: "67", icon: "🌍" }
  ];

  return (
    <FrontPageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gold-400/30 to-yellow-400/30 rounded-full blur-3xl animate-bounce delay-300"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-bounce delay-700"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8 animate-fade-in">
              <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-black px-6 py-2 text-lg font-bold mb-4">
                🎉 EXCLUSIVE PROMO EVENT
              </Badge>
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-6">
                <span className="bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-400 bg-clip-text text-transparent animate-pulse">
                  MEGA PROFIT
                </span>
                <br />
                <span className="text-white">WEEKEND</span>
              </h1>
              <p className="text-2xl text-purple-100 mb-8 max-w-4xl mx-auto">
                🚀 Turn $100 into $5,000 in 24 Hours! Limited time explosive returns!
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-12 animate-slide-up delay-500">
              <div className="text-xl text-purple-200 mb-4">⏰ OFFER EXPIRES IN:</div>
              <div className="flex justify-center space-x-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">HOURS</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">MINUTES</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">SECONDS</div>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto animate-slide-up delay-700">
              {liveStats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gold-400">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Offers */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 transform rotate-12 scale-150"></div>
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  EXPLOSIVE DEALS
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                🎯 Choose your path to massive profits. All offers include FREE Telegram signals & 24/7 support!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {promoOffers.map((offer, index) => (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl border-2 ${
                    index === 1 ? 'border-purple-500 ring-4 ring-purple-200' : 'border-gray-200'
                  }`}
                >
                  {/* Offer Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className={`bg-gradient-to-r ${offer.color} text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform rotate-12`}>
                      {offer.badge}
                    </div>
                  </div>

                  {/* Gradient Header */}
                  <div className={`h-4 bg-gradient-to-r ${offer.color}`}></div>

                  <CardHeader className="text-center pb-4">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${offer.color} flex items-center justify-center shadow-lg`}>
                      {index === 0 ? <Zap className="h-10 w-10 text-white" /> :
                       index === 1 ? <Rocket className="h-10 w-10 text-white" /> :
                       <Crown className="h-10 w-10 text-white" />}
                    </div>
                    
                    <CardTitle className="text-2xl font-black mb-2">{offer.title}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${offer.color} text-white mb-4`}>
                      {offer.subtitle}
                    </Badge>
                    
                    <div className="space-y-2">
                      <div className="text-4xl font-black text-gray-900">${offer.amount}</div>
                      <div className="text-lg text-gray-600">becomes</div>
                      <div className={`text-5xl font-black bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                        ${offer.returns.toLocaleString()}
                      </div>
                      <div className="text-2xl font-bold text-success-600">{offer.roi} ROI</div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">{offer.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => handleQuickInvest(offer.amount, offer.returns, offer.roi, offer.title)}
                      className={`w-full py-4 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r ${offer.color} hover:opacity-90`}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      INVEST NOW
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gradient-to-r from-success-500 to-success-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-black mb-12">🏆 WEEKEND WINNERS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Sarah M.", profit: "$12,500", investment: "$500", time: "24 hours" },
                { name: "David C.", profit: "$45,000", investment: "$1,000", time: "48 hours" },
                { name: "Maria R.", profit: "$8,750", investment: "$250", time: "12 hours" }
              ].map((winner, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{winner.name}</h3>
                    <div className="text-3xl font-black text-gold-400 mb-2">{winner.profit}</div>
                    <div className="text-sm text-success-100">
                      From {winner.investment} in {winner.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12">
              <a 
                href="https://t.me/forex_traders_signalss" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-white text-success-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-200 text-lg font-bold shadow-lg"
              >
                <MessageCircle className="h-6 w-6" />
                <span>Join 3,400+ Winners on Telegram</span>
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-gold-400 to-yellow-400 bg-clip-text text-transparent">
                DON'T MISS OUT!
              </span>
            </h2>
            <p className="text-2xl text-purple-100 mb-8">
              ⚠️ These explosive returns are only available this weekend. Join now or regret forever!
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={() => handleQuickInvest(100, 5000, "5,000%", "⚡ FLASH OFFER")}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-12 py-6 rounded-xl text-xl font-bold shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Zap className="h-6 w-6 mr-3" />
                START WITH $100 → GET $5,000
              </Button>
              
              <div className="text-sm text-purple-200">
                ✅ Instant activation • ✅ 24/7 support • ✅ Guaranteed returns
              </div>
            </div>
          </div>
        </section>

        <PaymentModal />
      </div>
    </FrontPageLayout>
  );
}
