import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { database } from "../initializeDatabase.js";

const getSnapshotsWithQueryWhere = (collectionName, field, value) => {
    const q = query(collection(database, collectionName), where(field, "==", value));
    return onSnapshot(q, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push(doc.data());
        });
        return documents;
    });
};

export { getSnapshotsWithQueryWhere }