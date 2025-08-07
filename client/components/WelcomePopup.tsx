import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, MessageCircle, Gift, Clock, Star } from "lucide-react";

export default function WelcomePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCount, setShowCount] = useState(0);

  useEffect(() => {
    // Get the current show count from localStorage
    const currentCount = parseInt(localStorage.getItem("forex_popup_count") || "0");
    const lastShown = localStorage.getItem("forex_popup_last_shown");
    const today = new Date().toDateString();

    setShowCount(currentCount);

    // Show popup if:
    // 1. Not shown more than 5 times total
    // 2. Not shown today OR less than 5 times total
    // 3. User hasn't closed it permanently
    const shouldShow = currentCount < 5 && lastShown !== today;

    if (shouldShow) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Update counters
        const newCount = currentCount + 1;
        localStorage.setItem("forex_popup_count", newCount.toString());
        localStorage.setItem("forex_popup_last_shown", today);
        setShowCount(newCount);
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleJoinTelegram = () => {
    window.open("https://t.me/forex_traders_signalss", "_blank");
    setIsVisible(false);
  };

  const handleInvest = () => {
    // Redirect to signup/login
    window.location.href = "/signup";
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={setIsVisible}>
      <DialogContent className="max-w-md p-0 bg-gradient-to-br from-white via-forex-50 to-blue-50 border-2 border-forex-200 overflow-hidden">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header with animated background */}
        <div className="relative bg-gradient-to-r from-forex-600 to-blue-600 p-6 text-white text-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 w-8 h-8 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-3 right-6 w-6 h-6 bg-white/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-4 right-12 w-4 h-4 bg-white/40 rounded-full animate-ping delay-700"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">
              🎉 Welcome Exclusive Offer!
            </DialogTitle>
            <Badge className="bg-white/20 text-white border-white/30">
              <Star className="h-3 w-3 mr-1" />
              Limited Time Only
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main offer */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-success-500 to-success-600 text-white p-4 rounded-xl mb-4">
              <div className="text-3xl font-bold mb-1">$100 → $2,500</div>
              <div className="text-sm opacity-90">25x ROI in 24 Hours</div>
            </div>
            <p className="text-gray-700 text-sm">
              Get started with just $100 and earn $2,500 in 24 hours! 
              Join our exclusive investment platform with proven results.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-lg border text-center">
              <TrendingUp className="h-5 w-5 text-forex-600 mx-auto mb-1" />
              <div className="font-medium">87% Win Rate</div>
            </div>
            <div className="bg-white p-3 rounded-lg border text-center">
              <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="font-medium">24hr Returns</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleInvest}
              className="w-full bg-gradient-to-r from-forex-600 to-blue-600 hover:from-forex-700 hover:to-blue-700 text-white py-3 text-base font-semibold"
            >
              Start Investing Now
            </Button>
            
            <Button
              onClick={handleJoinTelegram}
              variant="outline"
              className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 py-2"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Join Free Telegram First
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                3,400+ Active Users
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                Secure Platform
              </div>
            </div>
            <p>Show count: {showCount}/5 • This popup will show {5 - showCount} more times</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
