import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.1 : 1,
                backgroundColor: index < currentStep 
                  ? 'hsl(var(--accent))' 
                  : index === currentStep 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--muted))'
              }}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                index <= currentStep ? "text-primary-foreground" : "text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={cn(
              "text-xs mt-1 hidden sm:block max-w-[60px] text-center",
              index === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              "w-8 sm:w-12 h-0.5 mx-1 transition-colors duration-300",
              index < currentStep ? "bg-accent" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
};
