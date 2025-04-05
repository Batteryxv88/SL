import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SelectedFormState {
    selectedFormId: string | null;
}

const initialState: SelectedFormState = {
    selectedFormId: null
};

export const selectedFormSlice = createSlice({
    name: 'selectedForm',
    initialState,
    reducers: {
        setSelectedFormId: (state, action: PayloadAction<string | null>) => {
            state.selectedFormId = action.payload;
        }
    }
});

export const { setSelectedFormId } = selectedFormSlice.actions;
export default selectedFormSlice.reducer; 