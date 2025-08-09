import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Star, 
  Quote, 
  MapPin, 
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  TrendingUp
} from "lucide-react";

interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  content: string;
  rating: number;
  avatar_url: string;
  location: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
}

interface TestimonialSectionProps {
  limit?: number;
  showHeader?: boolean;
  featured?: boolean;
  showAddForm?: boolean;
}

export default function TestimonialSection({ 
  limit = 6, 
  showHeader = true, 
  featured = false,
  showAddForm = false 
}: TestimonialSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
    location: "",
  });

  useEffect(() => {
    loadTestimonials();
  }, [featured]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (featured) {
        query = query.eq('is_featured', true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTestimonials(data?.map(item => ({
        ...item,
        user_id: item.id,
        avatar_url: '',
        location: item.country || ''
      })) || []);
    } catch (error) {
      console.error('Error loading testimonials:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a testimonial",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          name: formData.name,
          content: formData.content,
          rating: formData.rating,
          location: formData.location,
          is_approved: false, // Requires admin approval
        });

      if (error) throw error;

      toast({
        title: "Testimonial Submitted!",
        description: "Thank you! Your testimonial is pending approval and will be visible soon.",
      });

      // Reset form
      setFormData({
        name: "",
        content: "",
        rating: 5,
        location: "",
      });
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit testimonial",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-forex-600" />
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-forex-600">Traders</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real success stories from our community of profitable forex traders
            </p>
          </div>
        )}

        {/* Add Testimonial Form */}
        {showAddForm && user && (
          <div className="mb-12">
            {!showForm ? (
              <div className="text-center">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-forex-600 hover:bg-forex-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Success Story
                </Button>
              </div>
            ) : (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Share Your Trading Success</h3>
                  <form onSubmit={submitTestimonial} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., New York, USA"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              star <= formData.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300 hover:text-yellow-300'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Your Testimonial</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Tell us about your experience with our forex signals and how they've helped your trading..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" disabled={submitting} className="flex-1 bg-forex-600 hover:bg-forex-700">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Submit Testimonial
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Testimonials Display */}
        {testimonials.length > 0 ? (
          <>
            {/* Featured Testimonial Carousel */}
            {featured && testimonials.length > 0 && (
              <div className="relative max-w-4xl mx-auto mb-12">
                <Card className="bg-gradient-to-r from-forex-500 to-blue-500 text-white overflow-hidden">
                  <CardContent className="p-8 md:p-12 text-center">
                    <Quote className="h-12 w-12 mx-auto mb-6 opacity-50" />
                    <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                      "{testimonials[currentIndex]?.content}"
                    </blockquote>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {renderStars(testimonials[currentIndex]?.rating || 5)}
                    </div>
                    <div className="text-lg font-semibold">
                      {testimonials[currentIndex]?.name}
                    </div>
                    {testimonials[currentIndex]?.location && (
                      <div className="flex items-center justify-center space-x-1 text-sm opacity-90">
                        <MapPin className="h-3 w-3" />
                        <span>{testimonials[currentIndex]?.location}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Navigation */}
                {testimonials.length > 1 && (
                  <div className="flex justify-center space-x-4 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevTestimonial}
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextTestimonial}
                      className="rounded-full w-10 h-10 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Grid Layout */}
            {!featured && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        {renderStars(testimonial.rating)}
                      </div>
                      
                      <blockquote className="text-gray-700 mb-4 italic leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>
                      
                      <div className="border-t pt-4">
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        {testimonial.location && (
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            <span>{testimonial.location}</span>
                          </div>
                        )}
                        {testimonial.is_featured && (
                          <Badge className="mt-2 bg-gold-100 text-gold-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Success Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-forex-600 mb-2">95%</div>
                <div className="text-gray-600">Satisfied Traders</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">$2.5M+</div>
                <div className="text-gray-600">Total Profits Generated</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Testimonials Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share your trading success story!</p>
            {showAddForm && user && (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-forex-600 hover:bg-forex-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your Testimonial
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Floating Testimonial Widget for Landing Page
export function FloatingTestimonial() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadFeaturedTestimonials();
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const loadFeaturedTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .limit(3);

      if (error) throw error;
      setTestimonials(data?.map(item => ({
        ...item,
        user_id: item.id,
        avatar_url: '',
        location: item.country || ''
      })) || []);
    } catch (error) {
      console.error('Error loading featured testimonials:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[currentIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <Card className="bg-white shadow-xl border-l-4 border-l-forex-500">
        <CardContent className="p-4">
          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < current.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-3">
            "{current.content}"
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs">{current.name}</div>
              {current.location && (
                <div className="text-xs text-gray-500">{current.location}</div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">Verified</span>
            </div>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center space-x-1 mt-3">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentIndex ? 'bg-forex-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
