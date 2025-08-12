-- Drop existing users table policies to avoid conflicts
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create simple, non-recursive policies for users table
CREATE POLICY "users_select_policy" ON users
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "users_insert_policy" ON users
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "users_update_policy" ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

CREATE POLICY "users_delete_policy" ON users
    FOR DELETE
    TO authenticated
    USING (auth.uid()::text = id::text);
