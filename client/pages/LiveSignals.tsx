import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "lucide-react";

// Mock live signals data
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
];

const previousSignals = [
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
    profit: "$313.75",
    duration: "2h 18m",
  },
  {
    id: "p3",
    pair: "GBP/USD",
    action: "SELL",
    entry: "1.2456",
    exit: "1.2398",
    stopLoss: "1.2476",
    takeProfit: "1.2398",
    time: "6 hours ago",
    status: "profit",
    change: "+4.67%",
    pips: "+58",
    profit: "$467.20",
    duration: "3h 45m",
  },
  {
    id: "p4",
    pair: "EUR/GBP",
    action: "BUY",
    entry: "0.8567",
    exit: "0.8543",
    stopLoss: "0.8547",
    takeProfit: "0.8607",
    time: "8 hours ago",
    status: "loss",
    change: "-1.25%",
    pips: "-24",
    profit: "-$125.00",
    duration: "45m",
  },
];

const winStats = {
  totalSignals: 127,
  winningSignals: 111,
  losingSignals: 16,
  winRate: 87.4,
  totalPips: 2847,
  totalProfit: 28470.5,
  avgWinPips: 52.3,
  avgLossPips: -18.7,
  bestTrade: 467.2,
  worstTrade: -235.8,
  avgDuration: "2h 15m",
};

