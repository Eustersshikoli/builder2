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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { signalsService, type ForexSignal } from "@/lib/signals-service";
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
  is_admin: boolean;
  created_at: string;
}

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  user_profiles: { full_name: string; email: string };
}

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  admin_response?: string;
  responded_at?: string;
  responded_by?: string;
  created_at: string;
  updated_at: string;
  user_profiles: { full_name: string; email: string };
}

interface VisitorAnalytics {
  id: string;
  ip_address: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  operating_system: string;
  page_visited: string;
  referrer: string;
  session_duration: number;
  is_mobile: boolean;
  user_agent: string;
  visited_at: string;
}

interface PageView {
  id: string;
  page_path: string;
  page_title: string;
  visitor_ip: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  referrer: string;
  view_duration: number;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // State for different content types
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [forexSignals, setForexSignals] = useState<ForexSignal[]>([]);
  const [visitorAnalytics, setVisitorAnalytics] = useState<VisitorAnalytics[]>(
    [],
  );
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [analyticsStats, setAnalyticsStats] = useState({
    totalVisitors: 0,
    uniqueVisitors: 0,
    topCountries: [] as { country: string; count: number }[],
    topPages: [] as { page: string; count: number }[],
    deviceBreakdown: [] as { device: string; count: number }[],
  });

