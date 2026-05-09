import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lms/data";
import { Loader2 } from "lucide-react";

interface Props {
  children: ReactNode;
  requireRole?: Role;
}

export const ProtectedRoute = ({ children, requireRole }: Props) => {
  const { user, role, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" state={{ from: loc.pathname }} replace />;
  if (requireRole && role !== requireRole) return <Navigate to="/" replace />;

  return <>{children}</>;
};
