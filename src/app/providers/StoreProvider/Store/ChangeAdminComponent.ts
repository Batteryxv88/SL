import { createSlice } from "@reduxjs/toolkit";

const ChangeAdminComponentSlice = createSlice({
    name: 'ChangeAdminComponentSlice',
    initialState: {
        adminComponent: "Главная"

    },
    reducers: {
        changeAdminComponent(state, action) {
            state.adminComponent = action.payload
        }
    }
})

export default ChangeAdminComponentSlice.reducer
export const {changeAdminComponent} =ChangeAdminComponentSlice.actions