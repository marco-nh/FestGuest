
import { getFirestore, collection, getDocs, where } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

async function checkIfExists(collectionName, fieldName, value) {
    try {
        const db = getFirestore(app);
        const querySnapshot = await getDocs(query(collection(db, collectionName), where(fieldName, '==', value)));
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking existence: ", error);
        return false;
    }
}

export { checkIfExists }