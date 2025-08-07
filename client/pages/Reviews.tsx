import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Star,
  CheckCircle,
  MessageSquare,
  Download,
  ArrowUpFromLine,
  Send,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  ThumbsUp,
  Filter,
  Calendar,
  BarChart3,
} from "lucide-react";

const telegramReviews = [
  {
    id: 1,
    username: "ForexTrader_Mike",
    rating: 5,
    date: "2024-01-15",
    title: "Exceptional Forex Signals!",
    content:
      "Amazing telegram forex signals! 89% win rate over 3 months. Made $15,000 profit from $2,000 investment. Professional analysis, clear entry/exit points, and excellent risk management. Best forex signals channel I've ever joined!",
    likes: 47,
    verified: true,
    tags: ["signals", "profit", "professional"],
  },
  {
    id: 2,
    username: "Sarah_Investor",
    rating: 5,
    date: "2024-01-12",
    title: "Life-changing Telegram Channel",
    content:
      "Outstanding forex signals on Telegram! Clear instructions, perfect timing, and incredible accuracy. Turned $1,500 into $18,750 in 2 months. Customer support is responsive and helpful. Highly recommend this forex signals service!",
    likes: 63,
    verified: true,
    tags: ["telegram", "accuracy", "support"],
  },
  {
    id: 3,
    username: "GlobalTrader_John",
    rating: 5,
    date: "2024-01-10",
    title: "Professional Forex Signals",
    content:
      "Best telegram forex signals ever! Professional analysis with detailed explanations. 9 out of 10 signals are profitable. Made consistent profits for 4 months. Clear stop loss and take profit levels. Excellent signal quality!",
    likes: 91,
    verified: true,
    tags: ["professional", "consistent", "profitable"],
  },
  {
    id: 4,
    username: "CryptoKing_Alex",
    rating: 5,
    date: "2024-01-08",
    title: "Incredible Signal Accuracy",
    content:
      "Phenomenal forex signals! 92% accuracy rate in my trading. Real-time alerts on Telegram with perfect timing. Made $25,000 profit in 3 months. Professional team with excellent market analysis. Best investment decision!",
    likes: 78,
    verified: true,
    tags: ["accuracy", "real-time", "profitable"],
  },
  {
    id: 5,
    username: "TradeQueen_Emma",
    rating: 5,
    date: "2024-01-05",
    title: "Outstanding Telegram Service",
    content:
      "Excellent forex signals channel! Clear communication, professional analysis, and consistent profits. 87% win rate over 6 months. Responsive support team and detailed trade explanations. Highly recommend for serious traders!",
    likes: 54,
    verified: true,
    tags: ["communication", "consistent", "support"],
  },
];

const ebookReviews = [
  {
    id: 1,
    username: "LearnToTrade_Sam",
    rating: 5,
    date: "2024-01-14",
    title: "Comprehensive Forex Education",
    content:
      "Amazing forex ebooks! Comprehensive trading strategies, risk management techniques, and market analysis methods. Perfect for beginners and advanced traders. Clear explanations with practical examples. Best forex education resources!",
    likes: 38,
    verified: true,
    tags: ["education", "comprehensive", "strategies"],
  },
  {
    id: 2,
    username: "StudentTrader_Lisa",
    rating: 5,
    date: "2024-01-11",
    title: "Excellent Learning Materials",
    content:
      "Outstanding forex ebooks! Well-structured content with step-by-step guides. Learned advanced trading techniques and psychology. Improved my trading results significantly. Professional quality education materials. Highly recommended!",
    likes: 42,
    verified: true,
    tags: ["learning", "structured", "advanced"],
  },
  {
    id: 3,
    username: "ProTrader_David",
    rating: 5,
    date: "2024-01-09",
    title: "Professional Trading Guides",
    content:
      "Excellent forex education ebooks! Detailed market analysis methods, trading psychology, and money management. High-quality content with real trading examples. Perfect for developing professional trading skills. Worth every penny!",
    likes: 56,
    verified: true,
    tags: ["professional", "detailed", "psychology"],
  },
];

