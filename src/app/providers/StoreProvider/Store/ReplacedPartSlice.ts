import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import db from '../../../config/fbConfig';

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

const partSlice = createSlice({
    name: 'UsedParts',
    initialState: {
        usedPartsArray: [],
    },
    reducers: {

    }, 
    extraReducers: (builder) => {
        builder
        .addCase(addUsedPart.fulfilled, (state, action)=> {
            state.usedPartsArray.push(action.payload);
        })
        .addCase(fetchUsedParts.fulfilled, (state, action)=> {
            state.usedPartsArray = action.payload
        })
        // .addCase(updateUsedPart.fulfilled, (state, action)=> {
        //     const {id, part} = action.payload
        //     const partIndex = state.usedPartsArray.findIndex((part)=> part.id === id);
        //     if(partIndex !== -1) {
        //         state.usedPartsArray[partIndex] = {id: id, part}
        //     }
        // })
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
       
    }
})

export default partSlice.reducer;