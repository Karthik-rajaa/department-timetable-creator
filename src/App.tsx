import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LmsDashboard from "./pages/LmsDashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Schedule from "./pages/Schedule";
import Admin from "./pages/Admin";
import { LmsProvider } from "./lms/LmsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LmsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LmsDashboard />} />
            <Route path="/lms" element={<LmsDashboard />} />
            <Route path="/lms/courses" element={<Courses />} />
            <Route path="/lms/courses/:courseId" element={<CourseDetail />} />
            <Route path="/lms/schedule" element={<Schedule />} />
            <Route path="/lms/admin" element={<Admin />} />
            <Route path="/timetable" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LmsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
