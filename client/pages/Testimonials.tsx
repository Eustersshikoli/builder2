import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ahmed Hassan",
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
      "Incredible forex investment returns! I started with just $500 and earned $12,500 in 8 days. These forex signals are absolutely amazing and have changed my financial life completely. The trading strategies are professional and the customer support is outstanding. Best forex investment platform I've ever used!",
    verified: true,
    date: "2024-01-15",
  },
  {
    id: 2,
    name: "Maria Rodriguez",
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
      "Outstanding forex trading results! My investment of $1,000 grew to $25,000 in just 10 days. The forex signals accuracy is phenomenal and the investment returns exceeded all my expectations. Professional forex trading platform with excellent risk management. Highly recommend for serious forex investors!",
    verified: true,
    date: "2024-01-12",
  },
  {
    id: 3,
    name: "James Wilson",
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
      "Exceptional forex investment platform! Turned my $2,000 into $50,000 in 9 days with their premium forex signals. The trading accuracy and investment returns are unmatched in the forex market. Professional service, reliable signals, and transparent trading process. Best forex investment decision I've made!",
    verified: true,
    date: "2024-01-10",
  },
  {
    id: 4,
    name: "Li Wei",
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
      "Amazing forex trading results! My $1,500 investment generated $37,500 profit in just 7 days. The forex signals are highly accurate and the investment returns are extraordinary. Professional forex trading platform with excellent customer support and transparent trading process. Highly recommended!",
    verified: true,
    date: "2024-01-08",
  },
  {
    id: 5,
    name: "Sarah Thompson",
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
      "Incredible forex investment returns! Started with $3,000 and earned $75,000 in 11 days. The forex signals accuracy is remarkable and the trading strategies are professional. Best forex investment platform with outstanding customer service and reliable trading signals. Life-changing investment experience!",
    verified: true,
    date: "2024-01-05",
  },
  {
    id: 6,
    name: "Hans Mueller",
    country: "Germany",
    flag: "🇩🇪",
    location: "Berlin, Germany",
    profession: "Engineering Manager",
    investment: "$800",
    profit: "$20,000",
    roi: "2,400%",
    duration: "9 days",
    rating: 5,
    content:
      "Outstanding forex trading platform! My $800 investment yielded $20,000 in 9 days. The forex signals are extremely accurate and the investment returns are exceptional. Professional service with excellent risk management and transparent trading process. Highly recommend this forex investment platform!",
    verified: true,
    date: "2024-01-03",
  },
  {
    id: 7,
    name: "Priya Sharma",
    country: "India",
    flag: "🇮🇳",
    location: "Mumbai, India",
    profession: "Software Developer",
    investment: "$600",
    profit: "$15,000",
    roi: "2,400%",
    duration: "8 days",
    rating: 5,
    content:
      "Excellent forex investment results! Turned $600 into $15,000 in just 8 days with their professional forex signals. The trading accuracy and investment returns are phenomenal. Best forex trading platform with reliable signals and outstanding customer support. Highly recommended for forex investors!",
    verified: true,
    date: "2024-01-01",
  },
  {
    id: 8,
    name: "Jean Dupont",
    country: "France",
    flag: "🇫🇷",
    location: "Paris, France",
    profession: "Marketing Director",
    investment: "$1,200",
    profit: "$30,000",
    roi: "2,400%",
    duration: "10 days",
    rating: 5,
    content:
      "Amazing forex trading platform! My $1,200 investment grew to $30,000 in 10 days. The forex signals are highly professional and the investment returns exceeded expectations. Excellent customer service and transparent trading process. Best forex investment decision with outstanding results!",
    verified: true,
    date: "2023-12-28",
  },
  {
    id: 9,
    name: "Roberto Silva",
    country: "Brazil",
    flag: "🇧🇷",
    location: "São Paulo, Brazil",
    profession: "Business Consultant",
    investment: "$900",
    profit: "$22,500",
    roi: "2,400%",
    duration: "9 days",
    rating: 5,
    content:
      "Incredible forex investment returns! Started with $900 and earned $22,500 in 9 days. The forex signals accuracy is outstanding and the trading strategies are professional. Best forex trading platform with excellent risk management and reliable customer support. Highly recommended!",
    verified: true,
    date: "2023-12-25",
  },
  {
    id: 10,
    name: "Yuki Tanaka",
    country: "Japan",
    flag: "🇯🇵",
    location: "Tokyo, Japan",
    profession: "Financial Advisor",
    investment: "$2,500",
    profit: "$62,500",
    roi: "2,400%",
    duration: "12 days",
    rating: 5,
    content:
      "Outstanding forex trading results! My $2,500 investment generated $62,500 profit in 12 days. The forex signals are extremely accurate and the investment returns are exceptional. Professional forex trading platform with transparent process and excellent customer service. Best forex investment platform!",
    verified: true,
    date: "2023-12-22",
  },
];

