import { API_BASE_URL } from "../config/api";

const TOKEN_KEY = "cliente_token";

export function guardarTokenCliente(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function obtenerTokenCliente() {
  return localStorage.getItem(TOKEN_KEY);
}

export async function initClienteAnonimo() {
  const response = await fetch(`${API_BASE_URL}/cliente-anonimo`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("No se pudo crear la sesión anónima");
  }

  const data = await response.json();
  guardarTokenCliente(data.token);
  return data;
}
