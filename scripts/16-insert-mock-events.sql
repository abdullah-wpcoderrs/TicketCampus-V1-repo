-- Insert mock events with comprehensive data matching the event creation form
-- All events will be owned by john@mail.com (user_id: e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6)

-- Insert Events
INSERT INTO events (
  id, user_id, title, description, slug, start_date, end_date, start_time, end_time,
  venue_name, venue_address, city, state, country, is_online, meeting_link,
  banner_image_url, max_capacity, event_type, category, is_published,
  enable_promotions, promotion_channels, enable_getdp, getdp_template,
  whatsapp_messages, email_messages, auto_send_confirmation, auto_send_reminders,
  reminder_timing, custom_fields, created_at, updated_at
) VALUES
-- Fixed field lengths to match database constraints
-- Tech Conference 2024
(
  gen_random_uuid(),
  'e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6',
  'Tech Conference 2024: AI & Innovation Summit',
  'Join industry leaders and innovators for a comprehensive exploration of artificial intelligence, blockchain technology, and the future of web development. This premier tech conference features keynote speakers, hands-on workshops, and networking opportunities.',
  'tech-conference-2024-ai-innovation-summit',
  '2024-03-15 09:00:00+00',
  '2024-03-15 17:00:00+00',
  '09:00:00',
  '17:00:00',
  'Lagos Continental Hotel',
  '52A Kofo Abayomi Street, Victoria Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  false,
  null,
  '/tech-conference.png',
  200,
  'Tech',
  'Tech',
  true,
  true,
  ARRAY['whatsapp', 'email'],
  true,
  '{"template_url": "/getdp-tech-template.png", "photo_position": {"x": 50, "y": 30}, "text_position": {"x": 50, "y": 80}, "font_family": "Inter", "text_color": "#FFFFFF"}'::jsonb,
  '{"confirmation": "🎉 Welcome to Tech Conference 2024! Your ticket is confirmed. Event details: March 15, 2024 at Lagos Continental Hotel. See you there!", "reminder": "⏰ Reminder: Tech Conference 2024 is tomorrow! Don''t forget to bring your ID and networking cards."}'::jsonb,
  '{"confirmation": {"subject": "Welcome to Tech Conference 2024!", "body": "Thank you for registering! We''re excited to have you join us for this premier technology event."}, "reminder": {"subject": "Tech Conference 2024 - Tomorrow!", "body": "Just a friendly reminder that Tech Conference 2024 is happening tomorrow. We can''t wait to see you there!"}}'::jsonb,
  true,
  true,
  '1_day',
  '[{"id": "dietary_requirements", "label": "Dietary Requirements", "type": "select", "required": false, "options": ["None", "Vegetarian", "Vegan", "Halal", "Kosher", "Gluten-free"]}, {"id": "company_name", "label": "Company/Organization", "type": "text", "required": true}, {"id": "job_title", "label": "Job Title", "type": "text", "required": false}, {"id": "linkedin_profile", "label": "LinkedIn Profile", "type": "text", "required": false}]'::jsonb,
  NOW(),
  NOW()
),

-- Digital Marketing Workshop
(
  gen_random_uuid(),
  'e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6',
  'Digital Marketing Mastery Workshop',
  'Transform your business with cutting-edge digital marketing strategies. Learn SEO, social media marketing, content creation, email campaigns, and analytics from industry experts. Perfect for entrepreneurs, small business owners, and marketing professionals.',
  'digital-marketing-mastery-workshop',
  '2024-03-20 14:00:00+00',
  '2024-03-20 18:00:00+00',
  '14:00:00',
  '18:00:00',
  'Online Event',
  null,
  'Online',
  'Online',
  'Nigeria',
  true,
  'https://zoom.us/j/marketing-workshop-2024',
  '/marketing-workshop.png',
  100,
  'Business',
  'Business',
  true,
  true,
  ARRAY['email', 'whatsapp'],
  true,
  '{"template_url": "/getdp-marketing-template.png", "photo_position": {"x": 40, "y": 25}, "text_position": {"x": 50, "y": 75}, "font_family": "Roboto", "text_color": "#2563EB"}'::jsonb,
  '{"confirmation": "📈 You''re registered for Digital Marketing Mastery Workshop! Join us online on March 20, 2024. Zoom link will be sent 1 hour before the event.", "reminder": "🚀 Digital Marketing Workshop starts in 1 hour! Get ready to transform your marketing game. Zoom link: https://zoom.us/j/marketing-workshop-2024"}'::jsonb,
  '{"confirmation": {"subject": "Digital Marketing Workshop - You''re In!", "body": "Welcome to Digital Marketing Mastery Workshop! Prepare to learn game-changing strategies that will boost your business."}, "reminder": {"subject": "Workshop Starting Soon!", "body": "Your Digital Marketing Workshop begins in 1 hour. Make sure you have a stable internet connection and a notebook ready!"}}'::jsonb,
  true,
  true,
  '1_hour',
  '[{"id": "business_type", "label": "Type of Business", "type": "select", "required": true, "options": ["E-commerce", "Service-based", "SaaS", "Local Business", "Non-profit", "Other"]}, {"id": "marketing_experience", "label": "Marketing Experience Level", "type": "select", "required": true, "options": ["Beginner", "Intermediate", "Advanced"]}, {"id": "main_challenge", "label": "Main Marketing Challenge", "type": "textarea", "required": false}]'::jsonb,
  NOW(),
  NOW()
),

