import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import LmsDashboard from "./pages/LmsDashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";
import { LmsProvider } from "./lms/LmsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LmsProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Protected><LmsDashboard /></Protected>} />
              <Route path="/lms" element={<Protected><LmsDashboard /></Protected>} />
              <Route path="/lms/courses" element={<Protected><Courses /></Protected>} />
              <Route path="/lms/courses/:courseId" element={<Protected><CourseDetail /></Protected>} />
              <Route path="/lms/schedule" element={<Protected><Schedule /></Protected>} />
              <Route path="/lms/admin" element={<ProtectedRoute requireRole="admin"><Admin /></ProtectedRoute>} />
              <Route path="/timetable" element={<Protected><Index /></Protected>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LmsProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
