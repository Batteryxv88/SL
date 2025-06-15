import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Material, updateMaterialQty as updateMaterialQtyService } from '../../../../services/materials';
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

// Асинхронные thunk-и
export const fetchMaterials = createAsyncThunk(
    'materials/fetchMaterials',
    async () => {
        const materialsCollection = collection(db, 'Materials');
        const snapshot = await getDocs(materialsCollection);
        const materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Material[];
        return materials;
    }
);

export const updateMaterialQuantity = createAsyncThunk(
    'materials/updateMaterialQuantity',
    async (payload: { id: string; qty: number }) => {
        await updateMaterialQtyService(payload.id, payload.qty);
        return payload;
    }
);

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
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaterials.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMaterials.fulfilled, (state, action) => {
                state.materials = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchMaterials.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch materials';
            })
            .addCase(updateMaterialQuantity.fulfilled, (state, action) => {
                const material = state.materials.find(m => m.id === action.payload.id);
                if (material) {
                    material.qty = action.payload.qty;
                }
            })
            .addCase(updateMaterialQuantity.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update material quantity';
            });
    }
});

export const { setMaterials, setLoading, setError, updateMaterialQty } = materialsSlice.actions;
export default materialsSlice.reducer; 