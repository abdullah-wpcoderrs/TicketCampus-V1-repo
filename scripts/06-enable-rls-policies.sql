-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Events table policies
-- Anyone can view published events
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (status = 'published');

-- Event creators can manage their own events
CREATE POLICY "Event creators can manage own events" ON events
    FOR ALL USING (auth.uid() = created_by);

-- Event creators can insert events
CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Ticket types policies
-- Anyone can view ticket types for published events
CREATE POLICY "Anyone can view ticket types for published events" ON ticket_types
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = ticket_types.event_id 
            AND events.status = 'published'
        )
    );

-- Event creators can manage ticket types for their events
CREATE POLICY "Event creators can manage ticket types" ON ticket_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = ticket_types.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Tickets table policies
-- Users can view their own tickets
CREATE POLICY "Users can view own tickets" ON tickets
    FOR SELECT USING (auth.uid() = user_id);

-- Event creators can view tickets for their events
CREATE POLICY "Event creators can view event tickets" ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = tickets.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- System can create tickets (for payment processing)
CREATE POLICY "System can create tickets" ON tickets
    FOR INSERT WITH CHECK (true);

-- Event analytics policies
-- Only event creators can view analytics for their events
CREATE POLICY "Event creators can view analytics" ON event_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_analytics.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- System can insert analytics data
CREATE POLICY "System can insert analytics" ON event_analytics
    FOR INSERT WITH CHECK (true);

-- Event collaborators policies
-- Event creators can manage collaborators
CREATE POLICY "Event creators can manage collaborators" ON event_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_collaborators.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Collaborators can view their collaborations
CREATE POLICY "Users can view own collaborations" ON event_collaborators
    FOR SELECT USING (auth.uid() = user_id);

-- Event updates policies
-- Anyone can view updates for published events
CREATE POLICY "Anyone can view updates for published events" ON event_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_updates.event_id 
            AND events.status = 'published'
        )
    );

-- Event creators and collaborators can manage updates
CREATE POLICY "Event creators can manage updates" ON event_updates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_updates.event_id 
            AND events.created_by = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM event_collaborators 
            WHERE event_collaborators.event_id = event_updates.event_id 
            AND event_collaborators.user_id = auth.uid()
            AND event_collaborators.role IN ('admin', 'editor')
        )
    );

-- Email templates policies
-- Event creators can manage their email templates
CREATE POLICY "Event creators can manage email templates" ON email_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = email_templates.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Wallet transactions policies
-- Users can view their own wallet transactions
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- System can create wallet transactions
CREATE POLICY "System can create wallet transactions" ON wallet_transactions
    FOR INSERT WITH CHECK (true);

-- Event creators can view transactions related to their events
CREATE POLICY "Event creators can view event transactions" ON wallet_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = wallet_transactions.event_id 
            AND events.created_by = auth.uid()
        )
    );
