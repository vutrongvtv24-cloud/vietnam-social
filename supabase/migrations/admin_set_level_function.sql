-- Function allows admin to set user level and xp
CREATE OR REPLACE FUNCTION admin_set_user_level(target_user_id UUID, new_level INT, new_xp INT)
RETURNS VOID AS $$
DECLARE
  caller_email TEXT;
BEGIN
  -- Get email of the caller
  SELECT email INTO caller_email FROM auth.users WHERE id = auth.uid();

  -- Check admin permission
  IF caller_email != 'vutrongvtv24@gmail.com' THEN
    RAISE EXCEPTION 'Unauthorized: Only admin can perform this action.';
  END IF;

  -- Validate level range
  IF new_level < 1 OR new_level > 5 THEN
     RAISE EXCEPTION 'Invalid level: Must be between 1 and 5';
  END IF;

  -- Update target user profile
  UPDATE public.profiles
  SET level = new_level,
      xp = new_xp
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
