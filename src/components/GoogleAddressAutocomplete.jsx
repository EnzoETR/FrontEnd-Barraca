import { useEffect, useRef } from "react";

export default function GoogleAddressAutocomplete({ onSelect }) {
    const containerRef = useRef(null);
    const autocompleteCreadoRef = useRef(false);

    useEffect(() => {
        let cancelado = false;

        const iniciarAutocomplete = async () => {
            if (cancelado) return;
            if (!containerRef.current || !window.google) return;

            if (autocompleteCreadoRef.current) return;
            if (containerRef.current.children.length > 0) return;

            autocompleteCreadoRef.current = true;

            const { PlaceAutocompleteElement } =
                await window.google.maps.importLibrary("places");

            if (cancelado || !containerRef.current) return;

            const autocomplete = new PlaceAutocompleteElement();

            autocomplete.includedRegionCodes = ["uy"];
            autocomplete.placeholder = "Buscar dirección en Young *";

            autocomplete.locationRestriction = {
                north: -32.61,
                south: -32.78,
                east: -57.55,
                west: -57.72
            };

            containerRef.current.appendChild(autocomplete);

            autocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
                const place = placePrediction.toPlace();

                await place.fetchFields({
                    fields: ["formattedAddress", "addressComponents"]
                });

                const componentes = place.addressComponents || [];

                const calle =
                    componentes.find((c) => c.types.includes("route"))?.longText || "";

                const numero =
                    componentes.find((c) => c.types.includes("street_number"))?.longText || "";

                const localidad =
                    componentes.find((c) =>
                        c.types.includes("locality") ||
                        c.types.includes("administrative_area_level_2")
                    )?.longText || "";

                const departamento =
                    componentes.find((c) =>
                        c.types.includes("administrative_area_level_1")
                    )?.longText || "";

                const direccionCompleta = place.formattedAddress || "";

                const texto = direccionCompleta.toLowerCase();

                const esYoung = texto.includes("young");

                const esRioNegro =
                    texto.includes("río negro") || texto.includes("rio negro");

                if (!esYoung || !esRioNegro) {
                    alert("Seleccione una dirección de Young, Río Negro.");
                    return;
                }

                onSelect({
                    calle: calle || direccionCompleta,
                    numero,
                    localidad,
                    departamento,
                    direccionCompleta,
                    tieneNumero: numero !== ""
                });
            });
        };

        const cargarGoogleMaps = () => {
            if (window.google?.maps?.places) {
                iniciarAutocomplete();
                return;
            }

            const scriptExistente = document.querySelector(
                'script[src*="maps.googleapis.com/maps/api/js"]'
            );

            if (scriptExistente) {
                scriptExistente.addEventListener("load", iniciarAutocomplete);
                return;
            }

            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`;
            script.async = true;
            script.onload = iniciarAutocomplete;
            document.body.appendChild(script);
        };

        cargarGoogleMaps();

        return () => {
            cancelado = true;
        };
    }, [onSelect]);

    return <div ref={containerRef} className="border rounded bg-white" />;
}