import { createSlice } from "@reduxjs/toolkit";

const ChangePageSlice = createSlice({
    name: 'ChangeMachineSlice',
    initialState: {
        machine: "C71cf",
        tonerMachine: "C71cf",
        storage: 'Детали'
    },
    reducers: {
        changeMachine(state, action) {
            state.machine = action.payload
        },
        changeTonerMachine(state, action) {
            state.tonerMachine = action.payload
        },
        changeStorage(state, action) {
            state.storage = action.payload
        }
    }
})

export default ChangePageSlice.reducer
export const {changeMachine, changeTonerMachine, changeStorage} =ChangePageSlice.actions