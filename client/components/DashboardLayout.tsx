import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  History,
  DollarSign,
  Users,
  FileText,
  Star,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  PieChart,
  Calculator,
  CreditCard,
  Award,
  MessageSquare,
  Bell,
  Search,
  BookOpen,
  ArrowUpDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  HandCoins,
  Gift,
  Phone,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export default function DashboardLayout({
  children,
  isAdmin = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const userNavItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      key: "overview",
    },
    { icon: Wallet, label: "Balance", path: "/dashboard", key: "balance" },
    {
      icon: ArrowDownToLine,
      label: "Deposit",
      path: "/dashboard",
      key: "deposit",
    },
    {
      icon: ArrowUpFromLine,
      label: "Withdraw",
      path: "/dashboard",
      key: "withdraw",
    },
    {
      icon: Calculator,
      label: "Investment Plans",
      path: "/dashboard?tab=investment-plans",
      key: "investment-plans",
    },
    {
      icon: BarChart3,
      label: "Live Signals",
      path: "/dashboard?tab=live-signals",
      key: "live-signals",
    },
    { icon: Gift, label: "Special Offers", path: "/dashboard?tab=offers", key: "offers" },
    {
      icon: TrendingUp,
      label: "Active Investments",
      path: "/dashboard?tab=active",
      key: "active",
    },
    {
      icon: History,
      label: "Investment History",
      path: "/dashboard?tab=history",
      key: "history",
    },
    {
      icon: DollarSign,
      label: "Transactions",
      path: "/dashboard?tab=transactions",
      key: "transactions",
    },
    { icon: Award, label: "Referrals", path: "/dashboard?tab=referrals", key: "referrals" },
    {
      icon: Star,
      label: "Testimonials",
      path: "/dashboard?tab=testimonials",
      key: "testimonials",
    },
    { icon: MessageSquare, label: "Reviews", path: "/dashboard?tab=reviews", key: "reviews" },
    {
      icon: Send,
      label: "Telegram Login",
      path: "/dashboard",
      key: "telegram",
    },
    {
      icon: Phone,
      label: "Support Tickets",
      path: "/dashboard",
      key: "support",
    },
    { icon: Settings, label: "Settings", path: "/dashboard", key: "settings" },
  ];

  const adminNavItems = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      path: "/admin-panel",
      key: "overview",
    },
    { icon: Users, label: "Users", path: "/admin-panel", key: "users" },
    {
      icon: BarChart3,
      label: "Investments",
      path: "/admin-panel",
      key: "investments",
    },
    {
      icon: DollarSign,
      label: "Payouts",
      path: "/admin-panel",
      key: "payouts",
    },
    {
      icon: FileText,
      label: "Blog Manager",
      path: "/admin-panel",
      key: "blog",
    },
    { icon: BookOpen, label: "Ebooks", path: "/admin-panel", key: "ebooks" },
    {
      icon: Star,
      label: "Testimonials",
      path: "/admin-panel",
      key: "testimonials",
    },
    {
      icon: MessageSquare,
      label: "Reviews",
      path: "/admin-panel",
      key: "reviews",
    },
    {
      icon: PieChart,
      label: "Analytics",
      path: "/admin-panel",
      key: "analytics",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin-panel",
      key: "settings",
    },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  const currentTab =
    new URLSearchParams(location.search).get("tab") || "overview";
  const currentPath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-forex-500 to-blue-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-sm">
              {isAdmin ? "Admin Panel" : "Forex Signals"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <nav className="mt-8 px-4 flex-1 overflow-y-auto pb-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                // Handle both tab-based and standalone page navigation
                const isTabBased = item.path === "/dashboard";
                const isActive = isTabBased
                  ? currentTab === item.key && currentPath === "/dashboard"
                  : currentPath === item.path;
                const linkPath = isTabBased
                  ? `${item.path}?tab=${item.key}`
                  : item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.key}
                    to={linkPath}
                    className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors min-h-[44px] ${
                      isActive
                        ? "bg-forex-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Need AI Help Section */}
        <div className="px-4 pb-6 mt-4 flex-shrink-0">
          <div className="bg-gradient-to-r from-forex-600 to-blue-600 rounded-lg p-4 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-white font-semibold text-xs mb-1">
              Need Help?
            </h4>
            <p className="text-white/80 text-xs mb-2">
              Join Telegram support
            </p>
            <a
              href="https://t.me/forex_traders_signalss"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-white text-forex-600 text-xs font-medium py-2 rounded-md hover:bg-gray-100 transition-colors min-h-[36px]"
            >
              Get Help Now
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
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

              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {isAdmin ? "Admin Dashboard" : "Trading Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forex-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-forex-600 text-white text-sm">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? "Administrator" : "Trader"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
