import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Material } from '../../../../services/materials';
import { collection } from 'firebase/firestore';
import { db } from '../../../../services/firebase';
import { getDocs } from 'firebase/firestore';

interface MaterialsState {
    materials: Material[];
    isLoading: boolean;
    error: string | null;
}

const initialState: MaterialsState = {
    materials: [],
    isLoading: false,
    error: null
};

export const fetchMaterials = createAsyncThunk(
    'materials/fetchMaterials',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'Materials'))
        const parts = querySnapshot.docs.map((doc)=> ({
            id: doc.id,
            material: doc.data()
        }))
        return parts;
    }
)

const materialsSlice = createSlice({
    name: 'materials',
    initialState,
    reducers: {
        setMaterials: (state, action: PayloadAction<Material[]>) => {
            state.materials = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateMaterialQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
            const material = state.materials.find(m => m.id === action.payload.id);
            if (material) {
                material.qty = action.payload.qty;
            }
        }
    }

    
});

export const { setMaterials, setLoading, setError, updateMaterialQty } = materialsSlice.actions;
export default materialsSlice.reducer; 