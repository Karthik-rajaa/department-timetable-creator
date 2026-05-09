import { useEffect, useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const ClaimAdminCard = () => {
  const { user, role, refreshRole } = useAuth();
  const { toast } = useToast();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc("any_admin_exists").then(({ data }) => {
      setAvailable(data === false);
      setChecked(true);
    });
  }, [user, role]);

  if (!checked || !available || role === "admin") return null;

  const claim = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("claim_admin_if_none");
    setLoading(false);
    if (error || data === false) {
      toast({ title: "Could not claim admin", description: error?.message ?? "An admin already exists.", variant: "destructive" });
      setAvailable(false);
      return;
    }
    toast({ title: "You are now admin", description: "Refreshing your permissions…" });
    await refreshRole();
  };

  return (
    <Card className="glass-card border-accent/40">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-accent-foreground" style={{ background: "var(--gradient-accent)" }}>
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-semibold">No admin exists yet</p>
          <p className="text-xs text-muted-foreground">Claim the admin role for this workspace. Available only until the first admin is set.</p>
        </div>
        <Button size="sm" className="btn-gradient" disabled={loading} onClick={claim}>
          {loading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
          Claim admin
        </Button>
      </CardContent>
    </Card>
  );
};
