import { getSnapshotsWithQueryWhere } from "./firestore.js";

// Función para obtener transportes por estado
const getTransports = (dest) => {
    const unsubscribe = getSnapshotsWithQueryWhere("transports", "destino", dest);
    // Debes devolver la función unsubscribe para poder llamarla desde fuera
    return unsubscribe;
};

export { getTransports };