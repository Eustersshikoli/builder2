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
  created_at: string;
}

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
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

export default function EnhancedAdminPanel() {
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
  const [siteErrors, setSiteErrors] = useState<SiteError[]>([]);
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);

  // Form states
  const [newsForm, setNewsForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    is_published: false,
    is_breaking: false,
  });

  const [investmentPlanForm, setInvestmentPlanForm] = useState({
    name: "",
    description: "",
    min_amount: 0,
    max_amount: 0,
    roi_percentage: 1000,
    duration_days: 1,
    is_active: true,
    is_featured: false,
    features: [""],
  });

  const [signalForm, setSignalForm] = useState({
    pair: "",
    signal_type: "buy" as "buy" | "sell",
    entry_price: 0,
    stop_loss: 0,
    take_profit_1: 0,
    take_profit_2: 0,
    take_profit_3: 0,
    confidence: 85,
    analysis: "",
  });

  const menuItems = [
    { id: "overview", icon: BarChart3, label: "Overview" },
    { id: "signals", icon: TrendingUp, label: "Signals" },
    { id: "users", icon: Users, label: "Users" },
    { id: "investments", icon: PiggyBank, label: "Investment Plans" },
    { id: "payments", icon: DollarSign, label: "Payments" },
    { id: "support", icon: HelpCircle, label: "Support Tickets" },
    { id: "news", icon: Newspaper, label: "News" },
    { id: "ebooks", icon: BookOpen, label: "Ebooks" },
    { id: "blog", icon: FileText, label: "Blog" },
    { id: "testimonials", icon: MessageSquare, label: "Reviews" },
    { id: "errors", icon: Bug, label: "Site Errors" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    if (activeTab === "signals") loadSignals();
    if (activeTab === "users") loadUsers();
    if (activeTab === "ebooks") loadEbooks();
    if (activeTab === "blog") loadBlogPosts();
    if (activeTab === "news") loadNewsPosts();
    if (activeTab === "testimonials") loadTestimonials();
    if (activeTab === "support") loadSupportTickets();
    if (activeTab === "errors") loadSiteErrors();
    if (activeTab === "investments") loadInvestmentPlans();
  }, [activeTab]);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const result = await signalsService.getAllSignals(1, 50);
      if (result.success) {
        setSignals(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load signals",
        variant: "destructive",
      });
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

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
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

      if (error) throw error;
      setEbooks(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ebooks",
        variant: "destructive",
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

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
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
      console.warn("News posts table not found, using empty data");
      setNewsPosts([]);
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

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
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

      if (error) throw error;
      setSupportTickets(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load support tickets",
        variant: "destructive",
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
      console.warn("Site errors table not found, using empty data");
      setSiteErrors([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInvestmentPlans = async () => {
    try {
      setLoading(true);
      const result = await investmentPlansService.getAllPlans();
      if (result.success) {
        setInvestmentPlans(result.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load investment plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const createInvestmentPlan = async () => {
    try {
      setLoading(true);
      const result = await investmentPlansService.createPlan({
        ...investmentPlanForm,
        features: investmentPlanForm.features.filter((f) => f.trim() !== ""),
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Investment plan created successfully",
        });
        setInvestmentPlanForm({
          name: "",
          description: "",
          min_amount: 0,
          max_amount: 0,
          roi_percentage: 1000,
          duration_days: 1,
          is_active: true,
          is_featured: false,
          features: [""],
        });
        loadInvestmentPlans();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create investment plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSignal = async () => {
    try {
      setLoading(true);
      const result = await signalsService.createSignal({
        ...signalForm,
        created_by: user?.id || "admin",
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Signal created successfully",
        });
        setSignalForm({
          pair: "",
          signal_type: "buy",
          entry_price: 0,
          stop_loss: 0,
          take_profit_1: 0,
          take_profit_2: 0,
          take_profit_3: 0,
          confidence: 85,
          analysis: "",
        });
        loadSignals();
      } else {
        throw new Error("Failed to create signal");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create signal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket status updated",
      });
      loadSupportTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status",
        variant: "destructive",
      });
    }
  };

  const markErrorResolved = async (errorId: string) => {
    try {
      const { error } = await supabase
        .from("site_errors")
        .update({ resolved: true })
        .eq("id", errorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Error marked as resolved",
      });
      loadSiteErrors();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve error",
        variant: "destructive",
      });
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
                      <Bug className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Unresolved Errors
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {siteErrors.filter((e) => !e.resolved).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">New user registered</span>
                      <span className="ml-auto text-gray-400">2 min ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">Signal created</span>
                      <span className="ml-auto text-gray-400">5 min ago</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">
                        Support ticket opened
                      </span>
                      <span className="ml-auto text-gray-400">12 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PiggyBank className="h-5 w-5 mr-2" />
                    Investment Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {investmentPlans.slice(0, 3).map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-600">
                            {plan.roi_percentage / 100}x Return
                          </p>
                        </div>
                        <Badge
                          variant={plan.is_active ? "default" : "secondary"}
                        >
                          {plan.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    <Button onClick={createNewsPost} disabled={loading}>
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

      case "investments":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Investment Plans
              </h2>
              <Button
                onClick={() => setActiveTab("create-investment")}
                className="bg-green-600 hover:bg-green-700 mt-4 sm:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </div>

            {activeTab === "create-investment" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create Investment Plan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan_name">Plan Name</Label>
                      <Input
                        id="plan_name"
                        placeholder="e.g., Premium Plan"
                        value={investmentPlanForm.name}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan_roi">ROI Percentage (%)</Label>
                      <Input
                        id="plan_roi"
                        type="number"
                        placeholder="1000 = 10x return"
                        value={investmentPlanForm.roi_percentage}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            roi_percentage: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="plan_min">Minimum Amount ($)</Label>
                      <Input
                        id="plan_min"
                        type="number"
                        placeholder="100"
                        value={investmentPlanForm.min_amount}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            min_amount: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan_max">Maximum Amount ($)</Label>
                      <Input
                        id="plan_max"
                        type="number"
                        placeholder="50000"
                        value={investmentPlanForm.max_amount}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            max_amount: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan_duration">Duration (Days)</Label>
                      <Input
                        id="plan_duration"
                        type="number"
                        placeholder="1"
                        value={investmentPlanForm.duration_days}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            duration_days: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="plan_description">Description</Label>
                    <Textarea
                      id="plan_description"
                      placeholder="Plan description..."
                      value={investmentPlanForm.description}
                      onChange={(e) =>
                        setInvestmentPlanForm({
                          ...investmentPlanForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Features</Label>
                    {investmentPlanForm.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 mt-2"
                      >
                        <Input
                          placeholder="Feature description"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [
                              ...investmentPlanForm.features,
                            ];
                            newFeatures[index] = e.target.value;
                            setInvestmentPlanForm({
                              ...investmentPlanForm,
                              features: newFeatures,
                            });
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newFeatures =
                              investmentPlanForm.features.filter(
                                (_, i) => i !== index,
                              );
                            setInvestmentPlanForm({
                              ...investmentPlanForm,
                              features: newFeatures,
                            });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() =>
                        setInvestmentPlanForm({
                          ...investmentPlanForm,
                          features: [...investmentPlanForm.features, ""],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={investmentPlanForm.is_active}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            is_active: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Active
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={investmentPlanForm.is_featured}
                        onChange={(e) =>
                          setInvestmentPlanForm({
                            ...investmentPlanForm,
                            is_featured: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Featured
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={createInvestmentPlan} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Plan
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("investments")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {investmentPlans.map((plan) => (
                        <div
                          key={plan.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-lg">
                              {plan.name}
                            </h3>
                            <div className="flex space-x-1">
                              {plan.is_featured && (
                                <Badge
                                  variant="default"
                                  className="text-xs bg-yellow-100 text-yellow-800"
                                >
                                  Featured
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  plan.is_active ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {plan.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {plan.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">ROI:</span>
                              <span className="font-semibold text-green-600">
                                {plan.roi_percentage / 100}x (
                                {plan.roi_percentage}%)
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-medium">
                                {plan.duration_days} day
                                {plan.duration_days !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Range:</span>
                              <span className="font-medium">
                                ${plan.min_amount} - ${plan.max_amount}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs text-gray-500 mb-2">
                              Features:
                            </p>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {plan.features
                                .slice(0, 3)
                                .map((feature, index) => (
                                  <li key={index} className="flex items-center">
                                    <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                    {feature}
                                  </li>
                                ))}
                              {plan.features.length > 3 && (
                                <li className="text-gray-400">
                                  +{plan.features.length - 3} more...
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="flex space-x-2 mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
                            </div>
                            <div className="flex space-x-2">
                              <Select
                                value={ticket.status}
                                onValueChange={(value) =>
                                  updateTicketStatus(ticket.id, value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in_progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="resolved">
                                    Resolved
                                  </SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
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

      case "errors":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Site Errors</h2>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <Badge variant="destructive">
                  {siteErrors.filter((e) => !e.resolved).length} Unresolved
                </Badge>
                <Badge variant="default">
                  {siteErrors.filter((e) => e.resolved).length} Resolved
                </Badge>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Error Log</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {siteErrors.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No errors logged
                      </p>
                    ) : (
                      siteErrors.map((error) => (
                        <div
                          key={error.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Bug className="h-4 w-4 text-red-500" />
                                <h3 className="font-semibold text-red-800">
                                  {error.error_code}
                                </h3>
                                <Badge
                                  variant={
                                    error.resolved ? "default" : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {error.resolved ? "Resolved" : "Unresolved"}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2 font-mono bg-gray-50 p-2 rounded">
                                {error.error_message}
                              </p>
                              <div className="flex flex-col space-y-1 text-xs text-gray-500">
                                <span>Page: {error.page_url}</span>
                                <span>
                                  User Agent:{" "}
                                  {error.user_agent.substring(0, 80)}...
                                </span>
                                <span>
                                  Time:{" "}
                                  {new Date(error.created_at).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {!error.resolved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markErrorResolved(error.id)}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Resolve
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
          </div>
        );

      case "signals":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Forex Signals Management
              </h2>
              <Button
                onClick={() => setActiveTab("create-signal")}
                className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Signal
              </Button>
            </div>

            {activeTab === "create-signal" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Signal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pair">Currency Pair</Label>
                      <Input
                        id="pair"
                        placeholder="EUR/USD"
                        value={signalForm.pair}
                        onChange={(e) =>
                          setSignalForm({ ...signalForm, pair: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="signal_type">Signal Type</Label>
                      <Select
                        value={signalForm.signal_type}
                        onValueChange={(value: "buy" | "sell") =>
                          setSignalForm({ ...signalForm, signal_type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">BUY</SelectItem>
                          <SelectItem value="sell">SELL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="entry_price">Entry Price</Label>
                      <Input
                        id="entry_price"
                        type="number"
                        step="0.00001"
                        value={signalForm.entry_price}
                        onChange={(e) =>
                          setSignalForm({
                            ...signalForm,
                            entry_price: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="stop_loss">Stop Loss</Label>
                      <Input
                        id="stop_loss"
                        type="number"
                        step="0.00001"
                        value={signalForm.stop_loss}
                        onChange={(e) =>
                          setSignalForm({
                            ...signalForm,
                            stop_loss: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="take_profit_1">Take Profit 1</Label>
                      <Input
                        id="take_profit_1"
                        type="number"
                        step="0.00001"
                        value={signalForm.take_profit_1}
                        onChange={(e) =>
                          setSignalForm({
                            ...signalForm,
                            take_profit_1: parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="analysis">Analysis</Label>
                    <Textarea
                      id="analysis"
                      placeholder="Provide detailed analysis for this signal..."
                      value={signalForm.analysis}
                      onChange={(e) =>
                        setSignalForm({
                          ...signalForm,
                          analysis: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button onClick={createSignal} disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Signal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("signals")}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Signals</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {signals.slice(0, 10).map((signal) => (
                        <div
                          key={signal.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {signal.pair}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {signal.signal_type.toUpperCase()} • Entry:{" "}
                                {signal.entry_price}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  signal.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {signal.status}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">
                                Confidence
                              </p>
                              <p className="font-semibold">
                                {signal.confidence}%
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">SL:</span>
                              <span className="ml-1 font-medium">
                                {signal.stop_loss}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">TP1:</span>
                              <span className="ml-1 font-medium">
                                {signal.take_profit_1}
                              </span>
                            </div>
                          </div>
                          {signal.analysis && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {signal.analysis}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
