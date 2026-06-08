import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../config/api";
import { initClienteAnonimo } from "../services/clienteAnonimoService";
import {
  borrarSesion,
  esAdmin,
  guardarSesion,
  obtenerSesion,
  rutaPorRol,
} from "../services/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => obtenerSesion());

  useEffect(() => {
    initClienteAnonimo().catch((error) => {
      console.error("Error al iniciar cliente anónimo:", error);
    });
  }, []);

  const login = useCallback(async (telefono, password) => {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/api/v1/seguridad/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, password }),
      });
    } catch {
      throw new Error(
        "No se pudo conectar con el servidor. Verificá que el backend esté corriendo en el puerto 8081."
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || "No se pudo iniciar sesión");
    }

    guardarSesion(data);
    setUsuario(data);
    localStorage.removeItem("carrito");
    return data;
  }, []);

  const logout = useCallback(() => {
    borrarSesion();
    setUsuario(null);
    localStorage.removeItem("carrito");
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      login,
      logout,
      estaAutenticado: Boolean(usuario?.token),
      esAdmin: () => esAdmin(usuario?.roles),
      rutaPorRol: () => rutaPorRol(usuario?.roles),
    }),
    [usuario, login, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return contexto;
}
