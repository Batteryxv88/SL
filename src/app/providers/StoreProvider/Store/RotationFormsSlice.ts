import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../../../../services/firebase';

// Асинхронное действие для получения форм
export const fetchForms = createAsyncThunk(
    'forms/fetchForms',
    async () => {
        const querySnapshot = await getDocs(collection(db, 'Forms'));
        const forms = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        }));
        return forms;
    }
);

// Асинхронное действие для добавления формы
export const addForm = createAsyncThunk(
    'forms/addForm',
    async (form: any) => {
        const docRef = await addDoc(collection(db, 'Forms'), form);
        return {
            id: docRef.id,
            ...form
        };
    }
);

// Асинхронное действие для обновления формы
export const updateForm = createAsyncThunk(
    'forms/updateForm',
    async ({ id, updatedData }: { id: string, updatedData: any }) => {
        const formRef = doc(db, 'Forms', id);
        await updateDoc(formRef, updatedData);
        return {
            id,
            ...updatedData
        };
    }
);

const RotationFormsSlice = createSlice({
    name: 'RotationFormsSlice',
    initialState: {
        rotationForms: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Обработка fetchForms
            .addCase(fetchForms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchForms.fulfilled, (state, action) => {
                state.loading = false;
                state.rotationForms = action.payload;
            })
            .addCase(fetchForms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Произошла ошибка при загрузке форм';
            })
            // Обработка addForm
            .addCase(addForm.fulfilled, (state, action) => {
                state.rotationForms.push(action.payload);
            })
            // Обработка updateForm
            .addCase(updateForm.fulfilled, (state, action) => {
                const index = state.rotationForms.findIndex((form: any) => form.id === action.payload.id);
                if (index !== -1) {
                    state.rotationForms[index] = {
                        ...state.rotationForms[index],
                        ...action.payload
                    };
                }
            });
    }
});

export default RotationFormsSlice.reducer;
