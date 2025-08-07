import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, MessageCircle, LogIn, LogOut, User } from "lucide-react";
import Logo from "@/components/Logo";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
            variant: "destructive"
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
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          setIsAuthModalOpen(false);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      navigate("/");
    }
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/">
              <Logo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-forex-600 transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-forex-600 transition-colors">
                Blog
              </Link>
              <Link to="/news" className="text-gray-700 hover:text-forex-600 transition-colors">
                News
              </Link>

              {user && (
                <Link to="/dashboard" className="text-gray-700 hover:text-forex-600 transition-colors">
                  Dashboard
                </Link>
              )}

              {/* Telegram CTA */}
              <a
                href="https://t.me/forex_traders_signalss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Join Telegram</span>
              </a>

              {/* Auth Button */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-forex-600 transition-colors px-2 py-1">
                  Home
                </Link>
                <Link to="/blog" className="text-gray-700 hover:text-forex-600 transition-colors px-2 py-1">
                  Blog
                </Link>
                <Link to="/news" className="text-gray-700 hover:text-forex-600 transition-colors px-2 py-1">
                  News
                </Link>

                {user && (
                  <Link to="/dashboard" className="text-gray-700 hover:text-forex-600 transition-colors px-2 py-1">
                    Dashboard
                  </Link>
                )}

                <a
                  href="https://t.me/forex_traders_signalss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 w-fit"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Join Telegram</span>
                </a>

                {user ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-gray-700 px-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="flex items-center space-x-2 w-fit"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    variant="outline"
                    className="flex items-center space-x-2 w-fit"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome Back</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="telegram" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="telegram">Telegram</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="telegram" className="space-y-4 mt-6">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Login with Telegram</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Connect with @Blakehunterfxbot to access your account
                  </p>
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={() => window.open("https://t.me/Blakehunterfxbot", "_blank")}
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
                  {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
                </Button>
                <div className="text-center text-sm">
                  <span className="text-gray-600">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
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
    </>
  );
}
