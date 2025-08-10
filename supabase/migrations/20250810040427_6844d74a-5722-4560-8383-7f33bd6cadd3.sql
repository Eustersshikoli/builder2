-- Add missing tables that are referenced in the admin panel

-- Create ebooks table
CREATE TABLE IF NOT EXISTS public.ebooks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  author text,
  category text,
  price numeric DEFAULT 0,
  file_url text,
  cover_image text,
  is_active boolean DEFAULT true,
  download_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create blog_posts table  
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  category text NOT NULL,
  author_id uuid NOT NULL,
  featured_image text,
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create news_posts table
CREATE TABLE IF NOT EXISTS public.news_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text NOT NULL,
  author_id uuid NOT NULL,
  featured_image text,
  is_published boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for ebooks
CREATE POLICY "Anyone can view active ebooks" ON public.ebooks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage ebooks" ON public.ebooks
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for blog_posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can view all blog posts" ON public.blog_posts
  FOR SELECT USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE 
  USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for news_posts
CREATE POLICY "Anyone can view published news posts" ON public.news_posts
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can manage news posts" ON public.news_posts
  FOR ALL USING (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ebooks_updated_at BEFORE UPDATE ON public.ebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_posts_updated_at BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();