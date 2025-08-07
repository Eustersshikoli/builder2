import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  RefreshCw,
  User,
} from "lucide-react";

interface DiagnosticResult {
  test: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: any;
}

export default function DatabaseDiagnostic() {
  const { user } = useAuth();
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [running, setRunning] = useState(false);

  const runDiagnostics = async () => {
    setRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    // Test 1: Basic Supabase connection
    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      diagnosticResults.push({
        test: "Supabase Authentication",
        status: authError ? "error" : "success",
        message: authError
          ? `Auth error: ${authError.message}`
          : "Authentication working",
        details: authError || { user: !!authData.user },
      });
    } catch (error) {
      diagnosticResults.push({
        test: "Supabase Authentication",
        status: "error",
        message: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error,
      });
    }

    // Test 2: Check if user_profiles table exists
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("count(*)")
        .limit(1);

      if (error) {
        diagnosticResults.push({
          test: "user_profiles table",
          status: "error",
          message: `Table access error: ${error.message}`,
          details: error,
        });
      } else {
        diagnosticResults.push({
          test: "user_profiles table",
          status: "success",
          message: "Table exists and accessible",
          details: data,
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "user_profiles table",
        status: "error",
        message: `Table test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error,
      });
    }

    // Test 3: Check if user_balances table exists
    try {
      const { data, error } = await supabase
        .from("user_balances")
        .select("count(*)")
        .limit(1);

      if (error) {
        diagnosticResults.push({
          test: "user_balances table",
          status: "error",
          message: `Table access error: ${error.message}`,
          details: error,
        });
      } else {
        diagnosticResults.push({
          test: "user_balances table",
          status: "success",
          message: "Table exists and accessible",
          details: data,
        });
      }
    } catch (error) {
      diagnosticResults.push({
        test: "user_balances table",
        status: "error",
        message: `Table test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: error,
      });
    }

    // Test 4: Current user profile check
    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          diagnosticResults.push({
            test: "Current user profile",
            status: "warning",
            message: "User profile does not exist",
            details: { user_id: user.id, error },
          });
        } else if (error) {
          diagnosticResults.push({
            test: "Current user profile",
            status: "error",
            message: `Profile check error: ${error.message}`,
            details: error,
          });
        } else {
          diagnosticResults.push({
            test: "Current user profile",
            status: "success",
            message: "User profile exists",
            details: data,
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Current user profile",
          status: "error",
          message: `Profile test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        });
      }

      // Test 5: Current user balance check
      try {
        const { data, error } = await supabase
          .from("user_balances")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code === "PGRST116") {
          diagnosticResults.push({
            test: "Current user balance",
            status: "warning",
            message: "User balance does not exist",
            details: { user_id: user.id, error },
          });
        } else if (error) {
          diagnosticResults.push({
            test: "Current user balance",
            status: "error",
            message: `Balance check error: ${error.message}`,
            details: error,
          });
        } else {
          diagnosticResults.push({
            test: "Current user balance",
            status: "success",
            message: "User balance exists",
            details: data,
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "Current user balance",
          status: "error",
          message: `Balance test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        });
      }
    }

    // Test 6: Try to create user profile (if user exists)
    if (user?.id) {
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .insert({
            id: user.id,
            email: user.email || "",
            full_name:
              user.user_metadata?.full_name || user.email || "Test User",
          })
          .select()
          .single();

        if (error && error.code === "23505") {
          diagnosticResults.push({
            test: "User profile creation test",
            status: "warning",
            message: "Profile already exists (duplicate key)",
            details: error,
          });
        } else if (error) {
          diagnosticResults.push({
            test: "User profile creation test",
            status: "error",
            message: `Creation failed: ${error.message}`,
            details: error,
          });
        } else {
          diagnosticResults.push({
            test: "User profile creation test",
            status: "success",
            message: "Profile created successfully",
            details: data,
          });
        }
      } catch (error) {
        diagnosticResults.push({
          test: "User profile creation test",
          status: "error",
          message: `Creation test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          details: error,
        });
      }
    }

    setResults(diagnosticResults);
    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-600" />
              <CardTitle>Database Diagnostic</CardTitle>
            </div>
            <p className="text-gray-600">
              Diagnose database connection and table structure issues
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Current User
              </h3>
              <div className="text-sm space-y-1">
                <div>
                  <strong>ID:</strong> {user?.id || "Not logged in"}
                </div>
                <div>
                  <strong>Email:</strong> {user?.email || "N/A"}
                </div>
                <div>
                  <strong>Metadata:</strong>{" "}
                  {JSON.stringify(user?.user_metadata || {})}
                </div>
              </div>
            </div>

            {/* Run Diagnostics Button */}
            <Button
              onClick={runDiagnostics}
              disabled={running}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {running ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Run Database Diagnostics
                </>
              )}
            </Button>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Diagnostic Results</h3>
                {results.map((result, index) => (
                  <Card
                    key={index}
                    className={`border-l-4 ${getStatusColor(result.status)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{result.test}</h4>
                            <Badge
                              variant={
                                result.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {result.status}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{result.message}</p>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-xs text-gray-500 cursor-pointer">
                                Show details
                              </summary>
                              <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
