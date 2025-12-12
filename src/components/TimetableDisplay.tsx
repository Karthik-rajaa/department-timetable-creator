import { forwardRef } from 'react';
import { Timetable, TIME_SLOTS, DAYS } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface TimetableDisplayProps {
  timetable: Timetable;
  compact?: boolean;
  forExport?: boolean;
}

export const TimetableDisplay = forwardRef<HTMLDivElement, TimetableDisplayProps>(
  ({ timetable, compact = false, forExport = false }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "bg-white rounded-xl overflow-visible border border-border",
          compact && !forExport ? "text-xs" : "text-sm",
          forExport && "min-w-[900px] w-[900px]"
        )}
        style={forExport ? { backgroundColor: '#ffffff' } : undefined}
      >
        {/* Header */}
        <div 
          className="bg-primary text-primary-foreground p-3 text-center"
          style={forExport ? { backgroundColor: '#1e3a5f', color: '#ffffff' } : undefined}
        >
          <h3 className="font-display font-bold text-base">
            {timetable.department} - {timetable.year}
          </h3>
          <p className="text-primary-foreground/70 text-xs" style={forExport ? { color: 'rgba(255,255,255,0.7)' } : undefined}>
            Weekly Timetable
          </p>
        </div>

        {/* Table */}
        <div className={cn("overflow-x-auto", forExport && "overflow-visible")}>
          <table className={cn("w-full border-collapse", forExport ? "min-w-[900px]" : "min-w-[600px]")}>
            <thead>
              <tr className="bg-muted" style={forExport ? { backgroundColor: '#f5f7fa' } : undefined}>
                <th className={cn(
                  "border-r border-border font-medium text-muted-foreground",
                  compact && !forExport ? "p-1.5 w-16" : "p-2 w-24"
                )}
                style={forExport ? { borderColor: '#e5e7eb', width: '100px', padding: '10px' } : undefined}
                >
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className={cn(
                      "border-r border-border last:border-r-0 font-medium",
                      compact && !forExport ? "p-1.5" : "p-2"
                    )}
                    style={forExport ? { borderColor: '#e5e7eb', padding: '10px' } : undefined}
                  >
                    {compact && !forExport ? day.slice(0, 3) : day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, slotIndex) => {
                const isBreakOrLunch = slot.type === 'break' || slot.type === 'lunch';

                return (
                  <tr key={slot.id} className="border-t border-border" style={forExport ? { borderColor: '#e5e7eb' } : undefined}>
                    <td className={cn(
                      "border-r border-border text-center font-medium",
                      compact && !forExport ? "p-1 text-[10px]" : "p-2 text-xs",
                      isBreakOrLunch ? "slot-break" : "bg-muted/30"
                    )}
                    style={forExport ? { 
                      borderColor: '#e5e7eb', 
                      padding: '8px',
                      backgroundColor: isBreakOrLunch ? '#fef3c7' : '#fafafa'
                    } : undefined}
                    >
                      <div>{slot.time}</div>
                    </td>
                    {isBreakOrLunch ? (
                      <td
                        colSpan={5}
                        className="slot-break text-center font-medium"
                        style={forExport ? { backgroundColor: '#fef3c7', color: '#b45309', padding: '8px' } : undefined}
                      >
                        {slot.label}
                      </td>
                    ) : (
                      DAYS.map((_, dayIndex) => {
                        const cell = timetable.days[dayIndex]?.slots[slotIndex];
                        
                        if (!cell || cell.isEmpty) {
                          return (
                            <td
                              key={dayIndex}
                              className={cn(
                                "border-r border-border last:border-r-0 text-center text-muted-foreground",
                                compact && !forExport ? "p-1" : "p-2"
                              )}
                              style={forExport ? { borderColor: '#e5e7eb', padding: '8px', color: '#9ca3af' } : undefined}
                            >
                              -
                            </td>
                          );
                        }

                        if (cell.isLabContinuation) {
                          return (
                            <td
                              key={dayIndex}
                              className={cn(
                                "border-r border-border last:border-r-0 slot-lab text-center",
                                compact && !forExport ? "p-1" : "p-2"
                              )}
                              style={forExport ? { 
                                borderColor: '#e5e7eb', 
                                padding: '8px', 
                                backgroundColor: '#dbeafe',
                                color: '#1e40af'
                              } : undefined}
                            >
                              <span className="text-[10px] opacity-60">(continued)</span>
                            </td>
                          );
                        }

                        const isLab = cell.subject?.type === 'lab';

                        return (
                          <td
                            key={dayIndex}
                            className={cn(
                              "border-r border-border last:border-r-0 text-center",
                              compact && !forExport ? "p-1" : "p-2",
                              isLab ? "slot-lab" : "slot-theory"
                            )}
                            style={forExport ? { 
                              borderColor: '#e5e7eb', 
                              padding: '8px',
                              backgroundColor: isLab ? '#dbeafe' : '#f0fdf4',
                              color: isLab ? '#1e40af' : '#166534'
                            } : undefined}
                          >
                            <div className="font-medium leading-tight">
                              {cell.subject?.name}
                            </div>
                            {isLab && cell.subject?.venue && (
                              <div className="text-[10px] mt-0.5 opacity-70">
                                {cell.subject.venue}
                              </div>
                            )}
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

TimetableDisplay.displayName = 'TimetableDisplay';