import React, { useState, useEffect } from "react";
import { Calendar, Search, Filter, Eye, ExternalLink } from "lucide-react";
import FrontPageLayout from "../components/FrontPageLayout";
import { supabase } from "../lib/supabase";

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  image_url?: string;
  category: string;
  published_at: string;
  author: string;
  views: number;
  featured: boolean;
  status: "published" | "draft";
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const categories = [
    "All",
    "Market Analysis",
    "Economic News",
    "Trading Tips",
    "Platform Updates",
    "Regulation",
  ];

  // Default news articles as fallback
  const defaultArticles: NewsArticle[] = [
    {
      id: 1,
      title: "Fed Interest Rate Decision Impacts Forex Markets",
      summary:
        "The Federal Reserve's latest interest rate decision has created significant movements in major currency pairs, affecting global forex trading strategies.",
      content:
        "The Federal Reserve's decision to maintain interest rates has sent ripples through the forex market...",
      category: "Economic News",
      published_at: new Date().toISOString(),
      author: "Market Analysis Team",
      views: 1247,
      featured: true,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
    {
      id: 2,
      title: "EUR/USD Technical Analysis: Key Support Levels",
      summary:
        "Professional analysis of EUR/USD pair showing critical support and resistance levels for the coming week.",
      content:
        "The EUR/USD pair has been showing strong consolidation patterns...",
      category: "Market Analysis",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      author: "Technical Analysis Team",
      views: 892,
      featured: true,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
    {
      id: 3,
      title: "New Trading Platform Features Released",
      summary:
        "Enhanced charting tools and improved order execution speed now available to all users.",
      content:
        "We're excited to announce the release of several new features...",
      category: "Platform Updates",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      author: "Development Team",
      views: 654,
      featured: false,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
    {
      id: 4,
      title: "Risk Management in Volatile Markets",
      summary:
        "Essential strategies for protecting your capital during periods of high market volatility.",
      content: "Risk management is crucial for long-term trading success...",
      category: "Trading Tips",
      published_at: new Date(Date.now() - 259200000).toISOString(),
      author: "Education Team",
      views: 1105,
      featured: false,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
    {
      id: 5,
      title: "Global Economic Calendar This Week",
      summary:
        "Key economic events and data releases that could impact forex markets in the upcoming week.",
      content:
        "This week's economic calendar is packed with important events...",
      category: "Economic News",
      published_at: new Date(Date.now() - 345600000).toISOString(),
      author: "Research Team",
      views: 743,
      featured: false,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
    {
      id: 6,
      title: "Cryptocurrency Integration in Forex Trading",
      summary:
        "How digital currencies are changing the landscape of traditional forex trading and new opportunities for traders.",
      content:
        "The integration of cryptocurrency markets with traditional forex...",
      category: "Market Analysis",
      published_at: new Date(Date.now() - 432000000).toISOString(),
      author: "Crypto Analysis Team",
      views: 567,
      featured: false,
      status: "published" as const,
      image_url: "/api/placeholder/400/250",
    },
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) {
        console.warn(
          "Failed to fetch news from database, using default articles:",
          error,
        );
        setArticles(defaultArticles);
      } else if (data && data.length > 0) {
        setArticles(data);
      } else {
        setArticles(defaultArticles);
      }
    } catch (error) {
      console.warn(
        "Error connecting to database, using default articles:",
        error,
      );
      setArticles(defaultArticles);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory,
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  // Pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle,
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <FrontPageLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-300 mt-4">Loading latest news...</p>
            </div>
          </div>
        </div>
      </FrontPageLayout>
    );
  }

  const featuredArticles = filteredArticles
    .filter((article) => article.featured)
    .slice(0, 2);
  const regularArticles = currentArticles.filter(
    (article) => !article.featured,
  );

  return (
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Latest <span className="text-blue-400">Forex News</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stay informed with the latest market developments, economic
              insights, and trading opportunities.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800/50 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Filter className="h-6 w-6 text-blue-400 mr-2" />
                Featured Stories
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.image_url || "/api/placeholder/400/250"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-400 mb-3">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(article.published_at)}
                        <span className="mx-2">•</span>
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {article.category}
                        </span>
                        <span className="mx-2">•</span>
                        <Eye className="h-4 w-4 mr-1" />
                        {formatViews(article.views)}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-300 mb-4 line-clamp-3">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          By {article.author}
                        </span>
                        <button className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Latest Articles
            </h2>
            {regularArticles.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-slate-800/30 backdrop-blur-sm border border-slate-600 rounded-xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={article.image_url || "/api/placeholder/400/250"}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(article.published_at)}
                        <span className="mx-2">•</span>
                        <Eye className="h-4 w-4 mr-1" />
                        {formatViews(article.views)}
                      </div>
                      <div className="mb-2">
                        <span className="bg-slate-700 text-gray-300 px-2 py-1 rounded text-xs">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          By {article.author}
                        </span>
                        <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                  No articles found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </FrontPageLayout>
  );
};

export default News;
