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

// Type definitions for admin panel data
interface Ebook {
  id: string;
  title: string;
  description: string;
  author: string;
  category: string;
  price: number;
  fileUrl: string;
  coverImage: string;
  isActive: boolean;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  authorId: string;
  featuredImage: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  isApproved: boolean;
  isFeatured: boolean;
  profession?: string;
  country?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  telegramId?: string;
  country?: string;
  isVerified: boolean;
  kyc_status?: string;
  is_admin?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
  user_profiles?: any;
}

interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  message: string;
  adminResponse?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  user_profiles?: any;
}

interface VisitorAnalytics {
  id: string;
  ip_address: string;
  country: string;
  city: string;
  device_type: string;
  browser: string;
  operating_system: string;
  screen_resolution: string;
  page_path: string;
  page_title: string;
  referrer: string;
  user_agent: string;
  session_id: string;
  session_duration: number;
  is_mobile: boolean;
  visited_at: string;
  created_at: string;
}

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // State for different data types
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [analytics, setAnalytics] = useState<VisitorAnalytics[]>([]);
  const [signals, setSignals] = useState<ForexSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Form states
  const [ebookData, setEbookData] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    price: "0",
    fileUrl: "",
    coverImage: "",
  });

  const [blogData, setBlogData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "",
  });

  const [testimonialData, setTestimonialData] = useState({
    name: "",
    content: "",
    rating: "5",
    profession: "",
    country: "",
    email: "",
  });

  const [ticketData, setTicketData] = useState({
    userId: "",
    subject: "",
    category: "technical",
    priority: "medium",
    description: "",
  });

  const [signalData, setSignalData] = useState({
    currencyPair: "",
    signalType: "buy",
    entryPrice: "",
    stopLoss: "",
    takeProfit: "",
    analysis: "",
    confidenceLevel: "medium",
    riskLevel: "medium",
  });

  // Check admin access
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-4">
                You don't have permission to access the admin panel.
              </p>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Load data functions
  const loadEbooks = async () => {
    try {
      setLoading(true);
      // Skip ebooks for now since table needs types update
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
      // Skip blog posts for now since table needs types update
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
      setTestimonials(
        data?.map(item => ({
          id: item.id,
          name: item.name,
          content: item.content,
          rating: item.rating || 5,
          isApproved: item.is_approved,
          isFeatured: item.is_featured,
          profession: item.profession,
          country: item.country,
          email: item.email,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) || []
      );
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
      setUsers(
        data?.map(item => ({
          id: item.id,
          email: item.email,
          fullName: item.full_name,
          username: item.username,
          phoneNumber: item.phone_number,
          telegramId: item.telegram_id,
          country: item.country,
          isVerified: item.is_verified,
          kyc_status: 'pending',
          is_admin: false,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        })) || []
      );
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
      setPayments(
        data?.map(item => ({
          id: item.id,
          userId: item.user_id,
          amount: item.amount,
          currency: item.currency,
          paymentStatus: item.status,
          paymentMethod: item.crypto_currency || 'crypto',
          transactionId: item.transaction_hash || '',
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          user_profiles: null as any
        })) || []
      );
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

  const loadTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*, user_profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(
        data?.map(item => ({
          id: item.id,
          userId: item.user_id,
          subject: item.subject,
          category: item.category,
          priority: item.priority,
          status: item.status,
          description: item.description,
          message: item.description, // Use description as message
          adminResponse: item.admin_response,
          resolvedAt: item.resolved_at,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          user_profiles: item.user_profiles
        })) || []
      );
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

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Skip analytics for now since table needs types update
      setAnalytics([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSignals = async () => {
    try {
      setLoading(true);
      const data = await signalsService.getAllSignals();
      setSignals(data);
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

  // CRUD operations
  const createEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Skip ebook creation since table doesn't exist
      toast({
        title: "Info",
        description: "Ebook functionality not available yet",
      });
      return;
      
      toast({
        title: "Success",
        description: "Ebook created successfully",
      });
      
      setEbookData({
        title: "",
        description: "",
        author: "",
        category: "",
        price: "0",
        fileUrl: "",
        coverImage: "",
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

  const createBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Skip blog post creation since table doesn't exist
      toast({
        title: "Info", 
        description: "Blog functionality not available yet",
      });
      return;
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      
      setBlogData({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        category: "",
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

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const newTicket = {
        user_id: ticketData.userId,
        subject: ticketData.subject,
        category: ticketData.category,
        priority: ticketData.priority,
        description: ticketData.description,
        status: "open",
      };

      const { error } = await supabase.from("support_tickets").insert(newTicket);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
      
      setTicketData({
        userId: "",
        subject: "",
        category: "technical",
        priority: "medium",
        description: "",
      });
      
      loadTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const newTestimonial = {
        name: testimonialData.name,
        content: testimonialData.content,
        rating: parseInt(testimonialData.rating),
        profession: testimonialData.profession,
        country: testimonialData.country,
        email: testimonialData.email,
        is_approved: false,
        is_featured: false,
      };

      const { error } = await supabase.from("testimonials").insert(newTestimonial);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Testimonial created successfully",
      });
      
      setTestimonialData({
        name: "",
        content: "",
        rating: "5",
        profession: "",
        country: "",
        email: "",
      });
      
      loadTestimonials();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create testimonial",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const newSignal = {
        pair: signalData.currencyPair,
        signal_type: signalData.signalType as 'buy' | 'sell',
        entry_price: parseFloat(signalData.entryPrice),
        stop_loss: parseFloat(signalData.stopLoss),
        take_profit_1: parseFloat(signalData.takeProfit),
        confidence: signalData.confidenceLevel === 'high' ? 90 : signalData.confidenceLevel === 'medium' ? 70 : 50,
        analysis: signalData.analysis,
        created_by: user?.id || 'admin',
      };

      await signalsService.createSignal(newSignal);
      
      toast({
        title: "Success",
        description: "Forex signal created successfully",
      });
      
      setSignalData({
        currencyPair: "",
        signalType: "buy",
        entryPrice: "",
        stopLoss: "",
        takeProfit: "",
        analysis: "",
        confidenceLevel: "medium",
        riskLevel: "medium",
      });
      
      loadSignals();
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

  // Initial data load
  useEffect(() => {
    if (isAdmin) {
      loadEbooks();
      loadBlogPosts(); 
      loadTestimonials();
      loadUsers();
      loadPayments();
      loadTickets();
      loadAnalytics();
      loadSignals();
    }
  }, [isAdmin]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage your website content and monitor analytics
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="ebooks">Ebooks</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {signals.filter(s => s.status === 'active').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{payments.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tickets.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forex Signals Tab */}
        <TabsContent value="signals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Forex Signal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createSignal} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currencyPair">Currency Pair</Label>
                      <Input
                        id="currencyPair"
                        value={signalData.currencyPair}
                        onChange={(e) => setSignalData({...signalData, currencyPair: e.target.value})}
                        placeholder="EUR/USD"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signalType">Signal Type</Label>
                      <Select
                        value={signalData.signalType}
                        onValueChange={(value) => setSignalData({...signalData, signalType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="entryPrice">Entry Price</Label>
                      <Input
                        id="entryPrice"
                        type="number"
                        step="0.00001"
                        value={signalData.entryPrice}
                        onChange={(e) => setSignalData({...signalData, entryPrice: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stopLoss">Stop Loss</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        step="0.00001"
                        value={signalData.stopLoss}
                        onChange={(e) => setSignalData({...signalData, stopLoss: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="takeProfit">Take Profit</Label>
                      <Input
                        id="takeProfit"
                        type="number"
                        step="0.00001"
                        value={signalData.takeProfit}
                        onChange={(e) => setSignalData({...signalData, takeProfit: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="analysis">Analysis</Label>
                    <Textarea
                      id="analysis"
                      value={signalData.analysis}
                      onChange={(e) => setSignalData({...signalData, analysis: e.target.value})}
                      placeholder="Technical analysis..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="confidenceLevel">Confidence Level</Label>
                      <Select
                        value={signalData.confidenceLevel}
                        onValueChange={(value) => setSignalData({...signalData, confidenceLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="riskLevel">Risk Level</Label>
                      <Select
                        value={signalData.riskLevel}
                        onValueChange={(value) => setSignalData({...signalData, riskLevel: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    Create Signal
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Signals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {signals.slice(0, 5).map((signal) => (
                    <div key={signal.id} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{signal.pair}</span>
                        <Badge variant={signal.signal_type === 'buy' ? 'default' : 'secondary'}>
                          {signal.signal_type.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Entry: {signal.entry_price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {signal.status}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ebooks">
          <Card>
            <CardHeader>
              <CardTitle>Ebook Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Ebook functionality will be available after database types are updated.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle>Blog Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Blog functionality will be available after database types are updated.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Testimonial</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createTestimonial} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={testimonialData.name}
                      onChange={(e) => setTestimonialData({...testimonialData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={testimonialData.content}
                      onChange={(e) => setTestimonialData({...testimonialData, content: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={testimonialData.rating}
                        onValueChange={(value) => setTestimonialData({...testimonialData, rating: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        value={testimonialData.profession}
                        onChange={(e) => setTestimonialData({...testimonialData, profession: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={testimonialData.country}
                        onChange={(e) => setTestimonialData({...testimonialData, country: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={testimonialData.email}
                        onChange={(e) => setTestimonialData({...testimonialData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    Create Testimonial
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Testimonials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testimonials.slice(0, 5).map((testimonial) => (
                    <div key={testimonial.id} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{testimonial.name}</span>
                        <Badge variant={testimonial.isApproved ? 'default' : 'secondary'}>
                          {testimonial.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {testimonial.content.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rating: {testimonial.rating}/5</span>
                        {testimonial.isFeatured && <Badge variant="outline">Featured</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="border rounded p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{user.fullName || user.email}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                        {user.country && (
                          <p className="text-sm text-muted-foreground mt-1">{user.country}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createTicket} className="space-y-4">
                  <div>
                    <Label htmlFor="userId">User ID</Label>
                    <Input
                      id="userId"
                      value={ticketData.userId}
                      onChange={(e) => setTicketData({...ticketData, userId: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={ticketData.subject}
                      onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={ticketData.category}
                        onValueChange={(value) => setTicketData({...ticketData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={ticketData.priority}
                        onValueChange={(value) => setTicketData({...ticketData, priority: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={ticketData.description}
                      onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading}>
                    Create Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="border rounded p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">{ticket.subject}</span>
                        <Badge variant={
                          ticket.status === 'open' ? 'destructive' :
                          ticket.status === 'in_progress' ? 'default' : 'secondary'
                        }>
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ticket.description.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Priority: {ticket.priority}</span>
                        <span className="text-sm">Category: {ticket.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
