import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useInvestment } from "@/contexts/InvestmentContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  MessageCircle,
  LogIn,
  Menu,
  X,
  Home,
  FileText,
  Star,
  Calculator,
  Target,
  UserPlus,
  Newspaper,
  BarChart3,
  DollarSign,
  Wallet,
  BookOpen,
  Gift,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FrontPageLayoutProps {
  children: React.ReactNode;
}

export default function FrontPageLayout({ children }: FrontPageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, signIn, signUp, signOut } = useAuth();
  const { setCurrentOffer, setShowPaymentModal } = useInvestment();
  const { toast } = useToast();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: "Home", path: "/", key: "home" },
    {
      icon: Calculator,
      label: "Investment Plans",
      path: "/investment-plans",
      key: "investment-plans",
    },
    {
      icon: BarChart3,
      label: "Live Signals",
      path: "/live-signals",
      key: "live-signals",
    },
    { icon: Gift, label: "Special Offers", path: "/offers", key: "offers" },
    {
      icon: Star,
      label: "Testimonials",
      path: "/testimonials",
      key: "testimonials",
    },
    { icon: MessageCircle, label: "Reviews", path: "/reviews", key: "reviews" },
    {
      icon: BookOpen,
      label: "Education",
      path: "/education",
      key: "education",
    },
    { icon: FileText, label: "Blog", path: "/blog", key: "blog" },
    { icon: Newspaper, label: "News", path: "/news", key: "news" },
  ];

  const authItems = [
    { icon: LogIn, label: "Login", path: "/login", key: "login" },
    { icon: UserPlus, label: "Sign Up", path: "/signup", key: "signup" },
  ];

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (result.error) {
          toast({
            title: "Sign up failed",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link.",
          });
          setIsAuthModalOpen(false);
        }
      } else {
        result = await signIn(email, password);
        if (result.error) {
          toast({
            title: "Sign in failed",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          setIsAuthModalOpen(false);
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickInvest = (
    plan: string,
    amount: number,
    expectedReturn: number,
    roi: string,
  ) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setCurrentOffer({
      isActive: true,
      name: plan,
      plan,
      amount,
      expectedReturn,
      duration:
        amount === 100 ? "24 hours" : amount === 1000 ? "3 days" : "7 days",
      roi,
    });
    setShowPaymentModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${sidebarHidden ? "lg:-translate-x-full lg:w-0" : "lg:translate-x-0 lg:w-64"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-all duration-300 lg:static lg:inset-0 border-r border-gray-200 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-forex-600 to-blue-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-forex-600" />
            </div>
            <span className="text-white font-bold text-sm">
              FREE FOREX SIGNALS
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:block text-white hover:bg-white/20"
              onClick={() => setSidebarHidden(!sidebarHidden)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="mt-8 px-4 flex-1 overflow-y-auto">
            <div className="space-y-2 pb-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  location.hash === item.path.split("#")[1];
                return (
                  <Link
                    key={item.key}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-forex-600 text-white"
                        : "text-gray-700 hover:text-forex-600 hover:bg-forex-50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Auth items for non-logged-in users */}
              {!user && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="px-2">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                      Account
                    </p>
                    {authItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.key}
                          to={item.path}
                          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? "bg-forex-600 text-white"
                              : "text-gray-700 hover:text-forex-600 hover:bg-forex-50"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Dashboard link for logged-in users */}
              {user && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="px-2">
                    <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                      Account
                    </p>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:text-forex-600 hover:bg-forex-50"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <BarChart3 className="w-5 h-5 mr-3" />
                      Dashboard
                    </Link>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Quick Investment Actions */}
        <div className="mt-4 px-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-forex-50 to-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Invest</h4>
            <div className="space-y-2">
              <Button
                onClick={() =>
                  handleQuickInvest("Starter Plan", 100, 2500, "2,500%")
                }
                size="sm"
                className="w-full bg-success-600 hover:bg-success-700 text-xs"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                $100 → $2,500
              </Button>
              <Button
                onClick={() =>
                  handleQuickInvest("Premium Plan", 1000, 4000, "400%")
                }
                size="sm"
                variant="outline"
                className="w-full text-xs"
              >
                <Wallet className="h-3 w-3 mr-1" />
                $1,000 → $4,000
              </Button>
            </div>
          </div>
        </div>

        {/* Telegram CTA */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-center">
            <MessageCircle className="w-8 h-8 text-white mx-auto mb-2" />
            <h4 className="text-white font-semibold text-sm mb-2">
              Join Free Signals
            </h4>
            <p className="text-blue-100 text-xs mb-3">
              87% win rate • 3,400+ members
            </p>
            <a
              href="https://t.me/forex_traders_signalss"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-blue-600 text-xs font-medium py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Join Telegram Now
            </a>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              {!sidebarHidden && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:block"
                  onClick={() => setSidebarHidden(true)}
                >
                  <X className="w-5 h-5" />
                </Button>
              )}

              {sidebarHidden && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden lg:block"
                  onClick={() => setSidebarHidden(false)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}

              <div className="hidden md:block">
                <Badge className="bg-gradient-to-r from-success-500 to-success-600 text-white">
                  🔥 Live: 87.3% Win Rate Today
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="hidden md:block text-sm text-gray-700">
                    Welcome, {user.email?.split("@")[0]}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/signup">
                    <Button
                      size="sm"
                      className="bg-forex-600 hover:bg-forex-700"
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Sign Up</span>
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      <LogIn className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Login</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="telegram">Telegram</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="telegram" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    Login with Telegram
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Connect with @Blakehunterfxbot to access your account
                  </p>
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() =>
                      window.open("https://t.me/Blakehunterfxbot", "_blank")
                    }
                  >
                    Open Telegram Bot
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-6">
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : isSignUp
                      ? "Create Account"
                      : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    {isSignUp
                      ? "Already have an account?"
                      : "Don't have an account?"}{" "}
                  </span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto text-forex-600"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
