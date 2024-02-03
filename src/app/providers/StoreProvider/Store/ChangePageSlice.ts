import { createSlice } from "@reduxjs/toolkit";

const ChangePageSlice = createSlice({
    name: 'ChangePageSlice',
    initialState: {
        page: ''
    },
    reducers: {
        changePage(state, action) {
            state.page = action.payload
        }
    }
})

export default ChangePageSlice.reducer
export const {changePage} =ChangePageSlice.actions