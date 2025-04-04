import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RotationFormState {
    selectedId: number | null;
    // Добавьте другие поля состояния по необходимости
}

const initialState: RotationFormState = {
    selectedId: null,
};

export const rotationFormSlice = createSlice({
    name: 'rotationForm',
    initialState,
    reducers: {
        setSelectedId: (state, action: PayloadAction<number>) => {
            state.selectedId = action.payload;
        },
        // Добавьте другие редьюсеры по необходимости
    },
});

export const { actions: rotationFormActions } = rotationFormSlice;
export const { reducer: rotationFormReducer } = rotationFormSlice; 