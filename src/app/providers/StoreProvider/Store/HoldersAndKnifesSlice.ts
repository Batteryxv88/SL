import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lamination } from '../../../../services/laminations';
import { collection } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { getDocs } from 'firebase/firestore';
import { HolderAndKnife } from '../../../../services/holdersAndKnifes';

interface HoldersAndKnifesState {
    holdersAndKnifes: HolderAndKnife[];
    isLoading: boolean;
    error: string | null;
}

const initialState: HoldersAndKnifesState = {
    holdersAndKnifes: [],
    isLoading: false,
    error: null
};

const holdersAndKnifesSlice = createSlice({
    name: 'holdersAndKnifes',
    initialState,
    reducers: {
        setHoldersAndKnifes: (state, action: PayloadAction<HolderAndKnife[]>) => {
            state.holdersAndKnifes = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateHolderAndKnifeQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
            const holderAndKnife = state.holdersAndKnifes.find(h => h.id === action.payload.id);
            if (holderAndKnife) {
                holderAndKnife.qty = action.payload.qty;
            }
        }
    }

    
});

export const { setHoldersAndKnifes, setLoading, setError, updateHolderAndKnifeQty } = holdersAndKnifesSlice.actions;
export default holdersAndKnifesSlice.reducer; 