import { Link } from "react-router-dom";
import { CalendarClock, MapPin, Video } from "lucide-react";
import { AppLayout } from "@/lms/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMockWeekSessions, getTodayName } from "@/lms/timetableLink";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Schedule = () => {
  const all = getMockWeekSessions();
  const today = getTodayName();

  return (
    <AppLayout title="My Schedule" subtitle="Weekly classes pulled from the timetable">
      <div className="container py-6 space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-display flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-accent" /> This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-5 gap-3">
            {DAYS.map(day => {
              const items = all.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
              const isToday = day === today;
              return (
                <div key={day} className={`rounded-xl border ${isToday ? "border-accent/60 bg-accent/5" : "border-border/60 bg-card"} p-3 space-y-2`}>
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider">{day}</p>
                    {isToday && <Badge className="bg-accent text-accent-foreground hover:bg-accent text-[10px]">Today</Badge>}
                  </div>
                  {items.length === 0 && <p className="text-xs text-muted-foreground italic">No classes</p>}
                  {items.map(s => (
                    <Link key={s.slotId + day} to={`/lms/courses/${s.course.id}`} className="block">
                      <div className="p-2 rounded-lg slot-theory hover:opacity-90 transition">
                        <p className="text-[10px] font-medium opacity-80">{s.time}</p>
                        <p className="text-xs font-semibold mt-0.5 leading-tight">{s.course.title}</p>
                        <p className="text-[10px] flex items-center gap-1 opacity-80 mt-0.5"><MapPin className="w-2.5 h-2.5" />{s.venue}</p>
                        {isToday && (
                          <Button size="sm" className="btn-gradient h-6 px-2 mt-1.5 text-[10px] w-full">
                            <Video className="w-3 h-3 mr-1" />Join Class
                          </Button>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Schedule;
