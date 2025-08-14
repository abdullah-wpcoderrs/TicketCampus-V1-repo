-- Add missing fields to events table for new functionality
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS start_time time,
ADD COLUMN IF NOT EXISTS end_time time,
ADD COLUMN IF NOT EXISTS enable_promotions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_channels text[],
ADD COLUMN IF NOT EXISTS enable_getdp boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS getdp_template jsonb,
ADD COLUMN IF NOT EXISTS whatsapp_messages jsonb,
ADD COLUMN IF NOT EXISTS email_messages jsonb,
ADD COLUMN IF NOT EXISTS auto_send_confirmation boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS auto_send_reminders boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_timing varchar(10) DEFAULT '24h';

-- Add custom field data to tickets table for attendee responses
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS custom_field_responses jsonb;

-- Create attendee_registrations table for public registrations
CREATE TABLE IF NOT EXISTS attendee_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  attendee_name varchar(255) NOT NULL,
  attendee_email varchar(255) NOT NULL,
  attendee_phone varchar(20),
  custom_field_responses jsonb,
  registration_status varchar(20) DEFAULT 'pending',
  ticket_type_id uuid REFERENCES ticket_types(id),
  payment_reference varchar(255),
  payment_status varchar(20) DEFAULT 'pending',
  amount_paid numeric(10,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for attendee_registrations
ALTER TABLE attendee_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Event organizers can view their event registrations" ON attendee_registrations
  FOR SELECT USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create registrations" ON attendee_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Event organizers can update their event registrations" ON attendee_registrations
  FOR UPDATE USING (
    event_id IN (
      SELECT id FROM events WHERE user_id = auth.uid()
    )
  );
