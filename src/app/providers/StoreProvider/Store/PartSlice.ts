import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import db from '../../../config/fbConfig';
import { doc } from 'firebase/firestore';

export const addPartToFirestore = createAsyncThunk(
    'parts/addPartToFirestore',
    async (part: any) => {
        const addPartRef = await addDoc(collection(db, 'Parts'), part);
        const newPart = {id: addPartRef.id, part}
        return newPart;
    }
)


export const fetchParts = createAsyncThunk(
    'parts/fetchParts',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'Parts'))
        const parts = querySnapshot.docs.map((doc)=> ({
            id: doc.id,
            part: doc.data()
        }))
        return parts;
    }
)

export const updateStock = createAsyncThunk(
    'parts/updateStock',
    async (editedPart: any) => {
        const parts = await getDocs(collection(db, 'Parts'))
        for(var snap of parts.docs){
            if(snap.id === editedPart.id){
                const partRef = doc(db, 'Parts', snap.id);
                await updateDoc(partRef, editedPart.part)
            }
        }
        return editedPart
    }
)

const partSlice = createSlice({
    name: 'Parts',
    initialState: {
        partsArray: [],
    },
    reducers: {

    }, 
    extraReducers: (builder) => {
        builder
        .addCase(addPartToFirestore.fulfilled, (state, action)=> {
            state.partsArray.push(action.payload);
        })
        .addCase(fetchParts.fulfilled, (state, action)=> {
            state.partsArray = action.payload
        })
        .addCase(updateStock.fulfilled, (state, action)=> {
            const {id, part} = action.payload
            const partIndex = state.partsArray.findIndex((part)=> part.id === id);
            if(partIndex !== -1) {
                state.partsArray[partIndex] = {id: id, part}
            }
        })
    }
})

export default partSlice.reducer;