-- =============================================
-- FIX ADMIN DELETE PERMISSION
-- Change from querying auth.users to using JWT email claim
-- =============================================

-- Drop the old policy that queries auth.users
DROP POLICY IF EXISTS "Posts delete with global admin" ON public.posts;

-- Create new policy using auth.jwt() instead of querying auth.users table
-- This avoids "permission denied for table users" error
CREATE POLICY "Posts delete with global admin"
ON public.posts FOR DELETE
USING (
    -- Global admin check using JWT email claim
    (auth.jwt() ->> 'email') = 'vutrongvtv24@gmail.com'
    -- Or post owner
    OR auth.uid() = user_id 
    -- Or community admin/mod
    OR (community_id IS NOT NULL AND public.is_community_admin_or_mod(community_id))
);

-- Also fix any other policies that might use auth.users directly
-- Fix for profiles table if needed
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
CREATE POLICY "Admin can update any profile"
ON public.profiles FOR UPDATE
USING (
    (auth.jwt() ->> 'email') = 'vutrongvtv24@gmail.com'
    OR auth.uid() = id
);

-- Verify the policies
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'posts' AND cmd = 'DELETE';
