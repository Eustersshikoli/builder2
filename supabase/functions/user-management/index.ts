import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, userId, role, email } = await req.json()

    console.log('User management action:', { action, userId, role, email })

    switch (action) {
      case 'assign_role':
        if (!userId || !role) {
          return new Response(
            JSON.stringify({ error: 'Missing userId or role' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Assign role to user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role })

        if (roleError) {
          console.error('Error assigning role:', roleError)
          return new Response(
            JSON.stringify({ error: 'Failed to assign role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Role assigned successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'create_super_admin':
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'Missing userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Create super admin role
        const { error: superAdminError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'super_admin' })

        if (superAdminError) {
          console.error('Error creating super admin:', superAdminError)
          return new Response(
            JSON.stringify({ error: 'Failed to create super admin' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true, message: 'Super admin created successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('User management error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})