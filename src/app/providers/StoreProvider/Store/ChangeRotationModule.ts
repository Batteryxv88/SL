import { createSlice } from "@reduxjs/toolkit";

const ChangeRotationModuleSlice = createSlice({
    name: 'ChangeRotationModuleSlice',
    initialState: {
        rotationModule: 'table'
    },
    reducers: {
        changeRotationModule(state, action) {
            state.rotationModule = action.payload
        }
    }
})

export default ChangeRotationModuleSlice.reducer
export const {changeRotationModule} =ChangeRotationModuleSlice.actions