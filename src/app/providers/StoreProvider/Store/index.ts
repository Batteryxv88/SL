import { configureStore } from "@reduxjs/toolkit";
import partsReducer from './PartSlice'
import replacedPartsReducer from './ReplacedPartSlice'
import FilterPartSlice from "./FilterPartSlice";
import TonerSlice from "./TonerSlice";
import ChangePageSlice from "./ChangePageSlice"
import ChangeMachineSlice from "./ChangeMachineSlice";
import ReportSlice from "./ReportSlice";
import TonersStorageSlice from "./TonersStorageSlice";
import ChangeRotationModuleSlice from "./ChangeRotationModule";
import RotationFormsSlice from "./RotationFormsSlice";
import SelectedFormSlice from "./SelectedFormSlice";
import materialsReducer from './MaterialsSlice';

const store = configureStore({
    reducer: {
        parts: partsReducer,
        replacedParts: replacedPartsReducer,
        filteredParts: FilterPartSlice,
        toners: TonerSlice,
        pages: ChangePageSlice,
        machines: ChangeMachineSlice,
        report: ReportSlice,
        tonersStorage: TonersStorageSlice,
        rotationModule: ChangeRotationModuleSlice,
        rotationForms: RotationFormsSlice,
        selectedForm: SelectedFormSlice,
        materials: materialsReducer,
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;