const withdrawalReviews = [
  {
    id: 1,
    username: "FastPayout_Tom",
    rating: 5,
    date: "2024-01-13",
    title: "Quick and Reliable Withdrawals",
    content:
      "Excellent withdrawal service! Fast processing within 24 hours, secure transactions, and transparent fees. Withdrew $12,000 without any issues. Professional customer support and smooth verification process. Trustworthy platform!",
    likes: 67,
    verified: true,
    tags: ["fast", "secure", "reliable"],
  },
  {
    id: 2,
    username: "CashOut_Maria",
    rating: 5,
    date: "2024-01-10",
    title: "Seamless Withdrawal Process",
    content:
      "Outstanding withdrawal experience! Simple process, quick approval, and received funds in 18 hours. Multiple payment options and excellent security measures. Customer support is responsive and helpful. Highly satisfied!",
    likes: 45,
    verified: true,
    tags: ["seamless", "quick", "security"],
  },
  {
    id: 3,
    username: "WithdrawPro_Jack",
    rating: 5,
    date: "2024-01-07",
    title: "Professional Withdrawal Service",
    content:
      "Exceptional withdrawal service! Transparent process, competitive fees, and fast processing. Withdrew $8,500 successfully. Professional team with excellent communication. No hidden charges and secure transactions. Recommended!",
    likes: 39,
    verified: true,
    tags: ["transparent", "competitive", "professional"],
  },
];

const overallStats = {
  telegram: { rating: 4.9, reviews: telegramReviews.length, totalUsers: 15420 },
  ebooks: { rating: 4.9, reviews: ebookReviews.length, totalUsers: 8750 },
  withdrawals: {
    rating: 4.9,
    reviews: withdrawalReviews.length,
    totalUsers: 12890,
  },
};

const themes = {
  modern: {
    name: "Modern Blue",
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    cardBg: "bg-white border-blue-200",
    accent: "text-blue-600",
    primary: "text-gray-900",
    secondary: "text-gray-600",
  },
  success: {
    name: "Success Green",
    background: "bg-gradient-to-br from-green-50 to-emerald-100",
    cardBg: "bg-white border-green-200",
    accent: "text-green-600",
    primary: "text-gray-900",
    secondary: "text-gray-600",
  },
  premium: {
    name: "Premium Gold",
    background: "bg-gradient-to-br from-yellow-50 to-amber-100",
    cardBg: "bg-white border-yellow-200",
    accent: "text-yellow-600",
    primary: "text-gray-900",
    secondary: "text-gray-600",
  },
  elegant: {
    name: "Elegant Purple",
    background: "bg-gradient-to-br from-purple-50 to-violet-100",
    cardBg: "bg-white border-purple-200",
    accent: "text-purple-600",
    primary: "text-gray-900",
    secondary: "text-gray-600",
  },
};

