import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/providers/StoreProvider/Store/hooks';
import { fetchLastInventoryCheck, setShowModal } from '../../../app/providers/StoreProvider/Store/InventoryCheckSlice';
import { isToday, isAfterTime } from '../utils/inventoryCheck';

export const useInventoryCheck = () => {
    const dispatch = useAppDispatch();
    const { lastCheckDate, showModal } = useAppSelector((state) => state.inventoryCheck);

    useEffect(() => {
        // Check localStorage first
        const cachedCheck = localStorage.getItem('lastInventoryCheck');
        const today = new Date().toISOString().split('T')[0];

        if (cachedCheck === today) {
            return; // No need to check Firestore
        }

        // If no cache or cache is outdated, fetch from Firestore
        dispatch(fetchLastInventoryCheck());
    }, [dispatch]);

    useEffect(() => {
        if (!lastCheckDate) return;

        const today = new Date().toISOString().split('T')[0];
        const lastCheckDay = lastCheckDate.split('T')[0];

        // Update localStorage
        if (isToday(lastCheckDate)) {
            localStorage.setItem('lastInventoryCheck', today);
        }

        // Check if we need to show the modal
        if (!isToday(lastCheckDate) && isAfterTime('14:00') && !showModal) {
            dispatch(setShowModal(true));
        }
    }, [lastCheckDate, showModal, dispatch]);

    return {
        lastCheckDate,
        showModal
    };
}; 