import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { usuario, esAdmin } = useAuth();
  const ubicacion = useLocation();

  if (!usuario?.token) {
    return <Navigate to="/micuenta" state={{ from: ubicacion }} replace />;
  }

  if (requireAdmin && !esAdmin()) {
    return <Navigate to="/catalogo" replace />;
  }

  return children;
}
