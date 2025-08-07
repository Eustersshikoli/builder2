import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

async function verifyTelegramAuth(authData: TelegramAuthData): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('Telegram bot token not configured');
  }

  // Create data check string
  const dataCheckArr: string[] = [];
  Object.keys(authData).forEach(key => {
    if (key !== 'hash') {
      dataCheckArr.push(`${key}=${authData[key as keyof TelegramAuthData]}`);
    }
  });
  dataCheckArr.sort();
  const dataCheckString = dataCheckArr.join('\n');

  // Create secret key from bot token
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode('WebAppData'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const secretKey = await crypto.subtle.sign('HMAC', key, encoder.encode(TELEGRAM_BOT_TOKEN));
  
  // Create HMAC of data check string
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    secretKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', hmacKey, encoder.encode(dataCheckString));
  const computedHash = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return computedHash === authData.hash;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { authData, action = 'login' } = await req.json();

    if (!authData) {
      return new Response(
        JSON.stringify({ error: 'Missing auth data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify Telegram authentication
    const isValid = await verifyTelegramAuth(authData);
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid Telegram authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if user exists with this Telegram ID
    const { data: existingUser, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('telegram_id', authData.id.toString())
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking existing user:', {
        message: userError instanceof Error ? userError.message : 'Unknown error',
        code: userError && typeof userError === 'object' && 'code' in userError ? userError.code : 'NO_CODE'
      });
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (existingUser) {
      // User exists, update their info and return session
      const { data: updatedUser, error: updateError } = await supabase
        .from('user_profiles')
        .update({
          telegram_username: authData.username,
          telegram_first_name: authData.first_name,
          telegram_last_name: authData.last_name,
          telegram_photo_url: authData.photo_url,
          last_login: new Date().toISOString(),
        })
        .eq('telegram_id', authData.id.toString())
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', {
          message: updateError instanceof Error ? updateError.message : 'Unknown error',
          code: updateError && typeof updateError === 'object' && 'code' in updateError ? updateError.code : 'NO_CODE'
        });
        return new Response(
          JSON.stringify({ error: 'Failed to update user' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: updatedUser,
          action: 'login'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // New user - create account
      if (action !== 'register') {
        return new Response(
          JSON.stringify({ 
            error: 'User not found',
            requiresRegistration: true,
            telegramData: authData
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create new user account
      const newUser = {
        telegram_id: authData.id.toString(),
        telegram_username: authData.username,
        telegram_first_name: authData.first_name,
        telegram_last_name: authData.last_name,
        telegram_photo_url: authData.photo_url,
        full_name: `${authData.first_name} ${authData.last_name || ''}`.trim(),
        email: authData.username ? `${authData.username}@telegram.local` : `user${authData.id}@telegram.local`,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      const { data: createdUser, error: createError } = await supabase
        .from('user_profiles')
        .insert(newUser)
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', {
          message: createError instanceof Error ? createError.message : 'Unknown error',
          code: createError && typeof createError === 'object' && 'code' in createError ? createError.code : 'NO_CODE'
        });
        return new Response(
          JSON.stringify({ error: 'Failed to create user account' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create user balance entry
      const { error: balanceError } = await supabase
        .from('user_balances')
        .insert({
          user_id: createdUser.id,
          balance: 0.0,
          currency: 'USD'
        });

      if (balanceError) {
        console.error('Error creating user balance:', {
          message: balanceError instanceof Error ? balanceError.message : 'Unknown error',
          code: balanceError && typeof balanceError === 'object' && 'code' in balanceError ? balanceError.code : 'NO_CODE',
          user_id: createdUser.id
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: createdUser,
          action: 'register'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Telegram auth error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
