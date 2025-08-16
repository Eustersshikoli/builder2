-- Create a secure view for public testimonials that excludes email addresses
CREATE OR REPLACE VIEW public.public_testimonials AS
SELECT 
  id,
  name,
  profession,
  country,
  content,
  rating,
  is_featured,
  created_at,
  updated_at
FROM public.testimonials
WHERE is_approved = true;

-- Create RLS policy for the view
ALTER VIEW public.public_testimonials OWNER TO postgres;

-- Grant SELECT access to the view for anonymous users
GRANT SELECT ON public.public_testimonials TO anon;
GRANT SELECT ON public.public_testimonials TO authenticated;

-- Update the existing RLS policy to be more restrictive for direct table access
-- Drop the existing public policy
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON public.testimonials;

-- Create new policies - only allow system/admin access to full table including emails
CREATE POLICY "System can manage testimonials" 
ON public.testimonials 
FOR ALL
USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

CREATE POLICY "Admins can view all testimonials" 
ON public.testimonials 
FOR SELECT
USING (
  has_role(auth.uid(), 'super_admin'::app_role) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated users to insert testimonials (for submission)
CREATE POLICY "Authenticated users can submit testimonials" 
ON public.testimonials 
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);