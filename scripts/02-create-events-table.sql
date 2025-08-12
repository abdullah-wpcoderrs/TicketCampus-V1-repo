-- Create events table with all required fields
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL, -- 'free', 'paid', 'donation'
  category VARCHAR(100),
  
  -- Date and time
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  
  -- Location
  venue_name VARCHAR(255),
  venue_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  is_online BOOLEAN DEFAULT false,
  meeting_link TEXT,
  
  -- Media
  banner_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  
  -- Capacity and pricing
  max_capacity INTEGER,
  base_price DECIMAL(10,2) DEFAULT 0.00,
  currency VARCHAR(3) DEFAULT 'NGN',
  
  -- Settings
  is_published BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  allow_guest_registration BOOLEAN DEFAULT true,
  custom_fields JSONB DEFAULT '{}',
  
  -- SEO and sharing
  slug VARCHAR(255) UNIQUE,
  meta_description TEXT,
  social_image_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(is_published);
