import { API_BASE_URL } from "../config/api";
import { borrarSesion, obtenerSesion } from "./authStorage";

export async function apiFetch(ruta, opciones = {}) {
  const { publico = false, ...restoOpciones } = opciones;
  const sesion = obtenerSesion();
  const headers = {
    "Content-Type": "application/json",
    ...restoOpciones.headers,
  };

  if (!publico && sesion?.token) {
    headers.Authorization = `Bearer ${sesion.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${ruta}`, {
    ...restoOpciones,
    headers,
  });

  if (!publico && (response.status === 401 || response.status === 403)) {
    borrarSesion();
    throw new Error("Sesión expirada o sin permisos");
  }

  return response;
}

/** GET público: no envía token (catálogo, presentaciones, etc.) */
export function apiFetchPublico(ruta, opciones = {}) {
  return apiFetch(ruta, { ...opciones, publico: true });
}
