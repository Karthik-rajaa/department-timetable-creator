import { AppLayout } from "@/lms/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_COURSES, MOCK_USERS } from "@/lms/data";
import { BookOpen, Users, ShieldCheck, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { useLms } from "@/lms/LmsContext";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { user } = useLms();
  if (user.role !== "admin") return <Navigate to="/lms" replace />;

  return (
    <AppLayout title="Admin Console" subtitle="Manage users, courses and timetable mappings">
      <div className="container py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Courses", value: MOCK_COURSES.length },
            { icon: Users, label: "Users", value: MOCK_USERS.length * 14 },
            { icon: TrendingUp, label: "Enrollments", value: 128 },
            { icon: ShieldCheck, label: "Pending", value: 2 },
          ].map(s => (
            <Card key={s.label} className="glass-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-display font-semibold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base font-display">Users</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {MOCK_USERS.map(u => (
                <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/60 transition">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                    {u.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                  <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base font-display">Course Approvals</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {MOCK_COURSES.map((c, i) => (
                <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg border border-border/60">
                  <div className="w-8 h-8 rounded-md shrink-0" style={{ background: c.coverGradient }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">Linked: {c.linkedSubjects.join(", ")}</p>
                  </div>
                  {i < 2 ? (
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7"><CheckCircle2 className="w-4 h-4 text-accent" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7"><XCircle className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Approved</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Admin;
