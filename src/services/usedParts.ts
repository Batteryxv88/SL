import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

export interface UsedPart {
    date: string;
    man: string;
    partN: string;
    partName: string;
    quantity: number;
    section: string;
    serviceLife?: number;
    percent: number;
}

export interface UsedPartData {
    id: string;
    part: UsedPart;
}

export const UsedPartService = (callback: (parts: UsedPartData[]) => void) => {
    const usedPartsCollection = collection(db, 'UsedParts');
    return onSnapshot(usedPartsCollection, (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
            id: doc.id,
            part: doc.data()
        })) as UsedPartData[];
        callback(parts);
    });
}; 