-- Startup Pitch Night
(
  gen_random_uuid(),
  'e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6',
  'Startup Pitch Night: Future Innovators',
  'An exciting evening where ambitious entrepreneurs present their groundbreaking ideas to a panel of seasoned investors, industry experts, and fellow innovators. Network, learn, and witness the next big thing in the startup ecosystem.',
  'startup-pitch-night-future-innovators',
  '2024-03-25 18:00:00+00',
  '2024-03-25 21:00:00+00',
  '18:00:00',
  '21:00:00',
  'Innovation Hub Abuja',
  '23 Jimmy Carter Street, Asokoro',
  'Abuja',
  'FCT',
  'Nigeria',
  false,
  null,
  '/startup-pitch.png',
  100,
  'Business',
  'Business',
  true,
  true,
  ARRAY['whatsapp'],
  false,
  null,
  '{"confirmation": "🚀 You''re registered for Startup Pitch Night! Join us March 25, 2024 at Innovation Hub Abuja. Prepare to be inspired by amazing entrepreneurs!", "reminder": "🌟 Startup Pitch Night is tonight! Don''t miss out on incredible pitches and networking opportunities. See you at Innovation Hub Abuja!"}'::jsonb,
  '{"confirmation": {"subject": "Welcome to Startup Pitch Night!", "body": "Thank you for joining us! Get ready for an evening of innovation, inspiration, and incredible networking opportunities."}}'::jsonb,
  true,
  true,
  '1_day',
  '[{"id": "attendee_type", "label": "I am a", "type": "select", "required": true, "options": ["Entrepreneur", "Investor", "Industry Professional", "Student", "Job Seeker", "Other"]}, {"id": "interests", "label": "Industry Interests", "type": "select", "required": false, "options": ["FinTech", "HealthTech", "EdTech", "AgriTech", "E-commerce", "SaaS", "AI/ML", "Blockchain", "Other"]}, {"id": "networking_goals", "label": "What are your networking goals for tonight?", "type": "textarea", "required": false}]'::jsonb,
  NOW(),
  NOW()
),

-- Contemporary Art Exhibition
(
  gen_random_uuid(),
  'e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6',
  'Contemporary Art Exhibition: Voices of Africa',
  'Immerse yourself in a captivating showcase of contemporary African art featuring works from emerging and established artists across the continent. Experience diverse mediums, powerful narratives, and cultural expressions that define modern African artistry.',
  'contemporary-art-exhibition-voices-africa',
  '2024-04-05 17:00:00+00',
  '2024-04-07 22:00:00+00',
  '17:00:00',
  '22:00:00',
  'National Gallery Lagos',
  '12 Onikan Street, Lagos Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  false,
  null,
  '/art-exhibition.png',
  150,
  'Arts',
  'Arts',
  true,
  true,
  ARRAY['email'],
  true,
  '{"template_url": "/getdp-art-template.png", "photo_position": {"x": 30, "y": 40}, "text_position": {"x": 70, "y": 85}, "font_family": "Playfair Display", "text_color": "#8B5CF6"}'::jsonb,
  null,
  '{"confirmation": {"subject": "Art Exhibition: Your Cultural Journey Awaits", "body": "Welcome to Voices of Africa! Prepare for an inspiring journey through contemporary African art. The exhibition runs from April 5-7, 2024."}, "reminder": {"subject": "Art Exhibition Opens Tomorrow!", "body": "The Contemporary Art Exhibition opens tomorrow evening. Join us for an unforgettable cultural experience at the National Gallery Lagos."}}'::jsonb,
  true,
  true,
  '1_day',
  '[{"id": "art_interest", "label": "Art Interest Level", "type": "select", "required": false, "options": ["Art Enthusiast", "Collector", "Artist", "Student", "First-time Visitor"]}, {"id": "preferred_medium", "label": "Preferred Art Medium", "type": "select", "required": false, "options": ["Painting", "Sculpture", "Photography", "Digital Art", "Mixed Media", "All"]}, {"id": "visit_purpose", "label": "Purpose of Visit", "type": "select", "required": false, "options": ["Personal Interest", "Academic Research", "Professional Development", "Social Event", "Other"]}]'::jsonb,
  NOW(),
  NOW()
),

