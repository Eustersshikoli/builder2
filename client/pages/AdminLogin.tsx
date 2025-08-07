import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DatabaseInitializer from "@/components/DatabaseInitializer";
import { enhancedAuth } from "@/lib/enhanced-auth";
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  TrendingUp,
  Settings,
  UserPlus,
  User,
} from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  // Admin creation form state
  const [adminForm, setAdminForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "admin" as "admin" | "super_admin" | "moderator"
  });
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const { adminSignIn, resetPassword, user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin-panel");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (forgotMode) {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setForgotMode(false);
          setEmail("");
          toast({
            title: "Reset email sent",
            description: "Check your email for password reset instructions.",
          });
        }
      } else {
        const { error } = await adminSignIn(email, password, rememberMe);
        if (error) {
          toast({
            title: "Access denied",
            description: error.message,
            variant: "destructive",
          });
        } else {
          navigate("/admin-panel");
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

  const handleAdminCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!adminForm.username || !adminForm.email || !adminForm.password || !adminForm.fullName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.password !== adminForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (adminForm.password.length < 8) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setCreatingAdmin(true);

    try {
      const result = await enhancedAuth.createAdminUser({
        username: adminForm.username,
        email: adminForm.email,
        password: adminForm.password,
        full_name: adminForm.fullName,
        role: adminForm.role
      });

      if (result.success) {
        toast({
          title: "Admin Created Successfully",
          description: `Admin account for ${adminForm.username} has been created.`,
        });

        // Reset form
        setAdminForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          role: "admin"
        });
      } else {
        toast({
          title: "Admin Creation Failed",
          description: result.error?.message || "Failed to create admin account",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating admin account.",
        variant: "destructive",
      });
    } finally {
      setCreatingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-forex-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-4xl relative z-10 shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {forgotMode ? "Reset Password" : "Admin Access"}
            </CardTitle>
            <div className="flex items-center justify-center space-x-2 text-forex-100">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">FREE FOREX SIGNALS</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
              <TabsTrigger value="login" className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Lock className="h-4 w-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="create" className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Admin
              </TabsTrigger>
              <TabsTrigger value="setup" className="text-gray-300 data-[state=active]:bg-white/20 data-[state=active]:text-white">
                <Settings className="h-4 w-4 mr-2" />
                Database Setup
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-6 mt-6">
              {forgotMode ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-forex-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Forgot your password?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Enter your admin email address and we'll send you a reset
                      link.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email" className="text-gray-200">
                        Admin Email
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="admin@forexsignals.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-300 hover:text-white hover:bg-white/10"
                      onClick={() => setForgotMode(false)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Demo Credentials Info */}
                  <div className="bg-blue-900/30 border border-blue-400/30 rounded-lg p-4 mb-4">
                    <div className="text-center mb-3">
                      <h3 className="text-blue-300 font-semibold text-sm">
                        Demo Admin Credentials
                      </h3>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Email:</span>
                        <code className="text-blue-300">
                          admin@forextraderssignals.com
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Password:</span>
                        <code className="text-blue-300">Demo@2024!</code>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setEmail("admin@forextraderssignals.com");
                        setPassword("Demo@2024!");
                      }}
                      className="w-full mt-3 bg-blue-600/50 hover:bg-blue-600/70 text-white text-xs"
                      type="button"
                    >
                      Use Demo Credentials
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-200">
                        Admin Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@forexsignals.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-200">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          required
                          minLength={6}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="remember-me"
                          className="text-sm text-gray-300"
                        >
                          Remember me
                        </Label>
                      </div>

                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-forex-400 text-sm hover:text-forex-300"
                        onClick={() => setForgotMode(true)}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                      disabled={loading}
                    >
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>
                          {loading ? "Verifying..." : "Access Admin Panel"}
                        </span>
                      </div>
                    </Button>
                  </form>
                </>
              )}

              <div className="text-center">
                <Button
                  variant="link"
                  className="text-gray-400 hover:text-gray-300 text-sm"
                  onClick={() => navigate("/")}
                >
                  ← Back to Main Site
                </Button>
              </div>

              <div className="border-t border-white/20 pt-4">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Secure Admin Access</span>
                  </div>
                  <div className="text-yellow-300/80 text-xs mt-1">
                    This area is restricted to authorized administrators only.
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="create" className="space-y-6 mt-6">
              <div className="text-center mb-6">
                <UserPlus className="h-12 w-12 text-forex-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Create Admin Account
                </h3>
                <p className="text-gray-300 text-sm">
                  Create a new administrator account with appropriate role and permissions.
                </p>
              </div>

              <form onSubmit={handleAdminCreation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username" className="text-gray-200">
                      Username *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-username"
                        type="text"
                        placeholder="admin_username"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, username: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-gray-200">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-fullname" className="text-gray-200">
                    Full Name *
                  </Label>
                  <Input
                    id="admin-fullname"
                    type="text"
                    placeholder="Administrator Full Name"
                    value={adminForm.fullName}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-gray-200">
                      Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="Secure password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, password: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-confirm-password" className="text-gray-200">
                      Confirm Password *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="admin-confirm-password"
                        type="password"
                        placeholder="Confirm password"
                        value={adminForm.confirmPassword}
                        onChange={(e) => setAdminForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-role" className="text-gray-200">
                    Admin Role
                  </Label>
                  <select
                    id="admin-role"
                    value={adminForm.role}
                    onChange={(e) => setAdminForm(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2"
                  >
                    <option value="admin" className="bg-gray-800">Administrator</option>
                    <option value="super_admin" className="bg-gray-800">Super Admin</option>
                    <option value="moderator" className="bg-gray-800">Moderator</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  disabled={creatingAdmin}
                >
                  <div className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>
                      {creatingAdmin ? "Creating Admin..." : "Create Admin Account"}
                    </span>
                  </div>
                </Button>
              </form>

              <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Admin Creation</span>
                </div>
                <div className="text-green-300/80 text-xs mt-1">
                  Only existing administrators can create new admin accounts. This creates accounts in both databases.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="setup" className="space-y-6 mt-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <DatabaseInitializer />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
