import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import FrontPageLayout from "@/components/FrontPageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users,
  Eye,
  Lock,
  TrendingUp,
  Target,
  Brain,
  ChevronLeft,
  ChevronRight
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
  content: string;
  publishDate: string;
  featured: boolean;
}

export default function Education() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    // Load ebooks from localStorage
    const storedEbooks = localStorage.getItem('forex_ebooks');
    if (storedEbooks) {
      const parsedEbooks = JSON.parse(storedEbooks);
      // Add sample content for reading
      const ebooksWithContent = parsedEbooks.map((ebook: Ebook) => ({
        ...ebook,
        content: generateSampleContent(ebook.title, ebook.category)
      }));
      setEbooks(ebooksWithContent);
    } else {
      // Default ebooks with content
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
          content: generateSampleContent("Forex Trading for Beginners", "Beginner"),
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
          content: generateSampleContent("Advanced Technical Analysis", "Advanced"),
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
          content: generateSampleContent("Risk Management Strategies", "Risk Management"),
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
          content: generateSampleContent("Psychology of Trading", "Psychology"),
          publishDate: "2024-01-05",
          featured: false
        }
      ];
      setEbooks(defaultEbooks);
      localStorage.setItem('forex_ebooks', JSON.stringify(defaultEbooks));
    }
  }, []);

  const generateSampleContent = (title: string, category: string) => {
    return `
# ${title}

## Chapter 1: Introduction

Welcome to "${title}". This comprehensive guide will take you through the essential concepts of ${category.toLowerCase()} in forex trading.

## Chapter 2: Fundamentals

Understanding the basics is crucial for success in forex trading. In this chapter, we'll cover:

- Market structure and participants
- Currency pairs and their characteristics
- Economic factors affecting exchange rates
- Trading sessions and their unique features

## Chapter 3: Core Concepts

${category === 'Beginner' ? 
  'As a beginner, you need to understand pip values, lot sizes, leverage, and margin requirements. These fundamental concepts form the foundation of all forex trading.' :
  category === 'Advanced' ? 
  'Advanced traders must master complex chart patterns, multi-timeframe analysis, and sophisticated entry/exit strategies.' :
  category === 'Risk Management' ?
  'Proper risk management involves position sizing, stop-loss placement, and portfolio diversification techniques.' :
  'Trading psychology encompasses emotional control, discipline, and the mental frameworks needed for consistent profitability.'
}

## Chapter 4: Practical Application

Theory without practice is incomplete. This chapter provides:

- Real-world examples and case studies
- Step-by-step implementation guides
- Common mistakes and how to avoid them
- Best practices from professional traders

## Chapter 5: Advanced Strategies

Building on the fundamentals, we explore:

- Advanced trading techniques
- Risk-reward optimization
- Market analysis methods
- Professional trading approaches

## Conclusion

Mastering ${category.toLowerCase()} in forex trading requires dedication, practice, and continuous learning. This guide provides the foundation you need to succeed.

---

**Note**: This is a preview of the full content. To access the complete ebook with detailed explanations, charts, and examples, please make an investment through our platform.
    `.trim();
  };

  const handleReadEbook = (ebook: Ebook) => {
    setSelectedEbook(ebook);
    setCurrentPage(1);
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
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent">
                Forex Education Library
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              📚 Read our comprehensive forex trading guides online. Download access unlocked after investment.
            </p>
          </div>

          {/* Featured Books */}
          {featuredEbooks.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Star className="h-6 w-6 text-gold-500 mr-2" />
                Featured Resources
              </h2>
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
                              {ebook.downloadCount.toLocaleString()} readers
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-gold-500 mr-1 fill-current" />
                            <span>{ebook.rating}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleReadEbook(ebook)}
                          className="w-full bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Read Online
                        </Button>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-8">All Educational Resources</h2>
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
                        {ebook.downloadCount.toLocaleString()} readers
                      </div>
                      
                      <Button 
                        onClick={() => handleReadEbook(ebook)}
                        variant="outline"
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Read Online
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Download Notice */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-2 border-forex-200">
              <CardContent className="p-8">
                <Lock className="h-16 w-16 text-forex-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Want to Download?</h3>
                <p className="text-gray-600 mb-6">
                  📥 Download access is unlocked after making an investment. Invested users can download all ebooks from their dashboard.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600">
                    View Investment Plans
                  </Button>
                  <a 
                    href="https://t.me/forex_traders_signalss" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      Join Telegram
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ebook Reader Modal */}
        {selectedEbook && (
          <Dialog open={!!selectedEbook} onOpenChange={() => setSelectedEbook(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{selectedEbook.title}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Reading Progress</span>
                    <span className="text-sm text-gray-600">Page {currentPage} of {selectedEbook.pages}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-forex-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(currentPage / selectedEbook.pages) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                    {selectedEbook.content}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {selectedEbook.pages}
                  </span>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(selectedEbook.pages, currentPage + 1))}
                    disabled={currentPage === selectedEbook.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-yellow-800 mb-2">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Full Access Available</span>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    This is a preview. Invest to unlock the complete ebook with detailed charts, examples, and downloadable PDF access in your dashboard.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </FrontPageLayout>
  );
}
