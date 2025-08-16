-- Fix banner image URLs to match actual files in public folder
-- Remove the '-banner' suffix from existing banner image URLs

UPDATE events 
SET banner_image_url = '/tech-conference.png'
WHERE banner_image_url = '/tech-conference-banner.png';

UPDATE events 
SET banner_image_url = '/marketing-workshop.png'
WHERE banner_image_url = '/marketing-workshop-banner.png';

UPDATE events 
SET banner_image_url = '/startup-pitch.png'
WHERE banner_image_url = '/startup-pitch-banner.png';

UPDATE events 
SET banner_image_url = '/art-exhibition.png'
WHERE banner_image_url = '/art-exhibition-banner.png';

UPDATE events 
SET banner_image_url = '/fitness-bootcamp.png'
WHERE banner_image_url = '/fitness-bootcamp-banner.png';

-- Verify the updates
SELECT id, title, banner_image_url 
FROM events 
WHERE banner_image_url IS NOT NULL 
ORDER BY created_at;