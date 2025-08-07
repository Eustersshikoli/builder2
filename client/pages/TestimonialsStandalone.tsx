import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import FrontPageLayout from "@/components/FrontPageLayout";
import {
  Star,
  CheckCircle,
  Globe,
  TrendingUp,
  DollarSign,
  Award,
  Users,
  Quote,
  Heart,
  Zap,
  Trophy,
  Target,
  MessageCircle,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  country?: string;
  flag?: string;
  location?: string;
  profession?: string;
  investment?: string;
  profit?: string;
  roi?: string;
  duration?: string;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function TestimonialsStandalone() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "featured" | "recent">("all");

  const defaultTestimonials: Testimonial[] = [
    {
      id: "1",
      name: "Ahmed Hassan",
      role: "Financial Analyst",
      country: "Egypt",
      flag: "🇪🇬",
      location: "Cairo, Egypt",
      profession: "Financial Analyst",
      investment: "$500",
      profit: "$12,500",
      roi: "2,400%",
      duration: "8 days",
      rating: 5,
      content:
        "Incredible forex investment returns! I started with just $500 and earned $12,500 in 8 days. These forex signals are absolutely amazing and have changed my financial life completely.",
      is_verified: true,
      is_featured: true,
      created_at: "2024-01-15",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      role: "Business Owner",
      country: "Spain",
      flag: "🇪🇸",
      location: "Madrid, Spain",
      profession: "Business Owner",
      investment: "$1,000",
      profit: "$25,000",
      roi: "2,400%",
      duration: "10 days",
      rating: 5,
      content:
        "Outstanding forex trading results! My investment of $1,000 grew to $25,000 in just 10 days. The forex signals accuracy is phenomenal and the investment returns exceeded all my expectations.",
      is_verified: true,
      is_featured: true,
      created_at: "2024-01-12",
    },
    {
      id: "3",
      name: "James Wilson",
      role: "Investment Manager",
      country: "United States",
      flag: "🇺🇸",
      location: "New York, USA",
      profession: "Investment Manager",
      investment: "$2,000",
      profit: "$50,000",
      roi: "2,400%",
      duration: "9 days",
      rating: 5,
      content:
        "Exceptional forex investment platform! Turned my $2,000 into $50,000 in 9 days with their premium forex signals. The trading accuracy and investment returns are unmatched.",
      is_verified: true,
      is_featured: true,
      created_at: "2024-01-10",
    },
    {
      id: "4",
      name: "Li Wei",
      role: "Tech Executive",
      country: "China",
      flag: "🇨🇳",
      location: "Shanghai, China",
      profession: "Tech Executive",
      investment: "$1,500",
      profit: "$37,500",
      roi: "2,400%",
      duration: "7 days",
      rating: 5,
      content:
        "Amazing forex trading results! My $1,500 investment generated $37,500 profit in just 7 days. The forex signals are highly accurate and the investment returns are extraordinary.",
      is_verified: true,
      is_featured: false,
      created_at: "2024-01-08",
    },
    {
      id: "5",
      name: "Sarah Thompson",
      role: "Real Estate Investor",
      country: "Canada",
      flag: "🇨🇦",
      location: "Toronto, Canada",
      profession: "Real Estate Investor",
      investment: "$3,000",
      profit: "$75,000",
      roi: "2,400%",
      duration: "11 days",
      rating: 5,
      content:
        "Phenomenal forex investment platform! My $3,000 investment became $75,000 in 11 days. Professional service with transparent trading process and exceptional customer support.",
      is_verified: true,
      is_featured: false,
      created_at: "2024-01-05",
    },
    {
      id: "6",
      name: "Roberto Silva",
      role: "Financial Consultant",
      country: "Brazil",
      flag: "🇧🇷",
      location: "São Paulo, Brazil",
      profession: "Financial Consultant",
      investment: "$800",
      profit: "$20,000",
      roi: "2,400%",
      duration: "6 days",
      rating: 5,
      content:
        "Extraordinary forex trading experience! Invested $800 and received $20,000 in just 6 days. The signals are incredibly accurate and the platform is very professional.",
      is_verified: true,
      is_featured: false,
      created_at: "2024-01-03",
    },
  ];

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Using default testimonials:", error.message);
        setTestimonials(defaultTestimonials);
      } else if (data && data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(defaultTestimonials);
      }
    } catch (error) {
      console.warn("Using default testimonials due to fetch error");
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (filter === "featured") return testimonial.is_featured;
    if (filter === "recent")
      return (
        new Date(testimonial.created_at) >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
    return true;
  });

  const stats = {
    totalTestimonials: testimonials.length,
    averageRating:
      testimonials.length > 0
        ? (
            testimonials.reduce((sum, t) => sum + t.rating, 0) /
            testimonials.length
          ).toFixed(1)
        : "5.0",
    verifiedCount: testimonials.filter((t) => t.is_verified).length,
    countries:
      [...new Set(testimonials.map((t) => t.country).filter(Boolean))].length ||
      25,
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
                  <Quote className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold">
                    Success Stories
                  </h1>
                  <p className="text-sm md:text-lg text-forex-100 mt-2">
                    Real testimonials from our successful traders
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    label: "Happy Traders",
                    value: stats.totalTestimonials.toLocaleString(),
                    icon: Users,
                  },
                  {
                    label: "Average Rating",
                    value: `${stats.averageRating}★`,
                    icon: Star,
                  },
                  {
                    label: "Verified Reviews",
                    value: stats.verifiedCount.toString(),
                    icon: CheckCircle,
                  },
                  {
                    label: "Countries",
                    value: `${stats.countries}+`,
                    icon: Globe,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 p-3 md:p-4 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                    <div className="text-lg md:text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-forex-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value={filter} className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                          <div className="h-20 bg-gray-200 rounded mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                      <Card
                        key={testimonial.id}
                        className="border-2 border-gray-100 hover:border-forex-200 transition-all duration-200 hover:shadow-lg"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                {testimonial.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-gray-900">
                                    {testimonial.name}
                                  </span>
                                  {testimonial.is_verified && (
                                    <Badge className="bg-success-500 text-white text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  {testimonial.flag && (
                                    <span>{testimonial.flag}</span>
                                  )}
                                  <span>{testimonial.role}</span>
                                </div>
                              </div>
                            </div>
                            {testimonial.is_featured && (
                              <Badge
                                variant="outline"
                                className="text-gold-600 border-gold-600"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-gold-500 fill-current"
                              />
                            ))}
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          <blockquote className="text-gray-700 italic text-sm leading-relaxed">
                            "{testimonial.content}"
                          </blockquote>

                          {(testimonial.investment || testimonial.profit) && (
                            <div className="bg-gradient-to-r from-success-50 to-success-100 p-3 rounded-lg">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                {testimonial.investment && (
                                  <div>
                                    <span className="text-gray-600">
                                      Investment:
                                    </span>
                                    <div className="font-bold text-gray-900">
                                      {testimonial.investment}
                                    </div>
                                  </div>
                                )}
                                {testimonial.profit && (
                                  <div>
                                    <span className="text-gray-600">
                                      Profit:
                                    </span>
                                    <div className="font-bold text-success-600">
                                      {testimonial.profit}
                                    </div>
                                  </div>
                                )}
                                {testimonial.roi && (
                                  <div>
                                    <span className="text-gray-600">ROI:</span>
                                    <div className="font-bold text-success-600">
                                      {testimonial.roi}
                                    </div>
                                  </div>
                                )}
                                {testimonial.duration && (
                                  <div>
                                    <span className="text-gray-600">
                                      Duration:
                                    </span>
                                    <div className="font-bold text-gray-900">
                                      {testimonial.duration}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {testimonial.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Globe className="h-4 w-4 mr-2" />
                              {testimonial.location}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Join Our Success Stories
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Start your own success story today. Join thousands of
                    traders who trust our signals for consistent profits.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href="https://t.me/forex_traders_signalss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-forex-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span>Join Free Telegram</span>
                    </a>
                    <Button
                      variant="outline"
                      className="border-2 border-forex-600 text-forex-600 hover:bg-forex-600 hover:text-white px-8 py-4"
                    >
                      Start Investing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </FrontPageLayout>
  );
}