const themes = {
  professional: {
    name: "Professional",
    background: "bg-gradient-to-br from-gray-50 to-blue-50",
    cardBg: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
  trading: {
    name: "Trading Floor",
    background: "bg-gradient-to-br from-green-900 to-red-900",
    cardBg: "bg-black/80 backdrop-blur",
    textPrimary: "text-green-400",
    textSecondary: "text-gray-300",
  },
  cyber: {
    name: "Cyber Blue",
    background: "bg-gradient-to-br from-blue-900 to-purple-900",
    cardBg: "bg-blue-900/30 backdrop-blur border-cyan-500/30",
    textPrimary: "text-cyan-300",
    textSecondary: "text-blue-200",
  },
  golden: {
    name: "Golden Signals",
    background: "bg-gradient-to-br from-yellow-100 to-orange-200",
    cardBg: "bg-gradient-to-br from-yellow-50/90 to-orange-50/90 backdrop-blur",
    textPrimary: "text-yellow-900",
    textSecondary: "text-orange-700",
  },
};

export default function LiveSignals() {
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("professional");
  const [liveTime, setLiveTime] = useState(new Date());

  const theme = themes[selectedTheme];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "profit":
        return "text-green-500";
      case "loss":
        return "text-red-500";
      case "active":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "profit":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "loss":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "active":
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Very High":
        return "bg-green-500";
      case "High":
        return "bg-blue-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${theme.background} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Activity
                className={`h-8 w-8 ${theme.textPrimary} animate-pulse`}
              />
              <h1 className={`text-4xl font-bold ${theme.textPrimary}`}>
                Live Forex Signals
              </h1>
              <Badge className="bg-red-500 text-white animate-pulse">
                LIVE
              </Badge>
            </div>
            <p
              className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto mb-4`}
            >
              Real-time forex signals with comprehensive tracking and
              performance analysis
            </p>
            <div className={`text-sm ${theme.textSecondary}`}>
              Last updated: {liveTime.toLocaleTimeString()}
            </div>

            {/* Theme Selector */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <span className={`text-sm ${theme.textSecondary}`}>Theme:</span>
              <Tabs
                value={selectedTheme}
                onValueChange={(value) =>
                  setSelectedTheme(value as keyof typeof themes)
                }
              >
                <TabsList className="grid grid-cols-4 w-auto">
                  {Object.entries(themes).map(([key, themeData]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {themeData.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs defaultValue="live" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="live">Live Signals</TabsTrigger>
              <TabsTrigger value="history">Signal History</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
            </TabsList>

            {/* Live Signals Tab */}
            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Live Stats */}
                <Card className={`${theme.cardBg} lg:col-span-1`}>
                  <CardHeader>
                    <CardTitle
                      className={`${theme.textPrimary} flex items-center space-x-2`}
                    >
                      <Flame className="h-5 w-5 text-orange-500" />
                      <span>Live Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div
                        className={`text-3xl font-bold ${theme.textPrimary}`}
                      >
                        {winStats.winRate}%
                      </div>
                      <div className={`text-sm ${theme.textSecondary}`}>
                        Win Rate
                      </div>
                      <Progress value={winStats.winRate} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className={`text-xl font-bold text-green-500`}>
                          {winStats.winningSignals}
                        </div>
                        <div className={`text-xs ${theme.textSecondary}`}>
                          Wins
                        </div>
                      </div>
                      <div>
                        <div className={`text-xl font-bold text-red-500`}>
                          {winStats.losingSignals}
                        </div>
                        <div className={`text-xs ${theme.textSecondary}`}>
                          Losses
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme.textSecondary}`}>
                          Total Pips:
                        </span>
                        <span className={`font-semibold ${theme.textPrimary}`}>
                          +{winStats.totalPips}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-sm ${theme.textSecondary}`}>
                          Total Profit:
                        </span>
                        <span className="font-semibold text-green-500">
                          ${winStats.totalProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Signals */}
                <div className="lg:col-span-2 space-y-4">
                  <h3
                    className={`text-xl font-semibold ${theme.textPrimary} flex items-center space-x-2`}
                  >
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Active Signals</span>
                    <Badge className="bg-blue-500 text-white">
                      {liveSignals.length}
                    </Badge>
                  </h3>

                  {liveSignals.map((signal) => (
                    <Card
                      key={signal.id}
                      className={`${theme.cardBg} border-l-4 border-l-blue-500`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant={
                                signal.action === "BUY"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                signal.action === "BUY"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            >
                              {signal.action === "BUY" ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                              ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                              )}
                              {signal.action}
                            </Badge>
                            <span
                              className={`font-bold text-lg ${theme.textPrimary}`}
                            >
                              {signal.pair}
                            </span>
                            <Badge
                              className={`${getConfidenceColor(signal.confidence)} text-white text-xs`}
                            >
                              {signal.confidence}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(signal.status)}
                            <Badge
                              variant="outline"
                              className={getStatusColor(signal.status)}
                            >
                              {signal.change}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className={theme.textSecondary}>Entry:</span>
                            <div
                              className={`font-semibold ${theme.textPrimary}`}
                            >
                              {signal.entry}
                            </div>
                          </div>
                          <div>
                            <span className={theme.textSecondary}>
                              Stop Loss:
                            </span>
                            <div
                              className={`font-semibold ${theme.textPrimary}`}
                            >
                              {signal.stopLoss}
                            </div>
                          </div>
                          <div>
                            <span className={theme.textSecondary}>
                              Take Profit:
                            </span>
                            <div className="font-semibold text-green-500">
                              {signal.takeProfit}
                            </div>
                          </div>
                          <div>
                            <span className={theme.textSecondary}>Pips:</span>
                            <div className="font-semibold text-blue-500">
                              {signal.pips}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t mt-3 flex items-center justify-between">
                          <span
                            className={`text-xs ${theme.textSecondary} flex items-center`}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {signal.time}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Risk: {signal.risk}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Signal History Tab */}
            <TabsContent value="history" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3
                  className={`text-xl font-semibold ${theme.textPrimary} flex items-center space-x-2`}
                >
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span>Previous Signals</span>
                </h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-sm ${theme.textSecondary}`}>
                    Last 24 hours:{" "}
                    {
                      previousSignals.filter((s) => s.status === "profit")
                        .length
                    }{" "}
                    wins,{" "}
                    {previousSignals.filter((s) => s.status === "loss").length}{" "}
                    losses
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {previousSignals.map((signal) => (
                  <Card
                    key={signal.id}
                    className={`${theme.cardBg} ${signal.status === "profit" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              signal.action === "BUY" ? "default" : "secondary"
                            }
                            className={
                              signal.action === "BUY"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {signal.action === "BUY" ? (
                              <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                            {signal.action}
                          </Badge>
                          <span
                            className={`font-bold text-lg ${theme.textPrimary}`}
                          >
                            {signal.pair}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div
                              className={`font-bold ${signal.status === "profit" ? "text-green-500" : "text-red-500"}`}
                            >
                              {signal.profit}
                            </div>
                            <div className={`text-xs ${theme.textSecondary}`}>
                              {signal.pips} pips
                            </div>
                          </div>
                          {getStatusIcon(signal.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className={theme.textSecondary}>Entry:</span>
                          <div className={`font-semibold ${theme.textPrimary}`}>
                            {signal.entry}
                          </div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>Exit:</span>
                          <div className={`font-semibold ${theme.textPrimary}`}>
                            {signal.exit}
                          </div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>
                            Stop Loss:
                          </span>
                          <div className={`font-semibold ${theme.textPrimary}`}>
                            {signal.stopLoss}
                          </div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>
                            Take Profit:
                          </span>
                          <div className="font-semibold text-green-500">
                            {signal.takeProfit}
                          </div>
                        </div>
                        <div>
                          <span className={theme.textSecondary}>Duration:</span>
                          <div className={`font-semibold ${theme.textPrimary}`}>
                            {signal.duration}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t mt-3">
                        <span
                          className={`text-xs ${theme.textSecondary} flex items-center`}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Closed {signal.time}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className={theme.cardBg}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                      {winStats.winRate}%
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Overall Win Rate
                    </div>
                  </CardContent>
                </Card>

                <Card className={theme.cardBg}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                      +{winStats.totalPips}
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Total Pips Earned
                    </div>
                  </CardContent>
                </Card>

                <Card className={theme.cardBg}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-2xl font-bold text-green-500`}>
                      ${winStats.totalProfit.toLocaleString()}
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Total Profit
                    </div>
                  </CardContent>
                </Card>

                <Card className={theme.cardBg}>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className={`text-2xl font-bold ${theme.textPrimary}`}>
                      {winStats.avgDuration}
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Avg Signal Duration
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className={theme.cardBg}>
                  <CardHeader>
                    <CardTitle className={theme.textPrimary}>
                      Detailed Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          Total Signals:
                        </span>
                        <span className={`font-semibold ${theme.textPrimary}`}>
                          {winStats.totalSignals}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          Winning Signals:
                        </span>
                        <span className="font-semibold text-green-500">
                          {winStats.winningSignals}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          Losing Signals:
                        </span>
                        <span className="font-semibold text-red-500">
                          {winStats.losingSignals}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          Avg Win Pips:
                        </span>
                        <span className="font-semibold text-green-500">
                          +{winStats.avgWinPips}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme.textSecondary}>
                          Avg Loss Pips:
                        </span>
                        <span className="font-semibold text-red-500">
                          {winStats.avgLossPips}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={theme.cardBg}>
                  <CardHeader>
                    <CardTitle className={theme.textPrimary}>
                      Best & Worst Trades
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-700">
                            Best Trade
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          +${winStats.bestTrade}
                        </div>
                      </div>

                      <div className="p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-semibold text-red-700">
                            Worst Trade
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          ${winStats.worstTrade}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
