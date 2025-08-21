
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity
} from 'lucide-react';

interface AdminStatsGridProps {
  stats: {
    totalTransactions: { today: number; week: number; month: number };
    pendingTransactions: number;
    pendingKYC: number;
    revenue: { today: number; week: number; month: number };
  };
  totalUsers: number;
  completedTransactions: number;
}

export default function AdminStatsGrid({ stats, totalUsers, completedTransactions }: AdminStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Transactions
              </p>
              <p className="text-2xl font-bold text-brand-warning">
                {stats.pendingTransactions}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </div>
            <div className="p-2 bg-brand-warning/10 rounded-full">
              <Clock className="h-6 w-6 text-brand-warning" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending KYC
              </p>
              <p className="text-2xl font-bold text-brand-secondary">
                {stats.pendingKYC}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Require review
              </p>
            </div>
            <div className="p-2 bg-brand-secondary/10 rounded-full">
              <AlertTriangle className="h-6 w-6 text-brand-secondary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <p className="text-2xl font-bold text-brand-primary">
                {totalUsers}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Active accounts
              </p>
            </div>
            <div className="p-2 bg-brand-primary/10 rounded-full">
              <Users className="h-6 w-6 text-brand-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Today's Revenue
              </p>
              <p className="text-2xl font-bold text-brand-success">
                £{stats.revenue.today.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                From {stats.totalTransactions.today} transactions
              </p>
            </div>
            <div className="p-2 bg-brand-success/10 rounded-full">
              <TrendingUp className="h-6 w-6 text-brand-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats for larger screens */}
      <Card className="hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <Badge variant="default" className="bg-brand-success">
                  {completedTransactions}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="text-sm font-medium">{stats.totalTransactions.week}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium">{stats.totalTransactions.month}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Week Revenue</span>
                <span className="text-sm font-medium">£{stats.revenue.week.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Month Revenue</span>
                <span className="text-sm font-medium">£{stats.revenue.month.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg. Transaction</span>
                <span className="text-sm font-medium">
                  £{stats.totalTransactions.today > 0 ? (stats.revenue.today / stats.totalTransactions.today).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
