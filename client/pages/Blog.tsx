import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import FrontPageLayout from "@/components/FrontPageLayout";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Search,
  Tag,
  TrendingUp,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image?: string;
  author_id?: string;
  status: string;
  tags?: string[];
  published_at: string;
  created_at: string;
  author_name?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const navigate = useNavigate();

  const defaultPosts: BlogPost[] = [
    {
      id: "1",
      title: "Getting Started with Forex Trading",
      slug: "getting-started-forex-trading",
      content: `<h2>Introduction to Forex Trading</h2>
        <p>Forex trading, also known as foreign exchange trading, is the process of buying and selling currencies to profit from changes in their exchange rates. With our platform, you can start your forex journey with expert signals and guidance.</p>
        
        <h3>Why Choose Our Forex Signals?</h3>
        <ul>
        <li>87% win rate backed by professional analysis</li>
        <li>Real-time signals delivered via Telegram</li>
        <li>Expert risk management included</li>
        <li>24/7 customer support</li>
        </ul>`,
      excerpt:
        "Learn how to start your forex trading journey with our expert signals and achieve consistent profits.",
      status: "published",
      tags: ["forex", "trading", "beginners", "signals"],
      published_at: new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      author_name: "Trading Expert",
    },
    {
      id: "2",
      title: "Understanding Risk Management in Forex",
      slug: "risk-management-forex",
      content: `<h2>The Importance of Risk Management</h2>
        <p>Risk management is crucial for successful forex trading. Our signals always include stop loss and take profit levels to protect your capital.</p>`,
      excerpt:
        "Master the art of risk management in forex trading with our comprehensive guide and expert signals.",
      status: "published",
      tags: ["risk management", "forex", "trading tips"],
      published_at: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author_name: "Risk Management Specialist",
    },
    {
      id: "3",
      title: "Top 5 Currency Pairs for Beginners",
      slug: "top-currency-pairs-beginners",
      content: `<h2>Best Currency Pairs for New Traders</h2>
        <p>Starting with the right currency pairs can make a significant difference in your trading success. Here are our top recommendations for beginners.</p>`,
      excerpt:
        "Discover the best currency pairs for beginners and start trading with confidence using our expert signals.",
      status: "published",
      tags: ["currency pairs", "beginners", "forex basics"],
      published_at: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      author_name: "Currency Analyst",
    },
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          `
          *,
          user_profiles!blog_posts_author_id_fkey(full_name)
        `,
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        console.warn("Using default blog posts:", error.message);
        setPosts(defaultPosts);
      } else if (data && data.length > 0) {
        const formattedPosts = data.map((post) => ({
          ...post,
          author_name: post.user_profiles?.full_name || "Anonymous Author",
          tags: Array.isArray(post.tags) ? post.tags : [],
        }));
        setPosts(formattedPosts);
      } else {
        setPosts(defaultPosts);
      }
    } catch (error) {
      console.warn("Using default blog posts due to fetch error");
      setPosts(defaultPosts);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      !selectedTag || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(posts.flatMap((post) => post.tags || []))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-forex-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold">
                    Trading Blog
                  </h1>
                  <p className="text-sm md:text-lg text-forex-100 mt-2">
                    Expert insights, trading strategies, and market analysis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    label: "Expert Articles",
                    value: posts.length.toString(),
                    icon: BookOpen,
                  },
                  { label: "Trading Guides", value: "20+", icon: TrendingUp },
                  { label: "Weekly Updates", value: "3-5", icon: Clock },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-sm text-forex-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedTag === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                  className="min-h-[36px]"
                >
                  All Topics
                </Button>
                {allTags.slice(0, 5).map((tag) => (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(tag)}
                    className="min-h-[36px]"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Section */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or selected topics.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden border-2 border-gray-100 hover:border-forex-200 transition-all duration-200 hover:shadow-lg"
                  >
                    {post.featured_image ? (
                      <div className="h-48 bg-gradient-to-r from-forex-500 to-blue-500 relative">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-r from-forex-500 to-blue-500 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-white" />
                      </div>
                    )}

                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(post.published_at)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {estimateReadTime(post.content)} min read
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {post.author_name}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-forex-600 hover:text-forex-700"
                          onClick={() => navigate(`/blog/${post.slug}`)}
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Join Our Trading Community
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Get exclusive trading insights, market analysis, and free
                    forex signals delivered directly to your Telegram.
                  </p>
                  <a
                    href="https://t.me/forex_traders_signalss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-forex-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span>Join Free Telegram Channel</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </FrontPageLayout>
  );
}
