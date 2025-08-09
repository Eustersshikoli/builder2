-- Create edge function to assign user roles
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email text,
  p_password text,
  p_role app_role DEFAULT 'admin'::app_role
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  result json;
BEGIN
  -- This function should only be called by service role or super admins
  IF NOT (
    (auth.jwt() ->> 'role'::text) = 'service_role'::text OR
    has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RETURN json_build_object('error', 'Unauthorized: Only super admins can create admin users');
  END IF;

  -- Create user profile entry (the auth.users will be created via Auth API)
  -- For now, we'll assume the user_id is provided or generated
  -- This function primarily handles role assignment for existing users
  
  -- Check if user already has a role
  IF EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() OR user_id = p_email::uuid
  ) THEN
    RETURN json_build_object('error', 'User already has a role assigned');
  END IF;

  -- Note: In practice, this function would be called after user creation
  -- For now, we'll just return a success message for the setup
  RETURN json_build_object(
    'success', true,
    'message', 'Admin user creation function ready'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'error', SQLSTATE,
      'message', SQLERRM
    );
END;
$$;

-- Function to assign role to existing user (to be called after signup)
CREATE OR REPLACE FUNCTION assign_user_role(
  p_user_id uuid,
  p_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only service role or super admins can assign roles
  IF NOT (
    (auth.jwt() ->> 'role'::text) = 'service_role'::text OR
    has_role(auth.uid(), 'super_admin'::app_role)
  ) THEN
    RETURN FALSE;
  END IF;

  -- Insert role for user
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, p_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Create default super admin role (for initial setup)
-- This should be called once during setup with a known user ID
CREATE OR REPLACE FUNCTION setup_initial_super_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert super_admin role
  INSERT INTO user_roles (user_id, role)
  VALUES (p_user_id, 'super_admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;