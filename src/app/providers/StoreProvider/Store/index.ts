import { configureStore } from "@reduxjs/toolkit";
import partsReducer from './PartSlice'
import replacedPartsReducer from './ReplacedPartSlice'
import FilterPartSlice from "./FilterPartSlice";
import TonerSlice from "./TonerSlice";


const store = configureStore({
    reducer: {
        parts: partsReducer,
        replacedParts: replacedPartsReducer,
        filteredParts: FilterPartSlice,
        toners: TonerSlice
        
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;