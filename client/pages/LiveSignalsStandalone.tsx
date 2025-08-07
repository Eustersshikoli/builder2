import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import FrontPageLayout from "@/components/FrontPageLayout";
import {
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Clock,
  Target,
  DollarSign,
  BarChart3,
  Activity,
  Star,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Trophy,
  Flame,
  MessageCircle,
} from "lucide-react";

// Live signals data
const liveSignals = [
  {
    id: "1",
    pair: "EUR/USD",
    action: "BUY",
    entry: "1.0845",
    stopLoss: "1.0825",
    takeProfit: "1.0885",
    time: "5 minutes ago",
    status: "active",
    change: "+0.34%",
    confidence: "High",
    pips: "+34",
    risk: "Medium",
  },
  {
    id: "2",
    pair: "GBP/JPY",
    action: "SELL",
    entry: "189.75",
    stopLoss: "190.25",
    takeProfit: "188.90",
    time: "12 minutes ago",
    status: "active",
    change: "+1.24%",
    confidence: "Very High",
    pips: "+89",
    risk: "Low",
  },
  {
    id: "3",
    pair: "USD/CAD",
    action: "BUY",
    entry: "1.3520",
    stopLoss: "1.3495",
    takeProfit: "1.3565",
    time: "23 minutes ago",
    status: "active",
    change: "+0.87%",
    confidence: "High",
    pips: "+45",
    risk: "Medium",
  },
  {
    id: "4",
    pair: "AUD/USD",
    action: "SELL",
    entry: "0.6734",
    stopLoss: "0.6754",
    takeProfit: "0.6689",
    time: "1 hour ago",
    status: "active",
    change: "+0.15%",
    confidence: "Medium",
    pips: "+15",
    risk: "High",
  },
];

const completedSignals = [
  {
    id: "p1",
    pair: "AUD/USD",
    action: "SELL",
    entry: "0.6734",
    exit: "0.6689",
    stopLoss: "0.6754",
    takeProfit: "0.6689",
    time: "2 hours ago",
    status: "profit",
    change: "+2.47%",
    pips: "+45",
    profit: "$247.50",
    duration: "1h 34m",
  },
  {
    id: "p2",
    pair: "USD/JPY",
    action: "BUY",
    entry: "148.25",
    exit: "148.89",
    stopLoss: "147.95",
    takeProfit: "148.89",
    time: "4 hours ago",
    status: "profit",
    change: "+3.13%",
    pips: "+64",
    profit: "$313.00",
    duration: "2h 18m",
  },
  {
    id: "p3",
    pair: "EUR/GBP",
    action: "BUY",
    entry: "0.8654",
    exit: "0.8699",
    stopLoss: "0.8634",
    takeProfit: "0.8699",
    time: "6 hours ago",
    status: "profit",
    change: "+1.85%",
    pips: "+45",
    profit: "$185.00",
    duration: "3h 45m",
  },
];

export default function LiveSignalsStandalone() {
  const [stats, setStats] = useState({
    totalSignals: 1247,
    winRate: 87.3,
    avgPips: 45.2,
    totalProfit: 2856,
  });

  // Animate stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        totalSignals: prev.totalSignals + Math.floor(Math.random() * 2),
        winRate: 87.3 + (Math.random() - 0.5) * 0.2,
        avgPips: 45.2 + (Math.random() - 0.5) * 2,
        totalProfit: prev.totalProfit + Math.floor(Math.random() * 50),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-forex-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <Activity className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold">
                    Live Forex Signals
                  </h1>
                  <p className="text-sm md:text-lg text-forex-100 mt-2">
                    Real-time trading signals with 87% win rate
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {[
                  {
                    label: "Total Signals",
                    value: stats.totalSignals.toLocaleString(),
                  },
                  { label: "Win Rate", value: `${stats.winRate.toFixed(1)}%` },
                  { label: "Avg Pips", value: stats.avgPips.toFixed(1) },
                  {
                    label: "Total Profit",
                    value: `$${stats.totalProfit.toLocaleString()}`,
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 p-3 md:p-4 rounded-lg backdrop-blur-sm"
                  >
                    <div className="text-lg md:text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-forex-100">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Signals Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger
                  value="live"
                  className="flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Live Signals</span>
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Completed</span>
                </TabsTrigger>
              </TabsList>

              {/* Live Signals */}
              <TabsContent value="live" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    🔥 Active Trading Signals
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Follow our live signals for real-time trading opportunities
                    with professional analysis and risk management.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {liveSignals.map((signal) => (
                    <Card
                      key={signal.id}
                      className="border-2 border-gray-100 hover:border-forex-200 transition-all duration-200 hover:shadow-lg"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                signal.action === "BUY"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`${
                                signal.action === "BUY"
                                  ? "bg-success-500"
                                  : "bg-danger-500"
                              } text-white min-h-[32px]`}
                            >
                              {signal.action === "BUY" ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {signal.action}
                            </Badge>
                            <span className="font-bold text-lg">
                              {signal.pair}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-success-600 border-success-600"
                          >
                            {signal.change}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Entry:</span>
                            <div className="font-semibold">{signal.entry}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Stop Loss:</span>
                            <div className="font-semibold text-danger-600">
                              {signal.stopLoss}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Take Profit:</span>
                            <div className="font-semibold text-success-600">
                              {signal.takeProfit}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Pips:</span>
                            <div className="font-semibold text-success-600">
                              {signal.pips}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Confidence:</span>
                            <div
                              className={`font-semibold ${
                                signal.confidence === "Very High"
                                  ? "text-success-600"
                                  : signal.confidence === "High"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {signal.confidence}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Risk:</span>
                            <div
                              className={`font-semibold ${
                                signal.risk === "Low"
                                  ? "text-success-600"
                                  : signal.risk === "Medium"
                                    ? "text-yellow-600"
                                    : "text-danger-600"
                              }`}
                            >
                              {signal.risk}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {signal.time}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">
                                LIVE
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Completed Signals */}
              <TabsContent value="completed" className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    🏆 Recent Profitable Signals
                  </h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Track record of our recent completed signals showing
                    consistent profitability.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {completedSignals.map((signal) => (
                    <Card
                      key={signal.id}
                      className="border-2 border-success-100 hover:border-success-200 transition-all duration-200 hover:shadow-lg"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <Badge className="bg-success-500 text-white min-h-[32px]">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              PROFIT
                            </Badge>
                            <span className="font-bold text-lg">
                              {signal.pair}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-success-600 border-success-600"
                          >
                            {signal.change}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Entry:</span>
                            <div className="font-semibold">{signal.entry}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Exit:</span>
                            <div className="font-semibold text-success-600">
                              {signal.exit}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Pips:</span>
                            <div className="font-semibold text-success-600">
                              {signal.pips}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Profit:</span>
                            <div className="font-semibold text-success-600">
                              {signal.profit}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Duration: {signal.duration}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {signal.time}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Join Our Free Telegram Channel
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Get all these signals delivered directly to your Telegram.
                    Join 3,400+ traders already profiting from our signals.
                  </p>
                  <a
                    href="https://t.me/forex_traders_signalss"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-8 py-4 rounded-xl hover:from-forex-600 hover:to-blue-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span>Join Free Telegram Now</span>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </FrontPageLayout>
  );
}
