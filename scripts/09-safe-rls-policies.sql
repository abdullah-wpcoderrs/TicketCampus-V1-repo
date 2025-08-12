-- Safe RLS Policy Setup - Handles existing policies gracefully
-- This script will drop existing policies and recreate them

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Event creators can manage their events" ON events;
DROP POLICY IF EXISTS "Users can view tickets for their events or purchases" ON tickets;
DROP POLICY IF EXISTS "Users can create tickets for their events" ON tickets;
DROP POLICY IF EXISTS "Users can view their own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Users can view analytics for their events" ON event_analytics;
DROP POLICY IF EXISTS "Users can create analytics for their events" ON event_analytics;
DROP POLICY IF EXISTS "Event creators can manage collaborators" ON event_collaborators;
DROP POLICY IF EXISTS "Collaborators can view events they collaborate on" ON event_collaborators;
DROP POLICY IF EXISTS "Users can view ticket types for published events" ON ticket_types;
DROP POLICY IF EXISTS "Event creators can manage ticket types" ON ticket_types;
DROP POLICY IF EXISTS "Users can view updates for published events" ON event_updates;
DROP POLICY IF EXISTS "Event creators can manage updates" ON event_updates;
DROP POLICY IF EXISTS "Anyone can view email templates" ON email_templates;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Events table policies
CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Event creators can manage their events" ON events
  FOR ALL USING (auth.uid() = user_id);

-- Tickets table policies
CREATE POLICY "Users can view tickets for their events or purchases" ON tickets
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = tickets.event_id
    ) OR auth.uid() = user_id
  );

CREATE POLICY "Users can create tickets for their events" ON tickets
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = tickets.event_id
    ) OR auth.uid() = user_id
  );

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON wallet_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Event analytics policies
CREATE POLICY "Users can view analytics for their events" ON event_analytics
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = event_analytics.event_id
    )
  );

CREATE POLICY "Users can create analytics for their events" ON event_analytics
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = event_analytics.event_id
    )
  );

-- Event collaborators policies
CREATE POLICY "Event creators can manage collaborators" ON event_collaborators
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = event_collaborators.event_id
    )
  );

CREATE POLICY "Collaborators can view events they collaborate on" ON event_collaborators
  FOR SELECT USING (auth.uid() = user_id);

-- Ticket types policies
CREATE POLICY "Users can view ticket types for published events" ON ticket_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = ticket_types.event_id 
      AND events.is_published = true
    )
  );

CREATE POLICY "Event creators can manage ticket types" ON ticket_types
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = ticket_types.event_id
    )
  );

-- Event updates policies
CREATE POLICY "Users can view updates for published events" ON event_updates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_updates.event_id 
      AND events.is_published = true
    )
  );

CREATE POLICY "Event creators can manage updates" ON event_updates
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM events WHERE events.id = event_updates.event_id
    )
  );

-- Email templates policies (public read access)
CREATE POLICY "Anyone can view email templates" ON email_templates
  FOR SELECT USING (true);
