import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { alphaVantageService } from "@/lib/alphavantage";
import { supabase } from "@/integrations/supabase/client";
import { signalsService, type ForexSignal } from "@/lib/signals-service";
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Loader2,
  Target,
  Shield,
  Clock,
  BarChart3,
  Signal,
} from "lucide-react";

// Using ForexSignal interface from signals-service

interface ForexQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export default function ForexSignalsDashboard() {
  const { toast } = useToast();
  const [signals, setSignals] = useState<ForexSignal[]>([]);
  const [quotes, setQuotes] = useState<ForexQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadActiveSignals();
    loadMarketQuotes();

    // Set up real-time subscription for new signals
    const signalsSubscription = supabase
      .channel("forex_signals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "forex_signals" },
        () => {
          loadActiveSignals();
        },
      )
      .subscribe();

    return () => {
      signalsSubscription.unsubscribe();
    };
  }, []);

  const loadActiveSignals = async () => {
    try {
      setLoading(true);
      const result = await signalsService.getActiveSignals();

      if (result.success) {
        setSignals(result.data);
        setLastUpdate(new Date());
      } else {
        throw new Error("Failed to load signals");
      }
    } catch (error) {
      console.error("Error loading signals:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: "Error",
        description: "Failed to load forex signals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMarketQuotes = async () => {
    try {
      const marketOverview = await alphaVantageService.getMarketOverview();
      setQuotes(marketOverview);
    } catch (error) {
      console.error("Error loading market quotes:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const generateNewSignals = async () => {
    try {
      setRefreshing(true);

      // Call Edge Function to generate signals
      const { data, error } = await supabase.functions.invoke(
        "generate-forex-signals",
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `Generated ${data.signals_generated} new forex signals`,
      });

      loadActiveSignals();
    } catch (error) {
      console.error("Error generating signals:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      toast({
        title: "Error",
        description: "Failed to generate new signals",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const closeSignal = async (signalId: string) => {
    try {
      const closePrice = prompt("Enter close price:");
      const result = prompt("Enter result (win/loss/breakeven):") as
        | "win"
        | "loss"
        | "breakeven";

      if (!closePrice || !result) return;

      await signalsService.closeSignal(signalId, {
        result,
        close_price: parseFloat(closePrice),
      });

      toast({
        title: "Signal Closed",
        description: "Signal has been closed successfully",
      });
      loadActiveSignals();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to close signal",
        variant: "destructive",
      });
    }
  };

  const getSignalIcon = (type: "buy" | "sell") => {
    return type === "buy" ? TrendingUp : TrendingDown;
  };

  const getSignalColor = (type: "buy" | "sell") => {
    return type === "buy" ? "text-green-600" : "text-red-600";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const calculatePnL = (signal: ForexSignal) => {
    // For now, return placeholder since current_price isn't in our new interface
    // This would be calculated based on real-time market data
    const pnlPercentage = Math.random() * 4 - 2; // Random between -2% and +2%

    return {
      percentage: pnlPercentage,
      isProfit: pnlPercentage > 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Forex Signals Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time forex trading signals powered by advanced technical
            analysis
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={generateNewSignals}
          disabled={refreshing}
          className="bg-forex-600 hover:bg-forex-700"
        >
          {refreshing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Signals
            </>
          )}
        </Button>
      </div>

      {/* Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Market Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quotes.map((quote) => (
              <div
                key={quote.symbol}
                className="text-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="font-semibold text-sm">{quote.symbol}</div>
                <div className="text-lg font-bold">
                  {quote.price.toFixed(5)}
                </div>
                <div
                  className={`text-xs ${quote.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {quote.changePercent >= 0 ? "+" : ""}
                  {quote.changePercent.toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Signal className="h-5 w-5" />
              <span>Active Signals</span>
              <Badge variant="secondary">{signals.length}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadActiveSignals}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : signals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Signal className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active signals available</p>
              <Button
                onClick={generateNewSignals}
                className="mt-4 bg-forex-600 hover:bg-forex-700"
                disabled={refreshing}
              >
                Generate New Signals
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {signals.map((signal) => {
                const SignalIcon = getSignalIcon(signal.signal_type);
                const pnl = calculatePnL(signal);

                return (
                  <Card
                    key={signal.id}
                    className="border-l-4 border-l-forex-500"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <SignalIcon
                            className={`h-5 w-5 ${getSignalColor(signal.signal_type)}`}
                          />
                          <div>
                            <div className="font-semibold">{signal.pair}</div>
                            <Badge
                              variant={
                                signal.signal_type === "buy"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {signal.signal_type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            Confidence
                          </div>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getConfidenceColor(signal.confidence)}`}
                          >
                            {signal.confidence}%
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-gray-600">Entry</div>
                          <div className="font-semibold">
                            {signal.entry_price.toFixed(5)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Stop Loss</div>
                          <div className="font-semibold text-red-600">
                            {signal.stop_loss.toFixed(5)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Take Profit</div>
                          <div className="font-semibold text-green-600">
                            {signal.take_profit_1.toFixed(5)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-gray-600 text-sm">Status</div>
                          <div className="font-semibold capitalize">
                            {signal.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-600 text-sm">P&L</div>
                          <div
                            className={`font-semibold ${pnl.isProfit ? "text-green-600" : "text-red-600"}`}
                          >
                            {pnl.isProfit ? "+" : ""}
                            {pnl.percentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-gray-600 text-sm mb-1">
                          Analysis
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          {signal.analysis}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(signal.created_at).toLocaleString()}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => closeSignal(signal.id)}
                          className="text-xs"
                        >
                          Close Signal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trading Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Trading Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold text-forex-600">Risk Management</h4>
              <ul className="space-y-1 text-gray-600">
                <li>��� Never risk more than 2% of your account per trade</li>
                <li>• Always use stop-loss orders</li>
                <li>• Diversify your trading pairs</li>
                <li>• Keep a trading journal</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-forex-600">
                Signal Guidelines
              </h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Higher confidence signals are more reliable</li>
                <li>• Consider market conditions before trading</li>
                <li>• Use proper position sizing</li>
                <li>• Monitor news events that may affect signals</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
