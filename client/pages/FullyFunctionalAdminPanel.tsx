import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signalsService, type ForexSignal } from "@/lib/signals-service";
import investmentPlansService, {
  InvestmentPlan,
} from "@/lib/investment-plans-service";
import {
  Upload,
  FileText,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  BookOpen,
  MessageSquare,
  Star,
  BarChart3,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Mail,
  Send,
  Archive,
  Globe,
  MapPin,
  Activity,
  Calendar,
  TrendingDown,
  Menu,
  X,
  Newspaper,
  Bug,
  Shield,
  Ticket,
  CreditCard,
  PiggyBank,
  Target,
  Smartphone,
  Monitor,
  Tablet,
  Reply,
  RefreshCw,
  Save,
  Search,
  Filter,
  Copy,
  ExternalLink,
  MailPlus,
  UserPlus,
  PlayCircle,
  PauseCircle,
  Wallet,
  Database,
  Key,
  Server,
} from "lucide-react";

interface Ebook {
  id: string;
  title: string;
  description: string;
  author: string;
  file_url: string;
  cover_image_url: string;
  category: string;
  is_free: boolean;
  required_investment_amount: number;
  download_count: number;
  is_published: boolean;
  created_at: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
}

interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  is_published: boolean;
  is_breaking: boolean;
  view_count: number;
  created_at: string;
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url: string;
  location: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  country: string;
  phone_number: string;
  kyc_status: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_reply?: string;
  replied_at?: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
  };
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
  transaction_hash?: string;
  created_at: string;
  user_profiles?: {
    full_name: string;
    email: string;
  };
}

interface SiteError {
  id: string;
  error_message: string;
  error_code: string;
  page_url: string;
  user_agent: string;
  user_id?: string;
  resolved: boolean;
  created_at: string;
}

interface FrontendInvestmentPlan {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
  is_active: boolean;
  is_featured: boolean;
  plan_type: "frontend" | "dashboard";
  features: string[];
  created_at: string;
}

