import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
    QuantityToOrder, 
    fetchQuantityToOrder as fetchQuantityToOrderService,
    updateOrderQuantity as updateOrderQuantityService,
    updateOrderUse as updateOrderUseService,
    updateOrderQtyAndUse as updateOrderQtyAndUseService
} from '../../../../services/quantityToOrder';

interface QuantityToOrderState {
    orders: QuantityToOrder[];
    isLoading: boolean;
    error: string | null;
}

const initialState: QuantityToOrderState = {
    orders: [],
    isLoading: false,
    error: null
};

// Асинхронные thunk-и
export const fetchQuantityToOrder = createAsyncThunk(
    'quantityToOrder/fetchQuantityToOrder',
    async () => {
        const orders = await fetchQuantityToOrderService();
        return orders;
    }
);

export const updateOrderQuantity = createAsyncThunk(
    'quantityToOrder/updateOrderQuantity',
    async (payload: { id: string; qty: number }) => {
        await updateOrderQuantityService(payload.id, payload.qty);
        return payload;
    }
);

export const updateOrderUse = createAsyncThunk(
    'quantityToOrder/updateOrderUse',
    async (payload: { id: string; use: boolean }) => {
        await updateOrderUseService(payload.id, payload.use);
        return payload;
    }
);

export const updateOrderQtyAndUse = createAsyncThunk(
    'quantityToOrder/updateOrderQtyAndUse',
    async (payload: { id: string; qty: number; use: boolean }) => {
        await updateOrderQtyAndUseService(payload.id, payload.qty, payload.use);
        return payload;
    }
);

const quantityToOrderSlice = createSlice({
    name: 'quantityToOrder',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<QuantityToOrder[]>) => {
            state.orders = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        updateOrderQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) {
                order.qty = action.payload.qty;
            }
        },
        updateOrderUseFlag: (state, action: PayloadAction<{ id: string; use: boolean }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) {
                order.use = action.payload.use;
            }
        },
        updateOrderQtyAndUseFlag: (state, action: PayloadAction<{ id: string; qty: number; use: boolean }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) {
                order.qty = action.payload.qty;
                order.use = action.payload.use;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuantityToOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchQuantityToOrder.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchQuantityToOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch quantity to order';
            })
            .addCase(updateOrderQuantity.fulfilled, (state, action) => {
                const order = state.orders.find(o => o.id === action.payload.id);
                if (order) {
                    order.qty = action.payload.qty;
                }
            })
            .addCase(updateOrderQuantity.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update order quantity';
            })
            .addCase(updateOrderUse.fulfilled, (state, action) => {
                const order = state.orders.find(o => o.id === action.payload.id);
                if (order) {
                    order.use = action.payload.use;
                }
            })
            .addCase(updateOrderUse.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update order use flag';
            })
            .addCase(updateOrderQtyAndUse.fulfilled, (state, action) => {
                const order = state.orders.find(o => o.id === action.payload.id);
                if (order) {
                    order.qty = action.payload.qty;
                    order.use = action.payload.use;
                }
            })
            .addCase(updateOrderQtyAndUse.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to update order quantity and use flag';
            });
    }
});

export const { 
    setOrders, 
    setLoading, 
    setError, 
    updateOrderQty, 
    updateOrderUseFlag, 
    updateOrderQtyAndUseFlag 
} = quantityToOrderSlice.actions;

export default quantityToOrderSlice.reducer; 