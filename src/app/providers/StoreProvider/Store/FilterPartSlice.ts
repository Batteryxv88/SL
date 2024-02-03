import { createSlice } from "@reduxjs/toolkit";

const filterPartSlice = createSlice({
    name: 'FilterPartSlice',
    initialState: {
        filter: {
            section: "All"
        }
    },
    reducers: {
        changeFilter(state, action) {
            state.filter.section = action.payload
        }
    }
})

export default filterPartSlice.reducer
export const {changeFilter} =filterPartSlice.actions
