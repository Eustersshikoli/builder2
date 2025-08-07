import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import EbookManager from "@/components/EbookManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Star,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Upload,
  Bell,
  Send,
  Globe,
  Activity,
  CreditCard,
  UserCheck,
  Settings,
  Shield,
  Zap,
  Clock,
  Target
} from "lucide-react";

export default function SuperAdmin() {
  const location = useLocation();
  const { toast } = useToast();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [telegramMessage, setTelegramMessage] = useState("");

  const adminStats = {
    totalUsers: 1847,
    newUsersToday: 47,
    totalInvestments: 3420000,
    activeInvestments: 542,
    pendingWithdrawals: 34,
    totalVisitors: 45230,
    dailyVisitors: 1250,
    conversionRate: 3.2,
    totalProfit: 2890000,
    monthlyGrowth: 28.5
  };

  const pendingWithdrawals = [
    {
      id: 1,
      user: "sarah.mitchell@email.com",
      amount: 12500,
      plan: "Premium Plan",
      requestDate: "2024-01-22",
      wallet: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      status: "pending",
      telegram: "@sarah_trader"
    },
    {
      id: 2,
      user: "david.chen@email.com", 
      amount: 45000,
      plan: "VIP Plan",
      requestDate: "2024-01-22",
      wallet: "0x742d35Cc6634C0532925a3b8D5c0B32C",
      status: "pending",
      telegram: "@david_fx"
    },
    {
      id: 3,
      user: "maria.rodriguez@email.com",
      amount: 8750,
      plan: "Starter Plan",
      requestDate: "2024-01-21",
      wallet: "TG2fJ4Co6aP4SPo6FqhQZqCQF6X5XdKx",
      status: "processing",
      telegram: "@maria_crypto"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      email: "john.wilson@email.com",
      name: "John Wilson",
      joinDate: "2024-01-22 14:30",
      country: "USA",
      invested: 0,
      status: "new",
      telegram: "@john_trader",
      lastLogin: "2024-01-22 14:32"
    },
    {
      id: 2,
      email: "emma.davis@email.com", 
      name: "Emma Davis",
      joinDate: "2024-01-22 13:15",
      country: "UK",
      invested: 1000,
      status: "active",
      telegram: "@emma_fx",
      lastLogin: "2024-01-22 15:45"
    },
    {
      id: 3,
      email: "carlos.rivera@email.com",
      name: "Carlos Rivera", 
      joinDate: "2024-01-22 12:00",
      country: "Spain",
      invested: 500,
      status: "active",
      telegram: "@carlos_crypto",
      lastLogin: "2024-01-22 16:20"
    }
  ];

  const activeInvestments = [
    {
      id: 1,
      user: "sarah.mitchell@email.com",
      plan: "Premium Plan",
      amount: 2000,
      expectedReturn: 8000,
      progress: 85,
      timeLeft: "12 hours",
      startDate: "2024-01-19",
      status: "completing"
    },
    {
      id: 2,
      user: "david.chen@email.com",
      plan: "VIP Plan", 
      amount: 10000,
      expectedReturn: 60000,
      progress: 45,
      timeLeft: "3 days 8 hours",
      startDate: "2024-01-20",
      status: "active"
    }
  ];

  const siteActivity = [
    { action: "New User Registration", user: "john.wilson@email.com", time: "2 min ago", type: "user" },
    { action: "Investment Completed", user: "emma.davis@email.com", time: "15 min ago", type: "investment" },
    { action: "Withdrawal Request", user: "carlos.rivera@email.com", time: "32 min ago", type: "withdrawal" },
    { action: "New Investment", user: "sarah.mitchell@email.com", time: "1 hour ago", type: "investment" },
    { action: "Login", user: "david.chen@email.com", time: "2 hours ago", type: "login" }
  ];

  const handleApproveWithdrawal = (id: number) => {
    toast({
      title: "Withdrawal Approved",
      description: "Payment will be processed within 24 hours.",
    });
    // Update withdrawal status logic here
  };

  const handleRejectWithdrawal = (id: number) => {
    toast({
      title: "Withdrawal Rejected",
      description: "User will be notified via email and Telegram.",
      variant: "destructive"
    });
    // Update withdrawal status logic here
  };

  const handleSendTelegramNotification = () => {
    if (!telegramMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to send.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Notification Sent",
      description: "Telegram notification sent to all users.",
    });
    setTelegramMessage("");
  };

  const handleCompleteInvestment = (id: number) => {
    toast({
      title: "Investment Completed",
      description: "User has been credited with returns and notified.",
    });
    // Complete investment logic here
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{adminStats.totalUsers.toLocaleString()}</p>
                <p className="text-blue-100 text-sm">+{adminStats.newUsersToday} today</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm">Total Investments</p>
                <p className="text-3xl font-bold">${(adminStats.totalInvestments / 1000000).toFixed(1)}M</p>
                <p className="text-success-100 text-sm">{adminStats.activeInvestments} active</p>
              </div>
              <TrendingUp className="h-12 w-12 text-success-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Daily Visitors</p>
                <p className="text-3xl font-bold">{adminStats.dailyVisitors.toLocaleString()}</p>
                <p className="text-purple-100 text-sm">{adminStats.conversionRate}% conversion</p>
              </div>
              <Globe className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-100 text-sm">Pending Withdrawals</p>
                <p className="text-3xl font-bold">{adminStats.pendingWithdrawals}</p>
                <p className="text-gold-100 text-sm">Needs attention</p>
              </div>
              <AlertCircle className="h-12 w-12 text-gold-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Activity (Live)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {siteActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'investment' ? 'bg-success-100 text-success-600' :
                    activity.type === 'withdrawal' ? 'bg-gold-100 text-gold-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'user' ? <UserCheck className="h-4 w-4" /> :
                     activity.type === 'investment' ? <TrendingUp className="h-4 w-4" /> :
                     activity.type === 'withdrawal' ? <DollarSign className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.user}</div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Telegram Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telegram-message">Broadcast Message</Label>
              <Textarea
                id="telegram-message"
                placeholder="Send notification to all users..."
                rows={4}
                value={telegramMessage}
                onChange={(e) => setTelegramMessage(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleSendTelegramNotification}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to All Users
            </Button>
            
            <div className="border-t pt-4">
              <div className="text-sm font-medium mb-2">Quick Messages:</div>
              <div className="space-y-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs"
                  onClick={() => setTelegramMessage("🎉 New investment plans available! Check your dashboard for amazing returns.")}
                >
                  New Investment Alert
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs"
                  onClick={() => setTelegramMessage("⚡ Server maintenance scheduled for tonight. All services will remain available.")}
                >
                  Maintenance Notice
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs"
                  onClick={() => setTelegramMessage("🔥 Limited time offer: 50% bonus on all investments today only!")}
                >
                  Special Offer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Withdrawal Approvals</h2>
        <Badge className="bg-red-500 text-white">
          {adminStats.pendingWithdrawals} Pending
        </Badge>
      </div>

      <div className="grid gap-6">
        {pendingWithdrawals.map(withdrawal => (
          <Card key={withdrawal.id} className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="font-semibold text-lg">${withdrawal.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    <div><strong>User:</strong> {withdrawal.user}</div>
                    <div><strong>Telegram:</strong> {withdrawal.telegram}</div>
                    <div><strong>Plan:</strong> {withdrawal.plan}</div>
                    <div><strong>Date:</strong> {withdrawal.requestDate}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Wallet Address:</div>
                  <div className="bg-gray-50 p-2 rounded text-xs font-mono break-all">
                    {withdrawal.wallet}
                  </div>
                  <Badge variant={withdrawal.status === "pending" ? "secondary" : "default"}>
                    {withdrawal.status}
                  </Badge>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={() => handleApproveWithdrawal(withdrawal.id)}
                    className="bg-success-600 hover:bg-success-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Send
                  </Button>
                  <Button 
                    onClick={() => handleRejectWithdrawal(withdrawal.id)}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button className="bg-forex-600 hover:bg-forex-700">
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telegram</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">{user.telegram}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">${user.invested.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{user.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">{user.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Bell className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Investment Control</h2>
        <Button variant="outline">
          <Target className="h-4 w-4 mr-2" />
          Complete All Ready
        </Button>
      </div>

      <div className="grid gap-6">
        {activeInvestments.map(investment => (
          <Card key={investment.id}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div>
                  <div className="font-semibold text-lg">{investment.plan}</div>
                  <div className="text-sm text-gray-600">{investment.user}</div>
                  <div className="text-xs text-gray-500">Started: {investment.startDate}</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-forex-600">${investment.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Invested</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span>{investment.progress}%</span>
                  </div>
                  <Progress value={investment.progress} className="h-2" />
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {investment.timeLeft} remaining
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Return: </span>
                    <span className="font-semibold text-success-600">${investment.expectedReturn.toLocaleString()}</span>
                  </div>
                  {investment.progress >= 90 ? (
                    <Button 
                      onClick={() => handleCompleteInvestment(investment.id)}
                      className="bg-success-600 hover:bg-success-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Monitor
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentTab) {
      case 'users':
        return renderUsers();
      case 'investments':
        return renderInvestments();
      case 'payouts':
        return renderWithdrawals();
      case 'blog':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Blog post title..." value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
                  <Textarea placeholder="Write your content..." rows={6} value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
                  <Button className="w-full">Publish Post</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Blog management interface</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'ebooks':
        return <EbookManager />;
      case 'testimonials':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Testimonials & Reviews</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                <p className="text-gray-600">Testimonials management system</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Site Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Visitors:</span>
                      <span className="font-bold">{adminStats.totalVisitors.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Today:</span>
                      <span className="font-bold">{adminStats.dailyVisitors.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-bold">{adminStats.conversionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">${(adminStats.totalProfit / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Growth:</span>
                      <span className="font-bold text-success-600">+{adminStats.monthlyGrowth}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout isAdmin={true}>
      <div className="p-6">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
