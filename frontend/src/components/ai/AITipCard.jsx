import React, { useState } from 'react';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';



export const AITipCard = ({title,
  description,
  onDismiss,
  variant = 'default',
  className,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "ai-insight relative group",
        variant === 'compact' ? 'p-3' : 'p-4',
        className
      )}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>
      
      <div className="flex gap-3">
        <div className={cn(
          "shrink-0 rounded-lg bg-primary/10 flex items-center justify-center",
          variant === 'compact' ? 'w-8 h-8' : 'w-10 h-10'
        )}>
          <Lightbulb className={cn(
            "text-primary",
            variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'
          )} />
        </div>
        
        <div className="min-w-0 flex-1">
          <h4 className={cn(
            "font-semibold text-foreground",
            variant === 'compact' ? 'text-sm' : 'text-base'
          )}>
            {title}
          </h4>
          <p className={cn(
            "text-muted-foreground mt-0.5",
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
