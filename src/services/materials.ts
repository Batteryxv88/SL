import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Lamination } from './laminations';

export interface Material {
    id: string;
    type: string;
    qty: number;
    status: 'new' | 'defective';
}

export const subscribeToMaterials = (callback: (materials: Material[]) => void) => {
    const materialsCollection = collection(db, 'Materials');
    return onSnapshot(materialsCollection, (snapshot) => {
        const materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Material[];
        callback(materials);
    });
};

export const updateMaterialQty = async (id: string, qty: number): Promise<void> => {
    const materialRef = doc(db, 'Materials', id);
    await updateDoc(materialRef, { qty });
};

export const subscribeLaminations = (callback: (laminations: Lamination[]) => void) => {
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