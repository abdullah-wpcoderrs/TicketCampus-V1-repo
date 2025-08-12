-- Create functions to handle public access scenarios

-- Function to check if an event is published and accessible
CREATE OR REPLACE FUNCTION is_event_public(event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM events 
        WHERE id = event_id 
        AND status = 'published'
        AND (privacy_setting = 'public' OR privacy_setting IS NULL)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns or collaborates on an event
CREATE OR REPLACE FUNCTION user_can_access_event(event_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM events 
        WHERE id = event_id 
        AND created_by = user_id
    ) OR EXISTS (
        SELECT 1 FROM event_collaborators 
        WHERE event_collaborators.event_id = event_id 
        AND event_collaborators.user_id = user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update some policies to use these functions for better performance
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
CREATE POLICY "Anyone can view published events" ON events
    FOR SELECT USING (is_event_public(id));
