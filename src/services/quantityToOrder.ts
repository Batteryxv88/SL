import { collection, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface QuantityToOrder {
    id: string;
    PartN: string;
    PartName: string;
    qty: number;
    use: boolean;
}

export const subscribeToQuantityToOrder = (callback: (orders: QuantityToOrder[]) => void) => {
    const ordersCollection = collection(db, 'quantityToOrder');
    return onSnapshot(ordersCollection, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as QuantityToOrder[];
        callback(orders);
    });
};

export const fetchQuantityToOrder = async (): Promise<QuantityToOrder[]> => {
    const ordersCollection = collection(db, 'quantityToOrder');
    const snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as QuantityToOrder[];
};

export const updateOrderQuantity = async (id: string, qty: number): Promise<void> => {
    const orderRef = doc(db, 'quantityToOrder', id);
    await updateDoc(orderRef, { qty });
};

export const updateOrderUse = async (id: string, use: boolean): Promise<void> => {
    const orderRef = doc(db, 'quantityToOrder', id);
    await updateDoc(orderRef, { use });
};

export const updateOrderQtyAndUse = async (id: string, qty: number, use: boolean): Promise<void> => {
    const orderRef = doc(db, 'quantityToOrder', id);
    await updateDoc(orderRef, { qty, use });
}; 