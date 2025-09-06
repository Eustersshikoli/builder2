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
  created_at: string;
}

export default function AdminPanelWithSidebar() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [signals, setSignals] = useState<ForexSignal[]>([]);

  // Form states
  const [ebookForm, setEbookForm] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    is_free: false,
    required_investment_amount: 0,
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
    { id: "payments", icon: DollarSign, label: "Payments" },
    { id: "support", icon: HelpCircle, label: "Support" },
    { id: "ebooks", icon: BookOpen, label: "Ebooks" },
    { id: "blog", icon: FileText, label: "Blog" },
    { id: "testimonials", icon: MessageSquare, label: "Reviews" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  useEffect(() => {
    if (activeTab === "signals") loadSignals();
    if (activeTab === "users") loadUsers();
    if (activeTab === "ebooks") loadEbooks();
    if (activeTab === "blog") loadBlogPosts();
    if (activeTab === "testimonials") loadTestimonials();
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
      setUsers((data || []).map((user: any) => ({
        ...user,
        kyc_status: user.kyc_status || 'pending'
      })));
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
      // Skip ebooks until table is available
      setEbooks([]);
      console.log('Ebooks functionality will be available after database migration');
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
      // Skip blog posts until table is available
      setBlogPosts([]);
      console.log('Blog posts functionality will be available after database migration');
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
      setTestimonials((data || []).map((testimonial: any) => ({
        ...testimonial,
        avatar_url: testimonial.avatar_url || '',
        location: testimonial.location || testimonial.country || ''
      })));
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

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={className}>
      <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 text-xs">
              Admin
            </Badge>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-forex-100 text-forex-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      activeTab === item.id ? "text-forex-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Link to="/" className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Back to Website
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  View site
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <p className="text-gray-600">Quick insights into your platform performance</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Signals</p>
                      <p className="text-2xl font-bold text-gray-900">{signals.filter(s => s.status === 'active').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Ebooks</p>
                      <p className="text-2xl font-bold text-gray-900">{ebooks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Reviews</p>
                      <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "signals":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Forex Signals Management</h2>
              <Button onClick={() => setActiveTab("create-signal")} className="bg-forex-600 hover:bg-forex-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Signal
              </Button>
            </div>

            {activeTab === "signals" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Signal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pair">Currency Pair</Label>
                      <Input
                        id="pair"
                        placeholder="EUR/USD"
                        value={signalForm.pair}
                        onChange={(e) => setSignalForm({ ...signalForm, pair: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signal_type">Signal Type</Label>
                      <Select value={signalForm.signal_type} onValueChange={(value: "buy" | "sell") => setSignalForm({ ...signalForm, signal_type: value })}>
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="entry_price">Entry Price</Label>
                      <Input
                        id="entry_price"
                        type="number"
                        step="0.00001"
                        value={signalForm.entry_price}
                        onChange={(e) => setSignalForm({ ...signalForm, entry_price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stop_loss">Stop Loss</Label>
                      <Input
                        id="stop_loss"
                        type="number"
                        step="0.00001"
                        value={signalForm.stop_loss}
                        onChange={(e) => setSignalForm({ ...signalForm, stop_loss: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="take_profit_1">Take Profit 1</Label>
                      <Input
                        id="take_profit_1"
                        type="number"
                        step="0.00001"
                        value={signalForm.take_profit_1}
                        onChange={(e) => setSignalForm({ ...signalForm, take_profit_1: parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="analysis">Analysis</Label>
                    <Textarea
                      id="analysis"
                      placeholder="Provide detailed analysis for this signal..."
                      value={signalForm.analysis}
                      onChange={(e) => setSignalForm({ ...signalForm, analysis: e.target.value })}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={createSignal} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                      Create Signal
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("signals")}>
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
                    <div className="space-y-4">
                      {signals.slice(0, 10).map((signal) => (
                        <div key={signal.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{signal.pair}</h3>
                              <p className="text-sm text-gray-600">
                                {signal.signal_type.toUpperCase()} • Entry: {signal.entry_price}
                              </p>
                              <Badge variant={signal.status === 'active' ? 'default' : 'secondary'}>
                                {signal.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="font-semibold">{signal.confidence}%</p>
                            </div>
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

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600 mt-2">This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex md:flex-shrink-0 w-64" />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <Sidebar className="relative flex-1 flex flex-col max-w-xs w-full" />
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-forex-500 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
