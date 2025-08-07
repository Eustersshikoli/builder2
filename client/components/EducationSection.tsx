import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Download,
  Star,
  Clock,
  Users,
  TrendingUp,
  Target,
  Brain,
  Eye
} from "lucide-react";

interface Ebook {
  id: string;
  title: string;
  description: string;
  author: string;
  pages: number;
  downloadCount: number;
  rating: number;
  category: string;
  coverImage: string;
  fileUrl: string;
  publishDate: string;
  featured: boolean;
}

export default function EducationSection() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  useEffect(() => {
    // Load ebooks from localStorage (in a real app, this would be from an API)
    const storedEbooks = localStorage.getItem('forex_ebooks');
    if (storedEbooks) {
      setEbooks(JSON.parse(storedEbooks));
    } else {
      // Default ebooks
      const defaultEbooks: Ebook[] = [
        {
          id: "1",
          title: "Forex Trading for Beginners",
          description: "Complete guide to start your forex trading journey. Learn the fundamentals, risk management, and basic strategies.",
          author: "Free Forex Signals Team",
          pages: 85,
          downloadCount: 1247,
          rating: 4.8,
          category: "Beginner",
          coverImage: "https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Forex+Basics",
          fileUrl: "/ebooks/forex-beginners.pdf",
          publishDate: "2024-01-15",
          featured: true
        },
        {
          id: "2", 
          title: "Advanced Technical Analysis",
          description: "Master advanced charting techniques, indicators, and pattern recognition for professional trading.",
          author: "Pro Trading Academy",
          pages: 156,
          downloadCount: 892,
          rating: 4.9,
          category: "Advanced",
          coverImage: "https://via.placeholder.com/300x400/10B981/FFFFFF?text=Technical+Analysis",
          fileUrl: "/ebooks/technical-analysis.pdf",
          publishDate: "2024-01-10",
          featured: true
        },
        {
          id: "3",
          title: "Risk Management Strategies",
          description: "Essential risk management techniques every forex trader must know to protect their capital.",
          author: "Risk Management Pro",
          pages: 67,
          downloadCount: 1156,
          rating: 4.7,
          category: "Risk Management",
          coverImage: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Risk+Management",
          fileUrl: "/ebooks/risk-management.pdf",
          publishDate: "2024-01-08",
          featured: false
        },
        {
          id: "4",
          title: "Psychology of Trading",
          description: "Understand the mental aspects of trading and develop the psychological edge needed for success.",
          author: "Trading Psychology Expert",
          pages: 124,
          downloadCount: 743,
          rating: 4.6,
          category: "Psychology",
          coverImage: "https://via.placeholder.com/300x400/8B5CF6/FFFFFF?text=Trading+Psychology",
          fileUrl: "/ebooks/trading-psychology.pdf",
          publishDate: "2024-01-05",
          featured: false
        }
      ];
      setEbooks(defaultEbooks);
      localStorage.setItem('forex_ebooks', JSON.stringify(defaultEbooks));
    }
  }, []);

  const handleDownload = (ebook: Ebook) => {
    // In a real app, this would track downloads and serve the actual file
    const updatedEbooks = ebooks.map(e => 
      e.id === ebook.id ? { ...e, downloadCount: e.downloadCount + 1 } : e
    );
    setEbooks(updatedEbooks);
    localStorage.setItem('forex_ebooks', JSON.stringify(updatedEbooks));
    
    // Simulate download
    const link = document.createElement('a');
    link.href = ebook.fileUrl;
    link.download = `${ebook.title}.pdf`;
    link.click();
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beginner': return <BookOpen className="h-4 w-4" />;
      case 'advanced': return <TrendingUp className="h-4 w-4" />;
      case 'risk management': return <Target className="h-4 w-4" />;
      case 'psychology': return <Brain className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beginner': return 'bg-blue-500';
      case 'advanced': return 'bg-success-500';
      case 'risk management': return 'bg-gold-500';
      case 'psychology': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const featuredEbooks = ebooks.filter(e => e.featured);
  const otherEbooks = ebooks.filter(e => !e.featured);

  return (
    <section id="education" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
              Forex Education Center
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            📚 Free educational resources to master forex trading. Download our comprehensive guides and level up your trading skills.
          </p>
        </div>

        {/* Featured Books */}
        {featuredEbooks.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Star className="h-6 w-6 text-gold-500 mr-2" />
              Featured Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredEbooks.map((ebook) => (
                <Card key={ebook.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gold-200">
                  <div className="flex">
                    <div className="w-32 h-48 bg-gradient-to-br from-forex-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {ebook.title.split(' ').map(word => word[0]).join('').substring(0, 3)}
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{ebook.title}</h4>
                          <p className="text-sm text-gray-600">by {ebook.author}</p>
                        </div>
                        <Badge className={`${getCategoryColor(ebook.category)} text-white`}>
                          {getCategoryIcon(ebook.category)}
                          <span className="ml-1">{ebook.category}</span>
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{ebook.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {ebook.pages} pages
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {ebook.downloadCount.toLocaleString()} downloads
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-gold-500 mr-1 fill-current" />
                          <span>{ebook.rating}</span>
                        </div>
                      </div>
                      
                      <a href="/education">
                    <Button className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600">
                      <Eye className="h-4 w-4 mr-2" />
                      Read Online
                    </Button>
                  </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Books Grid */}
        {otherEbooks.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">All Educational Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherEbooks.map((ebook) => (
                <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="w-full h-32 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">
                      {ebook.title.split(' ').map(word => word[0]).join('').substring(0, 2)}
                    </div>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg leading-tight">{ebook.title}</CardTitle>
                      <Badge variant="outline" className="ml-2">
                        {getCategoryIcon(ebook.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">by {ebook.author}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 text-sm line-clamp-2">{ebook.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {ebook.pages} pages
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 text-gold-500 mr-1 fill-current" />
                        {ebook.rating}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-2">
                      {ebook.downloadCount.toLocaleString()} downloads
                    </div>
                    
                    <a href="/education">
                    <Button
                      variant="outline"
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Read Online
                    </Button>
                  </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-2 border-forex-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Want More Resources?</h3>
              <p className="text-gray-600 mb-6">
                Join our Telegram channel for exclusive trading guides, market analysis, and educational content.
              </p>
              <a 
                href="https://t.me/forex_traders_signalss" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Join Education Channel
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
