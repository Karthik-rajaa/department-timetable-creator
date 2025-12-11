import { forwardRef } from 'react';
import { Timetable, TIME_SLOTS, DAYS } from '@/types/timetable';
import { cn } from '@/lib/utils';

interface TimetableDisplayProps {
  timetable: Timetable;
  compact?: boolean;
}

export const TimetableDisplay = forwardRef<HTMLDivElement, TimetableDisplayProps>(
  ({ timetable, compact = false }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "bg-card rounded-xl overflow-hidden border border-border",
          compact ? "text-xs" : "text-sm"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-3 text-center">
          <h3 className="font-display font-bold text-base">
            {timetable.department} - {timetable.year}
          </h3>
          <p className="text-primary-foreground/70 text-xs">Weekly Timetable</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-muted">
                <th className={cn(
                  "border-r border-border font-medium text-muted-foreground",
                  compact ? "p-1.5 w-16" : "p-2 w-24"
                )}>
                  Time
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className={cn(
                      "border-r border-border last:border-r-0 font-medium",
                      compact ? "p-1.5" : "p-2"
                    )}
                  >
                    {compact ? day.slice(0, 3) : day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((slot, slotIndex) => {
                // Skip rendering lab continuation rows as separate
                const isBreakOrLunch = slot.type === 'break' || slot.type === 'lunch';

                return (
                  <tr key={slot.id} className="border-t border-border">
                    <td className={cn(
                      "border-r border-border text-center font-medium",
                      compact ? "p-1 text-[10px]" : "p-2 text-xs",
                      isBreakOrLunch ? "slot-break" : "bg-muted/30"
                    )}>
                      <div>{slot.time}</div>
                    </td>
                    {isBreakOrLunch ? (
                      <td
                        colSpan={5}
                        className="slot-break text-center font-medium"
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
                                compact ? "p-1" : "p-2"
                              )}
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
                                compact ? "p-1" : "p-2"
                              )}
                            >
                              <span className="text-[10px] text-slot-lab-text/60">(continued)</span>
                            </td>
                          );
                        }

                        const isLab = cell.subject?.type === 'lab';

                        return (
                          <td
                            key={dayIndex}
                            className={cn(
                              "border-r border-border last:border-r-0 text-center",
                              compact ? "p-1" : "p-2",
                              isLab ? "slot-lab" : "slot-theory"
                            )}
                          >
                            <div className="font-medium leading-tight">
                              {cell.subject?.name}
                            </div>
                            {isLab && cell.subject?.venue && (
                              <div className={cn(
                                "text-slot-lab-text/70 mt-0.5",
                                compact ? "text-[8px]" : "text-[10px]"
                              )}>
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
