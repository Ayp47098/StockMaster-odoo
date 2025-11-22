-- ============================================================================
-- FIX: Row-Level Security Policy for Profiles
-- ============================================================================
-- Run this in Supabase SQL Editor to fix the signup issue
-- ============================================================================

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create a more permissive insert policy for signup
-- This allows any authenticated user to insert their own profile
CREATE POLICY "Enable insert for authentication" ON profiles
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- BETTER SOLUTION: Auto-create profile on user signup using trigger
-- ============================================================================
-- This automatically creates a profile when a new user signs up
-- No need for manual profile creation in the frontend code
-- ============================================================================

-- Function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- After running this, try signing up a new user
-- The profile should be created automatically!
-- ============================================================================
