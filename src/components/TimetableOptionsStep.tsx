import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, RefreshCw, Check, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  const exportRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const handleExportPDF = async () => {
    if (selectedIndex === null) return;
    
    setIsExporting(true);
    
    try {
      // Create a temporary container for the export
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '900px';
      container.style.backgroundColor = '#ffffff';
      document.body.appendChild(container);

      // Create a fresh render of the timetable for export
      const timetable = timetables[selectedIndex];
      container.innerHTML = `
        <div style="width: 880px; padding: 10px; background: white; font-family: system-ui, -apple-system, sans-serif;">
          <div style="background: #1e3a5f; color: white; padding: 12px; text-align: center; border-radius: 6px 6px 0 0;">
            <h2 style="margin: 0; font-size: 16px; font-weight: bold;">${timetable.department} - ${timetable.year}</h2>
            <p style="margin: 2px 0 0 0; font-size: 11px; opacity: 0.8;">Weekly Timetable</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-top: none;">
            <thead>
              <tr style="background: #f5f7fa;">
                <th style="border: 1px solid #e5e7eb; padding: 8px; width: 80px; font-weight: 600; font-size: 12px;">Time</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 600; font-size: 12px;">Monday</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 600; font-size: 12px;">Tuesday</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 600; font-size: 12px;">Wednesday</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 600; font-size: 12px;">Thursday</th>
                <th style="border: 1px solid #e5e7eb; padding: 8px; font-weight: 600; font-size: 12px;">Friday</th>
              </tr>
            </thead>
            <tbody>
              ${generateTableRows(timetable)}
            </tbody>
          </table>
        </div>
      `;

      // Use html2canvas to capture the element
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 900,
        windowWidth: 900,
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF in landscape A4
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // A4 landscape dimensions: 297mm x 210mm
      const pageWidth = 297;
      const pageHeight = 210;
      const margin = 8;
      
      // Calculate the aspect ratio of the canvas
      const canvasAspect = canvas.width / canvas.height;
      
      // Available space
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);
      
      // Fit the image to the available space while maintaining aspect ratio
      let finalWidth, finalHeight;
      
      if (availableWidth / availableHeight > canvasAspect) {
        // Height is the limiting factor
        finalHeight = availableHeight;
        finalWidth = finalHeight * canvasAspect;
      } else {
        // Width is the limiting factor
        finalWidth = availableWidth;
        finalHeight = finalWidth / canvasAspect;
      }

      // Position at top-left with margin (not centered vertically)
      const xOffset = margin;
      const yOffset = margin;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);

      // Save the PDF
      pdf.save(`timetable-${timetable.department.toLowerCase().replace(/\s+/g, '-')}-${timetable.year.toLowerCase().replace(/\s+/g, '-')}.pdf`);

      toast({
        title: "Timetable exported!",
        description: "Your timetable has been downloaded as PDF.",
      });
    } catch (err) {
      console.error('Export error:', err);
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
              <div className="p-2 overflow-x-auto">
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
          onClick={handleExportPDF}
          disabled={selectedIndex === null || isExporting}
          className="w-full"
        >
          <FileText className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Download Selected as PDF'}
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

// Helper function to generate table rows HTML
function generateTableRows(timetable: Timetable): string {
  const timeSlots = [
    { time: '09:30-10:15', type: 'class', label: 'Slot 1' },
    { time: '10:15-11:00', type: 'class', label: 'Slot 2' },
    { time: '11:00-11:15', type: 'break', label: 'Morning Break' },
    { time: '11:15-12:00', type: 'class', label: 'Slot 3' },
    { time: '12:00-12:45', type: 'class', label: 'Slot 4' },
    { time: '12:45-01:45', type: 'lunch', label: 'Lunch Break' },
    { time: '01:45-02:30', type: 'class', label: 'Slot 5' },
    { time: '02:30-03:15', type: 'class', label: 'Slot 6' },
    { time: '03:15-03:30', type: 'break', label: 'Evening Break' },
    { time: '03:30-04:15', type: 'class', label: 'Slot 7' },
  ];

  return timeSlots.map((slot, slotIndex) => {
    const isBreak = slot.type === 'break' || slot.type === 'lunch';
    const breakStyle = 'background: #fef3c7; color: #b45309; font-weight: 500;';
    const timeStyle = isBreak ? breakStyle : 'background: #fafafa;';
    
    if (isBreak) {
      return `
        <tr>
          <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 11px; ${timeStyle}">${slot.time}</td>
          <td colspan="5" style="border: 1px solid #e5e7eb; padding: 10px; text-align: center; ${breakStyle}">${slot.label}</td>
        </tr>
      `;
    }

    const dayCells = [0, 1, 2, 3, 4].map(dayIndex => {
      const cell = timetable.days[dayIndex]?.slots[slotIndex];
      
      if (!cell || cell.isEmpty) {
        return `<td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center; color: #9ca3af;">-</td>`;
      }

      if (cell.isLabContinuation) {
        return `<td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center; background: #dbeafe; color: #1e40af;"><span style="font-size: 10px; opacity: 0.7;">(continued)</span></td>`;
      }

      const isLab = cell.subject?.type === 'lab';
      const bgColor = isLab ? '#dbeafe' : '#f0fdf4';
      const textColor = isLab ? '#1e40af' : '#166534';

      return `
        <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center; background: ${bgColor}; color: ${textColor};">
          <div style="font-weight: 500;">${cell.subject?.name || '-'}</div>
          ${isLab && cell.subject?.venue ? `<div style="font-size: 10px; opacity: 0.7; margin-top: 2px;">${cell.subject.venue}</div>` : ''}
        </td>
      `;
    }).join('');

    return `
      <tr>
        <td style="border: 1px solid #e5e7eb; padding: 8px; text-align: center; font-size: 11px; ${timeStyle}">${slot.time}</td>
        ${dayCells}
      </tr>
    `;
  }).join('');
}