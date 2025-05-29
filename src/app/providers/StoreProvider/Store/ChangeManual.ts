import { createSlice } from "@reduxjs/toolkit";

const ChangeManualSlice = createSlice({
    name: 'ChangeManualSlice',
    initialState: {
        manual: "label_190"

    },
    reducers: {
        changeManual(state, action) {
            state.manual = action.payload
        }
    }
})

export default ChangeManualSlice.reducer
export const {changeManual} =ChangeManualSlice.actions