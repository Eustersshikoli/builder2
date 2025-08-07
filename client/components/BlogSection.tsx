import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { 
  Calendar, 
  User, 
  ArrowRight, 
  Eye, 
  MessageCircle,
  TrendingUp,
  Loader2
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string;
  category: string;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_id: string;
  user_profiles?: {
    full_name: string;
  };
}

interface BlogSectionProps {
  limit?: number;
  showHeader?: boolean;
  featured?: boolean;
}

export default function BlogSection({ limit = 6, showHeader = true, featured = false }: BlogSectionProps) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          user_profiles!blog_posts_author_id_fkey(full_name)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading blog posts:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('category')
        .eq('is_published', true);

      if (error) throw error;
      
      const uniqueCategories = [...new Set(data?.map(post => post.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  const incrementViewCount = async (postId: string) => {
    try {
      await supabase.rpc('increment_post_views', { post_id: postId });
    } catch (error) {
      console.error('Error incrementing view count:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'market-analysis': 'bg-blue-100 text-blue-800',
      'trading-tips': 'bg-green-100 text-green-800',
      'news': 'bg-red-100 text-red-800',
      'education': 'bg-purple-100 text-purple-800',
      'strategy': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-forex-600" />
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {showHeader && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest from Our <span className="text-forex-600">Blog</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest forex market insights, trading strategies, and educational content
            </p>
          </div>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className={`cursor-pointer hover:opacity-80 ${getCategoryColor(category)}`}
              >
                {category.replace('-', ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Featured Image */}
              {post.featured_image_url && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.featured_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category?.replace('-', ' ').toUpperCase()}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 space-x-2">
                    <Eye className="h-3 w-3" />
                    <span>{post.view_count}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight group-hover:text-forex-600 transition-colors">
                  <Link 
                    to={`/blog/${post.slug}`}
                    onClick={() => incrementViewCount(post.id)}
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt || truncateContent(post.content)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{post.user_profiles?.full_name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/blog/${post.slug}`}
                    onClick={() => incrementViewCount(post.id)}
                  >
                    <Button variant="ghost" size="sm" className="text-forex-600 hover:text-forex-700 p-0">
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        {showHeader && posts.length >= limit && (
          <div className="text-center mt-12">
            <Link to="/blog">
              <Button className="bg-forex-600 hover:bg-forex-700 text-white px-8 py-3">
                View All Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-500">Check back soon for the latest forex insights and trading tips.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Individual Blog Post Component
export function BlogPost({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      // Load main post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select(`
          *,
          user_profiles!blog_posts_author_id_fkey(full_name)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Increment view count
      await supabase.rpc('increment_post_views', { post_id: postData.id });

      // Load related posts
      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', postData.category)
        .eq('is_published', true)
        .neq('id', postData.id)
        .limit(3);

      setRelatedPosts(relatedData || []);
    } catch (error) {
      console.error('Error loading blog post:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: "Blog post not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-forex-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <Link to="/blog">
          <Button className="bg-forex-600 hover:bg-forex-700">
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Badge className={`mb-4`}>
            {post.category?.replace('-', ' ').toUpperCase()}
          </Badge>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center space-x-6 text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{post.user_profiles?.full_name || 'Admin'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>{post.view_count} views</span>
          </div>
        </div>

        {post.featured_image_url && (
          <div className="aspect-video mb-8 overflow-hidden rounded-lg">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* Post Content */}
      <div className="prose prose-lg max-w-none mb-12">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t pt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 leading-tight">
                    <Link 
                      to={`/blog/${relatedPost.slug}`}
                      className="hover:text-forex-600 transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                  </p>
                  <div className="text-xs text-gray-500">
                    {new Date(relatedPost.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
