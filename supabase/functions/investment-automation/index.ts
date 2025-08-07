import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Check for investments that should be completed (after 24 hours)
    const { data: activeInvestments, error: fetchError } = await supabaseClient
      .from("user_investments")
      .select(
        `
        *,
        user_profiles (id, email),
        investment_plans (name, roi_percentage)
      `,
      )
      .eq("status", "active")
      .lt(
        "start_date",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      );

    if (fetchError) {
      throw fetchError;
    }

    const completedInvestments = [];

    for (const investment of activeInvestments || []) {
      // Calculate actual return
      const actualReturn =
        investment.amount *
        (1 + investment.investment_plans.roi_percentage / 100);

      // Update investment status to completed
      const { error: updateError } = await supabaseClient
        .from("user_investments")
        .update({
          status: "completed",
          actual_return: actualReturn,
          end_date: new Date().toISOString(),
        })
        .eq("id", investment.id);

      if (updateError) {
        console.error("Error updating investment:", {
          message: updateError instanceof Error ? updateError.message : 'Unknown error',
          code: updateError && typeof updateError === 'object' && 'code' in updateError ? updateError.code : 'NO_CODE'
        });
        continue;
      }

      // Add profit to user balance
      const { error: balanceError } = await supabaseClient.rpc(
        "add_to_balance",
        {
          user_id: investment.user_id,
          amount: actualReturn,
        },
      );

      if (balanceError) {
        console.error("Error updating balance:", {
          message: balanceError instanceof Error ? balanceError.message : 'Unknown error',
          code: balanceError && typeof balanceError === 'object' && 'code' in balanceError ? balanceError.code : 'NO_CODE'
        });
        continue;
      }

      // Create transaction record
      const { error: transactionError } = await supabaseClient
        .from("transactions")
        .insert({
          user_id: investment.user_id,
          type: "return",
          amount: actualReturn,
          reference_id: investment.id,
          description: `Investment return for ${investment.investment_plans.name}`,
          status: "completed",
        });

      if (transactionError) {
        console.error("Error creating transaction:", {
          message: transactionError instanceof Error ? transactionError.message : 'Unknown error',
          code: transactionError && typeof transactionError === 'object' && 'code' in transactionError ? transactionError.code : 'NO_CODE'
        });
      }

      completedInvestments.push({
        id: investment.id,
        user_email: investment.user_profiles.email,
        amount: investment.amount,
        return: actualReturn,
        plan: investment.investment_plans.name,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${completedInvestments.length} investments`,
        completed: completedInvestments,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
