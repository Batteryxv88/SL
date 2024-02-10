import { createSlice } from "@reduxjs/toolkit";

const ChangePageSlice = createSlice({
    name: 'ChangeMachineSlice',
    initialState: {
        machine: "C71cf",
        tonerMachine: "C71cf"
    },
    reducers: {
        changeMachine(state, action) {
            state.machine = action.payload
        },
        changeTonerMachine(state, action) {
            state.tonerMachine = action.payload
        }
    }
})

export default ChangePageSlice.reducer
export const {changeMachine, changeTonerMachine} =ChangePageSlice.actions