import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";
import { useEffect } from 'react';
import { subscribeToMaterials, subscribeLaminations } from '../../../../services/materials';
import { setMaterials, setLoading, setError } from './MaterialsSlice';
import { setLaminations, setLoading as setLaminationsLoading, setError as setLaminationsError } from './LaminationsSlice';

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