export default function Reviews() {
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("modern");
  const [activeTab, setActiveTab] = useState("telegram");
  const [sortBy, setSortBy] = useState("recent");

  const theme = themes[selectedTheme];

  const getReviewsForTab = (tab: string) => {
    switch (tab) {
      case "telegram":
        return telegramReviews;
      case "ebooks":
        return ebookReviews;
      case "withdrawals":
        return withdrawalReviews;
      default:
        return telegramReviews;
    }
  };

  const sortReviews = (reviews: any[]) => {
    switch (sortBy) {
      case "recent":
        return [...reviews].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
      case "rating":
        return [...reviews].sort((a, b) => b.rating - a.rating);
      case "likes":
        return [...reviews].sort((a, b) => b.likes - a.likes);
      default:
        return reviews;
    }
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "telegram":
        return Send;
      case "ebooks":
        return BookOpen;
      case "withdrawals":
        return ArrowUpFromLine;
      default:
        return MessageSquare;
    }
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${theme.background} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className={`h-8 w-8 ${theme.accent}`} />
              <h1 className={`text-4xl font-bold ${theme.primary}`}>
                Service Reviews
              </h1>
              <Badge className="bg-yellow-500 text-white">
                ⭐ 4.9/5.0 Rating
              </Badge>
            </div>
            <p className={`text-xl ${theme.secondary} max-w-4xl mx-auto mb-8`}>
              Real reviews from our clients about our Telegram signals,
              educational ebooks, and withdrawal services. See why thousands of
              traders trust our platform for their forex trading success.
            </p>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className={`${theme.cardBg} text-center p-6`}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.primary}`}>
                  4.9/5.0
                </div>
                <div className={`text-sm ${theme.secondary} mb-2`}>
                  Telegram Signals
                </div>
                <div className="flex justify-center mb-2">
                  {renderStarRating(5)}
                </div>
                <div className={`text-xs ${theme.secondary}`}>
                  {overallStats.telegram.totalUsers.toLocaleString()} active
                  users
                </div>
              </Card>

              <Card className={`${theme.cardBg} text-center p-6`}>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.primary}`}>
                  4.9/5.0
                </div>
                <div className={`text-sm ${theme.secondary} mb-2`}>
                  Forex Ebooks
                </div>
                <div className="flex justify-center mb-2">
                  {renderStarRating(5)}
                </div>
                <div className={`text-xs ${theme.secondary}`}>
                  {overallStats.ebooks.totalUsers.toLocaleString()} downloads
                </div>
              </Card>

              <Card className={`${theme.cardBg} text-center p-6`}>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowUpFromLine className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.primary}`}>
                  4.9/5.0
                </div>
                <div className={`text-sm ${theme.secondary} mb-2`}>
                  Withdrawals
                </div>
                <div className="flex justify-center mb-2">
                  {renderStarRating(5)}
                </div>
                <div className={`text-xs ${theme.secondary}`}>
                  {overallStats.withdrawals.totalUsers.toLocaleString()}{" "}
                  transactions
                </div>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${theme.secondary}`}>Theme:</span>
                <Tabs
                  value={selectedTheme}
                  onValueChange={(value) =>
                    setSelectedTheme(value as keyof typeof themes)
                  }
                >
                  <TabsList className="grid grid-cols-4 w-auto">
                    {Object.entries(themes).map(([key, themeData]) => (
                      <TabsTrigger key={key} value={key} className="text-xs">
                        {themeData.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`text-sm ${theme.secondary}`}>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="rating">Highest Rating</option>
                  <option value="likes">Most Liked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="telegram"
                className="flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Telegram Signals</span>
              </TabsTrigger>
              <TabsTrigger
                value="ebooks"
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>Educational Ebooks</span>
              </TabsTrigger>
              <TabsTrigger
                value="withdrawals"
                className="flex items-center space-x-2"
              >
                <ArrowUpFromLine className="h-4 w-4" />
                <span>Withdrawal Service</span>
              </TabsTrigger>
            </TabsList>

            {/* Reviews Content */}
            {["telegram", "ebooks", "withdrawals"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortReviews(getReviewsForTab(tab)).map((review) => (
                    <Card
                      key={review.id}
                      className={`${theme.cardBg} hover:shadow-lg transition-all duration-300`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {review.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`font-semibold ${theme.primary} text-sm`}
                                >
                                  {review.username}
                                </span>
                                {review.verified && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </div>
                              <div className={`text-xs ${theme.secondary}`}>
                                {new Date(review.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {renderStarRating(review.rating)}
                          </div>
                        </div>

                        <CardTitle className={`text-lg ${theme.primary} mb-2`}>
                          {review.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent>
                        <p
                          className={`${theme.secondary} text-sm leading-relaxed mb-4`}
                        >
                          {review.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-2">
                            <ThumbsUp className="h-4 w-4 text-gray-400" />
                            <span className={`text-sm ${theme.secondary}`}>
                              {review.likes} likes
                            </span>
                          </div>
                          <Badge className="bg-green-500 text-white text-xs">
                            Verified Review
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className={`${theme.cardBg} p-8 max-w-4xl mx-auto`}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Award className={`h-8 w-8 ${theme.accent}`} />
                <h2 className={`text-3xl font-bold ${theme.primary}`}>
                  Join Our Satisfied Clients
                </h2>
              </div>
              <p
                className={`text-lg ${theme.secondary} mb-6 max-w-2xl mx-auto`}
              >
                Experience the same exceptional service that has earned us
                4.9/5.0 ratings across all our offerings. Start your forex
                trading journey with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3">
                  <Send className="mr-2 h-5 w-5" />
                  Join Telegram Signals
                </Button>
                <Button variant="outline" className="px-8 py-3">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Investing
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
