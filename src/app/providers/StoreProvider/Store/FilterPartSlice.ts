import { createSlice } from "@reduxjs/toolkit";

const filterPartSlice = createSlice({
    name: 'FilterPartSlice',
    initialState: {
        filter: "All"
    },
    reducers: {
        changeFilter(state, action) {
            state.filter = action.payload
        }
    }
})

export default filterPartSlice.reducer
export const {changeFilter} =filterPartSlice.actions
