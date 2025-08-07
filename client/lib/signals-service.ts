import { supabase } from "./supabase";
import { logger } from "./logger";

export interface ForexSignal {
  id: string;
  pair: string;
  signal_type: "buy" | "sell";
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2?: number;
  take_profit_3?: number;
  confidence: number;
  analysis: string;
  status: "active" | "closed" | "cancelled";
  result?: "win" | "loss" | "breakeven";
  close_price?: number;
  pips_gained?: number;
  created_at: string;
  closed_at?: string;
  created_by: string;
}

export interface SignalAnalytics {
  total_signals: number;
  win_rate: number;
  average_pips: number;
  active_signals: number;
  total_pips: number;
  best_pair: string;
  recent_performance: Array<{
    date: string;
    wins: number;
    losses: number;
    pips: number;
  }>;
}

class SignalsService {
  /**
   * Create a new forex signal
   */
  async createSignal(signalData: {
    pair: string;
    signal_type: "buy" | "sell";
    entry_price: number;
    stop_loss: number;
    take_profit_1: number;
    take_profit_2?: number;
    take_profit_3?: number;
    confidence: number;
    analysis: string;
    created_by: string;
  }) {
    try {
      logger.info("Creating new forex signal", {
        pair: signalData.pair,
        type: signalData.signal_type,
        confidence: signalData.confidence,
      });

      const { data, error } = await supabase
        .from("forex_signals")
        .insert({
          ...signalData,
          status: "active",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        logger.error("Failed to create signal", { error: error.message });
        throw error;
      }

      // Send Telegram notification
      await this.sendTelegramSignal(data);

      logger.info("Signal created successfully", { signalId: data.id });
      return { success: true, data };
    } catch (error) {
      logger.error("Signal creation error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Get active signals
   */
  async getActiveSignals() {
    try {
      const { data, error } = await supabase
        .from("forex_signals")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to get active signals", { error: error.message });
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      logger.error("Get active signals error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error, data: [] };
    }
  }

  /**
   * Get all signals with pagination
   */
  async getAllSignals(page = 1, limit = 20, status?: string) {
    try {
      let query = supabase
        .from("forex_signals")
        .select("*", { count: "exact" });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        logger.error("Failed to get signals", { error: error.message });
        throw error;
      }

      return {
        success: true,
        data: data || [],
        count: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      };
    } catch (error) {
      logger.error("Get signals error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error, data: [], count: 0, totalPages: 0 };
    }
  }

  /**
   * Close a signal with result
   */
  async closeSignal(
    signalId: string,
    result: {
      result: "win" | "loss" | "breakeven";
      close_price: number;
      pips_gained?: number;
      notes?: string;
    },
  ) {
    try {
      logger.info("Closing signal", { signalId, result: result.result });

      const { data, error } = await supabase
        .from("forex_signals")
        .update({
          status: "closed",
          result: result.result,
          close_price: result.close_price,
          pips_gained: result.pips_gained,
          closed_at: new Date().toISOString(),
        })
        .eq("id", signalId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to close signal", { error: error.message });
        throw error;
      }

      // Send Telegram update
      await this.sendTelegramSignalUpdate(data);

      logger.info("Signal closed successfully", { signalId });
      return { success: true, data };
    } catch (error) {
      logger.error("Signal close error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Get signals analytics
   */
  async getSignalsAnalytics(
    days = 30,
  ): Promise<{ success: boolean; data?: SignalAnalytics; error?: any }> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from("forex_signals")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (error) {
        logger.error("Failed to get signals analytics", {
          error: error.message,
        });
        throw error;
      }

      const signals = data || [];
      const closedSignals = signals.filter((s) => s.status === "closed");
      const winningSignals = closedSignals.filter((s) => s.result === "win");

      // Calculate analytics
      const analytics: SignalAnalytics = {
        total_signals: signals.length,
        win_rate:
          closedSignals.length > 0
            ? (winningSignals.length / closedSignals.length) * 100
            : 0,
        average_pips:
          closedSignals.length > 0
            ? closedSignals.reduce((sum, s) => sum + (s.pips_gained || 0), 0) /
              closedSignals.length
            : 0,
        active_signals: signals.filter((s) => s.status === "active").length,
        total_pips: closedSignals.reduce(
          (sum, s) => sum + (s.pips_gained || 0),
          0,
        ),
        best_pair: this.getBestPerformingPair(closedSignals),
        recent_performance: this.getRecentPerformance(closedSignals, 7),
      };

      return { success: true, data: analytics };
    } catch (error) {
      logger.error("Signals analytics error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Get recent signals for display
   */
  async getRecentSignals(limit = 10) {
    try {
      const { data, error } = await supabase
        .from("forex_signals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        logger.error("Failed to get recent signals", { error: error.message });
        throw error;
      }

      return { success: true, data: data || [] };
    } catch (error) {
      logger.error("Get recent signals error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error, data: [] };
    }
  }

  /**
   * Update signal (for modifications)
   */
  async updateSignal(signalId: string, updates: Partial<ForexSignal>) {
    try {
      logger.info("Updating signal", { signalId });

      const { data, error } = await supabase
        .from("forex_signals")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", signalId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to update signal", { error: error.message });
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Signal update error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Delete/Cancel signal
   */
  async cancelSignal(signalId: string, reason?: string) {
    try {
      logger.info("Cancelling signal", { signalId, reason });

      const { data, error } = await supabase
        .from("forex_signals")
        .update({
          status: "cancelled",
          closed_at: new Date().toISOString(),
        })
        .eq("id", signalId)
        .select()
        .single();

      if (error) {
        logger.error("Failed to cancel signal", { error: error.message });
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Signal cancel error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Send signal to Telegram (placeholder for webhook integration)
   */
  private async sendTelegramSignal(signal: ForexSignal) {
    try {
      // This would integrate with your Telegram bot
      const message = this.formatSignalForTelegram(signal);

      logger.info("Sending Telegram signal notification", {
        signalId: signal.id,
        pair: signal.pair,
      });

      // In production, this would call your Telegram bot API
      // For now, we'll just log the message that would be sent
      logger.debug("Telegram message", { message });

      return { success: true };
    } catch (error) {
      logger.error("Telegram signal send error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Send signal update to Telegram
   */
  private async sendTelegramSignalUpdate(signal: ForexSignal) {
    try {
      const message = this.formatSignalUpdateForTelegram(signal);

      logger.info("Sending Telegram signal update", {
        signalId: signal.id,
        result: signal.result,
      });

      logger.debug("Telegram update message", { message });

      return { success: true };
    } catch (error) {
      logger.error("Telegram signal update error", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, error };
    }
  }

  /**
   * Format signal for Telegram message
   */
  private formatSignalForTelegram(signal: ForexSignal): string {
    return `
🚨 NEW FOREX SIGNAL 🚨

📊 Pair: ${signal.pair}
🎯 Action: ${signal.signal_type.toUpperCase()}
💰 Entry: ${signal.entry_price}
🛑 Stop Loss: ${signal.stop_loss}
🎯 Take Profit 1: ${signal.take_profit_1}
${signal.take_profit_2 ? `🎯 Take Profit 2: ${signal.take_profit_2}` : ""}
${signal.take_profit_3 ? `🎯 Take Profit 3: ${signal.take_profit_3}` : ""}
⭐ Confidence: ${signal.confidence}%

📈 Analysis:
${signal.analysis}

⏰ Signal Time: ${new Date(signal.created_at).toLocaleString()}

Join our premium signals: @forex_traders_signalss
    `.trim();
  }

  /**
   * Format signal update for Telegram
   */
  private formatSignalUpdateForTelegram(signal: ForexSignal): string {
    const resultEmoji =
      signal.result === "win" ? "✅" : signal.result === "loss" ? "❌" : "⚖️";

    return `
${resultEmoji} SIGNAL UPDATE ${resultEmoji}

📊 Pair: ${signal.pair}
🎯 Action: ${signal.signal_type.toUpperCase()}
💰 Entry: ${signal.entry_price}
💰 Close: ${signal.close_price}
${signal.pips_gained ? `📈 Pips: ${signal.pips_gained > 0 ? "+" : ""}${signal.pips_gained}` : ""}
📊 Result: ${signal.result?.toUpperCase()}

⏰ Closed: ${signal.closed_at ? new Date(signal.closed_at).toLocaleString() : ""}
    `.trim();
  }

  /**
   * Get best performing currency pair
   */
  private getBestPerformingPair(signals: ForexSignal[]): string {
    const pairStats: {
      [key: string]: { wins: number; total: number; pips: number };
    } = {};

    signals.forEach((signal) => {
      if (!pairStats[signal.pair]) {
        pairStats[signal.pair] = { wins: 0, total: 0, pips: 0 };
      }
      pairStats[signal.pair].total++;
      if (signal.result === "win") {
        pairStats[signal.pair].wins++;
      }
      pairStats[signal.pair].pips += signal.pips_gained || 0;
    });

    let bestPair = "N/A";
    let bestScore = 0;

    Object.entries(pairStats).forEach(([pair, stats]) => {
      if (stats.total >= 3) {
        // Only consider pairs with at least 3 signals
        const score =
          (stats.wins / stats.total) * 100 + stats.pips / stats.total;
        if (score > bestScore) {
          bestScore = score;
          bestPair = pair;
        }
      }
    });

    return bestPair;
  }

  /**
   * Get recent performance data
   */
  private getRecentPerformance(signals: ForexSignal[], days: number) {
    const performance = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const daySignals = signals.filter(
        (s) => s.closed_at && s.closed_at.startsWith(dateStr),
      );

      performance.push({
        date: dateStr,
        wins: daySignals.filter((s) => s.result === "win").length,
        losses: daySignals.filter((s) => s.result === "loss").length,
        pips: daySignals.reduce((sum, s) => sum + (s.pips_gained || 0), 0),
      });
    }

    return performance.reverse();
  }
}

export const signalsService = new SignalsService();
export default signalsService;
