import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface HolderAndKnife {
    id: string;
    type: string;
    sub_type: string;
    qty: number;
}

export const HolderAndKnifeService = (callback: (holdersAndKnifes: HolderAndKnife[]) => void) => {
    const holdersAndKnifesCollection = collection(db, 'KnivesHolders');
    return onSnapshot(holdersAndKnifesCollection, (snapshot) => {
        const holdersAndKnifes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as HolderAndKnife[];
        callback(holdersAndKnifes);
    });
};

export const updateHolderAndKnifeQty = async (id: string, qty: number): Promise<void> => {
    const holderAndKnifeRef = doc(db, 'KnivesHolders', id);
    await updateDoc(holderAndKnifeRef, { qty });
}; 