  // Form states
  const [ebookForm, setEbookForm] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    is_free: false,
    required_investment_amount: 0,
  });

  const [blogForm, setBlogForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    is_published: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [ticketResponse, setTicketResponse] = useState<{
    [key: string]: string;
  }>({});
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  // Signal form state
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

  useEffect(() => {
    if (activeTab === "ebooks") loadEbooks();
    if (activeTab === "blog") loadBlogPosts();
    if (activeTab === "testimonials") loadTestimonials();
    if (activeTab === "users") loadUsers();
    if (activeTab === "payments") loadPayments();
    if (activeTab === "support") loadSupportTickets();
    if (activeTab === "analytics") loadAnalytics();
    if (activeTab === "signals") loadSignals();
  }, [activeTab]);

  const loadEbooks = async () => {
    try {
      setLoading(true);
      // Skip ebooks for now since table doesn't exist in current schema
      setEbooks([]);
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
      // Skip blog posts for now since table doesn't exist in current schema
      setBlogPosts([]);
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

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
        setTestimonials(data?.map(item => ({
          ...item,
          avatar_url: '',
          location: item.country || ''
        })) || []);
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

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Using deposits instead of non-existent payments table
      const { data, error } = await supabase
        .from("deposits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPayments(data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        amount: item.amount,
        currency: item.currency,
        payment_status: item.status,
        payment_method: item.crypto_currency || 'crypto',
        transaction_id: item.transaction_hash || '',
        created_at: item.created_at,
        updated_at: item.updated_at,
        user_profiles: null as any
      })) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    bucket: string = "ebooks",
  ): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleEbookUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Upload file to Supabase storage
      const fileUrl = await uploadFile(selectedFile, "ebooks");

      // Save ebook metadata to database
      const { error } = await supabase.from("ebooks").insert({
        ...ebookForm,
        file_url: fileUrl,
        file_size: selectedFile.size,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ebook uploaded successfully",
      });

      // Reset form
      setEbookForm({
        title: "",
        description: "",
        author: "",
        category: "",
        is_free: false,
        required_investment_amount: 0,
      });
      setSelectedFile(null);

      // Reload ebooks
      loadEbooks();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload ebook",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleBlogCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const slug = blogForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { error } = await supabase.from("blog_posts").insert({
        ...blogForm,
        slug,
        author_id: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully",
      });

      // Reset form
      setBlogForm({
        title: "",
        content: "",
        excerpt: "",
        category: "",
        is_published: false,
      });

      // Reload blog posts
      loadBlogPosts();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTestimonialApproval = async (id: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ is_approved: !isApproved })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Testimonial ${!isApproved ? "approved" : "rejected"}`,
      });

      loadTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
    }
  };

  const updateUserKYC = async (userId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ kyc_status: status })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `KYC status updated to ${status}`,
      });

      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update KYC status",
        variant: "destructive",
      });
    }
  };

  const loadSupportTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, user_profiles(full_name, email)")
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

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Ticket status updated to ${status}`,
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

  const respondToTicket = async (ticketId: string, response: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("support_tickets")
        .update({
          admin_response: response,
          responded_at: new Date().toISOString(),
          responded_by: user?.id,
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Response sent successfully",
      });

      setTicketResponse((prev) => ({ ...prev, [ticketId]: "" }));
      setRespondingTo(null);
      loadSupportTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500 text-white";
      case "in_progress":
        return "bg-orange-500 text-white";
      case "resolved":
        return "bg-green-500 text-white";
      case "closed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load visitor analytics
      const { data: visitors, error: visitorsError } = await supabase
        .from("visitor_analytics")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(1000);

      if (visitorsError) {
        console.warn("Visitor analytics table not found, using mock data");
        setVisitorAnalytics(generateMockVisitorData());
      } else {
        setVisitorAnalytics(visitors || []);
      }

      // Load page views
      const { data: pages, error: pagesError } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (pagesError) {
        console.warn("Page views table not found, using mock data");
        setPageViews(generateMockPageViewData());
      } else {
        setPageViews(pages || []);
      }

      // Calculate analytics stats
      calculateAnalyticsStats(
        visitors || generateMockVisitorData(),
        pages || generateMockPageViewData(),
      );
    } catch (error) {
      console.warn("Analytics loading failed, using mock data:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      const mockVisitors = generateMockVisitorData();
      const mockPages = generateMockPageViewData();
      setVisitorAnalytics(mockVisitors);
      setPageViews(mockPages);
      calculateAnalyticsStats(mockVisitors, mockPages);
    } finally {
      setLoading(false);
    }
  };

  const generateMockVisitorData = (): VisitorAnalytics[] => {
    const countries = [
      "United States",
      "United Kingdom",
      "Germany",
      "France",
      "Canada",
      "Australia",
      "Nigeria",
      "South Africa",
      "Brazil",
      "India",
    ];
    const cities = [
      "New York",
      "London",
      "Berlin",
      "Paris",
      "Toronto",
      "Sydney",
      "Lagos",
      "Cape Town",
      "São Paulo",
      "Mumbai",
    ];
    const devices = ["Desktop", "Mobile", "Tablet"];
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"];
    const pages = [
      "/",
      "/login",
      "/signup",
      "/blog",
      "/news",
      "/investment-plans",
      "/live-signals",
      "/testimonials",
    ];

    return Array.from({ length: 150 }, (_, i) => ({
      id: `visitor_${i}`,
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      device_type: devices[Math.floor(Math.random() * devices.length)],
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      operating_system:
        Math.random() > 0.5
          ? "Windows"
          : Math.random() > 0.5
            ? "macOS"
            : "Android",
      page_visited: pages[Math.floor(Math.random() * pages.length)],
      referrer:
        Math.random() > 0.3
          ? "https://google.com"
          : Math.random() > 0.5
            ? "https://facebook.com"
            : "direct",
      session_duration: Math.floor(Math.random() * 1800) + 30, // 30 seconds to 30 minutes
      is_mobile: Math.random() > 0.6,
      user_agent: "Mozilla/5.0 (compatible)",
      visited_at: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    }));
  };

  const generateMockPageViewData = (): PageView[] => {
    const pages = [
      { path: "/", title: "Home Page" },
      { path: "/login", title: "Login" },
      { path: "/signup", title: "Sign Up" },
      { path: "/blog", title: "Blog" },
      { path: "/news", title: "News" },
      { path: "/investment-plans", title: "Investment Plans" },
      { path: "/live-signals", title: "Live Signals" },
      { path: "/testimonials", title: "Testimonials" },
      { path: "/dashboard", title: "Dashboard" },
    ];
    const countries = [
      "United States",
      "United Kingdom",
      "Germany",
      "France",
      "Canada",
    ];
    const cities = ["New York", "London", "Berlin", "Paris", "Toronto"];
    const devices = ["Desktop", "Mobile", "Tablet"];
    const browsers = ["Chrome", "Firefox", "Safari", "Edge"];

    return Array.from({ length: 300 }, (_, i) => {
      const page = pages[Math.floor(Math.random() * pages.length)];
      return {
        id: `pageview_${i}`,
        page_path: page.path,
        page_title: page.title,
        visitor_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        device_type: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        referrer: Math.random() > 0.3 ? "https://google.com" : "direct",
        view_duration: Math.floor(Math.random() * 600) + 10, // 10 seconds to 10 minutes
        created_at: new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };
    });
  };

  const calculateAnalyticsStats = (
    visitors: VisitorAnalytics[],
    pages: PageView[],
  ) => {
    const uniqueIps = new Set(visitors.map((v) => v.ip_address));

    // Count by country
    const countryCount = visitors.reduce(
      (acc, visitor) => {
        acc[visitor.country] = (acc[visitor.country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by page
    const pageCount = pages.reduce(
      (acc, page) => {
        acc[page.page_path] = (acc[page.page_path] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Count by device
    const deviceCount = visitors.reduce(
      (acc, visitor) => {
        acc[visitor.device_type] = (acc[visitor.device_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    setAnalyticsStats({
      totalVisitors: visitors.length,
      uniqueVisitors: uniqueIps.size,
      topCountries: Object.entries(countryCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([country, count]) => ({ country, count })),
      topPages: Object.entries(pageCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([page, count]) => ({ page, count })),
      deviceBreakdown: Object.entries(deviceCount).map(([device, count]) => ({
        device,
        count,
      })),
    });
  };

  const loadSignals = async () => {
    try {
      setLoading(true);
      const result = await signalsService.getAllSignals(1, 50);

      if (result.success) {
        setForexSignals(result.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load forex signals",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignalCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User session not found",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const result = await signalsService.createSignal({
        ...signalForm,
        created_by: user.id,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Forex signal created successfully",
        });

        // Reset form
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

        // Reload signals
        loadSignals();
      } else {
        toast({
          title: "Error",
          description: "Failed to create signal",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSignal = async (
    signalId: string,
    result: "win" | "loss" | "breakeven",
    closePrice: number,
    pips?: number,
  ) => {
    try {
      const closeResult = await signalsService.closeSignal(signalId, {
        result,
        close_price: closePrice,
        pips_gained: pips,
      });

      if (closeResult.success) {
        toast({
          title: "Success",
          description: "Signal closed successfully",
        });
        loadSignals();
      } else {
        toast({
          title: "Error",
          description: "Failed to close signal",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while closing the signal",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">
            Manage your forex platform content and users
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Admin Access
        </Badge>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="flex flex-wrap gap-2 mb-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-10 lg:grid-cols-12">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-1 text-xs"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="flex items-center space-x-1 text-xs"
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Errors</span>
            </TabsTrigger>
            <TabsTrigger
              value="ebooks"
              className="flex items-center space-x-1 text-xs"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Ebooks</span>
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="flex items-center space-x-1 text-xs"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger
              value="promos"
              className="flex items-center space-x-1 text-xs"
            >
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Promos</span>
            </TabsTrigger>
            <TabsTrigger
              value="testimonials"
              className="flex items-center space-x-1 text-xs"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center space-x-1 text-xs"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center space-x-1 text-xs"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="flex items-center space-x-1 text-xs"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
            <TabsTrigger
              value="signals"
              className="flex items-center space-x-1 text-xs"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Signals</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center space-x-1 text-xs"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center space-x-1 text-xs"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Payments
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  $
                  {payments
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ebooks</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ebooks.length}</div>
                <p className="text-xs text-muted-foreground">
                  {ebooks.filter((e) => e.is_published).length} published
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blog Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogPosts.length}</div>
                <p className="text-xs text-muted-foreground">
                  {blogPosts.filter((b) => b.is_published).length} published
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Error Monitoring</h2>
              <p className="text-gray-600">
                Monitor and track application errors
              </p>
            </div>
            <Link to="/error-monitoring">
              <Button className="bg-red-600 hover:bg-red-700">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Full Error Dashboard
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Critical Errors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">3</div>
                <p className="text-sm text-gray-600">
                  Unresolved critical errors
                </p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">
                      Database Connection Failed
                    </div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Payment Processing Error</div>
                    <div className="text-gray-500">5 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span>Warnings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">7</div>
                <p className="text-sm text-gray-600">Active warnings</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm">
                    <div className="font-medium">High API Usage</div>
                    <div className="text-gray-500">1 hour ago</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">Slow Query Detected</div>
                    <div className="text-gray-500">3 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>System Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">98%</div>
                <p className="text-sm text-gray-600">Uptime (24h)</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database:</span>
                    <span className="text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>API:</span>
                    <span className="text-green-600">Online</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payments:</span>
                    <span className="text-green-600">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Error Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Database connection timeout
                    </div>
                    <div className="text-sm text-gray-600">
                      Connection to user_profiles table failed after 30s timeout
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      2024-01-15 14:30:22
                    </div>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">
                      Failed login attempts spike
                    </div>
                    <div className="text-sm text-gray-600">
                      15 failed login attempts detected from IP 192.168.1.100
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      2024-01-15 13:45:10
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    Warning
                  </Badge>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">Payment gateway error</div>
                    <div className="text-sm text-gray-600">
                      NowPayments API returned 500 error for transaction #TX123
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      2024-01-15 12:15:33
                    </div>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Link to="/error-monitoring">
                  <Button variant="outline">View All Errors</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ebooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload New Ebook</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEbookUpload} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={ebookForm.title}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={ebookForm.author}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={ebookForm.description}
                    onChange={(e) =>
                      setEbookForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setEbookForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="forex-basics">
                          Forex Basics
                        </SelectItem>
                        <SelectItem value="technical-analysis">
                          Technical Analysis
                        </SelectItem>
                        <SelectItem value="trading-strategies">
                          Trading Strategies
                        </SelectItem>
                        <SelectItem value="risk-management">
                          Risk Management
                        </SelectItem>
                        <SelectItem value="psychology">
                          Trading Psychology
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment-amount">
                      Required Investment ($)
                    </Label>
                    <Input
                      id="investment-amount"
                      type="number"
                      value={ebookForm.required_investment_amount}
                      onChange={(e) =>
                        setEbookForm((prev) => ({
                          ...prev,
                          required_investment_amount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Ebook File (PDF)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setSelectedFile(e.target.files?.[0] || null)
                      }
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Ebook
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Ebooks List */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Ebooks</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {ebooks.map((ebook) => (
                    <div
                      key={ebook.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{ebook.title}</h4>
                        <p className="text-sm text-gray-600">
                          by {ebook.author}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              ebook.is_published ? "success" : "secondary"
                            }
                          >
                            {ebook.is_published ? "Published" : "Draft"}
                          </Badge>
                          <Badge variant="outline">{ebook.category}</Badge>
                          <span className="text-sm text-gray-500">
                            {ebook.download_count} downloads
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
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
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Blog Post</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBlogCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blog-title">Title</Label>
                  <Input
                    id="blog-title"
                    value={blogForm.title}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={blogForm.excerpt}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={blogForm.content}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blog-category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        setBlogForm((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market-analysis">
                          Market Analysis
                        </SelectItem>
                        <SelectItem value="trading-tips">
                          Trading Tips
                        </SelectItem>
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="strategy">Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      id="published"
                      checked={blogForm.is_published}
                      onChange={(e) =>
                        setBlogForm((prev) => ({
                          ...prev,
                          is_published: e.target.checked,
                        }))
                      }
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Blog Post
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">
                              {testimonial.name}
                            </h4>
                            <div className="flex items-center">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {testimonial.content}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                testimonial.is_approved
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {testimonial.is_approved ? "Approved" : "Pending"}
                            </Badge>
                            {testimonial.is_featured && (
                              <Badge variant="outline">Featured</Badge>
                            )}
                            <span className="text-sm text-gray-500">
                              {testimonial.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant={
                              testimonial.is_approved ? "outline" : "default"
                            }
                            onClick={() =>
                              toggleTestimonialApproval(
                                testimonial.id,
                                testimonial.is_approved,
                              )
                            }
                          >
                            {testimonial.is_approved ? (
                              <XCircle className="h-4 w-4" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promos" className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Promotional Pages</h2>
              <p className="text-gray-600">
                Create and manage promotional landing pages with custom themes
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Create New Promo Page
            </Button>
          </div>

          {/* Existing Promo Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample Promo Page 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Black Friday Special
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      50% off all investment plans
                    </p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium">Dark Gold</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">2,340</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-medium">156 (6.7%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">Nov 20, 2024</span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Promo Page 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">New Year Boost</CardTitle>
                    <p className="text-sm text-gray-600">
                      Start 2024 with guaranteed returns
                    </p>
                  </div>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium">Luxury Blue</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Views:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Conversions:</span>
                    <span className="font-medium">0 (0%)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">Dec 28, 2024</span>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create New Promo Card */}
            <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Create New Promo Page
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Design a custom promotional landing page
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Theme Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Available Themes</CardTitle>
              <p className="text-gray-600">
                Choose from pre-designed themes for your promotional pages
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Theme 1 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded mb-3"></div>
                  <h4 className="font-medium">Golden Opportunity</h4>
                  <p className="text-xs text-gray-600">
                    Luxury gold theme with elegant animations
                  </p>
                </div>

                {/* Theme 2 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded mb-3"></div>
                  <h4 className="font-medium">Professional Blue</h4>
                  <p className="text-xs text-gray-600">
                    Clean and professional business theme
                  </p>
                </div>

                {/* Theme 3 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded mb-3"></div>
                  <h4 className="font-medium">Success Green</h4>
                  <p className="text-xs text-gray-600">
                    Growth-focused theme with success elements
                  </p>
                </div>

                {/* Theme 4 */}
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded mb-3"></div>
                  <h4 className="font-medium">Dark Elite</h4>
                  <p className="text-xs text-gray-600">
                    Premium dark theme for exclusive offers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Promotional Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Active Promos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    15,240
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    1,087
                  </div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">7.1%</div>
                  <div className="text-sm text-gray-600">
                    Avg Conversion Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{user.full_name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              user.kyc_status === "approved"
                                ? "success"
                                : user.kyc_status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            KYC: {user.kyc_status}
                          </Badge>
                          {user.is_admin && (
                            <Badge variant="outline">Admin</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {user.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select
                          onValueChange={(value) =>
                            updateUserKYC(user.id, value)
                          }
                          defaultValue={user.kyc_status}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          ${payment.amount} {payment.currency.toUpperCase()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {payment.user_profiles?.full_name} (
                          {payment.user_profiles?.email})
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge
                            variant={
                              payment.payment_status === "finished"
                                ? "success"
                                : payment.payment_status === "failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {payment.payment_status}
                          </Badge>
                          <Badge variant="outline">
                            {payment.payment_method}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          {/* Support Tickets Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Open Tickets
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {supportTickets.filter((t) => t.status === "open").length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting response
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {
                    supportTickets.filter((t) => t.status === "in_progress")
                      .length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Being handled</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {supportTickets.filter((t) => t.status === "resolved").length}
                </div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {supportTickets.filter((t) => t.priority === "urgent").length}
                </div>
                <p className="text-xs text-muted-foreground">High priority</p>
              </CardContent>
            </Card>
          </div>

          {/* Support Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Support Tickets</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : supportTickets.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No support tickets found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">
                              {ticket.subject}
                            </h4>
                            <Badge
                              className={getPriorityColor(ticket.priority)}
                            >
                              {ticket.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <span>From: {ticket.user_profiles?.full_name}</span>
                            <span>•</span>
                            <span>{ticket.user_profiles?.email}</span>
                            <span>•</span>
                            <span>{ticket.category}</span>
                            <span>•</span>
                            <span>
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Select
                            onValueChange={(value) =>
                              updateTicketStatus(ticket.id, value)
                            }
                            defaultValue={ticket.status}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="in_progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-gray-700">{ticket.message}</p>
                      </div>

                      {ticket.admin_response && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-700">
                              Admin Response
                            </span>
                            <span className="text-xs text-gray-500">
                              {ticket.responded_at &&
                                new Date(ticket.responded_at).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-blue-800">
                            {ticket.admin_response}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        {respondingTo === ticket.id ? (
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder="Type your response..."
                              value={ticketResponse[ticket.id] || ""}
                              onChange={(e) =>
                                setTicketResponse((prev) => ({
                                  ...prev,
                                  [ticket.id]: e.target.value,
                                }))
                              }
                              rows={3}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  respondToTicket(
                                    ticket.id,
                                    ticketResponse[ticket.id] || "",
                                  )
                                }
                                disabled={
                                  !ticketResponse[ticket.id]?.trim() || loading
                                }
                              >
                                <Send className="h-4 w-4 mr-1" />
                                Send Response
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRespondingTo(null);
                                  setTicketResponse((prev) => ({
                                    ...prev,
                                    [ticket.id]: "",
                                  }));
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRespondingTo(ticket.id)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Respond
                            </Button>
                            {ticket.status !== "resolved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() =>
                                  updateTicketStatus(ticket.id, "resolved")
                                }
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-gray-600 hover:text-gray-700"
                              onClick={() =>
                                updateTicketStatus(ticket.id, "closed")
                              }
                            >
                              <Archive className="h-4 w-4 mr-1" />
                              Archive
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          {/* Signal Creation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create New Forex Signal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignalCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signal-pair">Currency Pair</Label>
                    <Select
                      onValueChange={(value) =>
                        setSignalForm((prev) => ({ ...prev, pair: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                        <SelectItem value="GBP/USD">GBP/USD</SelectItem>
                        <SelectItem value="USD/JPY">USD/JPY</SelectItem>
                        <SelectItem value="USD/CHF">USD/CHF</SelectItem>
                        <SelectItem value="AUD/USD">AUD/USD</SelectItem>
                        <SelectItem value="USD/CAD">USD/CAD</SelectItem>
                        <SelectItem value="NZD/USD">NZD/USD</SelectItem>
                        <SelectItem value="EUR/GBP">EUR/GBP</SelectItem>
                        <SelectItem value="EUR/JPY">EUR/JPY</SelectItem>
                        <SelectItem value="GBP/JPY">GBP/JPY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signal-type">Signal Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          signal_type: value as "buy" | "sell",
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select signal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">BUY</SelectItem>
                        <SelectItem value="sell">SELL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry-price">Entry Price</Label>
                    <Input
                      id="entry-price"
                      type="number"
                      step="0.00001"
                      value={signalForm.entry_price}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          entry_price: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stop-loss">Stop Loss</Label>
                    <Input
                      id="stop-loss"
                      type="number"
                      step="0.00001"
                      value={signalForm.stop_loss}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          stop_loss: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confidence">Confidence (%)</Label>
                    <Input
                      id="confidence"
                      type="number"
                      min="1"
                      max="100"
                      value={signalForm.confidence}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          confidence: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tp1">Take Profit 1</Label>
                    <Input
                      id="tp1"
                      type="number"
                      step="0.00001"
                      value={signalForm.take_profit_1}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          take_profit_1: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tp2">Take Profit 2 (Optional)</Label>
                    <Input
                      id="tp2"
                      type="number"
                      step="0.00001"
                      value={signalForm.take_profit_2}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          take_profit_2: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tp3">Take Profit 3 (Optional)</Label>
                    <Input
                      id="tp3"
                      type="number"
                      step="0.00001"
                      value={signalForm.take_profit_3}
                      onChange={(e) =>
                        setSignalForm((prev) => ({
                          ...prev,
                          take_profit_3: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis">Market Analysis</Label>
                  <Textarea
                    id="analysis"
                    value={signalForm.analysis}
                    onChange={(e) =>
                      setSignalForm((prev) => ({
                        ...prev,
                        analysis: e.target.value,
                      }))
                    }
                    rows={4}
                    placeholder="Provide detailed market analysis and reasoning for this signal..."
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Signal...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Create Forex Signal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Signals List */}
          <Card>
            <CardHeader>
              <CardTitle>Active Forex Signals</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : forexSignals.length === 0 ? (
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No forex signals found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {forexSignals.map((signal) => (
                    <div
                      key={signal.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-lg">
                              {signal.pair}
                            </h4>
                            <Badge
                              className={`${
                                signal.signal_type === "buy"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {signal.signal_type.toUpperCase()}
                            </Badge>
                            <Badge
                              className={`${
                                signal.status === "active"
                                  ? "bg-blue-500 text-white"
                                  : signal.status === "closed"
                                    ? "bg-gray-500 text-white"
                                    : "bg-orange-500 text-white"
                              }`}
                            >
                              {signal.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {signal.confidence}% Confidence
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Entry:</span>
                              <div className="font-medium">
                                {signal.entry_price}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Stop Loss:</span>
                              <div className="font-medium">
                                {signal.stop_loss}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">TP1:</span>
                              <div className="font-medium">
                                {signal.take_profit_1}
                              </div>
                            </div>
                            {signal.take_profit_2 && (
                              <div>
                                <span className="text-gray-600">TP2:</span>
                                <div className="font-medium">
                                  {signal.take_profit_2}
                                </div>
                              </div>
                            )}
                            {signal.take_profit_3 && (
                              <div>
                                <span className="text-gray-600">TP3:</span>
                                <div className="font-medium">
                                  {signal.take_profit_3}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">
                              Analysis:
                            </div>
                            <p className="text-sm">{signal.analysis}</p>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                            <span>
                              Created:{" "}
                              {new Date(signal.created_at).toLocaleString()}
                            </span>
                            {signal.result && (
                              <span
                                className={`font-medium ${
                                  signal.result === "win"
                                    ? "text-green-600"
                                    : signal.result === "loss"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                }`}
                              >
                                Result: {signal.result.toUpperCase()}
                                {signal.pips_gained &&
                                  ` (${signal.pips_gained > 0 ? "+" : ""}${signal.pips_gained} pips)`}
                              </span>
                            )}
                          </div>
                        </div>

                        {signal.status === "active" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => {
                                const closePrice = prompt("Enter close price:");
                                const pips = prompt("Enter pips gained:");
                                if (closePrice) {
                                  handleCloseSignal(
                                    signal.id,
                                    "win",
                                    parseFloat(closePrice),
                                    pips ? parseFloat(pips) : undefined,
                                  );
                                }
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Win
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                const closePrice = prompt("Enter close price:");
                                const pips = prompt("Enter pips lost:");
                                if (closePrice) {
                                  handleCloseSignal(
                                    signal.id,
                                    "loss",
                                    parseFloat(closePrice),
                                    pips ? parseFloat(pips) : undefined,
                                  );
                                }
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Loss
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Visitors
                </CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsStats.totalVisitors.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Visitors
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsStats.uniqueVisitors.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique IP addresses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Page Views
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {pageViews.length.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total page views
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Session
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    visitorAnalytics.reduce(
                      (sum, v) => sum + v.session_duration,
                      0,
                    ) /
                      visitorAnalytics.length /
                      60,
                  ) || 0}
                  m
                </div>
                <p className="text-xs text-muted-foreground">
                  Average duration
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Top Countries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsStats.topCountries.map((country, index) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                              width: `${(country.count / analyticsStats.totalVisitors) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Most Visited Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsStats.topPages.map((page, index) => (
                    <div
                      key={page.page}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(page.count / pageViews.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-8">
                          {page.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Device Breakdown</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {analyticsStats.deviceBreakdown.map((device) => (
                  <div
                    key={device.device}
                    className="text-center p-4 border rounded-lg"
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {device.count}
                    </div>
                    <div className="text-sm text-gray-600">{device.device}</div>
                    <div className="text-xs text-gray-500">
                      {Math.round(
                        (device.count / analyticsStats.totalVisitors) * 100,
                      )}
                      %
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Recent Visitors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {visitorAnalytics.slice(0, 20).map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-medium">
                          {visitor.country}, {visitor.city}
                        </div>
                        <div className="text-sm text-gray-600">
                          {visitor.page_visited}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>
                        {visitor.device_type} • {visitor.browser}
                      </div>
                      <div>
                        {new Date(visitor.visited_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Website Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="site-name">Website Name</Label>
                  <Input
                    id="site-name"
                    defaultValue="FREE FOREX SIGNALS PROVIDER"
                    placeholder="Website name"
                  />
                </div>

                <div>
                  <Label htmlFor="site-description">Website Description</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="Professional forex trading signals and investment platform"
                    placeholder="Website description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    defaultValue="support@forexsignals.com"
                    placeholder="Support email address"
                  />
                </div>

                <div>
                  <Label htmlFor="telegram-channel">Telegram Channel</Label>
                  <Input
                    id="telegram-channel"
                    defaultValue="@forex_traders_signalss"
                    placeholder="Telegram channel username"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Update Website Settings
                </Button>
              </CardContent>
            </Card>

            {/* Investment Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="min-investment">
                    Minimum Investment (USD)
                  </Label>
                  <Input
                    id="min-investment"
                    type="number"
                    defaultValue="200"
                    placeholder="Minimum investment amount"
                  />
                </div>

                <div>
                  <Label htmlFor="min-deposit">Minimum Deposit (USD)</Label>
                  <Input
                    id="min-deposit"
                    type="number"
                    defaultValue="60"
                    placeholder="Minimum deposit amount"
                  />
                </div>

                <div>
                  <Label htmlFor="roi-percentage">Default ROI Percentage</Label>
                  <Input
                    id="roi-percentage"
                    type="number"
                    defaultValue="2500"
                    placeholder="ROI percentage"
                  />
                </div>

                <div>
                  <Label htmlFor="investment-duration">
                    Default Duration (days)
                  </Label>
                  <Input
                    id="investment-duration"
                    type="number"
                    defaultValue="10"
                    placeholder="Investment duration in days"
                  />
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Update Investment Settings
                </Button>
              </CardContent>
            </Card>

            {/* Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Website Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Upload New Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 200x50px, PNG or SVG format
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-gray-500">Current Logo Preview</div>
                  <div className="mt-4 text-2xl font-bold bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
                    FREE FOREX SIGNALS PROVIDER
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </Button>
              </CardContent>
            </Card>

            {/* Popup Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Popup Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="popup-enabled" defaultChecked />
                  <Label htmlFor="popup-enabled">Enable Welcome Popup</Label>
                </div>

                <div>
                  <Label htmlFor="popup-title">Popup Title</Label>
                  <Input
                    id="popup-title"
                    defaultValue="🎉 Welcome Exclusive Offer!"
                    placeholder="Popup title"
                  />
                </div>

                <div>
                  <Label htmlFor="popup-content">Popup Content</Label>
                  <Textarea
                    id="popup-content"
                    defaultValue="Get started with just $100 and earn $2,500 in 24 hours! Limited time offer for new investors."
                    placeholder="Popup content"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="popup-show-count">
                    Times to Show (per user)
                  </Label>
                  <Input
                    id="popup-show-count"
                    type="number"
                    defaultValue="10"
                    placeholder="Number of times to show popup"
                  />
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Update Popup Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
