import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const OrderTimeline = ({ status }) => {
  const steps = [
    { id: 'pending', label: 'Order Placed', icon: Clock },
    { id: 'confirmed', label: 'Processing', icon: Package },
    { id: 'shipped', label: 'In Transit', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);
  
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between relative px-2">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000" 
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex;
          const Icon = step.icon;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl",
                  isActive 
                    ? "bg-primary text-white scale-110 shadow-primary/20" 
                    : "bg-white text-muted-foreground border border-border"
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <p className={cn(
                "mt-4 text-[10px] font-black uppercase tracking-widest text-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
