import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Database,
  CheckCircle,
  XCircle,
  Settings,
  Loader2,
  Users,
  Key,
  RefreshCw,
} from "lucide-react";
import { enhancedAuth } from "@/lib/enhanced-auth";
import { dualDb } from "@/lib/dual-database";
import { testNeonConnection } from "@/lib/neon";
import { supabase } from "@/integrations/supabase/client";
import { ENV, getDatabaseInfo } from "@/lib/environment";

export default function DatabaseInitializer() {
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    supabase: boolean | null;
    neon: boolean | null;
    demoCredentials: boolean | null;
  }>({
    supabase: null,
    neon: null,
    demoCredentials: null,
  });
  const { toast } = useToast();

  const dbInfo = getDatabaseInfo();

  const testSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code,
        details: (error as any)?.details,
        hint: (error as any)?.hint
      });
      return false;
    }
  };

  const runConnectionTests = async () => {
    setLoading(true);
    try {
      const [supabaseResult, neonResult] = await Promise.allSettled([
        testSupabaseConnection(),
        testNeonConnection()
      ]);

      const results = {
        supabase: supabaseResult.status === 'fulfilled' ? supabaseResult.value : false,
        neon: neonResult.status === 'fulfilled' ? neonResult.value : false,
        demoCredentials: null
      };

      setTestResults(results);

      if (results.supabase || results.neon) {
        toast({
          title: "Connection Test Complete",
          description: `${results.supabase ? 'Supabase' : ''}${results.supabase && results.neon ? ' and ' : ''}${results.neon ? 'Neon' : ''} connected successfully.`,
        });
      } else {
        toast({
          title: "Connection Test Failed",
          description: "Both database connections failed. Please check your configuration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection test error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Test Error",
        description: "Failed to run connection tests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupDemoCredentials = async () => {
    setLoading(true);
    try {
      const result = await enhancedAuth.setupDemoAdminCredentials();
      
      setTestResults(prev => ({
        ...prev,
        demoCredentials: result.success
      }));

      if (result.success) {
        toast({
          title: "Demo Credentials Setup Complete",
          description: `Demo admin accounts created successfully in ${enhancedAuth.getActiveDatabase()}.`,
        });
      } else {
        toast({
          title: "Demo Credentials Setup Failed",
          description: result.message || "Failed to set up demo credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Demo credentials setup error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Setup Error",
        description: "Failed to set up demo credentials.",
        variant: "destructive",
      });
      
      setTestResults(prev => ({
        ...prev,
        demoCredentials: false
      }));
    } finally {
      setLoading(false);
    }
  };

  const switchDatabase = () => {
    const newUseNeon = !ENV.USE_NEON;
    enhancedAuth.setUseNeon(newUseNeon);
    dualDb.setUseNeon(newUseNeon);
    
    toast({
      title: "Database Switched",
      description: `Now using ${newUseNeon ? 'Neon' : 'Supabase'} as the primary database.`,
    });

    // Reset test results after switching
    setTestResults({
      supabase: null,
      neon: null,
      demoCredentials: null,
    });
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <Database className="h-4 w-4 text-gray-400" />;
    if (status === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: boolean | null) => {
    if (status === null) return <Badge variant="secondary">Not Tested</Badge>;
    if (status === true) return <Badge variant="default" className="bg-green-500">Connected</Badge>;
    return <Badge variant="destructive">Failed</Badge>;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Database Initializer</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Configuration */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Current Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Database:</span>
                <Badge variant={dbInfo.active === 'Neon' ? 'default' : 'secondary'}>
                  {dbInfo.active}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Supabase:</span>
                <Badge variant={dbInfo.supabaseConfigured ? 'default' : 'destructive'}>
                  {dbInfo.supabaseConfigured ? 'Configured' : 'Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Neon:</span>
                <Badge variant={dbInfo.neonConfigured ? 'default' : 'destructive'}>
                  {dbInfo.neonConfigured ? 'Configured' : 'Missing'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dual Mode:</span>
                <Badge variant={dbInfo.dualEnabled ? 'default' : 'secondary'}>
                  {dbInfo.dualEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Connection Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResults.supabase)}
                <span className="font-medium">Supabase</span>
              </div>
              {getStatusBadge(testResults.supabase)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResults.neon)}
                <span className="font-medium">Neon</span>
              </div>
              {getStatusBadge(testResults.neon)}
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResults.demoCredentials)}
                <span className="font-medium">Demo Credentials</span>
              </div>
              {getStatusBadge(testResults.demoCredentials)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={runConnectionTests}
              disabled={loading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Test Connections</span>
            </Button>

            <Button
              onClick={setupDemoCredentials}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              <span>Setup Demo Accounts</span>
            </Button>

            {dbInfo.supabaseConfigured && dbInfo.neonConfigured && (
              <Button
                onClick={switchDatabase}
                disabled={loading}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Database className="h-4 w-4" />
                <span>Switch to {dbInfo.active === 'Neon' ? 'Supabase' : 'Neon'}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Demo Credentials Info */}
        <Alert>
          <Key className="h-4 w-4" />
          <AlertDescription>
            <strong>Demo Admin Credentials:</strong>
            <br />
            Email: admin@forextraderssignals.com
            <br />
            Password: Demo@2024!
            <br />
            <br />
            Alternative Demo Account:
            <br />
            Email: demo@forextraderssignals.com
            <br />
            Password: Demo@2024!
          </AlertDescription>
        </Alert>

        {/* Environment Info */}
        {ENV.DEV_MODE && (
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Development Mode Active</strong>
              <br />
              Current active database: {enhancedAuth.getActiveDatabase()}
              <br />
              You can switch between databases using the controls above.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
