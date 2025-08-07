import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NOWPaymentsWebhook {
  payment_id: string
  payment_status: string
  pay_address: string
  price_amount: number
  price_currency: string
  pay_amount: number
  pay_currency: string
  order_id: string
  order_description: string
  actually_paid: number
  purchase_id: string
  outcome_amount: number
  outcome_currency: string
  created_at: string
  updated_at: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify webhook signature (basic verification)
    const authHeader = req.headers.get('authorization')
    const expectedSecret = Deno.env.get('NOWPAYMENTS_IPN_SECRET')
    
    if (!authHeader || !expectedSecret) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    // Parse webhook data
    const webhookData: NOWPaymentsWebhook = await req.json()
    
    console.log('Received NOWPayments webhook:', webhookData)

    // Update payment status in database
    const { data: payment, error: paymentError } = await supabaseClient
      .from('payments')
      .update({
        payment_status: webhookData.payment_status,
        actually_paid: webhookData.actually_paid,
        updated_at: new Date().toISOString(),
      })
      .eq('payment_id_external', webhookData.payment_id)
      .select('*, user_investments(*)')
      .single()

    if (paymentError) {
      console.error('Error updating payment:', {
        message: paymentError instanceof Error ? paymentError.message : 'Unknown error',
        code: paymentError && typeof paymentError === 'object' && 'code' in paymentError ? paymentError.code : 'NO_CODE'
      })
      return new Response('Payment update failed', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    // If payment is confirmed, activate the investment
    if (webhookData.payment_status === 'finished' && payment.investment_id) {
      // Update investment status
      const { error: investmentError } = await supabaseClient
        .from('user_investments')
        .update({
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.investment_id)

      if (investmentError) {
        console.error('Error activating investment:', {
          message: investmentError instanceof Error ? investmentError.message : 'Unknown error',
          code: investmentError && typeof investmentError === 'object' && 'code' in investmentError ? investmentError.code : 'NO_CODE'
        })
      }

      // Create notification for user
      const { error: notificationError } = await supabaseClient
        .from('user_notifications')
        .insert({
          user_id: payment.user_id,
          title: 'Investment Activated!',
          message: `Your investment of $${payment.amount} has been successfully activated and is now earning returns.`,
          type: 'success',
          action_url: '/dashboard',
        })

      if (notificationError) {
        console.error('Error creating notification:', {
          message: notificationError instanceof Error ? notificationError.message : 'Unknown error',
          code: notificationError && typeof notificationError === 'object' && 'code' in notificationError ? notificationError.code : 'NO_CODE'
        })
      }

      // Update user's total investment count
      const { error: profileError } = await supabaseClient.rpc(
        'increment_user_investments',
        { user_id: payment.user_id }
      )

      if (profileError) {
        console.error('Error updating user profile:', {
          message: profileError instanceof Error ? profileError.message : 'Unknown error',
          code: profileError && typeof profileError === 'object' && 'code' in profileError ? profileError.code : 'NO_CODE'
        })
      }
    }

    // Handle failed/expired payments
    if (['failed', 'expired'].includes(webhookData.payment_status) && payment.investment_id) {
      // Update investment status to cancelled
      const { error: investmentError } = await supabaseClient
        .from('user_investments')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.investment_id)

      if (investmentError) {
        console.error('Error cancelling investment:', {
          message: investmentError instanceof Error ? investmentError.message : 'Unknown error',
          code: investmentError && typeof investmentError === 'object' && 'code' in investmentError ? investmentError.code : 'NO_CODE'
        })
      }

      // Create notification for user
      const { error: notificationError } = await supabaseClient
        .from('user_notifications')
        .insert({
          user_id: payment.user_id,
          title: 'Payment Failed',
          message: `Your payment for the $${payment.amount} investment has ${webhookData.payment_status}. Please try again.`,
          type: 'error',
          action_url: '/dashboard',
        })

      if (notificationError) {
        console.error('Error creating notification:', {
          message: notificationError instanceof Error ? notificationError.message : 'Unknown error',
          code: notificationError && typeof notificationError === 'object' && 'code' in notificationError ? notificationError.code : 'NO_CODE'
        })
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook processing error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
