import { createSlice } from "@reduxjs/toolkit";

const ChangePageSlice = createSlice({
    name: 'ChangeMachineSlice',
    initialState: {
        machine: "C71cf"
    },
    reducers: {
        changeMachine(state, action) {
            state.machine = action.payload
        }
    }
})

export default ChangePageSlice.reducer
export const {changeMachine} =ChangePageSlice.actions