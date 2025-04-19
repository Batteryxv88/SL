import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../services/firebase';

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

export type UsedPartsArray = {
    id: string;
    part: UsedParts
}

export const addUsedPart = createAsyncThunk(
    'usedParts/addUsedPart',
    async (part: any) => {
        const addPartRef = await addDoc(collection(db, 'UsedParts'), part);
        const newPart = {id: addPartRef.id, part}
        return newPart;
    }
)

export const fetchUsedParts = createAsyncThunk(
    'usedParts/fetchParts',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'UsedParts'))
        const parts = querySnapshot.docs.map((doc)=> ({
            id: doc.id,
            part: doc.data()
        }))
        return parts;
    }
)

export const updateUsedPart = createAsyncThunk(
    'usedParts/updateUsedPart',
    async (editedPart: any) => {
        const parts = await getDocs(collection(db, 'UsedParts'))
        for(var snap of parts.docs){
            if(snap.id === editedPart.id){
                const partRef = doc(db, 'UsedParts', snap.id);
                await updateDoc(partRef, editedPart.part)
            }
        }
        return editedPart
    }
)

export const deleteUsedPart = createAsyncThunk(
    'usedParts/deleteUsedPart',
    async (id: string) => {
        const parts = await getDocs(collection(db, 'UsedParts'))
        for(var snap of parts.docs){
            if(snap.id === id){
                const partRef = doc(db, 'UsedParts', snap.id);
                await deleteDoc(partRef);
            }
        }
        return id;
    }
)

const replacedPartSlice = createSlice({
    name: 'replacedParts',
    initialState: {
        usedPartsArray: [],
    },
    reducers: {
        setUsedParts: (state, action) => {
            state.usedPartsArray = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addUsedPart.fulfilled, (state, action) => {
            // Предотвращаем дублирование при локальном добавлении и через подписку
            const exists = state.usedPartsArray.some(item => item.id === action.payload.id);
            if (!exists) {
                state.usedPartsArray.push(action.payload);
            }
        })
        .addCase(fetchUsedParts.fulfilled, (state, action)=> {
            state.usedPartsArray = action.payload
        })
        .addCase(updateUsedPart.fulfilled, (state, action)=> {
            const {id, part} = action.payload;
            const partIndex = state.usedPartsArray.findIndex((part)=> part.id === id);
            if(partIndex !== -1) {
                // Используем оператор расширения для изменения определенных свойств объекта part
                state.usedPartsArray[partIndex] = {
                    ...state.usedPartsArray[partIndex],
                    part: {
                        ...state.usedPartsArray[partIndex].part,
                        ...part  // Обновляем определенные свойства part
                    }
                };
            }
        })
        .addCase(deleteUsedPart.fulfilled, (state, action) => {
            state.usedPartsArray = state.usedPartsArray.filter(part => part.id !== action.payload);
        })
    }
})

export const { setUsedParts } = replacedPartSlice.actions;
export default replacedPartSlice.reducer;