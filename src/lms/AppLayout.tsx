import { ReactNode } from "react";
import { Calendar, LayoutDashboard, BookOpen, GraduationCap, ShieldCheck, CalendarClock, Sparkles } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@/lms/data";
import { Badge } from "@/components/ui/badge";

const navMain = [
  { title: "LMS Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Courses", url: "/lms/courses", icon: BookOpen },
  { title: "My Schedule", url: "/lms/schedule", icon: CalendarClock },
  { title: "Timetable", url: "/timetable", icon: Calendar },
];

function AppSidebar() {
  const { user, setRole } = useLms();
  const items = user.role === "admin"
    ? [...navMain, { title: "Admin", url: "/lms/admin", icon: ShieldCheck }]
    : navMain;

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
        <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">View as</p>
          <Select value={user.role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
              {user.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
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
