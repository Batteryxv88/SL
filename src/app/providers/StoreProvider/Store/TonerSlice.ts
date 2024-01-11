import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "../../../config/fbConfig";


export const addToner = createAsyncThunk(
    'toners/addToner',
    async (toner: any) => {
        const addTonerRef = await addDoc(collection(db, 'Toners'), toner);
        const newPart = {id: addTonerRef.id, toner}
        return newPart;
    }
)

export const deleteToner = createAsyncThunk(
    'toners/deleteToner',
    async() => {
        
    }
)

export const fetchToners = createAsyncThunk(
    'toners/fetchToners',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'Toners'))
        const toners = querySnapshot.docs.map((doc)=> ({
            id: doc.id,
            toner: doc.data()
        }))
        return toners;
    }
)

export type TonerArray = {
    color?: string;
    man?: string;
    counter?: number;
}

const tonerSlice = createSlice({
    name: 'Toners',
    initialState: {
        tonersArray: [],
    },
    reducers: {

    }, 
    extraReducers: (builder) => {
        builder
        .addCase(addToner.fulfilled, (state, action)=> {
            state.tonersArray.push(action.payload);
        })
        .addCase(fetchToners.fulfilled, (state, action)=> {
            state.tonersArray = action.payload
        })
    }
})

export default tonerSlice.reducer;