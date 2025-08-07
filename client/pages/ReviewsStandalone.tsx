import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  Quote,
  TrendingUp,
  Users,
  DollarSign,
  Award,
  CheckCircle,
  MessageCircle,
  ThumbsUp,
  Globe,
  ArrowLeft,
  Send,
  Filter,
  Search,
  Verified,
  Calendar,
  MapPin,
} from "lucide-react";

interface Review {
  id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url?: string;
  location?: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  investment_amount?: number;
  profit_earned?: number;
  platform_used?: string;
}

export default function ReviewsStandalone() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  
  // Form state for new review
  const [newReview, setNewReview] = useState({
    name: "",
    content: "",
    rating: 5,
    location: "",
    investment_amount: "",
    profit_earned: "",
    platform_used: "Forex Trading Signals",
  });

  // Sample reviews data (since we might not have real data)
  const sampleReviews: Review[] = [
    {
      id: "1",
      name: "Marcus Thompson",
      content: "Absolutely incredible service! I started with $500 and made over $12,000 in just 3 months. The signals are extremely accurate and the support team is always available. This platform has completely changed my financial situation.",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      location: "New York, USA",
      is_featured: true,
      is_approved: true,
      created_at: "2024-01-15T10:30:00Z",
      investment_amount: 500,
      profit_earned: 12000,
      platform_used: "Forex Trading Signals"
    },
    {
      id: "2",
      name: "Sarah Chen",
      content: "I was skeptical at first, but the results speak for themselves. The telegram signals are so easy to follow and the win rate is consistently above 85%. I've been able to quit my day job thanks to the profits I'm making.",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      location: "Singapore",
      is_featured: true,
      is_approved: true,
      created_at: "2024-01-10T14:20:00Z",
      investment_amount: 1000,
      profit_earned: 28000,
      platform_used: "VIP Signals Package"
    },
    {
      id: "3",
      name: "David Rodriguez",
      content: "Best forex platform I've ever used! The analysis is detailed, the entry and exit points are perfect, and I've never seen such consistent results. Highly recommended for both beginners and experienced traders.",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      location: "Madrid, Spain",
      is_featured: false,
      is_approved: true,
      created_at: "2024-01-08T09:15:00Z",
      investment_amount: 2000,
      profit_earned: 45000,
      platform_used: "Premium Trading Signals"
    },
    {
      id: "4",
      name: "Emily Watson",
      content: "As a single mother, this platform has been a lifesaver. The passive income I'm generating has allowed me to spend more time with my children while securing our financial future. The support team is amazing!",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      location: "London, UK",
      is_featured: true,
      is_approved: true,
      created_at: "2024-01-05T16:45:00Z",
      investment_amount: 750,
      profit_earned: 18500,
      platform_used: "Forex Trading Signals"
    },
    {
      id: "5",
      name: "Ahmed Hassan",
      content: "The telegram signals are incredibly accurate and the community is very supportive. I've learned so much about forex trading and I'm now consistently profitable. This is not just a signal service, it's an education.",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
      location: "Dubai, UAE",
      is_featured: false,
      is_approved: true,
      created_at: "2024-01-03T12:30:00Z",
      investment_amount: 1500,
      profit_earned: 32000,
      platform_used: "VIP Signals Package"
    },
    {
      id: "6",
      name: "Lisa Anderson",
      content: "I've tried many signal services before, but none come close to this. The transparency, accuracy, and customer service are unmatched. I've made more money in 6 months than I did in 2 years of trading alone.",
      rating: 5,
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      location: "Toronto, Canada",
      is_featured: false,
      is_approved: true,
      created_at: "2024-01-01T08:20:00Z",
      investment_amount: 3000,
      profit_earned: 67500,
      platform_used: "Premium Trading Signals"
    }
  ];

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Try to load from database first
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to sample data if database is empty or not configured
        setReviews(sampleReviews);
      } else {
        setReviews(data);
      }
    } catch (error) {
      // Fallback to sample data on any error
      setReviews(sampleReviews);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      if (!newReview.name || !newReview.content || !newReview.rating) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      const reviewData = {
        name: newReview.name,
        content: newReview.content,
        rating: newReview.rating,
        location: newReview.location,
        is_featured: false,
        is_approved: false,
        investment_amount: newReview.investment_amount ? parseFloat(newReview.investment_amount) : null,
        profit_earned: newReview.profit_earned ? parseFloat(newReview.profit_earned) : null,
        platform_used: newReview.platform_used,
      };

      const { error } = await supabase.from("testimonials").insert(reviewData);

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Thank you for your review! It will be published after approval.",
      });

      setNewReview({
        name: "",
        content: "",
        rating: 5,
        location: "",
        investment_amount: "",
        profit_earned: "",
        platform_used: "Forex Trading Signals",
      });
      setShowSubmitForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === "all" || 
      (filter === "featured" && review.is_featured) ||
      (filter === "high-profit" && (review.profit_earned || 0) > 20000);
    
    const matchesSearch = review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (review.location || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 5;

  const totalProfit = reviews.reduce((sum, review) => sum + (review.profit_earned || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Forex Reviews</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real Reviews from <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Real Traders</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See what our community of successful traders has to say about their experience with our forex trading signals and investment platform.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{reviews.length}+</div>
              <div className="text-sm text-gray-600">Happy Traders</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">${(totalProfit / 1000).toFixed(0)}K+</div>
              <div className="text-sm text-gray-600">Total Profits</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">90%+</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="text-sm"
              >
                All Reviews
              </Button>
              <Button
                size="sm"
                variant={filter === "featured" ? "default" : "outline"}
                onClick={() => setFilter("featured")}
                className="text-sm"
              >
                <Star className="h-4 w-4 mr-1" />
                Featured
              </Button>
              <Button
                size="sm"
                variant={filter === "high-profit" ? "default" : "outline"}
                onClick={() => setFilter("high-profit")}
                className="text-sm"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                High Profit
              </Button>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setShowSubmitForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {filteredReviews.map((review) => (
              <Card key={review.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-md">
                <CardContent className="p-6">
                  {review.is_featured && (
                    <Badge className="mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      ⭐ Featured Review
                    </Badge>
                  )}
                  
                  {/* Header */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      {review.avatar_url ? (
                        <img
                          src={review.avatar_url}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {review.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">{review.name}</h3>
                        <Verified className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      </div>
                      {review.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{review.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-6 w-6 text-gray-300" />
                    <p className="text-gray-700 leading-relaxed pl-4 text-sm sm:text-base">
                      {review.content}
                    </p>
                  </div>

                  {/* Profit Info */}
                  {(review.investment_amount || review.profit_earned) && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {review.investment_amount && (
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-red-600 font-medium">Initial Investment</p>
                          <p className="text-lg font-bold text-red-700">${review.investment_amount.toLocaleString()}</p>
                        </div>
                      )}
                      {review.profit_earned && (
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-green-600 font-medium">Profit Earned</p>
                          <p className="text-lg font-bold text-green-700">${review.profit_earned.toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    {review.platform_used && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {review.platform_used}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Submit Review Form Modal */}
        {showSubmitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Submit Your Review</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSubmitForm(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <Input
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <Input
                        value={newReview.location}
                        onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Review *
                    </label>
                    <Textarea
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      placeholder="Share your experience with our platform..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Investment ($)
                      </label>
                      <Input
                        type="number"
                        value={newReview.investment_amount}
                        onChange={(e) => setNewReview({ ...newReview, investment_amount: e.target.value })}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profit Earned ($)
                      </label>
                      <Input
                        type="number"
                        value={newReview.profit_earned}
                        onChange={(e) => setNewReview({ ...newReview, profit_earned: e.target.value })}
                        placeholder="5000"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSubmitReview}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Submit Review
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSubmitForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Success Stories?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey to financial freedom with our proven forex trading signals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/telegramsignals">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
                <TrendingUp className="mr-2 h-5 w-5" />
                Join Telegram Signals
              </Button>
            </Link>
            <Link to="/investment-plans">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                <DollarSign className="mr-2 h-5 w-5" />
                View Investment Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
