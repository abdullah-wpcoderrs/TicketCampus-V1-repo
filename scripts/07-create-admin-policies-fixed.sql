-- Admin policies for users with is_admin = true

-- Admin can view all users
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can update any user
CREATE POLICY "Admins can update any user" ON users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can view all events
CREATE POLICY "Admins can view all events" ON events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can update any event
CREATE POLICY "Admins can update any event" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can delete any event
CREATE POLICY "Admins can delete any event" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can view all tickets
CREATE POLICY "Admins can view all tickets" ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can view all analytics
CREATE POLICY "Admins can view all analytics" ON event_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );

-- Admin can view all wallet transactions
CREATE POLICY "Admins can view all wallet transactions" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user 
            WHERE admin_user.id = auth.uid() 
            AND admin_user.is_admin = true
        )
    );
