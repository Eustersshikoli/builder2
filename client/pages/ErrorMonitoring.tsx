import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Bug,
  Database,
  Globe,
  Server,
  User,
  Calendar,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  category: 'database' | 'auth' | 'api' | 'frontend' | 'payment' | 'general';
  message: string;
  details?: any;
  userId?: string;
  userAgent?: string;
  url?: string;
  stack?: string;
  resolved: boolean;
}

// Mock error data - in production this would come from your logging service
const mockErrors: ErrorLog[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    level: 'error',
    category: 'database',
    message: 'Failed to create user profile',
    details: { code: 'PGRST116', hint: 'Check table permissions' },
    userId: 'user_123',
    userAgent: 'Mozilla/5.0...',
    url: '/dashboard',
    stack: 'Error: Failed to create...',
    resolved: false,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    level: 'warning',
    category: 'auth',
    message: 'Multiple failed login attempts',
    details: { attempts: 5, ip: '192.168.1.1' },
    userId: 'user_456',
    url: '/login',
    resolved: true,
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    level: 'error',
    category: 'payment',
    message: 'Payment processing failed',
    details: { gateway: 'nowpayments', amount: 100, currency: 'USD' },
    userId: 'user_789',
    url: '/dashboard',
    resolved: false,
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    level: 'error',
    category: 'api',
    message: 'External API rate limit exceeded',
    details: { api: 'alphavantage', limit: 500 },
    url: '/signals',
    resolved: false,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    level: 'warning',
    category: 'frontend',
    message: 'Component render error recovered',
    details: { component: 'ForexSignalsDashboard' },
    url: '/dashboard',
    resolved: true,
  },
];

export default function ErrorMonitoring() {
  const [errors, setErrors] = useState<ErrorLog[]>(mockErrors);
  const [filteredErrors, setFilteredErrors] = useState<ErrorLog[]>(mockErrors);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [filters, setFilters] = useState({
    level: 'all',
    category: 'all',
    resolved: 'all',
    timeRange: '24h',
    search: '',
  });

  // Filter errors based on current filters
  useEffect(() => {
    let filtered = errors;

    if (filters.level !== 'all') {
      filtered = filtered.filter(error => error.level === filters.level);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(error => error.category === filters.category);
    }

    if (filters.resolved !== 'all') {
      const isResolved = filters.resolved === 'resolved';
      filtered = filtered.filter(error => error.resolved === isResolved);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(error => 
        error.message.toLowerCase().includes(searchLower) ||
        error.category.toLowerCase().includes(searchLower) ||
        (error.userId && error.userId.toLowerCase().includes(searchLower))
      );
    }

    // Time range filter
    const now = Date.now();
    const timeFilters = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    };

    if (filters.timeRange !== 'all') {
      const timeLimit = timeFilters[filters.timeRange as keyof typeof timeFilters];
      filtered = filtered.filter(error => 
        now - new Date(error.timestamp).getTime() <= timeLimit
      );
    }

    setFilteredErrors(filtered);
  }, [errors, filters]);

  const getErrorIcon = (category: string) => {
    switch (category) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'auth': return <User className="h-4 w-4" />;
      case 'api': return <Server className="h-4 w-4" />;
      case 'frontend': return <Globe className="h-4 w-4" />;
      case 'payment': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bug className="h-4 w-4" />;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive" className="text-xs">Error</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-xs">Info</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const markAsResolved = (errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));
  };

  const deleteError = (errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
    if (selectedError?.id === errorId) {
      setSelectedError(null);
    }
  };

  const clearAllResolved = () => {
    setErrors(prev => prev.filter(error => !error.resolved));
  };

  const exportErrors = () => {
    const dataStr = JSON.stringify(filteredErrors, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const refreshErrors = () => {
    // In production, this would refetch from your logging service
    console.log('Refreshing error logs...');
  };

  const errorStats = {
    total: errors.length,
    unresolved: errors.filter(e => !e.resolved).length,
    critical: errors.filter(e => e.level === 'error' && !e.resolved).length,
    warnings: errors.filter(e => e.level === 'warning' && !e.resolved).length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Error Monitoring</h1>
          <p className="text-gray-600">Monitor and manage application errors and warnings</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshErrors} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportErrors} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={clearAllResolved} variant="outline" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Resolved
          </Button>
        </div>
      </div>

      {/* Error Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bug className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Errors</p>
                <p className="text-2xl font-bold">{errorStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Unresolved</p>
                <p className="text-2xl font-bold text-yellow-600">{errorStats.unresolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{errorStats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-orange-600">{errorStats.warnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search errors..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={filters.level} onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.resolved} onValueChange={(value) => setFilters(prev => ({ ...prev, resolved: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select value={filters.timeRange} onValueChange={(value) => setFilters(prev => ({ ...prev, timeRange: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => setFilters({
                  level: 'all',
                  category: 'all',
                  resolved: 'all',
                  timeRange: '24h',
                  search: '',
                })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error List */}
        <Card>
          <CardHeader>
            <CardTitle>Error Log ({filteredErrors.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {filteredErrors.map((error) => (
                  <div
                    key={error.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedError?.id === error.id 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    } ${error.resolved ? 'opacity-60' : ''}`}
                    onClick={() => setSelectedError(error)}
                  >
                    <div className="flex items-start justify-between space-x-2">
                      <div className="flex items-start space-x-2 flex-1">
                        {getErrorIcon(error.category)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            {getLevelBadge(error.level)}
                            <Badge variant="outline" className="text-xs">
                              {error.category}
                            </Badge>
                            {error.resolved && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {error.message}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(error.timestamp).toLocaleString()}</span>
                            {error.userId && (
                              <>
                                <span>•</span>
                                <User className="h-3 w-3" />
                                <span>{error.userId}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedError(error);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        {!error.resolved && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsResolved(error.id);
                            }}
                          >
                            ✓
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteError(error.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredErrors.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No errors found matching the current filters.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Error Details */}
        <Card>
          <CardHeader>
            <CardTitle>Error Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedError ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getErrorIcon(selectedError.category)}
                    <span className="font-medium">{selectedError.category}</span>
                  </div>
                  <div className="flex space-x-2">
                    {getLevelBadge(selectedError.level)}
                    {selectedError.resolved && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        Resolved
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <p className="text-gray-700">{selectedError.message}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Timestamp</h4>
                  <p className="text-gray-700">{new Date(selectedError.timestamp).toLocaleString()}</p>
                </div>

                {selectedError.userId && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">User ID</h4>
                    <p className="text-gray-700">{selectedError.userId}</p>
                  </div>
                )}

                {selectedError.url && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">URL</h4>
                    <p className="text-gray-700 break-all">{selectedError.url}</p>
                  </div>
                )}

                {selectedError.userAgent && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">User Agent</h4>
                    <p className="text-gray-700 text-sm break-all">{selectedError.userAgent}</p>
                  </div>
                )}

                {selectedError.details && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedError.details, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedError.stack && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Stack Trace</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}

                <div className="flex space-x-2 pt-4">
                  {!selectedError.resolved && (
                    <Button
                      onClick={() => markAsResolved(selectedError.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Resolved
                    </Button>
                  )}
                  <Button
                    onClick={() => deleteError(selectedError.id)}
                    variant="destructive"
                  >
                    Delete Error
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Bug className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select an error from the list to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