-- Weekend Fitness Bootcamp
(
  gen_random_uuid(),
  'e96fda68-ccea-4b4f-b0e5-fb14a1b32ea6',
  'Weekend Warrior Fitness Bootcamp',
  'High-intensity fitness bootcamp designed for all fitness levels. Join certified trainers for an energizing workout session featuring cardio, strength training, and functional movements. Equipment provided, just bring your energy!',
  'weekend-warrior-fitness-bootcamp',
  '2024-03-30 07:00:00+00',
  '2024-03-30 09:00:00+00',
  '07:00:00',
  '09:00:00',
  'Tafawa Balewa Square',
  'Tafawa Balewa Square, Lagos Island',
  'Lagos',
  'Lagos',
  'Nigeria',
  false,
  null,
  '/fitness-bootcamp.png',
  50,
  'Sports',
  'Sports',
  true,
  true,
  ARRAY['whatsapp', 'email'],
  true,
  '{"template_url": "/getdp-fitness-template.png", "photo_position": {"x": 60, "y": 20}, "text_position": {"x": 50, "y": 90}, "font_family": "Montserrat", "text_color": "#EF4444"}'::jsonb,
  '{"confirmation": "💪 Ready to sweat? You''re registered for Weekend Warrior Fitness Bootcamp! March 30, 2024 at 7 AM. Bring water, towel, and your warrior spirit!", "reminder": "🔥 Bootcamp starts in 2 hours! Time to unleash your inner warrior. See you at Tafawa Balewa Square at 7 AM sharp!"}'::jsonb,
  '{"confirmation": {"subject": "Bootcamp Registration Confirmed!", "body": "Welcome to Weekend Warrior Fitness Bootcamp! Get ready for an intense, fun, and rewarding workout experience."}, "reminder": {"subject": "Bootcamp Starts Soon - Are You Ready?", "body": "Your fitness bootcamp begins in 2 hours. Remember to bring water, a towel, and comfortable workout clothes!"}}'::jsonb,
  true,
  true,
  '2_hours',
  '[{"id": "fitness_level", "label": "Current Fitness Level", "type": "select", "required": true, "options": ["Beginner", "Intermediate", "Advanced", "Athlete"]}, {"id": "health_conditions", "label": "Any Health Conditions or Injuries?", "type": "textarea", "required": false}, {"id": "emergency_contact", "label": "Emergency Contact Name", "type": "text", "required": true}, {"id": "emergency_phone", "label": "Emergency Contact Phone", "type": "text", "required": true}]'::jsonb,
  NOW(),
  NOW()
);

-- Insert corresponding ticket types for each event
INSERT INTO ticket_types (
  id, event_id, name, description, price, quantity_available, quantity_sold,
  is_active, sale_start_date, sale_end_date, created_at
) VALUES
-- Tech Conference tickets
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'tech-conference-2024-ai-innovation-summit'), 'Early Bird', 'Limited time discount for early registrations', 45000.00, 100, 35, true, NOW() - INTERVAL '30 days', '2024-03-10 23:59:59+00', NOW()),
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'tech-conference-2024-ai-innovation-summit'), 'Regular', 'Standard conference ticket', 60000.00, 100, 20, true, NOW() - INTERVAL '30 days', '2024-03-14 23:59:59+00', NOW()),

-- Marketing Workshop tickets
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'digital-marketing-mastery-workshop'), 'Workshop Pass', 'Full access to digital marketing workshop', 25000.00, 100, 45, true, NOW() - INTERVAL '20 days', '2024-03-19 23:59:59+00', NOW()),

-- Startup Pitch tickets
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'startup-pitch-night-future-innovators'), 'General Admission', 'Access to pitch presentations and networking', 15000.00, 100, 60, true, NOW() - INTERVAL '25 days', '2024-03-24 23:59:59+00', NOW()),

-- Art Exhibition tickets
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'contemporary-art-exhibition-voices-africa'), 'Exhibition Pass', '3-day access to art exhibition', 8000.00, 150, 25, true, NOW() - INTERVAL '15 days', '2024-04-04 23:59:59+00', NOW()),

-- Fitness Bootcamp tickets
(gen_random_uuid(), (SELECT id FROM events WHERE slug = 'weekend-warrior-fitness-bootcamp'), 'Bootcamp Session', 'Single bootcamp session access', 5000.00, 50, 30, true, NOW() - INTERVAL '10 days', '2024-03-29 23:59:59+00', NOW());