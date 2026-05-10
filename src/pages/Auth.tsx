import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Loader2, Mail, Lock, User as UserIcon, Users, BookOpen, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPwd, setSignInPwd] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPwd, setSignUpPwd] = useState("");
  const [signUpRole, setSignUpRole] = useState<"student" | "teacher" | "admin">("student");

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: signInEmail, password: signInPwd });
    setBusy(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back!" });
    navigate("/", { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPwd,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: signUpName, role: signUpRole },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: `You're signed in as a ${signUpRole}.` });
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
            <GraduationCap className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display font-semibold text-lg">Campus OS</span>
        </Link>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="font-display">Welcome</CardTitle>
            <CardDescription>Sign in or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="si-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="si-email" type="email" required value={signInEmail} onChange={e => setSignInEmail(e.target.value)} className="pl-9" placeholder="you@campus.edu" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="si-pwd">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="si-pwd" type="password" required value={signInPwd} onChange={e => setSignInPwd(e.target.value)} className="pl-9" placeholder="••••••••" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient" disabled={busy}>
                    {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name">Display name</Label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="su-name" required value={signUpName} onChange={e => setSignUpName(e.target.value)} className="pl-9" placeholder="Sara Student" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-email">Email</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="su-email" type="email" required value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} className="pl-9" placeholder="you@campus.edu" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-pwd">Password</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="su-pwd" type="password" required minLength={6} value={signUpPwd} onChange={e => setSignUpPwd(e.target.value)} className="pl-9" placeholder="At least 6 characters" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>I am a…</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: "student", label: "Student", icon: BookOpen, hint: "Learn & enroll" },
                        { value: "teacher", label: "Teacher", icon: Users, hint: "Teach & track" },
                        { value: "admin", label: "Admin", icon: ShieldCheck, hint: "Manage all" },
                      ] as const).map(opt => {
                        const active = signUpRole === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setSignUpRole(opt.value)}
                            className={`p-3 rounded-lg border text-left transition ${active ? "border-accent bg-accent/10" : "border-border/60 hover:border-accent/50"}`}
                          >
                            <opt.icon className={`w-4 h-4 mb-1 ${active ? "text-accent" : "text-muted-foreground"}`} />
                            <p className="text-xs font-medium">{opt.label}</p>
                            <p className="text-[10px] text-muted-foreground">{opt.hint}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient" disabled={busy}>
                    {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create account
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center">
                    Admin access is granted from the Admin console — never at signup.
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