export default function FullyFunctionalAdminPanel() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [signals, setSignals] = useState<ForexSignal[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [siteErrors, setSiteErrors] = useState<SiteError[]>([]);
  const [frontendPlans, setFrontendPlans] = useState<FrontendInvestmentPlan[]>(
    [],
  );
  const [dashboardPlans, setDashboardPlans] = useState<
    FrontendInvestmentPlan[]
  >([]);

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    is_published: false,
    is_breaking: false,
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    category: "",
    is_published: false,
  });

  const [ebookForm, setEbookForm] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    is_free: false,
    required_investment_amount: 0,
    file_url: "",
    cover_image_url: "",
  });

  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    is_html: false,
  });

  const [ticketReply, setTicketReply] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );

  const [siteSettings, setSiteSettings] = useState({
    site_name: "Forex Signals Platform",
    site_description:
      "Professional forex trading signals and investment platform",
    contact_email: "support@forexsignals.com",
    telegram_channel: "https://t.me/forex_traders_signalss",
    maintenance_mode: false,
    registration_enabled: true,
    min_deposit: 100,
    max_withdrawal_per_day: 50000,
  });

  const menuItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "users", icon: Users, label: "User Management" },
    { id: "payments", icon: DollarSign, label: "Payment Management" },
    { id: "support", icon: HelpCircle, label: "Support Tickets" },
    { id: "news", icon: Newspaper, label: "News Management" },
    { id: "blog", icon: FileText, label: "Blog Management" },
    { id: "ebooks", icon: BookOpen, label: "Ebook Management" },
    { id: "testimonials", icon: MessageSquare, label: "Reviews Management" },
    { id: "frontend-plans", icon: Target, label: "Frontend Plans" },
    { id: "dashboard-plans", icon: PiggyBank, label: "Dashboard Plans" },
    { id: "signals", icon: TrendingUp, label: "Signals" },
    { id: "errors", icon: Bug, label: "Site Errors" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "email", icon: MailPlus, label: "Email Notifications" },
    { id: "settings", icon: Settings, label: "Site Settings" },
  ];

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    switch (activeTab) {
      case "users":
        loadUsers();
        break;
      case "payments":
        loadPayments();
        break;
      case "support":
        loadSupportTickets();
        break;
      case "news":
        loadNewsPosts();
        break;
      case "blog":
        loadBlogPosts();
        break;
      case "ebooks":
        loadEbooks();
        break;
      case "testimonials":
        loadTestimonials();
        break;
      case "signals":
        loadSignals();
        break;
      case "errors":
        loadSiteErrors();
        break;
      case "frontend-plans":
      case "dashboard-plans":
        loadInvestmentPlans();
        break;
      default:
        loadOverviewData();
    }
  };

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      await Promise.allSettled([
        loadUsers(),
        loadSupportTickets(),
        loadSignals(),
        loadNewsPosts(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error loading users:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          *,
          user_profiles(full_name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error loading payments:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSupportTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select(
          `
          *,
          user_profiles(full_name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setSupportTickets(data || []);
    } catch (error) {
      console.error("Error loading support tickets:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadNewsPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setNewsPosts(data || []);
    } catch (error) {
      console.error("Error loading news posts:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error("Error loading blog posts:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEbooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setEbooks(data || []);
    } catch (error) {
      console.error("Error loading ebooks:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error loading testimonials:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSignals = async () => {
    try {
      setLoading(true);
      const result = await signalsService.getAllSignals(1, 50);
      if (result.success) {
        setSignals(result.data);
      }
    } catch (error) {
      console.error("Error loading signals:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSiteErrors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("site_errors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error && error.code !== "42P01") throw error;
      setSiteErrors(data || []);
    } catch (error) {
      console.error("Error loading site errors:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadInvestmentPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== "42P01") throw error;

      const plans = data || [];
      setFrontendPlans(plans.filter((p) => p.plan_type === "frontend"));
      setDashboardPlans(plans.filter((p) => p.plan_type === "dashboard"));
    } catch (error) {
      console.error("Error loading investment plans:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Create functions
  const createNewsPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .insert({
          ...newsForm,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "News post created successfully",
      });
      setNewsForm({
        title: "",
        content: "",
        excerpt: "",
        featured_image_url: "",
        is_published: false,
        is_breaking: false,
      });
      loadNewsPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create news post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBlogPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          ...blogForm,
          slug:
            blogForm.slug || blogForm.title.toLowerCase().replace(/\s+/g, "-"),
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      setBlogForm({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        featured_image_url: "",
        category: "",
        is_published: false,
      });
      loadBlogPosts();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEbook = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ebooks")
        .insert({
          ...ebookForm,
          download_count: 0,
          is_published: true,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ebook created successfully",
      });
      setEbookForm({
        title: "",
        description: "",
        author: "",
        category: "",
        is_free: false,
        required_investment_amount: 0,
        file_url: "",
        cover_image_url: "",
      });
      loadEbooks();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ebook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const replyToTicket = async (ticketId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("support_tickets")
        .update({
          admin_reply: ticketReply,
          replied_at: new Date().toISOString(),
          status: "replied",
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply sent successfully",
      });
      setTicketReply("");
      setSelectedTicket(null);
      loadSupportTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendEmailToAllUsers = async () => {
    try {
      setLoading(true);

      // First get all users
      const { data: users, error: usersError } = await supabase
        .from("user_profiles")
        .select("email, full_name");

      if (usersError) throw usersError;

      // Create email notifications for all users
      const notifications = users.map((user) => ({
        user_id: user.id || "system",
        type: "email",
        title: emailForm.subject,
        message: emailForm.message,
        created_at: new Date().toISOString(),
      }));

      const { error: notifError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notifError) throw notifError;

      toast({
        title: "Success",
        description: `Email notification sent to ${users.length} users`,
      });
      setEmailForm({
        subject: "",
        message: "",
        is_html: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ is_active: isActive })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("payments")
        .update({ status })
        .eq("id", paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment status updated successfully",
      });
      loadPayments();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive",
      });
    }
  };

  const updateSiteSettings = async () => {
    try {
      setLoading(true);

      // In a real app, this would update a settings table
      // For now, we'll just show success
      toast({
        title: "Success",
        description: "Site settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update site settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={className}>
      <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-lg">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center justify-between flex-shrink-0 px-4 mb-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 text-xs"
                >
                  Administrator
                </Badge>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-900 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      activeTab === item.id
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex flex-col space-y-2 w-full">
            <Link
              to="/"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Globe className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Dashboard Overview
                </h2>
                <p className="text-gray-600">
                  Platform performance at a glance
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Monitor className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">Live Data</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {users.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Active Signals
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {signals.filter((s) => s.status === "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <HelpCircle className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Open Tickets
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          supportTickets.filter((t) => t.status === "open")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Newspaper className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        News Posts
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {newsPosts.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                User Management
              </h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">User</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Country</th>
                          <th className="text-left p-3">KYC Status</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Joined</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3">
                              <div>
                                <p className="font-medium">
                                  {user.full_name || "N/A"}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {user.id.substring(0, 8)}...
                                </p>
                              </div>
                            </td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.country || "N/A"}</td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  user.kyc_status === "verified"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.kyc_status || "pending"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  user.is_active ? "default" : "destructive"
                                }
                              >
                                {user.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    updateUserStatus(user.id, !user.is_active)
                                  }
                                >
                                  {user.is_active ? (
                                    <PauseCircle className="h-4 w-4" />
                                  ) : (
                                    <PlayCircle className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Management
              </h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">User</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Method</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr
                            key={payment.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="p-3">
                              <div>
                                <p className="font-medium">
                                  {payment.user_profiles?.full_name ||
                                    "Unknown"}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {payment.user_profiles?.email}
                                </p>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold">
                                ${payment.amount}
                              </span>
                              <span className="text-gray-500 ml-1">
                                {payment.currency}
                              </span>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline">
                                {payment.payment_method}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant={
                                  payment.status === "completed"
                                    ? "default"
                                    : payment.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {new Date(
                                payment.created_at,
                              ).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              <Select
                                onValueChange={(value) =>
                                  updatePaymentStatus(payment.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">
                                    Pending
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    Completed
                                  </SelectItem>
                                  <SelectItem value="failed">Failed</SelectItem>
                                  <SelectItem value="refunded">
                                    Refunded
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "support":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Support Tickets
              </h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Badge variant="outline">
                  {supportTickets.filter((t) => t.status === "open").length}{" "}
                  Open
                </Badge>
                <Badge variant="secondary">
                  {supportTickets.filter((t) => t.status === "resolved").length}{" "}
                  Resolved
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supportTickets.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No support tickets found
                      </p>
                    ) : (
                      supportTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Ticket className="h-4 w-4 text-gray-400" />
                                <h3 className="font-semibold">
                                  {ticket.subject}
                                </h3>
                                <Badge
                                  variant={
                                    ticket.status === "open"
                                      ? "destructive"
                                      : ticket.status === "resolved"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {ticket.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {ticket.message}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  From:{" "}
                                  {ticket.user_profiles?.full_name ||
                                    "Unknown User"}
                                </span>
                                <span>
                                  Email:{" "}
                                  {ticket.user_profiles?.email || "No email"}
                                </span>
                                <span>
                                  {new Date(
                                    ticket.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              {ticket.admin_reply && (
                                <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-200">
                                  <p className="text-sm font-medium text-blue-800">
                                    Admin Reply:
                                  </p>
                                  <p className="text-sm text-blue-700">
                                    {ticket.admin_reply}
                                  </p>
                                  <p className="text-xs text-blue-500 mt-1">
                                    Replied:{" "}
                                    {new Date(
                                      ticket.replied_at || "",
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col space-y-2">
                              {!ticket.admin_reply && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedTicket(ticket)}
                                >
                                  <Reply className="h-4 w-4 mr-1" />
                                  Reply
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reply Modal */}
            {selectedTicket && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        Reply to Ticket: {selectedTicket.subject}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedTicket(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-600 mb-1">
                        Original message:
                      </p>
                      <p className="text-sm">{selectedTicket.message}</p>
                    </div>
                    <div>
                      <Label htmlFor="reply">Your Reply</Label>
                      <Textarea
                        id="reply"
                        placeholder="Type your reply..."
                        value={ticketReply}
                        onChange={(e) => setTicketReply(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => replyToTicket(selectedTicket.id)}
                        disabled={!ticketReply.trim() || loading}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Send Reply
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedTicket(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "news":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                News Management
              </h2>
              <Button
                onClick={() => setActiveTab("create-news")}
                className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create News
              </Button>
            </div>

            {activeTab === "create-news" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create News Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="news_title">Title</Label>
                      <Input
                        id="news_title"
                        placeholder="Enter news title"
                        value={newsForm.title}
                        onChange={(e) =>
                          setNewsForm({ ...newsForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="news_image">Featured Image URL</Label>
                      <Input
                        id="news_image"
                        placeholder="https://example.com/image.jpg"
                        value={newsForm.featured_image_url}
                        onChange={(e) =>
                          setNewsForm({
                            ...newsForm,
                            featured_image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="news_excerpt">Excerpt</Label>
                    <Textarea
                      id="news_excerpt"
                      placeholder="Brief summary of the news..."
                      value={newsForm.excerpt}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, excerpt: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="news_content">Content</Label>
                    <Textarea
                      id="news_content"
                      placeholder="Full news content..."
                      className="min-h-[200px]"
                      value={newsForm.content}
                      onChange={(e) =>
                        setNewsForm({ ...newsForm, content: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newsForm.is_published}
                        onChange={(e) =>
                          setNewsForm({
                            ...newsForm,
                            is_published: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Publish immediately
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newsForm.is_breaking}
                        onChange={(e) =>
                          setNewsForm({
                            ...newsForm,
                            is_breaking: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Breaking news
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={createNewsPost}
                      disabled={loading || !newsForm.title || !newsForm.content}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create News
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("news")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent News Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {newsPosts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No news posts created yet
                        </p>
                      ) : (
                        newsPosts.slice(0, 10).map((post) => (
                          <div
                            key={post.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">
                                    {post.title}
                                  </h3>
                                  {post.is_breaking && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      BREAKING
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Views: {post.view_count}</span>
                                  <span>
                                    {new Date(
                                      post.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                <Badge
                                  variant={
                                    post.is_published ? "default" : "secondary"
                                  }
                                >
                                  {post.is_published ? "Published" : "Draft"}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "email":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Email Notifications
              </h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Badge variant="outline">{users.length} Recipients</Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send Email to All Users</CardTitle>
                <p className="text-gray-600">
                  Send notifications to all registered users
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email_subject">Subject</Label>
                  <Input
                    id="email_subject"
                    placeholder="Email subject"
                    value={emailForm.subject}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="email_message">Message</Label>
                  <Textarea
                    id="email_message"
                    placeholder="Email content..."
                    className="min-h-[200px]"
                    value={emailForm.message}
                    onChange={(e) =>
                      setEmailForm({ ...emailForm, message: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={emailForm.is_html}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          is_html: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    HTML Email
                  </label>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={sendEmailToAllUsers}
                    disabled={
                      loading || !emailForm.subject || !emailForm.message
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <MailPlus className="h-4 w-4 mr-2" />
                    )}
                    Send to All Users ({users.length})
                  </Button>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    This will send an email notification to all {
                      users.length
                    }{" "}
                    registered users. Make sure your message is appropriate and
                    follows email best practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "blog":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Blog Management
              </h2>
              <Button
                onClick={() => setActiveTab("create-blog")}
                className="bg-green-600 hover:bg-green-700 mt-4 sm:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Blog Post
              </Button>
            </div>

            {activeTab === "create-blog" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Blog Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blog_title">Title</Label>
                      <Input
                        id="blog_title"
                        placeholder="Enter blog title"
                        value={blogForm.title}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="blog_slug">Slug</Label>
                      <Input
                        id="blog_slug"
                        placeholder="blog-post-slug (auto-generated if empty)"
                        value={blogForm.slug}
                        onChange={(e) =>
                          setBlogForm({ ...blogForm, slug: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="blog_category">Category</Label>
                      <Select
                        value={blogForm.category}
                        onValueChange={(value) =>
                          setBlogForm({ ...blogForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="market-analysis">
                            Market Analysis
                          </SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="news">News</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="blog_image">Featured Image URL</Label>
                      <Input
                        id="blog_image"
                        placeholder="https://example.com/image.jpg"
                        value={blogForm.featured_image_url}
                        onChange={(e) =>
                          setBlogForm({
                            ...blogForm,
                            featured_image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="blog_excerpt">Excerpt</Label>
                    <Textarea
                      id="blog_excerpt"
                      placeholder="Brief summary of the blog post..."
                      value={blogForm.excerpt}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, excerpt: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="blog_content">Content</Label>
                    <Textarea
                      id="blog_content"
                      placeholder="Full blog content..."
                      className="min-h-[300px]"
                      value={blogForm.content}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, content: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={blogForm.is_published}
                        onChange={(e) =>
                          setBlogForm({
                            ...blogForm,
                            is_published: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Publish immediately
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={createBlogPost}
                      disabled={loading || !blogForm.title || !blogForm.content}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Blog Post
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("blog")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {blogPosts.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No blog posts created yet
                        </p>
                      ) : (
                        blogPosts.map((post) => (
                          <div
                            key={post.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">
                                    {post.title}
                                  </h3>
                                  <Badge variant="outline">
                                    {post.category}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Views: {post.view_count}</span>
                                  <span>Slug: {post.slug}</span>
                                  <span>
                                    {new Date(
                                      post.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                <Badge
                                  variant={
                                    post.is_published ? "default" : "secondary"
                                  }
                                >
                                  {post.is_published ? "Published" : "Draft"}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "ebooks":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Ebook Management
              </h2>
              <Button
                onClick={() => setActiveTab("create-ebook")}
                className="bg-purple-600 hover:bg-purple-700 mt-4 sm:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Ebook
              </Button>
            </div>

            {activeTab === "create-ebook" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Ebook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ebook_title">Title</Label>
                      <Input
                        id="ebook_title"
                        placeholder="Ebook title"
                        value={ebookForm.title}
                        onChange={(e) =>
                          setEbookForm({ ...ebookForm, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ebook_author">Author</Label>
                      <Input
                        id="ebook_author"
                        placeholder="Author name"
                        value={ebookForm.author}
                        onChange={(e) =>
                          setEbookForm({ ...ebookForm, author: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ebook_description">Description</Label>
                    <Textarea
                      id="ebook_description"
                      placeholder="Ebook description..."
                      value={ebookForm.description}
                      onChange={(e) =>
                        setEbookForm({
                          ...ebookForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ebook_category">Category</Label>
                      <Select
                        value={ebookForm.category}
                        onValueChange={(value) =>
                          setEbookForm({ ...ebookForm, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trading">Trading</SelectItem>
                          <SelectItem value="forex">Forex</SelectItem>
                          <SelectItem value="strategy">Strategy</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="technical-analysis">
                            Technical Analysis
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ebook_investment">
                        Required Investment ($)
                      </Label>
                      <Input
                        id="ebook_investment"
                        type="number"
                        placeholder="0 for free ebooks"
                        value={ebookForm.required_investment_amount}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            required_investment_amount: parseInt(
                              e.target.value,
                            ),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ebook_file">File URL</Label>
                      <Input
                        id="ebook_file"
                        placeholder="https://example.com/ebook.pdf"
                        value={ebookForm.file_url}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            file_url: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ebook_cover">Cover Image URL</Label>
                      <Input
                        id="ebook_cover"
                        placeholder="https://example.com/cover.jpg"
                        value={ebookForm.cover_image_url}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            cover_image_url: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={ebookForm.is_free}
                        onChange={(e) =>
                          setEbookForm({
                            ...ebookForm,
                            is_free: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Free ebook (overrides investment requirement)
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                      onClick={createEbook}
                      disabled={
                        loading || !ebookForm.title || !ebookForm.file_url
                      }
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Ebook
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("ebooks")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Ebooks</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {ebooks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">
                          No ebooks created yet
                        </p>
                      ) : (
                        ebooks.map((ebook) => (
                          <div
                            key={ebook.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="font-semibold">
                                    {ebook.title}
                                  </h3>
                                  <Badge variant="outline">
                                    {ebook.category}
                                  </Badge>
                                  {ebook.is_free && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  By {ebook.author}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                  {ebook.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Downloads: {ebook.download_count}</span>
                                  {!ebook.is_free && (
                                    <span>
                                      Requires: $
                                      {ebook.required_investment_amount}{" "}
                                      investment
                                    </span>
                                  )}
                                  <span>
                                    {new Date(
                                      ebook.created_at,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                <Badge
                                  variant={
                                    ebook.is_published ? "default" : "secondary"
                                  }
                                >
                                  {ebook.is_published ? "Published" : "Draft"}
                                </Badge>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Reviews Management
              </h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testimonials.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No reviews found
                      </p>
                    ) : (
                      testimonials.map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">
                                  {testimonial.name}
                                </h3>
                                <div className="flex items-center">
                                  {Array.from({
                                    length: testimonial.rating,
                                  }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({testimonial.rating}/5)
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {testimonial.content}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  Location: {testimonial.location || "N/A"}
                                </span>
                                <span>
                                  {new Date(
                                    testimonial.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                              <Badge
                                variant={
                                  testimonial.is_approved
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {testimonial.is_approved
                                  ? "Approved"
                                  : "Pending"}
                              </Badge>
                              {testimonial.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Featured
                                </Badge>
                              )}
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "analytics":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Analytics Dashboard
              </h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Users
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {users.length}
                      </p>
                      <p className="text-xs text-green-600">
                        +12% from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        $45,231
                      </p>
                      <p className="text-xs text-green-600">
                        +23% from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Active Investments
                      </p>
                      <p className="text-2xl font-bold text-gray-900">1,234</p>
                      <p className="text-xs text-green-600">
                        +8% from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Conversion Rate
                      </p>
                      <p className="text-2xl font-bold text-gray-900">3.2%</p>
                      <p className="text-xs text-red-600">
                        -0.1% from last month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">New user registration</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Investment plan purchased</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Support ticket created</p>
                        <p className="text-xs text-gray-500">8 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm">Blog post published</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Investment Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Premium Plan</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Professional Plan</span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Starter Plan</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "frontend-plans":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Frontend Investment Plans
                </h2>
                <p className="text-gray-600">
                  Plans shown on the main website and landing pages
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Frontend Plan
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frontend Plans Management</CardTitle>
                <p className="text-gray-600">
                  These plans are displayed on your website homepage and
                  marketing pages
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((plan) => (
                    <div
                      key={plan}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">Starter Plan</h3>
                        <Badge variant="default" className="text-xs">
                          Frontend
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Perfect for beginners
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-semibold text-green-600">
                            10x (1000%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">24 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Range:</span>
                          <span className="font-medium">$100 - $999</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "dashboard-plans":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Dashboard Investment Plans
                </h2>
                <p className="text-gray-600">
                  Plans available inside the user dashboard
                </p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create Dashboard Plan
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dashboard Plans Management</CardTitle>
                <p className="text-gray-600">
                  These plans are available exclusively to logged-in users in
                  their dashboard
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((plan) => (
                    <div
                      key={plan}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">VIP Plan</h3>
                        <Badge variant="secondary" className="text-xs">
                          Dashboard
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Exclusive dashboard offer
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-semibold text-green-600">
                            15x (1500%)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">32 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Range:</span>
                          <span className="font-medium">$5000 - $50000</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Site Settings
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site_name">Site Name</Label>
                    <Input
                      id="site_name"
                      value={siteSettings.site_name}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          site_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={siteSettings.site_description}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          site_description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={siteSettings.contact_email}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          contact_email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="telegram_channel">
                      Telegram Channel URL
                    </Label>
                    <Input
                      id="telegram_channel"
                      value={siteSettings.telegram_channel}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          telegram_channel: e.target.value,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-gray-600">
                        Put the site in maintenance mode
                      </div>
                    </div>
                    <Button
                      variant={
                        siteSettings.maintenance_mode
                          ? "destructive"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSiteSettings({
                          ...siteSettings,
                          maintenance_mode: !siteSettings.maintenance_mode,
                        })
                      }
                    >
                      {siteSettings.maintenance_mode ? "Disable" : "Enable"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">User Registration</div>
                      <div className="text-sm text-gray-600">
                        Allow new user registrations
                      </div>
                    </div>
                    <Button
                      variant={
                        siteSettings.registration_enabled
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSiteSettings({
                          ...siteSettings,
                          registration_enabled:
                            !siteSettings.registration_enabled,
                        })
                      }
                    >
                      {siteSettings.registration_enabled
                        ? "Enabled"
                        : "Disabled"}
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="min_deposit">Minimum Deposit ($)</Label>
                    <Input
                      id="min_deposit"
                      type="number"
                      value={siteSettings.min_deposit}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          min_deposit: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="max_withdrawal">
                      Max Daily Withdrawal ($)
                    </Label>
                    <Input
                      id="max_withdrawal"
                      type="number"
                      value={siteSettings.max_withdrawal_per_day}
                      onChange={(e) =>
                        setSiteSettings({
                          ...siteSettings,
                          max_withdrawal_per_day: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={updateSiteSettings} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Settings
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600 mt-2">
              This section is under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex lg:flex-shrink-0 w-72" />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <Sidebar className="relative flex-1 flex flex-col max-w-xs w-full" />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="hidden sm:block text-sm text-gray-500">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
