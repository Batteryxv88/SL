import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface Part {
    partN: string;
    section: string;
    partName: string;
    quantity: number;
    partLife: string | number;
}

export interface PartData {
    id: string;
    part: Part;
}

export const PartService = (callback: (parts: PartData[]) => void) => {
    const partsCollection = collection(db, 'Parts');
    return onSnapshot(partsCollection, (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
            id: doc.id,
            part: doc.data()
        })) as PartData[];
        callback(parts);
    });
}; 