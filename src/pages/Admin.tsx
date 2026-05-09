import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/lms/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_COURSES } from "@/lms/data";
import { BookOpen, Users, ShieldCheck, TrendingUp, CheckCircle2, XCircle, Loader2, UserPlus, UserMinus, Crown } from "lucide-react";
import { useLms } from "@/lms/LmsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Role = "admin" | "teacher" | "student";
interface AdminUser {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  roles: Role[];
}

const Admin = () => {
  const { user } = useLms();
  const { user: authUser, refreshRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_users");
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
    } else {
      setUsers((data ?? []) as AdminUser[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (user.role === "admin") load();
  }, [user.role, load]);

  if (user.role !== "admin") return <Navigate to="/lms" replace />;

  const grantRole = async (uid: string, role: Role) => {
    setSavingId(uid + role);
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
    setSavingId(null);
    if (error && !error.message.includes("duplicate")) {
      toast({ title: "Failed to grant role", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Granted ${role}` });
    if (uid === authUser?.id) await refreshRole();
    load();
  };

  const revokeRole = async (uid: string, role: Role) => {
    setSavingId(uid + role);
    const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    setSavingId(null);
    if (error) {
      toast({ title: "Failed to revoke role", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `Revoked ${role}` });
    if (uid === authUser?.id) await refreshRole();
    load();
  };

  const totalRoles = (r: Role) => users.filter(u => u.roles.includes(r)).length;

  return (
    <AppLayout title="Admin Console" subtitle="Manage users, roles and course approvals">
      <div className="container py-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: BookOpen, label: "Courses", value: MOCK_COURSES.length },
            { icon: Users, label: "Total Users", value: users.length },
            { icon: TrendingUp, label: "Teachers", value: totalRoles("teacher") },
            { icon: ShieldCheck, label: "Admins", value: totalRoles("admin") },
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
            <CardHeader><CardTitle className="text-base font-display">Users & Roles</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              )}
              {!loading && users.length === 0 && (
                <p className="text-sm text-muted-foreground">No users yet.</p>
              )}
              {!loading && users.map(u => (
                <div key={u.id} className="p-3 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                      {(u.display_name ?? u.email ?? "?").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.display_name ?? "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      {u.roles.length === 0 && <Badge variant="outline" className="text-[10px]">no role</Badge>}
                      {u.roles.map(r => (
                        <Badge key={r} variant="secondary" className="capitalize text-[10px]">{r}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(["student", "teacher", "admin"] as Role[]).map(r => {
                      const has = u.roles.includes(r);
                      const isSaving = savingId === u.id + r;
                      return (
                        <Button
                          key={r}
                          size="sm"
                          variant={has ? "outline" : "ghost"}
                          className="h-7 text-[11px] capitalize"
                          disabled={isSaving}
                          onClick={() => has ? revokeRole(u.id, r) : grantRole(u.id, r)}
                        >
                          {isSaving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : has ? <UserMinus className="w-3 h-3 mr-1" /> : <UserPlus className="w-3 h-3 mr-1" />}
                          {has ? "Revoke " : "Grant "}{r}
                        </Button>
                      );
                    })}
                  </div>
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
                    <Badge variant="outline" className="text-[10px]"><Crown className="w-3 h-3 mr-1" />Approved</Badge>
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
