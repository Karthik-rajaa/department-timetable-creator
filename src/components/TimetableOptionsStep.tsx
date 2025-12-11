import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TimetableDisplay } from './TimetableDisplay';
import { Timetable } from '@/types/timetable';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TimetableOptionsStepProps {
  timetables: Timetable[];
  onBack: () => void;
  onRegenerate: () => void;
}

export const TimetableOptionsStep = ({
  timetables,
  onBack,
  onRegenerate,
}: TimetableOptionsStepProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const timetableRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const handleExport = async () => {
    if (selectedIndex === null) return;
    
    const element = timetableRefs.current[selectedIndex];
    if (!element) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `timetable-option-${selectedIndex + 1}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Timetable exported!",
        description: "Your timetable has been downloaded as PNG.",
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
          Choose Your Timetable
        </h2>
        <p className="text-muted-foreground text-sm">
          Select one of the three generated options
        </p>
      </div>

      {/* Timetable Options */}
      <div className="space-y-4">
        {timetables.map((timetable, index) => (
          <motion.div
            key={timetable.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-300 overflow-hidden",
                selectedIndex === index
                  ? "ring-2 ring-accent shadow-glow"
                  : "hover:shadow-medium"
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="p-3 bg-muted/50 flex items-center justify-between">
                <span className="font-display font-semibold">
                  Option {index + 1}
                </span>
                {selectedIndex === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-accent-foreground" />
                  </motion.div>
                )}
              </div>
              <div className="p-2">
                <TimetableDisplay
                  ref={(el) => (timetableRefs.current[index] = el)}
                  timetable={timetable}
                  compact
                />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 pt-4">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleExport}
          disabled={selectedIndex === null || isExporting}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Download Selected as PNG'}
        </Button>

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onBack} className="flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={onRegenerate} className="flex-1">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
