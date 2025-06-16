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
import laminationsReducer from './LaminationsSlice';
import holdersAndKnifesReducer from './HoldersAndKnifesSlice';
import inventoryCheckReducer from './InventoryCheckSlice';
import ChangeManualSlice from "./ChangeManual";
import ChangeAdminComponentSlice from "./ChangeAdminComponent";
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
        laminations: laminationsReducer,
        inventoryCheck: inventoryCheckReducer,
        holdersAndKnifes: holdersAndKnifesReducer,
        manuals: ChangeManualSlice,
        adminComponent: ChangeAdminComponentSlice,
    }
})

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;