import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookiesAccepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookiesAccepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto p-3 sm:p-4">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:gap-4">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-forex-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base leading-tight">Cookie Notice</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We use cookies to improve your experience. By continuing, you consent to our{" "}
                <a href="#" className="text-forex-600 hover:underline">Cookie Policy</a>.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={rejectCookies}
              className="flex-1 sm:flex-none text-gray-600 border-gray-300 hover:bg-gray-50 text-sm font-medium h-11 sm:h-9 touch-manipulation"
            >
              Deny
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="flex-1 sm:flex-none bg-forex-600 hover:bg-forex-700 text-sm font-medium h-11 sm:h-9 touch-manipulation"
            >
              Accept
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectCookies}
              className="flex-shrink-0 p-2 h-11 w-11 sm:h-9 sm:w-9 hover:bg-gray-100 touch-manipulation"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
