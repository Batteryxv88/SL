import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '../../../config/fbConfig';

export type UsedParts = {
    date: string;
    man: string;
    partN: string;
    partName: string;
    quantity: number;
    section: string;
    serviceLife?: number;
    percent: number
}

export type tonersStorageArr = {
    id: string;
    part: UsedParts
}

export const fetchTonersStorage = createAsyncThunk(
    'tonersStorage/fetchToners',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'TonersStorage'))
        const parts = querySnapshot.docs.map((doc)=> ({
            id: doc.id,
            toner: doc.data()
        }))
        return parts;
    }
)

export const updateTonersStorage = createAsyncThunk(
    'tonersStorage/updateTonersStorage',
    async (editedToner: any) => {
        const parts = await getDocs(collection(db, 'TonersStorage'))
        for(var snap of parts.docs){
            if(snap.id === editedToner.id){
                const partRef = doc(db, 'TonersStorage', snap.id);
                await updateDoc(partRef, editedToner.toner)
            }
        }
        return editedToner
    }
)

export const updateToner = createAsyncThunk(
    'tonersStorage/updateToner',
    async (editedToner: any) => {
        try {
            const parts = await getDocs(collection(db, 'TonersStorage'))
            for (var snap of parts.docs) {
                if (snap.id === editedToner.id) {
                    const partRef = doc(db, 'TonersStorage', snap.id);
                    await updateDoc(partRef, editedToner.toner);
                }
            }
            return editedToner;
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }
)

const partSlice = createSlice({
    name: 'TonersStorage',
    initialState: {
        tonersStorageArr: [],
    },
    reducers: {

    }, 
    extraReducers: (builder) => {
        builder
        .addCase(fetchTonersStorage.fulfilled, (state, action)=> {
            state.tonersStorageArr = action.payload
        })
        .addCase(updateTonersStorage.fulfilled, (state, action)=> {
            const {id, part} = action.payload;
            const partIndex = state.tonersStorageArr.findIndex((part)=> part.id === id);
            if(partIndex !== -1) {
                // Используем оператор расширения для изменения определенных свойств объекта part
                state.tonersStorageArr[partIndex] = {
                    ...state.tonersStorageArr[partIndex],
                    part: {
                        ...state.tonersStorageArr[partIndex].part,
                        ...part  // Обновляем определенные свойства part
                    }
                };
            }
        })
        .addCase(updateToner.fulfilled, (state, action)=> {
            const { id, toner } = action.payload;
            const tonerIndex = state.tonersStorageArr.findIndex((toner: any) => toner.id === id);
            if (tonerIndex !== -1) {
            // Используем оператор расширения для создания нового объекта
            state.tonersStorageArr[tonerIndex] = {
            ...state.tonersStorageArr[tonerIndex],
            toner: {
                ...state.tonersStorageArr[tonerIndex].toner,
                qty: toner.qty
            }
        };
    }
        })
       
    }
})

export default partSlice.reducer;