-- Create missing tables for full functionality

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[],
    featured_image TEXT,
    is_published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Create news_posts table
CREATE TABLE public.news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID NOT NULL,
    category TEXT NOT NULL,
    featured_image TEXT,
    is_published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on news_posts
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for news_posts
CREATE POLICY "Anyone can view published news posts"
ON public.news_posts
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage all news posts"
ON public.news_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Create ebooks table
CREATE TABLE public.ebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    author TEXT,
    price NUMERIC DEFAULT 0,
    file_url TEXT,
    cover_image TEXT,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ebooks
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Create policies for ebooks
CREATE POLICY "Anyone can view active ebooks"
ON public.ebooks
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage all ebooks"
ON public.ebooks
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

-- Create function to increment post views
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID, table_name TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF table_name = 'blog_posts' THEN
        UPDATE public.blog_posts SET views = views + 1 WHERE id = post_id;
    ELSIF table_name = 'news_posts' THEN
        UPDATE public.news_posts SET views = views + 1 WHERE id = post_id;
    END IF;
END;
$$;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_posts_updated_at
    BEFORE UPDATE ON public.news_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ebooks_updated_at
    BEFORE UPDATE ON public.ebooks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();