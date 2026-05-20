const STORAGE_KEY = "barraca_auth";

export function guardarSesion(datos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

export function obtenerSesion() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : null;
}

export function borrarSesion() {
  localStorage.removeItem(STORAGE_KEY);
}

export function esAdmin(roles = []) {
  return roles.some((rol) => {
    const normalizado = rol.toUpperCase();
    return normalizado === "ADMIN" || normalizado === "ADMINISTRADOR";
  });
}

export function rutaPorRol(roles = []) {
  return esAdmin(roles) ? "/admin/pedidos" : "/catalogo";
}
