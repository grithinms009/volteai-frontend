import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Loader2, FileText, AlertCircle, CheckCircle, 
  Clock, TrendingUp, Wallet, BarChart3, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiCall } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface Bill {
  id: string;
  createdAt: string;
  providerName?: string;
  unitsConsumed?: number;
  monthlySavingsEstimate?: number;
  status: 'completed' | 'processing' | 'failed';
  paid: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, name, logout } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSaved: 0,
    reportsCount: 0,
    avgScore: 0,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    fetchBills();
  }, [isAuthenticated, navigate]);

  const fetchBills = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await apiCall(`/api/bills/user/${userId}`);
      setBills(response.bills || []);
      
      // Calculate stats
      const completedBills = response.bills?.filter((b: Bill) => b.status === 'completed') || [];
      const totalSaved = completedBills.reduce((sum: number, b: Bill) => sum + (b.monthlySavingsEstimate || 0), 0);
      
      setStats({
        totalSaved,
        reportsCount: completedBills.length,
        avgScore: 68, // Placeholder - would come from backend
      });
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    navigate('/');
  };

  const handleViewReport = (billId: string) => {
    // Would open a modal or navigate to detailed view
    toast.info('Detailed view coming soon');
  };

  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-primary animate-pulse" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: Bill['status']) => {
    const styles = {
      completed: 'bg-accent/20 text-accent',
      processing: 'bg-primary/20 text-primary',
      failed: 'bg-destructive/20 text-destructive',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-4 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-foreground/60">Track your energy savings</p>
          </div>
          <Button onClick={handleNewAnalysis} className="gradient-cta text-white gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-accent" />
              </div>
              <span className="text-foreground/60">Total Saved</span>
            </div>
            <p className="text-3xl font-bold text-white">₹{stats.totalSaved.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground/60">Reports</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.reportsCount}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground/60">Avg Score</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats.avgScore}/100</p>
          </motion.div>
        </div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
        >
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-white">Your Reports</h2>
          </div>

          {bills.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/60 mb-4">No reports yet</p>
              <p className="text-foreground/40 text-sm mb-6">
                Upload your first bill to get started
              </p>
              <Button onClick={handleNewAnalysis} className="gradient-cta text-white">
                Upload Your First Bill
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {bills.map((bill) => (
                <div
                  key={bill.id}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getStatusIcon(bill.status)}
                    <div>
                      <p className="font-medium text-white">
                        {bill.providerName || 'Unknown Provider'}
                      </p>
                      <p className="text-sm text-foreground/50">
                        {new Date(bill.createdAt).toLocaleDateString()}
                        {bill.unitsConsumed && ` • ${bill.unitsConsumed} kWh`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(bill.status)}
                    {bill.monthlySavingsEstimate && (
                      <span className="text-accent font-medium">
                        ₹{bill.monthlySavingsEstimate}/mo saved
                      </span>
                    )}
                    {!bill.paid && bill.status === 'completed' && (
                      <Lock className="w-4 h-4 text-foreground/40" />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(bill.id)}
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
