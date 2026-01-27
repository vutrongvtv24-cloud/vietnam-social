-- Add visibility column to posts table
ALTER TABLE posts ADD COLUMN visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private'));

-- Update existing posts to be public
UPDATE posts SET visibility = 'public' WHERE visibility IS NULL;
