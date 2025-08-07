import { useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  Upload
} from "lucide-react";

export default function Admin() {
  const location = useLocation();
  const currentTab = new URLSearchParams(location.search).get('tab') || 'overview';

  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialContent, setTestimonialContent] = useState("");

  const adminStats = {
    totalUsers: 1247,
    activeInvestments: 342,
    totalInvested: 2450000,
    totalProfitPaid: 1876000,
    pendingPayouts: 23,
    blogPosts: 45,
    testimonials: 28,
    monthlyGrowth: 23.5
  };

  const recentUsers = [
    {
      id: 1,
      email: "sarah.mitchell@email.com",
      name: "Sarah Mitchell",
      joinDate: "2024-01-20",
      invested: 1500,
      status: "active",
      telegram: "@sarah_trader"
    },
    {
      id: 2,
      email: "david.chen@email.com", 
      name: "David Chen",
      joinDate: "2024-01-19",
      invested: 5000,
      status: "active",
      telegram: "@david_fx"
    },
    {
      id: 3,
      email: "maria.rodriguez@email.com",
      name: "Maria Rodriguez", 
      joinDate: "2024-01-18",
      invested: 750,
      status: "pending",
      telegram: "@maria_crypto"
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Understanding Forex Market Fundamentals",
      excerpt: "Learn the basics of forex trading and market analysis...",
      author: "Admin",
      date: "2024-01-20",
      status: "published",
      views: 1250
    },
    {
      id: 2,
      title: "Risk Management Strategies for Forex Trading",
      excerpt: "Essential risk management techniques every trader should know...",
      author: "Admin", 
      date: "2024-01-18",
      status: "published",
      views: 890
    },
    {
      id: 3,
      title: "Technical Analysis Guide: Reading Charts Like a Pro",
      excerpt: "Master the art of technical analysis in forex trading...",
      author: "Admin",
      date: "2024-01-15",
      status: "draft",
      views: 0
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Mitchell",
      content: "Amazing platform! I've earned $12,500 from a $1,000 investment in just 3 days.",
      rating: 5,
      status: "approved",
      date: "2024-01-20"
    },
    {
      id: 2,
      name: "David Chen",
      content: "Best forex signals I've ever used. 87% win rate is incredible!",
      rating: 5,
      status: "approved", 
      date: "2024-01-19"
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      content: "Professional service and excellent customer support. Highly recommended!",
      rating: 5,
      status: "pending",
      date: "2024-01-18"
    }
  ];

  const investments = [
    {
      id: 1,
      user: "sarah.mitchell@email.com",
      plan: "Premium Plan",
      amount: 1500,
      expectedReturn: 6000,
      progress: 72,
      status: "active",
      startDate: "2024-01-18"
    },
    {
      id: 2,
      user: "david.chen@email.com",
      plan: "VIP Plan", 
      amount: 5000,
      expectedReturn: 30000,
      progress: 15,
      status: "active",
      startDate: "2024-01-20"
    }
  ];

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
                <p className="text-blue-100 text-sm">+{adminStats.monthlyGrowth}% this month</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-success-500 to-success-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm">Total Invested</p>
                <p className="text-3xl font-bold">${(adminStats.totalInvested / 1000000).toFixed(1)}M</p>
                <p className="text-success-100 text-sm">{adminStats.activeInvestments} active</p>
              </div>
              <TrendingUp className="h-12 w-12 text-success-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gold-500 to-yellow-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gold-100 text-sm">Profit Paid</p>
                <p className="text-3xl font-bold">${(adminStats.totalProfitPaid / 1000000).toFixed(1)}M</p>
                <p className="text-gold-100 text-sm">{adminStats.pendingPayouts} pending</p>
              </div>
              <DollarSign className="h-12 w-12 text-gold-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Content</p>
                <p className="text-3xl font-bold">{adminStats.blogPosts}</p>
                <p className="text-purple-100 text-sm">{adminStats.testimonials} testimonials</p>
              </div>
              <FileText className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.slice(0, 3).map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">Invested: ${user.invested}</div>
                  </div>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-forex-600 hover:bg-forex-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New Blog Post
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Manage Testimonials
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics Report
            </Button>
          </CardContent>
        </Card>
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
            <Plus className="h-4 w-4 mr-2" />
            Add User
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join Date</th>
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
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">${user.invested.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.joinDate}</td>
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

  const renderBlog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
        <Button className="bg-forex-600 hover:bg-forex-700">
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Blog Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Create New Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                placeholder="Enter blog post title"
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="blog-content">Content</Label>
              <Textarea
                id="blog-content"
                placeholder="Write your blog post content here..."
                rows={10}
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button className="bg-success-600 hover:bg-success-700">
                Publish Post
              </Button>
              <Button variant="outline">
                Save Draft
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blogPosts.map(post => (
              <div key={post.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{post.title}</h4>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{post.excerpt}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.views} views</span>
                </div>
                <div className="flex space-x-1 mt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
        <Button className="bg-forex-600 hover:bg-forex-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Testimonial */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Customer Name</Label>
              <Input
                id="testimonial-name"
                placeholder="Enter customer name"
                value={testimonialName}
                onChange={(e) => setTestimonialName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testimonial-content">Testimonial</Label>
              <Textarea
                id="testimonial-content"
                placeholder="Enter testimonial content..."
                rows={4}
                value={testimonialContent}
                onChange={(e) => setTestimonialContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex space-x-1">
                {[1,2,3,4,5].map(star => (
                  <Star key={star} className="h-5 w-5 text-gold-400 fill-current cursor-pointer" />
                ))}
              </div>
            </div>

            <Button className="w-full bg-success-600 hover:bg-success-700">
              Add Testimonial
            </Button>
          </CardContent>
        </Card>

        {/* Existing Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-gold-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <Badge variant={testimonial.status === "approved" ? "default" : "secondary"}>
                    {testimonial.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{testimonial.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{testimonial.date}</span>
                  <div className="flex space-x-1">
                    {testimonial.status === "pending" && (
                      <Button size="sm" className="bg-success-600 hover:bg-success-700">
                        <CheckCircle className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInvestments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Investment Monitor</h2>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map(investment => (
                  <tr key={investment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{investment.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{investment.plan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${investment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-success-600 font-semibold">${investment.expectedReturn.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{investment.progress}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className="bg-blue-500">{investment.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" className="bg-success-600 hover:bg-success-700">
                          Complete
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

  const renderContent = () => {
    switch (currentTab) {
      case 'users':
        return renderUsers();
      case 'investments':
        return renderInvestments();
      case 'payouts':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payout Management</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <DollarSign className="h-16 w-16 text-gold-500 mx-auto mb-4" />
                <p className="text-gray-600">Payout management system coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'blog':
        return renderBlog();
      case 'testimonials':
        return renderTestimonials();
      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Reviews Management</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600">Reviews management system coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart3 className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600">Advanced analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-600">Admin settings panel coming soon...</p>
              </CardContent>
            </Card>
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
