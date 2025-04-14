import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lamination } from '../../../../services/laminations';
import { collection } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { getDocs } from 'firebase/firestore';

interface LaminationsState {
    laminations: Lamination[];
    isLoading: boolean;
    error: string | null;
}

const initialState: LaminationsState = {
    laminations: [],
    isLoading: false,
    error: null
};

const laminationsSlice = createSlice({
    name: 'laminations',
    initialState,
    reducers: {
        setLaminations: (state, action: PayloadAction<Lamination[]>) => {
            state.laminations = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateLaminationQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
            const lamination = state.laminations.find(l => l.id === action.payload.id);
            if (lamination) {
                lamination.qty = action.payload.qty;
            }
        }
    }

    
});

export const { setLaminations, setLoading, setError, updateLaminationQty } = laminationsSlice.actions;
export default laminationsSlice.reducer; 