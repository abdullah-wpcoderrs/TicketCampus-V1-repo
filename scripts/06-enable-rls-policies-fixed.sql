-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can create a user profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Events table policies
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can view their own events" ON events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" ON events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" ON events
    FOR DELETE USING (auth.uid() = user_id);

-- Tickets table policies
CREATE POLICY "Users can view their own tickets" ON tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Event owners can view tickets for their events" ON tickets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = tickets.event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create tickets" ON tickets
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own tickets" ON tickets
    FOR UPDATE USING (auth.uid() = user_id);

-- Ticket types table policies
CREATE POLICY "Anyone can view ticket types for published events" ON ticket_types
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = ticket_types.event_id 
            AND events.is_published = true
        )
    );

CREATE POLICY "Event owners can manage their ticket types" ON ticket_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = ticket_types.event_id 
            AND events.user_id = auth.uid()
        )
    );

-- Event analytics table policies
CREATE POLICY "Event owners can view analytics for their events" ON event_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_analytics.event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can create analytics data" ON event_analytics
    FOR INSERT WITH CHECK (true);

-- Event collaborators table policies
CREATE POLICY "Event owners can manage collaborators" ON event_collaborators
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_collaborators.event_id 
            AND events.user_id = auth.uid()
        )
    );

CREATE POLICY "Collaborators can view their collaborations" ON event_collaborators
    FOR SELECT USING (auth.uid() = user_id);

-- Event updates table policies
CREATE POLICY "Anyone can view published event updates" ON event_updates
    FOR SELECT USING (
        is_published = true AND
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_updates.event_id 
            AND events.is_published = true
        )
    );

CREATE POLICY "Event owners can manage their event updates" ON event_updates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events 
            WHERE events.id = event_updates.event_id 
            AND events.user_id = auth.uid()
        )
    );

-- Wallet transactions table policies
CREATE POLICY "Users can view their own wallet transactions" ON wallet_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create wallet transactions" ON wallet_transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Email templates table policies
CREATE POLICY "Users can view their own email templates" ON email_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own email templates" ON email_templates
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view default email templates" ON email_templates
    FOR SELECT USING (is_default = true);
