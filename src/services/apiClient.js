import { API_BASE_URL } from "../config/api";
import { borrarSesion, obtenerSesion } from "./authStorage";

export async function apiFetch(ruta, opciones = {}) {
  const sesion = obtenerSesion();
  const headers = {
    "Content-Type": "application/json",
    ...opciones.headers,
  };

  if (sesion?.token) {
    headers.Authorization = `Bearer ${sesion.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${ruta}`, {
    ...opciones,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    borrarSesion();
    throw new Error("Sesión expirada o sin permisos");
  }

  return response;
}
