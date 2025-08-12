-- Fix infinite recursion in users table RLS policy
-- The issue is that auth.uid() = id creates recursion when fetching user profiles

-- Drop the problematic users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create non-recursive policies for users table
-- Allow authenticated users to read user profiles (needed for event organizers, collaborators, etc.)
CREATE POLICY "Authenticated users can view profiles" ON users
  FOR SELECT TO authenticated USING (true);

-- Users can only update their own profile using a simpler check
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated USING (auth.uid()::text = id::text);

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated WITH CHECK (auth.uid()::text = id::text);
