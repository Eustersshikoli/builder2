import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Star, 
  MessageCircle, 
  CheckCircle,
  Gift,
  Zap,
  ArrowRight,
  X
} from "lucide-react";

export default function WelcomeOfferModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      // Check how many times user has seen this offer
      const viewCount = parseInt(localStorage.getItem(`welcome-offer-count-${user.id}`) || '0');
      if (viewCount < 10) {
        // Show after 2 seconds for better UX
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    if (user) {
      const currentCount = parseInt(localStorage.getItem(`welcome-offer-count-${user.id}`) || '0');
      localStorage.setItem(`welcome-offer-count-${user.id}`, (currentCount + 1).toString());
    }
  };

  const handleAcceptOffer = () => {
    // Redirect to dashboard with starter offer
    toast({
      title: "Redirecting to Dashboard",
      description: "Please complete the investment from your dashboard",
    });

    navigate("/dashboard?tab=plans", {
      state: {
        selectedPlan: {
          id: "starter",
          name: "Starter Plan",
          minAmount: 100,
          expectedReturn: 2500,
          duration: "24 hours",
          roi: "2,500%"
        },
        action: "invest"
      }
    });
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl p-0 bg-gradient-to-br from-forex-50 via-white to-blue-50 border-0 overflow-hidden">
        <DialogTitle className="sr-only">Welcome Offer - Exclusive Investment Opportunity</DialogTitle>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-forex-600/10 to-blue-600/10"></div>
          
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              
              <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white mb-4 px-4 py-1 text-sm">
                ���� EXCLUSIVE WELCOME OFFER
              </Badge>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-forex-600 bg-clip-text text-transparent mb-3">
                Welcome to Free Forex Signals!
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start your trading journey with our exclusive beginner offer
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Offer Details */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-r from-success-50 to-forex-50 border-2 border-success-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Zap className="h-6 w-6 text-gold-500" />
                      <span className="text-2xl font-bold text-gray-900">STARTER SPECIAL</span>
                      <Zap className="h-6 w-6 text-gold-500" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-3xl font-bold text-forex-600 mb-1">Invest $100</div>
                        <div className="text-xl text-gray-600">Get Back</div>
                        <div className="text-4xl font-bold text-success-600">$2,500</div>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>24 Hours</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-success-500" />
                          <span>2,500% ROI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-gray-700">Guaranteed 2,500% return in 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-gray-700">Secure crypto payments (BTC, ETH, USDT)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-gray-700">Free Telegram signals included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success-500" />
                    <span className="text-gray-700">24/7 customer support</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={handleAcceptOffer}
                    className="w-full bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <DollarSign className="h-5 w-5 mr-2" />
                    Start with $100 Investment
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  
                  <a 
                    href="https://t.me/forex_traders_signalss" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full"
                  >
                    <Button variant="outline" className="w-full py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Free Telegram First
                    </Button>
                  </a>
                </div>
              </div>

              {/* Testimonials & Reviews */}
              <div className="space-y-6">
                {/* Testimonial */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-gold-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 italic mb-4">
                      "I started with just $100 and couldn't believe when I got $2,500 back in 24 hours! 
                      This platform changed my life. The signals are incredibly accurate and the support team is amazing."
                    </blockquote>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        SM
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Sarah Mitchell</div>
                        <div className="text-sm text-gray-500">Verified Trader</div>
                      </div>
                      <Badge className="bg-success-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Telegram Review */}
                <Card className="p-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <MessageCircle className="h-6 w-6 text-blue-500" />
                      <span className="font-semibold text-gray-900">Telegram Channel Review</span>
                    </div>
                    
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gold-400 fill-current" />
                      ))}
                    </div>
                    
                    <blockquote className="text-gray-700 italic mb-4">
                      "Best forex signals channel on Telegram! 87% win rate is not a joke. 
                      I've been following for 6 months and my portfolio is up 340%. Highly recommended!"
                    </blockquote>
                    
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        DC
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">David Chen</div>
                        <div className="text-sm text-gray-500">@david_trader</div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Live Stats */}
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-2">🔥 Live Stats Today</div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-lg font-bold text-success-600">+127</div>
                        <div className="text-xs text-gray-500">New Members</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-600">23</div>
                        <div className="text-xs text-gray-500">Signals Sent</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gold-600">89%</div>
                        <div className="text-xs text-gray-500">Win Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                ⚠️ Limited time offer for new members only. Terms and conditions apply.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Trading involves risks. Past performance does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
