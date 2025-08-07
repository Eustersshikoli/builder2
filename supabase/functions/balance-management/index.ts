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
    const { action, userId, amount, type, description, referenceId } =
      await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    switch (action) {
      case "add_balance":
        // Add amount to user balance
        const { data: currentBalance } = await supabaseClient
          .from("user_balances")
          .select("balance")
          .eq("user_id", userId)
          .single();

        const newBalance = (currentBalance?.balance || 0) + amount;

        const { error: updateError } = await supabaseClient
          .from("user_balances")
          .upsert({
            user_id: userId,
            balance: newBalance,
            updated_at: new Date().toISOString(),
          });

        if (updateError) throw updateError;

        // Create transaction record
        const { error: transactionError } = await supabaseClient
          .from("transactions")
          .insert({
            user_id: userId,
            type: type || "deposit",
            amount: amount,
            reference_id: referenceId,
            description: description || "Balance adjustment",
            status: "completed",
          });

        if (transactionError) throw transactionError;

        return new Response(
          JSON.stringify({
            success: true,
            newBalance: newBalance,
            message: `Added ${amount} to user balance`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );

      case "subtract_balance":
        // Subtract amount from user balance
        const { data: currentBalance2 } = await supabaseClient
          .from("user_balances")
          .select("balance")
          .eq("user_id", userId)
          .single();

        if (!currentBalance2 || currentBalance2.balance < amount) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Insufficient balance",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            },
          );
        }

        const newBalance2 = currentBalance2.balance - amount;

        const { error: updateError2 } = await supabaseClient
          .from("user_balances")
          .update({
            balance: newBalance2,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        if (updateError2) throw updateError2;

        // Create transaction record
        const { error: transactionError2 } = await supabaseClient
          .from("transactions")
          .insert({
            user_id: userId,
            type: type || "withdrawal",
            amount: -amount,
            reference_id: referenceId,
            description: description || "Balance deduction",
            status: "completed",
          });

        if (transactionError2) throw transactionError2;

        return new Response(
          JSON.stringify({
            success: true,
            newBalance: newBalance2,
            message: `Subtracted ${amount} from user balance`,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );

      case "get_balance":
        const { data: balance } = await supabaseClient
          .from("user_balances")
          .select("balance")
          .eq("user_id", userId)
          .single();

        return new Response(
          JSON.stringify({
            success: true,
            balance: balance?.balance || 0,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid action",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
