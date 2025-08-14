-- Messaging and Payment System Schema
-- Add missing columns and tables for new functionality

-- Remove columns that already exist in events table and fix RLS policies to use user_id instead of organizer_id

-- Add only missing columns to events table (most already exist based on schema)
ALTER TABLE events ADD COLUMN IF NOT EXISTS whatsapp_template TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS email_template TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS registration_settings JSONB DEFAULT '{}';

-- Create message_templates table
CREATE TABLE IF NOT EXISTS message_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('whatsapp', 'email')),
    template_name VARCHAR(100) NOT NULL,
    subject VARCHAR(200), -- For email templates
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Dynamic variables like {{name}}, {{event_title}}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_logs table
CREATE TABLE IF NOT EXISTS message_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    attendee_id UUID REFERENCES attendee_registrations(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('whatsapp', 'email')),
    template_id UUID REFERENCES message_templates(id),
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    external_id VARCHAR(100), -- BotSailor message ID or email provider ID
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    attendee_id UUID REFERENCES attendee_registrations(id) ON DELETE CASCADE,
    reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
    payment_method VARCHAR(50),
    gateway_response JSONB,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create webhook_logs table for tracking external webhook calls
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(50) NOT NULL, -- 'paystack', 'botsailor', etc.
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    signature VARCHAR(500),
    status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
    processed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_message_templates_event_id ON message_templates(event_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_event_id ON message_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_message_logs_status ON message_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_reference ON payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_status ON webhook_logs(status);

-- Enable RLS on new tables
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Fix RLS policies to use user_id instead of organizer_id
-- Create RLS policies
-- Message templates - only event owners can manage
CREATE POLICY "Event owners can manage message templates" ON message_templates
    FOR ALL USING (
        event_id IN (
            SELECT id FROM events WHERE user_id = auth.uid()
        )
    );

-- Message logs - only event owners can view
CREATE POLICY "Event owners can view message logs" ON message_logs
    FOR SELECT USING (
        event_id IN (
            SELECT id FROM events WHERE user_id = auth.uid()
        )
    );

-- Payment transactions - only event owners can view
CREATE POLICY "Event owners can view payment transactions" ON payment_transactions
    FOR SELECT USING (
        event_id IN (
            SELECT id FROM events WHERE user_id = auth.uid()
        )
    );

-- Notifications - users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_message_templates_updated_at ON message_templates;
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
