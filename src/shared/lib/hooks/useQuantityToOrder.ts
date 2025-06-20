import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/providers/StoreProvider/Store';
import {
    fetchQuantityToOrder,
    updateOrderQuantity,
    updateOrderUse,
    updateOrderQtyAndUse,
    setOrders,
    setLoading,
    setError
} from '../../../app/providers/StoreProvider/Store/QuantityToOrderSlice';
import { QuantityToOrder } from '../../../services/quantityToOrder';

export const useQuantityToOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, isLoading, error } = useSelector((state: RootState) => state.quantityToOrder);

    const handleFetchOrders = () => {
        dispatch(fetchQuantityToOrder());
    };

    const handleUpdateQuantity = (id: string, qty: number) => {
        dispatch(updateOrderQuantity({ id, qty }));
    };

    const handleUpdateUse = (id: string, use: boolean) => {
        dispatch(updateOrderUse({ id, use }));
    };

    const handleUpdateQtyAndUse = (id: string, qty: number, use: boolean) => {
        dispatch(updateOrderQtyAndUse({ id, qty, use }));
    };

    const handleSetOrders = (orders: QuantityToOrder[]) => {
        dispatch(setOrders(orders));
    };

    const handleSetLoading = (loading: boolean) => {
        dispatch(setLoading(loading));
    };

    const handleSetError = (error: string | null) => {
        dispatch(setError(error));
    };

    return {
        // State
        orders,
        isLoading,
        error,
        
        // Actions
        fetchOrders: handleFetchOrders,
        updateQuantity: handleUpdateQuantity,
        updateUse: handleUpdateUse,
        updateQtyAndUse: handleUpdateQtyAndUse,
        setOrders: handleSetOrders,
        setLoading: handleSetLoading,
        setError: handleSetError,
    };
}; 