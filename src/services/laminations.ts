import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Lamination {
    id: string;
    type: string;
    sub_type: string;
    title: string;
    qty: number;
}

export const subscribeToMaterials = (callback: (laminations: Lamination[]) => void) => {
    const laminationsCollection = collection(db, 'Laminations');
    return onSnapshot(laminationsCollection, (snapshot) => {
        const laminations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Lamination[];
        callback(laminations);
    });
};

export const updateLaminationQty = async (id: string, qty: number): Promise<void> => {
    const laminationRef = doc(db, 'Laminations', id);
    await updateDoc(laminationRef, { qty });
}; 