import { configureStore } from "@reduxjs/toolkit";
import partsReducer from './PartSlice'
import replacedPartsReducer from './ReplacedPartSlice'

const store = configureStore({
    reducer: {
        parts: partsReducer,
        replacedParts: replacedPartsReducer
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;