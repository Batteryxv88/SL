import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface Material {
    id: string;
    type: string;
    qty: number;
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