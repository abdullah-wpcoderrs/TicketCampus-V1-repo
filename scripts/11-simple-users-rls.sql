-- Fix infinite recursion in users table RLS policy
-- Drop existing problematic policies and create simple ones

-- Drop existing users table policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create simple, non-recursive policies for users table
-- Allow authenticated users to read any user profile (needed for event organizers, collaborators, etc.)
CREATE POLICY "Authenticated users can view profiles" ON users
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow users to insert their own profile during signup
CREATE POLICY "Users can create their own profile" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = id);

-- Allow users to update their own profile only
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

-- Allow service role (for admin operations) full access
CREATE POLICY "Service role full access" ON users
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
