import { supabase } from "@/integrations/supabase/client";
import { logger } from "./logger";

export interface Investment {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  expected_return: number;
  roi_percentage: number;
  duration_days: number;
  status: "pending" | "active" | "completed" | "cancelled";
  payment_status: "pending" | "confirmed" | "failed";
  payment_method: string;
  payment_address?: string;
  payment_transaction_id?: string;
  start_date?: string;
  end_date?: string;
  actual_return?: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  payment_method: string;
  crypto_address?: string;
  transaction_id?: string;
}

class InvestmentService {
  /**
   * Create a new investment record
   */
  async createInvestment(investmentData: {
    user_id: string;
    plan_name: string;
    amount: number;
    expected_return: number;
    roi_percentage: number;
    duration_days: number;
    payment_method: string;
  }) {
    try {
      logger.info("Creating new investment", {
        plan: investmentData.plan_name,
        amount: investmentData.amount,
        userId: investmentData.user_id,
      });

      const { data, error } = await supabase
        .from("user_investments")
        .insert({
          user_id: investmentData.user_id,
          plan_name: investmentData.plan_name,
          amount: investmentData.amount,
          expected_return: investmentData.expected_return,
          roi_percentage: investmentData.roi_percentage,
          duration_days: investmentData.duration_days,
          status: "pending",
          payment_status: "pending",
          payment_method: investmentData.payment_method,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error("Failed to create investment", { error: error.message });
        throw error;
      }

      logger.info("Investment created successfully", { investmentId: data.id });
      return { success: true, data };
    } catch (error) {
      logger.error("Investment creation error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update investment payment details
   */
  async updatePaymentDetails(
    investmentId: string,
    paymentDetails: PaymentDetails,
  ) {
    try {
      logger.info("Updating payment details", { investmentId });

      const { data, error } = await supabase
        .from("user_investments")
        .update({
          payment_address: paymentDetails.crypto_address,
          payment_transaction_id: paymentDetails.transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", investmentId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to update payment details", {
          error: error.message,
        });
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Payment update error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Confirm payment and activate investment
   */
  async confirmPayment(investmentId: string, transactionId: string) {
    try {
      logger.info("Confirming payment", { investmentId, transactionId });

      const startDate = new Date();
      const investment = await this.getInvestment(investmentId);

      if (!investment.success || !investment.data) {
        throw new Error("Investment not found");
      }

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + investment.data.duration_days);

      const { data, error } = await supabase
        .from("user_investments")
        .update({
          payment_status: "confirmed",
          status: "active",
          payment_transaction_id: transactionId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", investmentId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to confirm payment", { error: error.message });
        throw error;
      }

      // Create transaction record
      await this.createTransactionRecord({
        user_id: investment.data.user_id,
        type: "investment",
        amount: investment.data.amount,
        status: "completed",
        description: `Investment in ${investment.data.plan_name}`,
        investment_id: investmentId,
      });

      logger.info("Payment confirmed successfully", { investmentId });
      return { success: true, data };
    } catch (error) {
      logger.error("Payment confirmation error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get single investment
   */
  async getInvestment(investmentId: string) {
    try {
      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("id", investmentId)
        .single();

      if (error) {
        logger.error("Failed to get investment", { error: error.message });
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Get investment error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get user investments
   */
  async getUserInvestments(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to get user investments", {
          error: error.message,
        });
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      logger.error("Get user investments error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', data: [] };
    }
  }

  /**
   * Complete investment and process ROI
   */
  async completeInvestment(investmentId: string, actualReturn?: number) {
    try {
      logger.info("Completing investment", { investmentId });

      const investment = await this.getInvestment(investmentId);

      if (!investment.success || !investment.data) {
        throw new Error("Investment not found");
      }

      const finalReturn = actualReturn || investment.data.expected_return;

      const { data, error } = await supabase
        .from("user_investments")
        .update({
          status: "completed",
          actual_return: finalReturn,
          updated_at: new Date().toISOString(),
        })
        .eq("id", investmentId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to complete investment", { error: error.message });
        throw error;
      }

      // Create ROI payout transaction
      await this.createTransactionRecord({
        user_id: investment.data.user_id,
        type: "payout",
        amount: finalReturn,
        status: "completed",
        description: `ROI payout for ${investment.data.plan_name}`,
        investment_id: investmentId,
      });

      // Update user balance
      await this.updateUserBalance(investment.data.user_id, finalReturn);

      logger.info("Investment completed successfully", {
        investmentId,
        finalReturn,
      });
      return { success: true, data };
    } catch (error) {
      logger.error("Investment completion error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create transaction record
   */
  private async createTransactionRecord(transactionData: {
    user_id: string;
    type: "investment" | "payout" | "deposit" | "withdrawal";
    amount: number;
    status: "pending" | "completed" | "failed";
    description: string;
    investment_id?: string;
  }) {
    try {
      const { error } = await supabase.from("payment_transactions").insert({
        ...transactionData,
        created_at: new Date().toISOString(),
      });

      if (error) {
        logger.error("Failed to create transaction record", {
          error: error.message,
        });
        throw error;
      }

      return { success: true };
    } catch (error) {
      logger.error("Transaction creation error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update user balance
   */
  private async updateUserBalance(userId: string, amount: number) {
    try {
      // Get current balance
      const { data: currentBalance, error: balanceError } = await supabase
        .from("user_balances")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (balanceError && balanceError.code !== "PGRST116") {
        throw balanceError;
      }

      const newBalance = (currentBalance?.balance || 0) + amount;

      // Update or insert balance
      const { error } = await supabase.from("user_balances").upsert({
        user_id: userId,
        balance: newBalance,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        logger.error("Failed to update user balance", { error: error.message });
        throw error;
      }

      return { success: true, newBalance };
    } catch (error) {
      logger.error("Balance update error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get investment statistics
   */
  async getInvestmentStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from("user_investments")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to get investment stats", {
          error: error.message,
        });
        throw error;
      }

      const investments = data || [];
      const stats = {
        totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
        totalReturns: investments
          .filter((inv) => inv.status === "completed")
          .reduce(
            (sum, inv) => sum + (inv.actual_return || inv.expected_return),
            0,
          ),
        activeInvestments: investments.filter((inv) => inv.status === "active")
          .length,
        completedInvestments: investments.filter(
          (inv) => inv.status === "completed",
        ).length,
        totalProfit: 0,
      };

      stats.totalProfit = stats.totalReturns - stats.totalInvested;

      return { success: true, data: stats };
    } catch (error) {
      logger.error("Investment stats error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

export const investmentService = new InvestmentService();
export default investmentService;
