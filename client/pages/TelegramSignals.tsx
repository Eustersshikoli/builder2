import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useToast } from "@/hooks/use-toast";
import InvestmentModal from "@/components/InvestmentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Star,
  Users,
  MessageCircle,
  Send,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  Award,
  Zap,
  Globe,
  Smartphone,
  TrendingDown,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function TelegramSignals() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const { toast } = useToast();

  // Investment offer data
  const investmentOffer = {
    id: "telegram-vip",
    name: "VIP Telegram Signals Package",
    description:
      "Exclusive access to our premium Telegram signals with guaranteed results",
    min_amount: 500,
    max_amount: 50000,
    roi_percentage: 1200,
    duration_days: 1,
    is_active: true,
    is_featured: true,
    features: [
      "12x return in 26 hours",
      "Daily Premium Signals",
      "90%+ Win Rate",
      "24/7 Support",
      "Risk Management",
      "Live Trading Room",
      "Exclusive Telegram Access",
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Telegram signals reviews
  const signalsReviews = [
    {
      id: 1,
      name: "Marcus Johnson",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "The Telegram signals are incredibly accurate! I've made over $15,000 in just 3 weeks following their trades. The analysis is spot-on and the entry/exit points are perfect.",
      profit: "+$15,240",
      timeframe: "3 weeks",
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      review:
        "Best forex signals I've ever used! The Telegram channel is so well organized and the signals come with detailed analysis. My trading account has grown by 180% since joining.",
      profit: "+$8,750",
      timeframe: "1 month",
    },
  ];

  // Investment testimonials
  const investmentTestimonials = [
    {
      id: 1,
      name: "David Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      location: "Miami, FL",
      investment: "$1,000",
      return: "$25,000",
      story:
        "I started with just $1,000 and couldn't believe the results! The team delivered exactly what they promised. My investment grew to $25,000 in just 6 weeks. This is life-changing!",
      timeframe: "6 weeks",
    },
    {
      id: 2,
      name: "Emily Watson",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "London, UK",
      investment: "$2,500",
      return: "$62,500",
      story:
        "As a single mother, this investment changed everything for my family. The returns exceeded all my expectations and the support team was incredible throughout the process.",
      timeframe: "2 months",
    },
  ];

  const handleSignup = async () => {
    if (!name || !email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a temporary password for quick signup
      const tempPassword = Math.random().toString(36).slice(-8) + "!A1";

      const result = await signUp({
        email,
        password: tempPassword,
        fullName: name,
        country: "US", // Default country
        phoneNumber: "", // Optional
      });

      if (result.success) {
        toast({
          title: "Success!",
          description:
            "Account created successfully! Redirecting to dashboard...",
        });

        // Redirect to dashboard after successful signup
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        throw new Error(result.error || "Failed to create account");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const handleInvestNow = () => {
    if (user) {
      setShowInvestmentModal(true);
    } else {
      // Redirect to signup if not logged in
      navigate("/signup");
    }
  };

  const handleJoinTelegram = () => {
    // Open Telegram channel
    window.open("https://t.me/forex_traders_signalss", "_blank");

    // If user is not logged in, encourage them to create account
    if (!user) {
      toast({
        title: "Join Our Community!",
        description:
          "Create a free account to get exclusive access to our premium features",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                ForexSignals
              </span>
            </div>
            <Link
              to="/"
              className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-6">
              🔥 EXCLUSIVE TELEGRAM OFFER
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Join Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                VIP
              </span>
              <br />
              Telegram Signals
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get access to premium forex signals with 90%+ win rate directly in
              your Telegram. Start earning massive profits today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleJoinTelegram}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3 text-lg"
              >
                <Send className="mr-2 h-5 w-5" />
                Join Telegram Channel
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup")}
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
              >
                Create Account
              </Button>
            </div>
          </div>

          {/* Investment Offer Section */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🚀 Limited Time Investment Opportunity
              </h2>
              <p className="text-gray-300 text-lg">
                Don't miss this exclusive offer available only through Telegram
              </p>
            </div>

            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {investmentOffer.name}
                </CardTitle>
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {investmentOffer.roi_percentage / 100}x ROI
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Minimum Investment</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${investmentOffer.min_amount}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Return Multiplier</p>
                    <p className="text-xl font-bold text-green-600">
                      {investmentOffer.roi_percentage / 100}x
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-xl font-bold text-gray-900">
                      {investmentOffer.duration_days} day
                      {investmentOffer.duration_days !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    What's Included:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {investmentOffer.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleInvestNow}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 text-lg"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Invest Now - Limited Spots Available
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Telegram Signals Reviews */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                📈 Real Results from Our Telegram Signals
              </h2>
              <p className="text-gray-300 text-lg">
                See what our members are saying about our Telegram trading
                signals
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {signalsReviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 text-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {review.name}
                          </h3>
                          <div className="flex space-x-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            {review.profit}
                          </Badge>
                          <span className="text-sm text-gray-300">
                            {review.timeframe}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 leading-relaxed">
                      {review.review}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Investment Testimonials */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                💰 Life-Changing Investment Stories
              </h2>
              <p className="text-gray-300 text-lg">
                Real people, real profits, real life transformations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {investmentTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 text-white"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-xl">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-300">{testimonial.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-500/20 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-300">
                          Initial Investment
                        </p>
                        <p className="text-xl font-bold text-red-400">
                          {testimonial.investment}
                        </p>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <p className="text-sm text-gray-300">Total Return</p>
                        <p className="text-xl font-bold text-green-400">
                          {testimonial.return}
                        </p>
                      </div>
                    </div>

                    <blockquote className="text-gray-200 leading-relaxed mb-4">
                      "{testimonial.story}"
                    </blockquote>

                    <div className="flex items-center justify-between text-sm">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {testimonial.timeframe}
                      </Badge>
                      <span className="text-gray-400">Verified Result ✓</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mb-12">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg border border-yellow-500/30 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Financial Future?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of successful traders in our exclusive Telegram
                channel and start your journey to financial freedom today.
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-3">
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSignup}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 text-lg"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Create Account & Join Telegram
                </Button>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Free to Join</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </section>

          {/* Telegram Channel Link */}
          <section className="text-center">
            <Card className="bg-blue-600/20 backdrop-blur-lg border border-blue-500/30 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Send className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Join Our Official Telegram Channel
                </h3>
                <p className="text-gray-300 mb-6">
                  Get instant access to premium forex signals, market analysis,
                  and join our community of successful traders.
                </p>
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-3 text-lg"
                  onClick={handleJoinTelegram}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Open Telegram Channel
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  @forex_traders_signalss
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && (
        <InvestmentModal
          isOpen={showInvestmentModal}
          onClose={() => setShowInvestmentModal(false)}
          plan={investmentOffer}
        />
      )}
    </div>
  );
}
