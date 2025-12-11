import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DEPARTMENTS, YEARS } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface DepartmentYearStepProps {
  department: string;
  year: string;
  onDepartmentChange: (dept: string) => void;
  onYearChange: (year: string) => void;
  onNext: () => void;
}

export const DepartmentYearStep = ({
  department,
  year,
  onDepartmentChange,
  onYearChange,
  onNext,
}: DepartmentYearStepProps) => {
  const canProceed = department && year;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Let's Get Started
        </h2>
        <p className="text-muted-foreground">
          Select your department and year to begin
        </p>
      </div>

      {/* Department Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <GraduationCap className="w-4 h-4 text-accent" />
          <span>Department</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {DEPARTMENTS.map((dept) => (
            <motion.button
              key={dept}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDepartmentChange(dept)}
              className={cn(
                "p-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                department === dept
                  ? "bg-primary text-primary-foreground shadow-medium"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {dept}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Year Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="w-4 h-4 text-accent" />
          <span>Year</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {YEARS.map((y) => (
            <motion.button
              key={y}
              whileTap={{ scale: 0.98 }}
              onClick={() => onYearChange(y)}
              className={cn(
                "p-3 rounded-lg text-sm font-medium transition-all duration-200",
                year === y
                  ? "bg-accent text-accent-foreground shadow-glow"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {y}
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        variant="gradient"
        size="lg"
        className="w-full mt-6"
        onClick={onNext}
        disabled={!canProceed}
      >
        Continue to Subjects
      </Button>
    </motion.div>
  );
};
