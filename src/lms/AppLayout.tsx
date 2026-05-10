import { ReactNode } from "react";
import { Calendar, LayoutDashboard, BookOpen, GraduationCap, ShieldCheck, CalendarClock, Sparkles, LogOut, LogIn } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLms } from "@/lms/LmsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const navMain = [
  { title: "LMS Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Courses", url: "/lms/courses", icon: BookOpen },
  { title: "My Schedule", url: "/lms/schedule", icon: CalendarClock },
];

function AppSidebar() {
  const { user } = useLms();
  const { user: authUser, signOut } = useAuth();
  const navigate = useNavigate();
  const items = user.role === "admin"
    ? [...navMain, { title: "Timetable", url: "/timetable", icon: Calendar }, { title: "Admin", url: "/lms/admin", icon: ShieldCheck }]
    : navMain;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
            <GraduationCap className="w-4 h-4 text-accent-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-display font-semibold leading-tight">Campus OS</span>
            <span className="text-[10px] text-muted-foreground leading-tight">Timetable + LMS</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/" || item.url === "/lms" || item.url === "/timetable"}
                      className="flex items-center gap-2"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        <div className="px-2 py-1 group-data-[collapsible=icon]:hidden space-y-2">
          {authUser ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                  {user.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant="secondary" className="text-[9px] capitalize">{user.role}</Badge>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs" onClick={handleSignOut}>
                <LogOut className="w-3.5 h-3.5 mr-2" /> Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="default" size="sm" className="w-full h-8 text-xs btn-gradient">
              <Link to="/auth"><LogIn className="w-3.5 h-3.5 mr-2" /> Sign in</Link>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <header className="h-14 flex items-center gap-3 border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-20 px-4">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="text-base sm:text-lg font-display font-semibold leading-tight truncate">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
            </div>
            <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
              <Sparkles className="w-3 h-3" /> AI Powered
            </Badge>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
