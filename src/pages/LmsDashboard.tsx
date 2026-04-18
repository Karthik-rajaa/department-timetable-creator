import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, CalendarClock, GraduationCap, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { AppLayout } from "@/lms/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useLms } from "@/lms/LmsContext";
import { MOCK_COURSES, MOCK_USERS } from "@/lms/data";
import { getTodaySessions, getTodayName } from "@/lms/timetableLink";

const StatCard = ({ icon: Icon, label, value, accent }: { icon: typeof BookOpen; label: string; value: string | number; accent?: boolean }) => (
  <Card className="glass-card">
    <CardContent className="p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent ? "text-accent-foreground" : "text-primary-foreground"}`}
        style={{ background: accent ? "var(--gradient-accent)" : "var(--gradient-hero)" }}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-xl font-display font-semibold">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const LmsDashboard = () => {
  const { user, enrolled, courseProgress } = useLms();
  const myCourses = MOCK_COURSES.filter(c => enrolled.includes(c.id));
  const today = getTodaySessions();

  return (
    <AppLayout title="LMS Dashboard" subtitle={`Welcome back, ${user.name.split(" ")[0]} · ${getTodayName()}`}>
      <div className="container py-6 space-y-6">
        {user.role === "student" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={BookOpen} label="Enrolled Courses" value={myCourses.length} />
              <StatCard icon={CalendarClock} label="Classes Today" value={today.length} accent />
              <StatCard icon={TrendingUp} label="Avg. Progress" value={`${myCourses.length ? Math.round(myCourses.reduce((s, c) => s + courseProgress(c.id), 0) / myCourses.length) : 0}%`} />
              <StatCard icon={GraduationCap} label="Lessons Done" value={Object.values(useLms().completedLessons).reduce((n, l) => n + l.length, 0)} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="glass-card lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-display">My Courses</CardTitle>
                  <Button asChild size="sm" variant="ghost"><Link to="/lms/courses">Browse all</Link></Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {myCourses.length === 0 && (
                    <p className="text-sm text-muted-foreground">You haven't enrolled in any course yet.</p>
                  )}
                  {myCourses.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/lms/courses/${c.id}`} className="block group">
                        <div className="p-4 rounded-xl border border-border/60 hover:border-accent/50 hover:shadow-[var(--shadow-soft)] transition-all bg-card">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg shrink-0" style={{ background: c.coverGradient }} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">{c.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.instructor}</p>
                            </div>
                            <Badge variant="secondary" className="text-[10px]">{courseProgress(c.id)}%</Badge>
                          </div>
                          <Progress value={courseProgress(c.id)} className="h-1.5" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base font-display">Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {today.length === 0 && <p className="text-sm text-muted-foreground">No classes scheduled today.</p>}
                  {today.map(s => (
                    <Link key={s.slotId + s.subject} to={`/lms/courses/${s.course.id}`} className="block">
                      <div className="p-3 rounded-lg slot-theory hover:opacity-90 transition">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-medium">{s.time}</p>
                          <Badge className="bg-accent text-accent-foreground hover:bg-accent text-[10px]">Join</Badge>
                        </div>
                        <p className="text-sm font-semibold mt-1 truncate">{s.course.title}</p>
                        <p className="text-[11px] opacity-80">{s.venue}</p>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {user.role === "teacher" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={BookOpen} label="My Courses" value={MOCK_COURSES.length} />
              <StatCard icon={CalendarClock} label="Sessions Today" value={today.length} accent />
              <StatCard icon={Users} label="Students" value={42} />
              <StatCard icon={GraduationCap} label="Avg. Class Progress" value="68%" />
            </div>
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base font-display">Courses You Teach</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-3">
                {MOCK_COURSES.map(c => (
                  <Link key={c.id} to={`/lms/courses/${c.id}`} className="p-4 rounded-xl border border-border/60 hover:border-accent/50 transition bg-card">
                    <div className="w-full h-16 rounded-lg mb-3" style={{ background: c.coverGradient }} />
                    <p className="font-medium text-sm">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.chapters.length} chapters · {c.chapters.reduce((n, ch) => n + ch.lessons.length, 0)} lessons</p>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {user.role === "admin" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <StatCard icon={BookOpen} label="Total Courses" value={MOCK_COURSES.length} />
              <StatCard icon={Users} label="Active Users" value={MOCK_USERS.length * 14} accent />
              <StatCard icon={GraduationCap} label="Enrollments" value={128} />
              <StatCard icon={ShieldCheck} label="Pending Approvals" value={2} />
            </div>
            <Card className="glass-card">
              <CardHeader><CardTitle className="text-base font-display">Platform Activity</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Mock analytics — head to the Admin page for details.</p>
                <Button asChild size="sm" className="btn-gradient mt-3"><Link to="/lms/admin">Open Admin</Link></Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default LmsDashboard;
