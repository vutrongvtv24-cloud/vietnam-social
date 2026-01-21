-- RUN THIS IN SUPABASE SQL EDITOR

-- Fix: Set Admin to Level 5 and ensure XP is consistently high to prevent auto-derank trigger
-- Level 5 requires 5000 XP. We give 25000 to be safe.

UPDATE public.profiles
SET 
  level = 5,
  xp = 25000
WHERE email = 'vutrongvtv24@gmail.com';
