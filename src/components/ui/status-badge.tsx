
import { cn } from '@/lib/utils';
import { Transaction } from '@/types';

interface StatusBadgeProps {
  status: Transaction['status'];
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'status-pending',
  },
  payment_received: {
    label: 'Payment Received',
    className: 'status-processing',
  },
  usdt_sent: {
    label: 'USDT Sent',
    className: 'status-processing',
  },
  completed: {
    label: 'Completed',
    className: 'status-completed',
  },
  failed: {
    label: 'Failed',
    className: 'status-failed',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}
