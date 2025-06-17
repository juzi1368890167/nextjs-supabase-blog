-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Technology', 'technology', 'Posts about technology and programming'),
  ('Design', 'design', 'Posts about design and user experience'),
  ('Business', 'business', 'Posts about business and entrepreneurship'),
  ('Lifestyle', 'lifestyle', 'Posts about lifestyle and personal development')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample posts (you'll need to replace author_id with actual user ID after authentication)
-- This is just for demonstration - in practice, posts will be created through the UI
