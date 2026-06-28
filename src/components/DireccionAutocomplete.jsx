import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { apiFetch } from "../services/apiClient";

export default function DireccionAutocomplete({
    value,
    onChange,
    onSelectAddress,
    placeholder = "Buscar dirección"
}) {
    const [sugerencias, setSugerencias] = useState([]);

    const buscarDirecciones = async (event) => {
        const texto = event.query;

        if (!texto || texto.length < 3) {
            setSugerencias([]);
            return;
        }

        try {
            const response = await apiFetch(
                `/api/v1/maps/autocomplete?input=${encodeURIComponent(texto)}`
            );

            if (!response.ok) {
                throw new Error("Error al buscar direcciones");
            }

            const data = await response.json();

            /*
                Esperamos que el backend devuelva algo así:
                [
                    {
                        descripcion: "Av. España 1234, Paysandú, Uruguay",
                        placeId: "..."
                    }
                ]
            */
            setSugerencias(data);

        } catch (error) {
            console.error("Error buscando direcciones:", error);
            setSugerencias([]);
        }
    };

    const seleccionarDireccion = async (event) => {
        const direccionSeleccionada = event.value;

        try {
            const response = await apiFetch(
                `/api/v1/maps/place-details?placeId=${encodeURIComponent(
                    direccionSeleccionada.placeId
                )}`
            );

            if (!response.ok) {
                throw new Error("Error al obtener detalles de la dirección");
            }

            const detalle = await response.json();


            onSelectAddress(detalle);

        } catch (error) {
            console.error("Error seleccionando dirección:", error);
            alert("No se pudo obtener la información completa de la dirección");
        }
    };

    return (
        <AutoComplete
            value={value}
            suggestions={sugerencias}
            completeMethod={buscarDirecciones}
            field="descripcion"
            dropdown
            forceSelection
            placeholder={placeholder}
            onChange={(e) => onChange(e.value)}
            onSelect={seleccionarDireccion}
            className="w-full"
            inputClassName="w-full border p-3 rounded"
        />
    );
}