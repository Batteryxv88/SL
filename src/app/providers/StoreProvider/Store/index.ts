import { configureStore } from "@reduxjs/toolkit";
import partsReducer from './PartSlice'
import replacedPartsReducer from './ReplacedPartSlice'
import FilterPartSlice from "./FilterPartSlice";
import TonerSlice from "./TonerSlice";
import ChangePageSlice from "./ChangePageSlice"
import ChangeMachineSlice from "./ChangeMachineSlice";
import ReportSlice from "./ReportSlice";


const store = configureStore({
    reducer: {
        parts: partsReducer,
        replacedParts: replacedPartsReducer,
        filteredParts: FilterPartSlice,
        toners: TonerSlice,
        pages: ChangePageSlice,
        machines: ChangeMachineSlice,
        report: ReportSlice
        
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;