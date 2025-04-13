import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from ".";
import { useEffect } from 'react';
import { subscribeToMaterials } from '../../../../services/materials';
import { setMaterials, setLoading, setError } from './MaterialsSlice';

export const useAppDispatch = () => useDispatch<AppDispatch>()
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