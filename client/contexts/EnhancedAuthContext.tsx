import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { enhancedAuth, EnhancedUserData } from "@/lib/enhanced-auth";
import { dualDb } from "@/lib/dual-database";
import { useToast } from "@/hooks/use-toast";

interface SessionData {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  loginTime: string;
  lastActivity: string;
  rememberMe: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  sessionData: SessionData | null;
  signUp: (
    email: string,
    password: string,
    userData?: EnhancedUserData,
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signInWithGoogle: () => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signInWithTelegram: () => Promise<{
    user: User | null;
    error: AuthError | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  adminSignIn: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  trackVisitor: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const { toast } = useToast();

  // Get visitor IP and user agent
  const getVisitorInfo = async () => {
    try {
      // Use a simple client-side approach instead of non-existent API
      return {
        ipAddress: "client-side", // We'll get this from a working service later
        userAgent: navigator.userAgent,
      };
    } catch {
      return {
        ipAddress: "unknown",
        userAgent: navigator.userAgent,
      };
    }
  };

  // Track visitor for analytics
  const trackVisitor = async () => {
    try {
      const visitorInfo = await getVisitorInfo();
      const visitData = {
        ...visitorInfo,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
      };

      // Store in localStorage for admin analytics
      try {
        const visitors = JSON.parse(
          localStorage.getItem("forex_visitors") || "[]",
        );
        visitors.push(visitData);
        // Keep only last 1000 visitors
        if (visitors.length > 1000) {
          visitors.splice(0, visitors.length - 1000);
        }
        localStorage.setItem("forex_visitors", JSON.stringify(visitors));
      } catch (storageError) {
        // Silently fail if localStorage is not available
        console.warn(
          "Unable to store visitor data:",
          storageError instanceof Error
            ? storageError.message
            : "Unknown storage error",
        );
      }
    } catch (error) {
      // Don't throw errors for visitor tracking - it's not critical
      console.warn(
        "Error tracking visitor:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  };

  // Create session data
  const createSessionData = async (
    rememberMe: boolean = false,
  ): Promise<SessionData> => {
    try {
      const visitorInfo = await getVisitorInfo();
      const sessionId = crypto.randomUUID();
      const now = new Date().toISOString();

      const sessionData: SessionData = {
        sessionId,
        ipAddress: visitorInfo.ipAddress,
        userAgent: visitorInfo.userAgent,
        loginTime: now,
        lastActivity: now,
        rememberMe,
      };

      // Store session data
      try {
        if (rememberMe) {
          localStorage.setItem("forex_session", JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem("forex_session", JSON.stringify(sessionData));
        }
      } catch (storageError) {
        console.warn(
          "Unable to store session data:",
          storageError instanceof Error
            ? storageError.message
            : "Unknown storage error",
        );
      }

      return sessionData;
    } catch (error) {
      console.warn(
        "Error creating session data:",
        error instanceof Error ? error.message : "Unknown error",
      );
      // Return a minimal session data object
      const fallbackSessionData: SessionData = {
        sessionId: crypto.randomUUID(),
        ipAddress: "unknown",
        userAgent: navigator.userAgent,
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        rememberMe,
      };
      return fallbackSessionData;
    }
  };

  // Load existing session data
  const loadSessionData = () => {
    const stored =
      localStorage.getItem("forex_session") ||
      sessionStorage.getItem("forex_session");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSessionData(data);
        return data;
      } catch {
        return null;
      }
    }
    return null;
  };

  // Update last activity
  const updateLastActivity = () => {
    if (sessionData) {
      const updated = {
        ...sessionData,
        lastActivity: new Date().toISOString(),
      };
      setSessionData(updated);

      if (sessionData.rememberMe) {
        localStorage.setItem("forex_session", JSON.stringify(updated));
      } else {
        sessionStorage.setItem("forex_session", JSON.stringify(updated));
      }
    }
  };

  useEffect(() => {
    // Defer visitor tracking to avoid startup errors
    const timer = setTimeout(() => {
      trackVisitor();
    }, 1000);

    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      // Check if user is admin
      if (session?.user?.email) {
        const adminEmails = [
          "admin@forexsignals.com", 
          "reno@forexsignals.com",
          "admin@forextraderssignals.com"
        ];
        setIsAdmin(adminEmails.includes(session.user.email));
      }

      // Load session data
      loadSessionData();

      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        const adminEmails = [
          "admin@forexsignals.com", 
          "reno@forexsignals.com",
          "admin@forextraderssignals.com"
        ];
        setIsAdmin(adminEmails.includes(session.user.email));
      } else {
        setIsAdmin(false);
      }

      if (event === "SIGNED_OUT") {
        // Clear session data on signout
        localStorage.removeItem("forex_session");
        sessionStorage.removeItem("forex_session");
        setSessionData(null);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    // Update activity every minute
    const activityInterval = setInterval(updateLastActivity, 60000);

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
      clearInterval(activityInterval);
    };
  }, [sessionData]);

  const signUp = async (
    email: string,
    password: string,
    userData?: EnhancedUserData,
  ) => {
    try {
      let result;

      if (userData) {
        // Use enhanced authentication with additional user data
        result = await enhancedAuth.enhancedSignUp(email, password, userData);
      } else {
        // Fallback to basic Supabase auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        result = { user: data.user, error };
      }

      if (!result.error && result.user) {
        await createSessionData(false);
        toast({
          title: "Account created successfully!",
          description: userData
            ? `Registration completed using ${enhancedAuth.getActiveDatabase()} database.`
            : "Please check your email for verification.",
        });
      }

      return { user: result.user, error: result.error };
    } catch (error: any) {
      console.error("SignUp error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        email,
        hasUserData: !!userData,
      });
      return {
        user: null,
        error: { message: error.message || "Sign up failed" },
      };
    }
  };

  const signIn = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        await createSessionData(rememberMe);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }

      return { user: data.user, error };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      return { user: data.user, error };
    } catch (error: any) {
      return { user: null, error };
    }
  };

  const signInWithTelegram = async () => {
    try {
      // Get Telegram bot URL from enhanced auth
      const telegramUrl = await enhancedAuth.initiateTelegramAuth();

      // Open Telegram bot in new window
      const telegramWindow = window.open(
        telegramUrl,
        "_blank",
        "width=400,height=600",
      );

      // Set up message listener for Telegram authentication result
      const handleTelegramAuth = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "TELEGRAM_AUTH_SUCCESS") {
          const { authData, action } = event.data;

          // Process Telegram authentication
          enhancedAuth
            .authenticateWithTelegram(authData, action)
            .then((result) => {
              if (result.error) {
                toast({
                  title: "Telegram Authentication Failed",
                  description: result.error.message,
                  variant: "destructive",
                });
              } else if (result.user) {
                toast({
                  title: "Telegram Authentication Successful",
                  description: `Welcome back! Authenticated via Telegram.`,
                });

                // Trigger Supabase session update or manual session creation
                if (action === "login") {
                  // Simulate successful authentication
                  setUser(result.user as any);
                  createSessionData(false);
                }
              }
            })
            .catch((error) => {
              toast({
                title: "Authentication Error",
                description:
                  error.message || "Failed to process Telegram authentication",
                variant: "destructive",
              });
            });

          // Clean up
          window.removeEventListener("message", handleTelegramAuth);
          if (telegramWindow) telegramWindow.close();
        }
      };

      window.addEventListener("message", handleTelegramAuth);

      toast({
        title: "Telegram Authentication",
        description:
          "Please complete authentication in the Telegram bot that just opened.",
      });

      // Clean up after 5 minutes
      setTimeout(() => {
        window.removeEventListener("message", handleTelegramAuth);
      }, 300000);

      return { user: null, error: null };
    } catch (error: any) {
      console.error("Telegram authentication error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      return {
        user: null,
        error: {
          message:
            error.message || "Failed to initiate Telegram authentication",
        },
      };
    }
  };

  const adminSignIn = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
  ) => {
    try {
      // Try enhanced admin authentication first
      const { user: adminUser, error: adminError } =
        await enhancedAuth.verifyAdminCredentials(email, password);

      if (!adminError && adminUser) {
        await createSessionData(rememberMe);
        setIsAdmin(true);
        toast({
          title: "Admin access granted",
          description: `Welcome to the admin panel (${enhancedAuth.getActiveDatabase()}).`,
        });
        return { user: adminUser as any, error: null };
      }

      // Fallback to Supabase auth for backward compatibility
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.user) {
        const adminEmails = [
          "admin@forexsignals.com",
          "reno@forexsignals.com",
          "admin@forextraderssignals.com",
          "demo@forextraderssignals.com",
        ];

        if (!adminEmails.includes(data.user.email || "")) {
          await supabase.auth.signOut();
          return {
            user: null,
            error: {
              message: "Access denied. Admin credentials required.",
            } as AuthError,
          };
        }

        await createSessionData(rememberMe);
        setIsAdmin(true);
        toast({
          title: "Admin access granted",
          description: "Welcome to the admin panel (Supabase).",
        });
        return { user: data.user, error: null };
      }

      return {
        user: null,
        error:
          adminError ||
          error ||
          ({ message: "Invalid admin credentials" } as AuthError),
      };
    } catch (error: any) {
      console.error("Admin sign-in error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        email,
      });
      return {
        user: null,
        error: {
          message:
            error instanceof Error ? error.message : "Admin sign-in failed",
        },
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      // Clear all session data
      localStorage.removeItem("forex_session");
      sessionStorage.removeItem("forex_session");
      setSessionData(null);
      setIsAdmin(false);

      if (!error) {
        toast({
          title: "Signed out successfully",
          description: "You have been logged out of your account.",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (!error) {
        toast({
          title: "Password reset email sent",
          description: "Check your email for password reset instructions.",
        });
      }

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    sessionData,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithTelegram: async () => ({ user: null, error: null }) as any, // Placeholder
    signOut,
    resetPassword,
    adminSignIn,
    trackVisitor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
