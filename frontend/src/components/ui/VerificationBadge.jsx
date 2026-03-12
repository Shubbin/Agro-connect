import React from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const VerificationBadge = ({ status = 'unverified', className }) => {
  const config = {
    verified: {
      icon: ShieldCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      label: 'Verified Producer',
      description: 'This farmer has completed the core verification process.'
    },
    premium: {
      icon: ShieldCheck,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      label: 'Elite Partner',
      description: 'Top-tier partner with consistent quality and high-trust rating.'
    },
    pending: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-600/10',
      label: 'Verification Pending',
      description: 'Documents are currently under review by our team.'
    },
    unverified: {
      icon: CheckCircle2,
      color: 'text-muted-foreground/40',
      bgColor: 'bg-secondary',
      label: 'Community Member',
      description: 'This member has not yet applied for verification.'
    }
  };

  const current = config[status] || config.unverified;
  const Icon = current.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-help transition-all hover:scale-105 active:scale-95",
            current.bgColor,
            current.color,
            className
          )}>
            <Icon className="w-3 h-3" />
            <span>{current.label}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="glass-premium border-border/50 p-4 max-w-xs rounded-2xl">
          <div className="space-y-1">
            <p className="font-black text-foreground">{current.label}</p>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              {current.description}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
