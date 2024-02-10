import { createSlice } from "@reduxjs/toolkit";

const ReportSlice = createSlice({
    name: 'ReportSlice',
    initialState: {
        report: []
    },
    reducers: {
        changeReport(state, action) {
            state.report = action.payload
        }
    }
})

export default ReportSlice.reducer
export const {changeReport} =ReportSlice.actions