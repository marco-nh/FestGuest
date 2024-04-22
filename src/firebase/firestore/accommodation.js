import { getSnapshotsWithQueryWhere } from "./firestore.js";

const getAccommodations = (city) => {
    const unsubscribe = getSnapshotsWithQueryWhere("accommodations", "ciudad", city);
    return unsubscribe;
};

export { getAccommodations };
