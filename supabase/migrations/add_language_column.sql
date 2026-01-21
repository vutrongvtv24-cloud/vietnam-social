-- =============================================
-- ADD LANGUAGE COLUMN TO PROFILES
-- =============================================

-- Add language column with default 'vi' (Vietnamese)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'vi' CHECK (language IN ('en', 'vi'));

-- Update handle_new_user to include language
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, xp, level, language)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'avatar_url',
        30,   -- Welcome bonus XP
        1,    -- Starting level
        'vi'  -- Default language (can be changed during onboarding)
    );
    RETURN new;
END;
$$;

-- DONE: Profiles now have a language preference column
