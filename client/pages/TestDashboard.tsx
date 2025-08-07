import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

export default function TestDashboard() {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    console.log(message);
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    if (!user) {
      addResult("❌ No user available");
      return;
    }

    setLoading(true);
    setTestResults([]);
    addResult("🔍 Starting database tests...");

    try {
      // Test 1: Basic Supabase connection
      addResult("Test 1: Basic Supabase connection");
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        addResult(`❌ Auth test failed: ${authError.message}`);
      } else {
        addResult(`✅ Auth test passed, user ID: ${authData.user?.id}`);
      }

      // Test 2: User profiles table
      addResult("Test 2: User profiles table access");
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, email')
        .eq('id', user.id)
        .limit(1);

      if (profileError) {
        addResult(`❌ User profiles query failed: ${profileError.message} (Code: ${profileError.code})`);
      } else {
        addResult(`✅ User profiles query passed, found ${profileData?.length || 0} records`);
      }

      // Test 3: User investments table
      addResult("Test 3: User investments table access");
      const { data: investmentData, error: investmentError } = await supabase
        .from('user_investments')
        .select('id, amount')
        .eq('user_id', user.id)
        .limit(1);

      if (investmentError) {
        addResult(`❌ User investments query failed: ${investmentError.message} (Code: ${investmentError.code})`);
      } else {
        addResult(`✅ User investments query passed, found ${investmentData?.length || 0} records`);
      }

      // Test 4: User balances table
      addResult("Test 4: User balances table access");
      const { data: balanceData, error: balanceError } = await supabase
        .from('user_balances')
        .select('id, balance')
        .eq('user_id', user.id)
        .limit(1);

      if (balanceError) {
        addResult(`❌ User balances query failed: ${balanceError.message} (Code: ${balanceError.code})`);
      } else {
        addResult(`✅ User balances query passed, found ${balanceData?.length || 0} records`);
      }

      // Test 5: Payments table
      addResult("Test 5: Payments table access");
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('id, amount')
        .eq('user_id', user.id)
        .limit(1);

      if (paymentError) {
        addResult(`❌ Payments query failed: ${paymentError.message} (Code: ${paymentError.code})`);
      } else {
        addResult(`✅ Payments query passed, found ${paymentData?.length || 0} records`);
      }

      addResult("🎉 Database tests completed");

    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      runTests();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="mb-4">
                <strong>User Info:</strong>
                <ul className="ml-4 text-sm">
                  <li>ID: {user?.id || 'Not available'}</li>
                  <li>Email: {user?.email || 'Not available'}</li>
                  <li>Metadata: {JSON.stringify(user?.user_metadata) || 'Not available'}</li>
                </ul>
              </div>
              
              <div className="border rounded p-4 bg-gray-50 max-h-96 overflow-y-auto">
                {testResults.length === 0 && !loading && (
                  <p className="text-gray-500">No tests run yet</p>
                )}
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))}
                {loading && (
                  <div className="text-sm font-mono text-blue-600">
                    ⏳ Running tests...
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
