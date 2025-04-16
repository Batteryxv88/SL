import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";
import { useEffect } from 'react';
import { subscribeToMaterials, subscribeLaminations } from '../../../../services/materials';
import { setMaterials, setLoading, setError } from './MaterialsSlice';
import { setLaminations, setLoading as setLaminationsLoading, setError as setLaminationsError } from './LaminationsSlice';
import { setHoldersAndKnifes, setLoading as setHoldersAndKnifesLoading, setError as setHoldersAndKnifesError } from "./HoldersAndKnifesSlice";
import { HolderAndKnife } from "../../../../services/holdersAndKnifes";
import { HolderAndKnifeService } from "../../../../services/holdersAndKnifes";
import { TonerService } from '../../../../services/toners';
import { setTonersStorage } from './TonersStorageSlice';
import { PartService } from '../../../../services/parts';
import { setParts } from './PartSlice';
import { UsedPartService } from '../../../../services/usedParts';
import { setUsedParts } from './ReplacedPartSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useMaterials = () => {
    const dispatch = useAppDispatch();
    const materials = useAppSelector(state => state.materials.materials);
    const isLoading = useAppSelector(state => state.materials.isLoading);
    const error = useAppSelector(state => state.materials.error);

    useEffect(() => {
        if (materials.length === 0) {
            dispatch(setLoading(true));
        }
        
        const unsubscribe = subscribeToMaterials((materialsData) => {
            dispatch(setMaterials(materialsData));
            dispatch(setLoading(false));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch, materials.length]);

    return { materials, isLoading, error };
};

export const useLaminations = () => {
    const dispatch = useAppDispatch();
    const laminations = useAppSelector(state => state.laminations.laminations);
    const isLoading = useAppSelector(state => state.laminations.isLoading);
    const error = useAppSelector(state => state.laminations.error);

    useEffect(() => {
        if (laminations.length === 0) {
            dispatch(setLoading(true));
        }
        
        const unsubscribe = subscribeLaminations((laminationsData) => {
            dispatch(setLaminations(laminationsData));
            dispatch(setLoading(false));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch, laminations.length]);

    return { laminations, isLoading, error };
};

export const useHoldersAndKnifes = () => {
    const dispatch = useAppDispatch();
    const holdersAndKnifes = useAppSelector(state => state.holdersAndKnifes.holdersAndKnifes);
    const isLoading = useAppSelector(state => state.holdersAndKnifes.isLoading);
    const error = useAppSelector(state => state.holdersAndKnifes.error);

    useEffect(() => {
        if (holdersAndKnifes.length === 0) {
            dispatch(setHoldersAndKnifesLoading(true));
        }
        
        const unsubscribe = HolderAndKnifeService((holdersAndKnifesData) => {
            dispatch(setHoldersAndKnifes(holdersAndKnifesData));
            dispatch(setHoldersAndKnifesLoading(false));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch, holdersAndKnifes.length]);

    return { holdersAndKnifes, isLoading, error };
};

export const useToners = () => {
    const dispatch = useAppDispatch();
    const tonersArr = useAppSelector(state => state.tonersStorage.tonersStorageArr);

    useEffect(() => {
        const unsubscribe = TonerService((tonersData) => {
            dispatch(setTonersStorage(tonersData));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { tonersArr };
};

export const useParts = () => {
    const dispatch = useAppDispatch();
    const partsArray = useAppSelector(state => state.parts.partsArray);

    useEffect(() => {
        const unsubscribe = PartService((partsData) => {
            dispatch(setParts(partsData));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { partsArray };
};

export const useUsedParts = () => {
    const dispatch = useAppDispatch();
    const usedPartsArray = useAppSelector(state => state.replacedParts.usedPartsArray);

    useEffect(() => {
        const unsubscribe = UsedPartService((partsData) => {
            dispatch(setUsedParts(partsData));
        });

        return () => {
            unsubscribe();
        };
    }, [dispatch]);

    return { usedPartsArray };
};