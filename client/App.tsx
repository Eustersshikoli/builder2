import "./global.css";
import "./lib/startup-validation"; // Import for auto-validation in development

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/EnhancedAuthContext";
import { InvestmentProvider } from "@/contexts/InvestmentContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import NavigationGuard from "@/components/NavigationGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import News from "./pages/News";
import Dashboard from "./pages/Dashboard";
import EnhancedUserDashboard from "./pages/EnhancedUserDashboard";
import TestDashboard from "./pages/TestDashboard";
import Admin from "./pages/Admin";
import SuperAdmin from "./pages/SuperAdmin";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import ErrorMonitoring from "./pages/ErrorMonitoring";
import Promo from "./pages/Promo";
import Offers from "./pages/Offers";
import Education from "./pages/Education";
import InvestmentPlans from "./pages/InvestmentPlans";
import LiveSignals from "./pages/LiveSignals";
import LiveSignalsStandalone from "./pages/LiveSignalsStandalone";
import Testimonials from "./pages/Testimonials";
import TestimonialsStandalone from "./pages/TestimonialsStandalone";
import InvestmentPlansStandalone from "./pages/InvestmentPlansStandalone";
import Reviews from "./pages/Reviews";
import DatabaseDiagnostic from "./pages/DatabaseDiagnostic";
import NotFound from "./pages/NotFound";
import TelegramSignals from "./pages/TelegramSignals";
import ReviewsStandalone from "./pages/ReviewsStandalone";
import VisitorTracker from "./components/VisitorTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InvestmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <VisitorTracker />
            <NavigationGuard>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/education" element={<Education />} />
                <Route path="/promo" element={<Promo />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/news" element={<News />} />
                {/* Standalone pages accessible without login */}
                <Route path="/telegramsignals" element={<TelegramSignals />} />
                <Route path="/reviews" element={<ReviewsStandalone />} />
                <Route
                  path="/live-signals"
                  element={<LiveSignalsStandalone />}
                />
                <Route
                  path="/testimonials"
                  element={<TestimonialsStandalone />}
                />
                <Route
                  path="/investment-plans"
                  element={<InvestmentPlansStandalone />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <EnhancedUserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/test-dashboard"
                  element={
                    <ProtectedRoute>
                      <TestDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="/eustersmain" element={<AdminLogin />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route
                  path="/admin-panel"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/error-monitoring"
                  element={
                    <ProtectedRoute>
                      <ErrorMonitoring />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/investment-plans"
                  element={
                    <ProtectedRoute>
                      <InvestmentPlans />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/live-signals"
                  element={
                    <ProtectedRoute>
                      <LiveSignals />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/testimonials"
                  element={
                    <ProtectedRoute>
                      <Testimonials />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute>
                      <Reviews />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/db-diagnostic"
                  element={
                    <ProtectedRoute>
                      <DatabaseDiagnostic />
                    </ProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NavigationGuard>
          </BrowserRouter>
        </TooltipProvider>
      </InvestmentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
