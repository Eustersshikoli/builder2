import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import SimpleInvestmentPlans from "@/components/SimpleInvestmentPlans";
import InvestmentModal from "@/components/InvestmentModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { nowPaymentsService } from "@/lib/nowpayments";
import { investmentService, type Investment } from "@/lib/investment-service";
import {
  investmentPlansService,
  type InvestmentPlan,
} from "@/lib/investment-plans-service";
import {
  Wallet,
  TrendingUp,
  MessageCircle,
  Users,
  Copy,
  ExternalLink,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Target,
  Clock,
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  PieChart,
  BarChart3,
  CreditCard,
  Download,
  ArrowDownToLine,
  ArrowUpFromLine,
  Send,
  Phone,
  Gift,
  Loader2,
  Star,
  History,
  Award,
  Calculator,
  Eye,
  Play,
  BookOpen,
  Globe,
  MapPin,
  Verified,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EnhancedUserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({
    balance: 0,
    totalInvested: 0,
    totalProfit: 0,
    totalROI: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    pendingPayouts: 0,
    referralEarnings: 0,
  });

  const [depositAmount, setDepositAmount] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawCrypto, setWithdrawCrypto] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("");
  const [supportTicket, setSupportTicket] = useState({
    subject: "",
    category: "",
    description: "",
  });

  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [showTicketsList, setShowTicketsList] = useState(false);

  // Investment plans and payment states
  const [investmentPlans, setInvestmentPlans] = useState<InvestmentPlan[]>([]);
  const [selectedInvestmentPlan, setSelectedInvestmentPlan] =
    useState<InvestmentPlan | null>(null);
  const [investmentModalOpen, setInvestmentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"balance" | "nowpayments">(
    "balance",
  );
  const [customAmount, setCustomAmount] = useState("");
  const [expectedProfit, setExpectedProfit] = useState(0);

  // Reviews and testimonials data
  const [reviews, setReviews] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [liveSignals, setLiveSignals] = useState<any[]>([]);

  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);

  // Investment data
  const [userInvestments, setUserInvestments] = useState<Investment[]>([]);
  const [investmentStats, setInvestmentStats] = useState({
    totalInvested: 0,
    totalReturns: 0,
    activeInvestments: 0,
    completedInvestments: 0,
    totalProfit: 0,
  });

  const currentTab =
    new URLSearchParams(location.search).get("tab") || "overview";

  // Check for passed state from frontpage investment redirect
  useEffect(() => {
    if (location.state?.selectedPlan && location.state?.action === "invest") {
      const plan = location.state.selectedPlan;
      setSelectedPlan(plan.id);
      setInvestmentAmount(plan.minAmount.toString());
      // Auto-focus on plans tab
      navigate(`/dashboard?tab=plans`, { replace: true });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    console.log("User effect triggered, user:", user);
    if (user) {
      console.log("User ID:", user.id);
      console.log("User email:", user.email);
      initializeUserData()
        .then(async () => {
          try {
            await Promise.allSettled([
              loadUserStats(),
              loadSupportTickets(),
              loadInvestmentPlans(),
              loadReviews(),
              loadTestimonials(),
              loadLiveSignals(),
              checkTelegramConnection(),
            ]);
          } catch (error) {
            console.error("Error in parallel loading:", {
              message: error instanceof Error ? error.message : "Unknown error",
              stack: error instanceof Error ? error.stack : undefined,
              user_id: user?.id,
            });
          }
        })
        .catch((error) => {
          console.error("Error in user initialization chain:", {
            message: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
            user_id: user?.id,
          });
        });
    }
  }, [user]);

  const initializeUserData = async () => {
    if (!user?.id) return;

    try {
      // Check if user profile exists
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (profileError) {
        if (profileError.code === "PGRST116") {
          // User profile doesn't exist, create it
          console.log("Creating user profile...");
          const { error: createError } = await supabase
            .from("user_profiles")
            .insert({
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name || user.email || "User",
            });

          if (createError) {
            console.error("Failed to create user profile:", {
              message: createError.message,
              code: createError.code,
              details: createError.details,
              hint: createError.hint,
              user_id: user.id,
              user_email: user.email,
            });
          } else {
            console.log("User profile created successfully");
          }
        } else if (profileError.code === "42P01") {
          console.warn(
            "user_profiles table does not exist. Please run database migrations.",
          );
        } else {
          // Log error for admin monitoring without exposing details to user
          console.warn(
            "User profile check failed - contact support if issues persist",
          );
        }
      }

      // Check if user balance exists
      const { data: balance, error: balanceError } = await supabase
        .from("user_balances")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (balanceError) {
        if (balanceError.code === "PGRST116") {
          // User balance doesn't exist, create it
          console.log("Creating user balance entry...");
          const { error: createBalanceError } = await supabase
            .from("user_balances")
            .insert({
              user_id: user.id,
              balance: 0.0, // Starting balance
              currency: "USD",
            });

          if (createBalanceError) {
            // Check if this is a configuration error
            if (createBalanceError.code === "CONFIGURATION_ERROR") {
              console.warn(
                "Supabase not configured - user balance creation skipped",
              );
              console.info("Using default balance values for demo mode");
            } else {
              // Enhanced error logging with fallback for undefined properties
              const errorInfo = {
                message: createBalanceError.message || "Unknown error",
                code: createBalanceError.code || "NO_CODE",
                details: createBalanceError.details || "No details available",
                hint: createBalanceError.hint || "No hint available",
                user_id: user.id,
                error_type: typeof createBalanceError,
                timestamp: new Date().toISOString(),
              };

              console.error("Failed to create user balance:", errorInfo);

              // Log to system for admin monitoring
              console.warn(
                "User balance creation failed - initializing with default values",
              );
            }
          } else {
            console.log("User balance created successfully for user:", user.id);
          }
        } else if (balanceError.code === "42P01") {
          console.warn(
            "user_balances table does not exist. Please run database migrations.",
          );
        } else {
          // Enhanced error logging for balance check failures
          const errorInfo = {
            message: balanceError.message || "Unknown balance error",
            code: balanceError.code || "NO_CODE",
            details: balanceError.details || "No details available",
            user_id: user.id,
            timestamp: new Date().toISOString(),
          };

          console.error("User balance check failed:", errorInfo);
          console.warn(
            "Balance check failed - will use default balance values",
          );
        }
      }
    } catch (error) {
      console.error("Unexpected error initializing user data:", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        user_id: user.id,
        user_email: user.email,
      });
    }
  };

  const loadUserStats = async () => {
    if (!user?.id) {
      console.warn("No user ID available for loading stats");
      return;
    }

    try {
      // First test basic Supabase connection
      console.log("Testing Supabase connection...");
      const { data: testData, error: testError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("id", user.id)
        .limit(1);

      if (testError) {
        if (testError.code === "CONFIGURATION_ERROR") {
          console.warn(
            "Supabase is not configured - using default/demo values",
          );
          // Set default stats and return early
          setUserStats({
            balance: 0.0,
            totalInvested: 0,
            totalProfit: 0,
            totalROI: 0,
            activeInvestments: 0,
            completedInvestments: 0,
            pendingPayouts: 0,
            referralEarnings: 0.0,
          });
          return;
        }

        console.error("Supabase connection test failed:", {
          message: testError.message,
          code: testError.code,
          details: testError.details,
          hint: testError.hint,
        });
        throw new Error(`Connection failed: ${testError.message}`);
      }

      console.log(
        "Supabase connection successful, user profile exists:",
        !!testData?.length,
      );

      // Load user investments
      await loadUserInvestments();

      // Try to load user balance first (simpler query)
      let userBalance = 0.0; // Default balance

      try {
        const { data: balanceData } = await supabase
          .from("user_balances")
          .select("balance")
          .eq("user_id", user.id)
          .single();

        if (balanceData?.balance !== undefined) {
          userBalance = balanceData.balance;
        }
      } catch (balanceError) {
        console.warn("User balance table not available, using default balance");
      }

      // Try to load user investments (with simplified query)
      let investmentStats = {
        totalInvested: 0,
        totalProfit: 0,
        activeInvestments: 0,
        completedInvestments: 0,
      };

      try {
        const { data: investments, error } = await supabase
          .from("user_investments")
          .select("amount, status, actual_return")
          .eq("user_id", user.id);

        if (error) {
          console.warn("User investments table query failed:", error.message);
        } else if (investments) {
          investmentStats = investments.reduce((acc, inv) => {
            if (inv.status === "active") acc.activeInvestments++;
            if (inv.status === "completed") acc.completedInvestments++;
            acc.totalInvested += inv.amount || 0;
            if (inv.actual_return)
              acc.totalProfit += inv.actual_return - (inv.amount || 0);
            return acc;
          }, investmentStats);
        }
      } catch (investmentError) {
        console.warn(
          "User investments table not available, using default values",
        );
      }

      // Calculate final stats
      const stats = {
        balance: userBalance,
        ...investmentStats,
        totalROI:
          investmentStats.totalInvested > 0
            ? (investmentStats.totalProfit / investmentStats.totalInvested) *
              100
            : 0,
        pendingPayouts: 0,
        referralEarnings: 0.0,
      };

      setUserStats(stats);
      console.log("User stats loaded successfully:", stats);
    } catch (error) {
      // Enhanced error logging for debugging
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const isConnectionError =
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("fetch");

      console.error("Error loading user statistics:", {
        message: errorMessage,
        isConnectionError,
        stack: error instanceof Error ? error.stack : undefined,
        user_id: user?.id,
      });

      if (isConnectionError) {
        console.warn(
          "Connection error detected - check Supabase configuration and network connectivity",
        );
      }

      console.warn("Failed to load user statistics - using default values");

      // Set default stats on error
      const defaultStats = {
        balance: 0.0,
        totalInvested: 0,
        totalProfit: 0,
        totalROI: 0,
        activeInvestments: 0,
        completedInvestments: 0,
        pendingPayouts: 0,
        referralEarnings: 0.0,
      };

      setUserStats(defaultStats);
      console.log("Using default stats due to error:", defaultStats);
    }
  };

  const checkTelegramConnection = async () => {
    if (!user?.id) {
      return;
    }

    try {
      // Check if user has connected Telegram
      const { data, error } = await supabase
        .from("user_profiles")
        .select("telegram_id")
        .eq("id", user.id)
        .single();

      if (!error && data?.telegram_id) {
        setTelegramConnected(true);
      }
    } catch (error) {
      console.error(
        "Error checking telegram connection:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  const createMissingProfile = async () => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email || "User",
      });

      if (error) {
        console.error("Error creating profile:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          user_id: user.id,
        });
        return false;
      }

      console.log("Profile created/updated successfully");
      return true;
    } catch (error) {
      console.error("Unexpected error creating profile:", {
        error: error instanceof Error ? error.message : "Unknown error",
        user_id: user.id,
      });
      return false;
    }
  };

  const createMissingBalance = async () => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase.from("user_balances").upsert({
        user_id: user.id,
        balance: 0.0,
        currency: "USD",
      });

      if (error) {
        console.error("Error creating balance:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
          user_id: user.id,
        });
        return false;
      }

      console.log("Balance created/updated successfully");
      return true;
    } catch (error) {
      console.error("Unexpected error creating balance:", {
        error: error instanceof Error ? error.message : "Unknown error",
        user_id: user.id,
      });
      return false;
    }
  };

  const loadUserInvestments = async () => {
    if (!user?.id) return;

    try {
      // Load user investments
      const investmentsResult = await investmentService.getUserInvestments(
        user.id,
      );
      if (investmentsResult.success) {
        setUserInvestments(investmentsResult.data);
      }

      // Load investment stats
      const statsResult = await investmentService.getInvestmentStats(user.id);
      if (statsResult.success) {
        setInvestmentStats(statsResult.data);
      }
    } catch (error) {
      console.error("Error loading user investments:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
        user_id: user?.id,
      });
    }
  };

  const loadSupportTickets = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSupportTickets(data || []);
    } catch (error) {
      console.error("Error loading support tickets:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
        user_id: user?.id,
      });
    }
  };

  const loadInvestmentPlans = async () => {
    try {
      const result = await investmentPlansService.getActivePlans();
      if (result.success) {
        setInvestmentPlans(result.data);
      }
    } catch (error) {
      console.error("Error loading investment plans:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error && error.code !== "CONFIGURATION_ERROR") throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error loading reviews:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const loadTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      if (error && error.code !== "CONFIGURATION_ERROR") throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error loading testimonials:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const loadLiveSignals = async () => {
    try {
      const { data, error } = await supabase
        .from("forex_signals")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error && error.code !== "CONFIGURATION_ERROR") throw error;
      setLiveSignals(data || []);
    } catch (error) {
      console.error("Error loading live signals:", {
        message:
          error instanceof Error
            ? error.message
            : error?.message || error?.error || "Unknown error",
        code: error?.code || "NO_CODE",
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  const handleDeposit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to make a deposit",
        variant: "destructive",
      });
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) < 60) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is $60 USD",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCrypto) {
      toast({
        title: "Select Cryptocurrency",
        description: "Please select a cryptocurrency for deposit",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create deposit payment
      const { payment, dbPayment } =
        await nowPaymentsService.createInvestmentPayment(
          user.id,
          "", // No investment ID for deposits
          parseFloat(depositAmount),
          selectedCrypto,
          `Account deposit - $${depositAmount}`,
        );

      toast({
        title: "Deposit Created",
        description: "Please send the exact amount to the provided address.",
      });

      setShowPaymentModal(true);
    } catch (error) {
      toast({
        title: "Deposit Error",
        description:
          error instanceof Error ? error.message : "Failed to create deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to request a withdrawal",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) > userStats.balance) {
      toast({
        title: "Invalid Amount",
        description: "Insufficient balance or invalid amount",
        variant: "destructive",
      });
      return;
    }

    if (!withdrawAddress || !withdrawCrypto || !withdrawNetwork) {
      toast({
        title: "Missing Information",
        description: "Please fill in all withdrawal details",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.from("withdrawal_requests").insert({
        user_id: user.id,
        amount: parseFloat(withdrawAmount),
        crypto_currency: withdrawCrypto,
        wallet_address: withdrawAddress,
        network: withdrawNetwork,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description:
          "Your withdrawal request has been submitted for processing.",
      });

      // Reset form
      setWithdrawAmount("");
      setWithdrawAddress("");
      setWithdrawCrypto("");
      setWithdrawNetwork("");
    } catch (error) {
      toast({
        title: "Withdrawal Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit withdrawal request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSupportTicket = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a support ticket",
        variant: "destructive",
      });
      return;
    }

    if (
      !supportTicket.subject ||
      !supportTicket.category ||
      !supportTicket.description
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Create ticket with enhanced data for admin panel integration
      const ticketData = {
        user_id: user.id,
        user_email: user.email,
        user_name: user.user_metadata?.full_name || user.email || "User",
        subject: supportTicket.subject,
        category: supportTicket.category,
        description: supportTicket.description,
        status: "open",
        priority: supportTicket.category === "technical" ? "high" : "medium",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("support_tickets")
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;

      // Create notification for admin (if notifications table exists)
      try {
        await supabase.from("admin_notifications").insert({
          type: "support_ticket",
          title: `New Support Ticket: ${supportTicket.subject}`,
          message: `${user.email} created a new ${supportTicket.category} ticket`,
          reference_id: data.id,
          is_read: false,
          created_at: new Date().toISOString(),
        });
      } catch (notifError) {
        // Notification creation is optional - don't fail the ticket creation
        console.warn("Could not create admin notification:", {
          message:
            notifError instanceof Error ? notifError.message : "Unknown error",
        });
      }

      toast({
        title: "Ticket Created Successfully",
        description: `Ticket #${data.id.slice(0, 8)} has been created. We'll respond within 24 hours.`,
      });

      setSupportTicket({ subject: "", category: "", description: "" });
      setShowTicketsList(true);
      loadSupportTickets();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    // Open Telegram bot for connection
    window.open("https://t.me/forex_traders_signalss", "_blank");
    toast({
      title: "Telegram Connection",
      description: "Please start a chat with our bot to connect your account",
    });
  };

  const handleInvestment = (plan: any) => {
    setSelectedInvestmentPlan(plan);
    setCustomAmount(plan.min_amount.toString());
    calculateExpectedProfit(plan, plan.min_amount);
    setInvestmentModalOpen(true);
  };

  const calculateExpectedProfit = (plan: InvestmentPlan, amount: number) => {
    const calculation = investmentPlansService.calculateExpectedReturn(
      plan,
      amount,
    );
    setExpectedProfit(calculation.profit);
  };

  const processInvestment = async () => {
    if (!user?.id || !selectedInvestmentPlan) return;

    const amount = parseFloat(customAmount);

    if (
      amount < selectedInvestmentPlan.min_amount ||
      amount > selectedInvestmentPlan.max_amount
    ) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between $${selectedInvestmentPlan.min_amount} and $${selectedInvestmentPlan.max_amount}`,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "balance") {
        // Check if user has sufficient balance
        if (amount > userStats.balance) {
          toast({
            title: "Insufficient Balance",
            description: `You need $${amount - userStats.balance} more in your account`,
            variant: "destructive",
          });
          return;
        }

        // Create investment using balance
        const result = await investmentService.createInvestment({
          user_id: user.id,
          plan_name: selectedInvestmentPlan.name,
          amount: amount,
          expected_return: amount + expectedProfit,
          roi_percentage: selectedInvestmentPlan.roi_percentage,
          duration_days: selectedInvestmentPlan.duration_days,
          payment_method: "account_balance",
        });

        if (result.success) {
          // Deduct from balance
          const { error: balanceError } = await supabase
            .from("user_balances")
            .update({
              balance: userStats.balance - amount,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", user.id);

          if (!balanceError) {
            toast({
              title: "Investment Successful",
              description: `You've successfully invested $${amount} in ${selectedInvestmentPlan.name}`,
            });
            setInvestmentModalOpen(false);
            loadUserStats();
            loadUserInvestments();
          }
        }
      } else {
        // Process with NOWPayments
        const paymentData = await nowPaymentsService.createInvestmentPayment(
          user.id,
          "",
          amount,
          "btc", // Default crypto, user can change in checkout
          `Investment in ${selectedInvestmentPlan.name}`,
        );

        if (paymentData.payment) {
          // Payment created successfully - user can complete it via dashboard
          // No payment_url property available in the current implementation
          setInvestmentModalOpen(false);

          toast({
            title: "Redirecting to Payment",
            description:
              "You'll be redirected to complete your payment with cryptocurrency",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Investment Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process investment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const offerPlans = [
    {
      id: "flash",
      name: "Flash Deal",
      amount: 200,
      expectedReturn: 5000,
      roi: "2,500%",
      duration: "24 hours",
      description: "Limited time offer",
      timeLeft: "12:45:32",
      popular: true,
    },
    {
      id: "weekend",
      name: "Weekend Special",
      amount: 500,
      expectedReturn: 12500,
      roi: "2,500%",
      duration: "48 hours",
      description: "Weekend only",
      timeLeft: "2:15:45",
      popular: false,
    },
    {
      id: "vip-deal",
      name: "VIP Deal",
      amount: 1000,
      expectedReturn: 25000,
      roi: "2,500%",
      duration: "72 hours",
      description: "Exclusive offer",
      timeLeft: "8:30:12",
      popular: false,
    },
  ];

  const cryptoOptions = nowPaymentsService.getPopularCryptoCurrencies();

  const renderTabContent = () => {
    switch (currentTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="text-xl font-bold">
                        ${userStats.balance.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Invested</p>
                      <p className="text-xl font-bold">
                        ${userStats.totalInvested.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Profit</p>
                      <p className="text-xl font-bold text-green-600">
                        ${userStats.totalProfit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className="text-xl font-bold text-green-600">
                        {userStats.totalROI.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => navigate("/dashboard?tab=deposit")}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <ArrowDownToLine className="h-5 w-5" />
                    <span className="text-xs">Deposit</span>
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard?tab=withdraw")}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <ArrowUpFromLine className="h-5 w-5" />
                    <span className="text-xs">Withdraw</span>
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard?tab=plans")}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-xs">Invest</span>
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard?tab=offers")}
                    className="flex flex-col items-center space-y-2 h-16"
                    variant="outline"
                  >
                    <Gift className="h-5 w-5" />
                    <span className="text-xs">Offers</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "balance":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-4xl font-bold text-green-600 mb-4">
                  ${userStats.balance.toFixed(2)}
                </div>
                <p className="text-gray-600 mb-6">Available Balance</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button
                    onClick={() => navigate("/dashboard?tab=deposit")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Deposit
                  </Button>
                  <Button
                    onClick={() => navigate("/dashboard?tab=withdraw")}
                    variant="outline"
                  >
                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "deposit":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Deposit Funds</CardTitle>
              <p className="text-gray-600">
                Add funds to your account using cryptocurrency
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-blue-800 text-sm">
                  <strong>Minimum deposit:</strong> $60 USD • Funds are
                  available immediately after confirmation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deposit-amount">Deposit Amount (USD)</Label>
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="60.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      min="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="crypto-select">Select Cryptocurrency</Label>
                    <Select onValueChange={setSelectedCrypto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem
                            key={crypto.currency}
                            value={crypto.currency}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={crypto.logo_url}
                                alt={crypto.name}
                                className="w-4 h-4"
                              />
                              <span>
                                {crypto.name} ({crypto.currency.toUpperCase()})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleDeposit}
                    disabled={loading || !depositAmount || !selectedCrypto}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Deposit...
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="mr-2 h-4 w-4" />
                        Create Deposit
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Supported Cryptocurrencies</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {cryptoOptions.slice(0, 6).map((crypto) => (
                      <div
                        key={crypto.currency}
                        className="flex items-center space-x-2 p-2 bg-gray-50 rounded"
                      >
                        <img
                          src={crypto.logo_url}
                          alt={crypto.name}
                          className="w-6 h-6"
                        />
                        <span className="text-sm">
                          {crypto.currency.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "withdraw":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <p className="text-gray-600">
                Request a withdrawal to your crypto wallet
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  <strong>Available balance:</strong> $
                  {userStats.balance.toFixed(2)} • Withdrawals are processed
                  within 24 hours
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="withdraw-amount">
                      Withdrawal Amount (USD)
                    </Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="100.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={userStats.balance}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdraw-crypto">Cryptocurrency</Label>
                    <Select onValueChange={setWithdrawCrypto}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cryptocurrency" />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoOptions.map((crypto) => (
                          <SelectItem
                            key={crypto.currency}
                            value={crypto.currency}
                          >
                            {crypto.name} ({crypto.currency.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="withdraw-address">Wallet Address</Label>
                    <Input
                      id="withdraw-address"
                      placeholder="Enter your wallet address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="withdraw-network">Network</Label>
                    <Select onValueChange={setWithdrawNetwork}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="bep20">BEP20 (BSC)</SelectItem>
                        <SelectItem value="erc20">ERC20 (Ethereum)</SelectItem>
                        <SelectItem value="trc20">TRC20 (Tron)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    disabled={loading || !withdrawAmount || !withdrawAddress}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ArrowUpFromLine className="mr-2 h-4 w-4" />
                        Request Withdrawal
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Withdrawal Information</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Minimum withdrawal: $500 USD</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Network fees apply</li>
                    <li>• Double-check wallet address</li>
                    <li>• Withdrawals require email confirmation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "plans":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Plans</CardTitle>
                <p className="text-gray-600">
                  Choose your investment plan and payment method
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Available Balance:</strong> $
                    {userStats.balance.toFixed(2)} • Choose to pay with balance
                    or cryptocurrency
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.is_featured ? "ring-2 ring-blue-500" : ""}`}
                >
                  {plan.is_featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">
                      {plan.roi_percentage}% ROI
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Min Amount:</span>
                        <span className="font-semibold">
                          ${plan.min_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Amount:</span>
                        <span className="font-semibold">
                          ${plan.max_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">
                          {plan.duration_days} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span className="font-semibold text-green-600">
                          $
                          {Math.round(
                            plan.min_amount * (1 + plan.roi_percentage / 100),
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleInvestment(plan)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Investment Modal */}
            {investmentModalOpen && selectedInvestmentPlan && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>
                      Invest in {selectedInvestmentPlan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Investment Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          calculateExpectedProfit(
                            selectedInvestmentPlan,
                            parseFloat(e.target.value) || 0,
                          );
                        }}
                        min={selectedInvestmentPlan.min_amount}
                        max={selectedInvestmentPlan.max_amount}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Min: ${selectedInvestmentPlan.min_amount} - Max: $
                        {selectedInvestmentPlan.max_amount}
                      </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Expected Profit:</strong> $
                        {expectedProfit.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Total Return:</strong> $
                        {(
                          parseFloat(customAmount || "0") + expectedProfit
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Duration: {selectedInvestmentPlan.duration_days} days
                      </p>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={
                            paymentMethod === "balance" ? "default" : "outline"
                          }
                          onClick={() => setPaymentMethod("balance")}
                          className="text-sm"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Account Balance
                        </Button>
                        <Button
                          variant={
                            paymentMethod === "nowpayments"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setPaymentMethod("nowpayments")}
                          className="text-sm"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Crypto Payment
                        </Button>
                      </div>
                      {paymentMethod === "balance" && (
                        <p className="text-xs text-gray-600 mt-2">
                          Available Balance: ${userStats.balance.toFixed(2)}
                        </p>
                      )}
                      {paymentMethod === "nowpayments" && (
                        <p className="text-xs text-gray-600 mt-2">
                          You'll be redirected to select your preferred
                          cryptocurrency
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={processInvestment}
                        disabled={loading || !customAmount}
                        className="flex-1"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : paymentMethod === "balance" ? (
                          <Wallet className="mr-2 h-4 w-4" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        {paymentMethod === "balance"
                          ? "Invest Now"
                          : "Pay with Crypto"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setInvestmentModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "investment-plans":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Plans</CardTitle>
                <p className="text-gray-600">
                  Choose your investment plan and payment method
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Available Balance:</strong> $
                    {userStats.balance.toFixed(2)} • Choose to pay with balance
                    or cryptocurrency
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investmentPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.is_featured ? "ring-2 ring-blue-500" : ""}`}
                >
                  {plan.is_featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">
                      {plan.roi_percentage}% ROI
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Min Amount:</span>
                        <span className="font-semibold">
                          ${plan.min_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Amount:</span>
                        <span className="font-semibold">
                          ${plan.max_amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">
                          {plan.duration_days} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span className="font-semibold text-green-600">
                          $
                          {Math.round(
                            plan.min_amount * (1 + plan.roi_percentage / 100),
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleInvestment(plan)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <DollarSign className="mr-2 h-4 w-4" />
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Investment Modal */}
            {investmentModalOpen && selectedInvestmentPlan && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>
                      Invest in {selectedInvestmentPlan.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="amount">Investment Amount ($)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          calculateExpectedProfit(
                            selectedInvestmentPlan,
                            parseFloat(e.target.value) || 0,
                          );
                        }}
                        min={selectedInvestmentPlan.min_amount}
                        max={selectedInvestmentPlan.max_amount}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Min: ${selectedInvestmentPlan.min_amount} - Max: $
                        {selectedInvestmentPlan.max_amount}
                      </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Expected Profit:</strong> $
                        {expectedProfit.toFixed(2)}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Total Return:</strong> $
                        {(
                          parseFloat(customAmount || "0") + expectedProfit
                        ).toFixed(2)}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Duration: {selectedInvestmentPlan.duration_days} days
                      </p>
                    </div>

                    <div>
                      <Label>Payment Method</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          variant={
                            paymentMethod === "balance" ? "default" : "outline"
                          }
                          onClick={() => setPaymentMethod("balance")}
                          className="text-sm"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          Account Balance
                        </Button>
                        <Button
                          variant={
                            paymentMethod === "nowpayments"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setPaymentMethod("nowpayments")}
                          className="text-sm"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Crypto Payment
                        </Button>
                      </div>
                      {paymentMethod === "balance" && (
                        <p className="text-xs text-gray-600 mt-2">
                          Available Balance: ${userStats.balance.toFixed(2)}
                        </p>
                      )}
                      {paymentMethod === "nowpayments" && (
                        <p className="text-xs text-gray-600 mt-2">
                          You'll be redirected to select your preferred
                          cryptocurrency
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={processInvestment}
                        disabled={loading || !customAmount}
                        className="flex-1"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : paymentMethod === "balance" ? (
                          <Wallet className="mr-2 h-4 w-4" />
                        ) : (
                          <CreditCard className="mr-2 h-4 w-4" />
                        )}
                        {paymentMethod === "balance"
                          ? "Invest Now"
                          : "Pay with Crypto"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setInvestmentModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <p className="text-gray-600">
                  See what our users are saying about our platform
                </p>
              </CardHeader>
            </Card>

            {reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500">
                    Be the first to leave a review!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          {review.avatar_url ? (
                            <img
                              src={review.avatar_url}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-semibold text-lg">
                                {review.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{review.name}</h3>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                              <MapPin className="h-3 w-3" />
                              <span>{review.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Verified className="h-3 w-3 text-blue-500" />
                          <span>Verified</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Success Stories</CardTitle>
                <p className="text-gray-600">
                  Featured testimonials from our most successful users
                </p>
              </CardHeader>
            </Card>

            {testimonials.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Testimonials Yet
                  </h3>
                  <p className="text-gray-500">
                    Success stories will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className="bg-gradient-to-br from-blue-50 to-purple-50"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex-shrink-0">
                          {testimonial.avatar_url ? (
                            <img
                              src={testimonial.avatar_url}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-xl">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {testimonial.name}
                          </h3>
                          {testimonial.location && (
                            <p className="text-gray-600 text-sm">
                              {testimonial.location}
                            </p>
                          )}
                          <div className="flex space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <blockquote className="text-gray-700 mb-4 italic">
                        "{testimonial.content}"
                      </blockquote>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {new Date(
                            testimonial.created_at,
                          ).toLocaleDateString()}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          ⭐ Featured
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "live-signals":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Forex Signals</CardTitle>
                <p className="text-gray-600">
                  Real-time trading signals from our expert analysts
                </p>
              </CardHeader>
            </Card>

            {liveSignals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Active Signals
                  </h3>
                  <p className="text-gray-500">
                    Live signals will appear here when available
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() =>
                      window.open(
                        "https://t.me/forex_traders_signalss",
                        "_blank",
                      )
                    }
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Join Telegram for Signals
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {liveSignals.map((signal) => (
                  <Card
                    key={signal.id}
                    className="border-l-4 border-l-green-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl">{signal.pair}</h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              signal.signal_type === "buy"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {signal.signal_type.toUpperCase()}
                          </span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {signal.confidence}% Confidence
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Entry Price</p>
                          <p className="font-semibold">{signal.entry_price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Stop Loss</p>
                          <p className="font-semibold text-red-600">
                            {signal.stop_loss}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Take Profit 1</p>
                          <p className="font-semibold text-green-600">
                            {signal.take_profit_1}
                          </p>
                        </div>
                        {signal.take_profit_2 && (
                          <div>
                            <p className="text-sm text-gray-600">
                              Take Profit 2
                            </p>
                            <p className="font-semibold text-green-600">
                              {signal.take_profit_2}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <h4 className="font-semibold text-sm mb-2">Analysis</h4>
                        <p className="text-sm text-gray-700">
                          {signal.analysis}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {new Date(signal.created_at).toLocaleString()}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>Live Signal</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "offers":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Special Offers</CardTitle>
                <p className="text-gray-600">
                  Limited time investment opportunities
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerPlans.map((offer) => (
                <Card
                  key={offer.id}
                  className={`relative overflow-hidden ${offer.popular ? "ring-2 ring-gold-500" : ""}`}
                >
                  {offer.popular && (
                    <div className="absolute top-0 right-0 bg-gold-500 text-white px-3 py-1 text-xs">
                      🔥 HOT DEAL
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{offer.name}</CardTitle>
                    <div className="text-3xl font-bold text-green-600">
                      {offer.roi}
                    </div>
                    <p className="text-gray-600">{offer.description}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">Time Left:</div>
                      <div className="text-red-600 font-mono text-xl">
                        {offer.timeLeft}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">${offer.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Return:</span>
                        <span className="font-semibold text-green-600">
                          ${offer.expectedReturn.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-semibold">{offer.duration}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600"
                      onClick={() => handleInvestment(offer)}
                      disabled={userStats.balance < offer.amount}
                    >
                      {userStats.balance >= offer.amount
                        ? "Invest Now"
                        : "Insufficient Balance"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "telegram":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Telegram Connection</CardTitle>
              <p className="text-gray-600">
                Connect your Telegram account to receive signals
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                {telegramConnected ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                    <h3 className="text-xl font-semibold text-green-600">
                      Connected!
                    </h3>
                    <p className="text-gray-600">
                      Your Telegram account is connected and you're receiving
                      signals.
                    </p>
                    <Button
                      onClick={() =>
                        window.open(
                          "https://t.me/forex_traders_signalss",
                          "_blank",
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Open Telegram Channel
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Send className="h-16 w-16 text-blue-600 mx-auto" />
                    <h3 className="text-xl font-semibold">
                      Connect Your Telegram
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Connect your Telegram account to receive real-time forex
                      signals and updates.
                    </p>
                    <Button
                      onClick={handleTelegramLogin}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Connect Telegram
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "referrals":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Referral Program</CardTitle>
              <p className="text-gray-600">
                Earn commission by referring new investors to our platform
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-4">
                  Earn 10% Commission on Every Referral!
                </h3>
                <p className="text-gray-600 mb-4">
                  Share your unique referral link and earn 10% commission on
                  every investment made by your referrals.
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="referral-link">Your Referral Link</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="referral-link"
                        value={`https://www.forextraderssignals.com/?ref=${user?.id?.slice(0, 8) || "user"}`}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://www.forextraderssignals.com/?ref=${user?.id?.slice(0, 8) || "user"}`,
                          );
                          toast({
                            title: "Copied!",
                            description: "Referral link copied to clipboard",
                          });
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Total Referrals</div>
                </Card>

                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${userStats.referralEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Earned</div>
                </Card>

                <Card className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">10%</div>
                  <div className="text-sm text-gray-600">Commission Rate</div>
                </Card>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">How It Works</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Share your unique referral link with friends and family
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      When someone signs up and makes their first investment,
                      you earn 10% commission
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      Commissions are paid directly to your account balance
                    </span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      No limit on the number of referrals you can make
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Share on Social Media
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case "active":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Investments</CardTitle>
              <p className="text-gray-600">
                Monitor your current investment positions
              </p>
            </CardHeader>
            <CardContent>
              {userStats.activeInvestments === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Active Investments
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You don't have any active investments at the moment.
                  </p>
                  <Button
                    onClick={() => navigate("/investment-plans")}
                    className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start Investing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* This would be populated with actual investment data */}
                    <div className="text-center text-gray-500">
                      Active investments will appear here when you make an
                      investment.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "history":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Investment History</CardTitle>
              <p className="text-gray-600">
                View all your completed investments and returns
              </p>
            </CardHeader>
            <CardContent>
              {userStats.completedInvestments === 0 ? (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Investment History
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Your completed investments will appear here.
                  </p>
                  <Button
                    onClick={() => navigate("/investment-plans")}
                    className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Make Your First Investment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Plan</th>
                          <th className="text-left p-3">Amount</th>
                          <th className="text-left p-3">Return</th>
                          <th className="text-left p-3">ROI</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-3 text-gray-500" colSpan={6}>
                            No completed investments yet.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "transactions":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <p className="text-gray-600">
                View all your deposits, withdrawals, and transactions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline">All Transactions</Badge>
                    <Badge variant="outline">Deposits</Badge>
                    <Badge variant="outline">Withdrawals</Badge>
                    <Badge variant="outline">Investments</Badge>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Method</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">TXN ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-gray-500" colSpan={6}>
                          No transactions yet. Your transaction history will
                          appear here.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "support":
        return (
          <div className="space-y-6">
            {/* Support Tickets Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Tickets</p>
                      <p className="text-xl font-bold">
                        {supportTickets.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Open Tickets</p>
                      <p className="text-xl font-bold">
                        {
                          supportTickets.filter((t) => t.status === "open")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-xl font-bold">
                        {
                          supportTickets.filter((t) => t.status === "resolved")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Toggle between create ticket and view tickets */}
            <div className="flex space-x-2">
              <Button
                variant={!showTicketsList ? "default" : "outline"}
                onClick={() => setShowTicketsList(false)}
              >
                Create New Ticket
              </Button>
              <Button
                variant={showTicketsList ? "default" : "outline"}
                onClick={() => setShowTicketsList(true)}
              >
                View My Tickets ({supportTickets.length})
              </Button>
            </div>

            {!showTicketsList ? (
              /* Create Ticket Form */
              <Card>
                <CardHeader>
                  <CardTitle>Create Support Ticket</CardTitle>
                  <p className="text-gray-600">
                    Get help with deposits, withdrawals, or technical issues
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-subject">Subject</Label>
                      <Input
                        id="ticket-subject"
                        placeholder="Brief description of your issue"
                        value={supportTicket.subject}
                        onChange={(e) =>
                          setSupportTicket((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticket-category">Category</Label>
                      <Select
                        value={supportTicket.category}
                        onValueChange={(value) =>
                          setSupportTicket((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deposit">
                            Deposit Issues
                          </SelectItem>
                          <SelectItem value="withdrawal">
                            Withdrawal Issues
                          </SelectItem>
                          <SelectItem value="investment">
                            Investment Questions
                          </SelectItem>
                          <SelectItem value="technical">
                            Technical Support
                          </SelectItem>
                          <SelectItem value="account">
                            Account Issues
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="ticket-description">Description</Label>
                      <Textarea
                        id="ticket-description"
                        placeholder="Please provide detailed information about your issue..."
                        rows={5}
                        value={supportTicket.description}
                        onChange={(e) =>
                          setSupportTicket((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <Button
                      onClick={handleSupportTicket}
                      disabled={
                        loading ||
                        !supportTicket.subject ||
                        !supportTicket.category
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Ticket...
                        </>
                      ) : (
                        <>
                          <Phone className="mr-2 h-4 w-4" />
                          Create Support Ticket
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Response Times</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Urgent issues: 2-4 hours</li>
                      <li>• General inquiries: 24 hours</li>
                      <li>• Technical issues: 48 hours</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Tickets List */
              <Card>
                <CardHeader>
                  <CardTitle>My Support Tickets</CardTitle>
                  <p className="text-gray-600">
                    Track the status of your support requests
                  </p>
                </CardHeader>
                <CardContent>
                  {supportTickets.length === 0 ? (
                    <div className="text-center py-8">
                      <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        No Support Tickets
                      </h3>
                      <p className="text-gray-500 mb-6">
                        You haven't created any support tickets yet.
                      </p>
                      <Button
                        onClick={() => setShowTicketsList(false)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create First Ticket
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {ticket.subject}
                              </h3>
                              <p className="text-sm text-gray-600 capitalize">
                                Category: {ticket.category}
                              </p>
                            </div>
                            <Badge
                              variant={
                                ticket.status === "open"
                                  ? "default"
                                  : ticket.status === "resolved"
                                    ? "secondary"
                                    : ticket.status === "in_progress"
                                      ? "destructive"
                                      : "outline"
                              }
                              className={
                                ticket.status === "open"
                                  ? "bg-blue-100 text-blue-800"
                                  : ticket.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : ticket.status === "in_progress"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : ""
                              }
                            >
                              {ticket.status === "open" &&
                                "🟡 Waiting for Response"}
                              {ticket.status === "resolved" && "✅ Resolved"}
                              {ticket.status === "in_progress" &&
                                "🔄 In Progress"}
                              {ticket.status === "closed" && "⚫ Closed"}
                            </Badge>
                          </div>

                          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                            {ticket.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Created:{" "}
                              {new Date(ticket.created_at).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(ticket.created_at).toLocaleTimeString()}
                            </span>
                            <span>#{ticket.id.slice(0, 8)}</span>
                          </div>

                          {ticket.status === "open" && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-700 font-medium">
                                  Waiting for support team response
                                </span>
                              </div>
                              <p className="text-xs text-blue-600 mt-1">
                                Expected response within 24 hours
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <p className="text-gray-600">
                  Update your account information and preferences
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>

                    <div>
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        placeholder="Enter your full name"
                        defaultValue={user?.user_metadata?.full_name || ""}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="de">Germany</SelectItem>
                          <SelectItem value="fr">France</SelectItem>
                          <SelectItem value="jp">Japan</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Withdrawal Settings
                    </h3>

                    <div>
                      <Label htmlFor="btc-address">Bitcoin (BTC) Address</Label>
                      <Input
                        id="btc-address"
                        placeholder="Enter your BTC wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="eth-address">
                        Ethereum (ETH) Address
                      </Label>
                      <Input
                        id="eth-address"
                        placeholder="Enter your ETH wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="usdt-address">USDT Address</Label>
                      <Input
                        id="usdt-address"
                        placeholder="Enter your USDT wallet address"
                        defaultValue=""
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferred-network">
                        Preferred Network
                      </Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred network" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mainnet">
                            Bitcoin Mainnet
                          </SelectItem>
                          <SelectItem value="erc20">
                            ERC20 (Ethereum)
                          </SelectItem>
                          <SelectItem value="bep20">BEP20 (BSC)</SelectItem>
                          <SelectItem value="trc20">TRC20 (Tron)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Security Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-gray-600">
                      Receive updates about your investments via email
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Telegram Notifications</div>
                    <div className="text-sm text-gray-600">
                      Get instant notifications via Telegram
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Investment Alerts</div>
                    <div className="text-sm text-gray-600">
                      Notifications when investments mature
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Feature Coming Soon
              </h3>
              <p className="text-gray-500">
                This feature is under development and will be available soon.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-6">
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              Welcome back, {user?.user_metadata?.full_name || user?.email}!
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Manage your investments and track your portfolio
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Verified Account
          </Badge>
        </div>

        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}