const themes = {
  elegant: {
    name: "Elegant Gold",
    background: "bg-gradient-to-br from-yellow-50 to-orange-100",
    cardBg: "bg-white border-yellow-200 shadow-yellow-100",
    accent: "text-yellow-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
  professional: {
    name: "Professional Blue",
    background: "bg-gradient-to-br from-blue-50 to-indigo-100",
    cardBg: "bg-white border-blue-200 shadow-blue-100",
    accent: "text-blue-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
  success: {
    name: "Success Green",
    background: "bg-gradient-to-br from-green-50 to-emerald-100",
    cardBg: "bg-white border-green-200 shadow-green-100",
    accent: "text-green-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
  luxury: {
    name: "Luxury Purple",
    background: "bg-gradient-to-br from-purple-50 to-violet-100",
    cardBg: "bg-white border-purple-200 shadow-purple-100",
    accent: "text-purple-600",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
};

export default function Testimonials() {
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("elegant");
  const [selectedCountry, setSelectedCountry] = useState("all");

  const theme = themes[selectedTheme];

  const countries = Array.from(
    new Set(testimonials.map((t) => t.country)),
  ).sort();

  const filteredTestimonials =
    selectedCountry === "all"
      ? testimonials
      : testimonials.filter((t) => t.country === selectedCountry);

  const totalInvestment = testimonials.reduce(
    (sum, t) => sum + parseInt(t.investment.replace("$", "").replace(",", "")),
    0,
  );
  const totalProfit = testimonials.reduce(
    (sum, t) => sum + parseInt(t.profit.replace("$", "").replace(",", "")),
    0,
  );
  const avgRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${theme.background} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Quote className={`h-8 w-8 ${theme.accent}`} />
              <h1 className={`text-4xl font-bold ${theme.textPrimary}`}>
                Client Testimonials
              </h1>
              <Badge className="bg-green-500 text-white">
                ⭐ {avgRating.toFixed(1)} Rating
              </Badge>
            </div>
            <p
              className={`text-xl ${theme.textSecondary} max-w-4xl mx-auto mb-8`}
            >
              Real success stories from our global community of forex investors.
              See how our professional forex signals have transformed thousands
              of lives with exceptional investment returns and consistent
              trading profits.
            </p>

            {/* Success Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className={`${theme.cardBg} text-center p-4`}>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                  {testimonials.length}+
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Happy Clients
                </div>
              </Card>

              <Card className={`${theme.cardBg} text-center p-4`}>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                  ${totalInvestment.toLocaleString()}
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Total Invested
                </div>
              </Card>

              <Card className={`${theme.cardBg} text-center p-4`}>
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold text-green-600`}>
                  ${totalProfit.toLocaleString()}
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Total Profits
                </div>
              </Card>

              <Card className={`${theme.cardBg} text-center p-4`}>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                  {countries.length}
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Countries
                </div>
              </Card>
            </div>

            {/* Theme and Filter Controls */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-4">
                <span className={`text-sm ${theme.textSecondary}`}>Theme:</span>
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
                <span className={`text-sm ${theme.textSecondary}`}>
                  Country:
                </span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className={`${theme.cardBg} hover:shadow-xl transition-all duration-300 hover:scale-105`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold ${theme.textPrimary}`}>
                            {testimonial.name}
                          </h3>
                          {testimonial.verified && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-sm">
                          <span>{testimonial.flag}</span>
                          <span className={theme.textSecondary}>
                            {testimonial.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <div className={`text-xs ${theme.textSecondary}`}>
                        {new Date(testimonial.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className={`text-sm ${theme.textSecondary}`}>
                        Investment
                      </div>
                      <div className={`font-bold ${theme.textPrimary}`}>
                        {testimonial.investment}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className={`text-sm ${theme.textSecondary}`}>
                        Profit
                      </div>
                      <div className="font-bold text-green-600">
                        {testimonial.profit}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      ROI: {testimonial.roi}
                    </Badge>
                    <Badge variant="outline" className={theme.accent}>
                      {testimonial.duration}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="relative">
                    <Quote
                      className={`absolute -top-2 -left-2 h-8 w-8 ${theme.accent} opacity-20`}
                    />
                    <blockquote
                      className={`text-sm ${theme.textSecondary} italic leading-relaxed pl-6`}
                    >
                      "{testimonial.content}"
                    </blockquote>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className={theme.textSecondary}>
                        {testimonial.profession}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Verified Client
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <Card className={`${theme.cardBg} p-8 max-w-4xl mx-auto`}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Trophy className={`h-8 w-8 ${theme.accent}`} />
                <h2 className={`text-3xl font-bold ${theme.textPrimary}`}>
                  Join Our Success Stories
                </h2>
              </div>
              <p
                className={`text-lg ${theme.textSecondary} mb-6 max-w-2xl mx-auto`}
              >
                Start your forex investment journey today and become our next
                success story. Join thousands of satisfied clients earning
                exceptional returns with our professional forex signals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Start Investing Now
                </Button>
                <Button variant="outline" className="px-8 py-3">
                  <Target className="mr-2 h-5 w-5" />
                  View Investment Plans
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
