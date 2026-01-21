import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfirmOrderMapper } from '../../application/mappers/ConfirmOrderMapper';
import { ConfirmOrderUseCase } from '../../application/usecases/ConfirmOrderUseCase';
import { ConfirmOrderParams } from '../../domain/repositories/ConfirmOrderRepository';
import { confirmOrderRepository } from '../../infrastructure/repositories/ConfirmOrderRepositoryImpl';

const confirmOrderUseCase = new ConfirmOrderUseCase(confirmOrderRepository);

interface SerializableConfirmOrderItem {
    id: number;
    orderId: number;
    productId: number | null;
    menuItemId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options: {
        size: string;
        ice: string;
        sweetness: string;
        toppings: { id: string; name?: string; price?: number }[];
    };
    createdAt: string;
}

interface SerializableConfirmOrder {
    id: number;
    orderCode: string;
    userId: number;
    storeId: number;
    source: string;
    subtotal: number;
    totalAmount: number;
    deliveryFee: number;
    discountAmount: number;
    finalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    address: { lat: number; lng: number; detail: string } | null;
    contactName: string | null;
    contactPhone: string | null;
    note: string | null;
    items: SerializableConfirmOrderItem[];
    createdAt: string;
    updatedAt: string;
}

interface ConfirmOrderState {
    isLoading: boolean;
    error: string | null;
    confirmedOrder: SerializableConfirmOrder | null;
}

const initialState: ConfirmOrderState = {
    isLoading: false,
    error: null,
    confirmedOrder: null,
};

export const confirmOrder = createAsyncThunk<SerializableConfirmOrder, ConfirmOrderParams, { rejectValue: string }>('confirmOrder/confirm', async (params: ConfirmOrderParams, { rejectWithValue }) => {
    try {
        const result = await confirmOrderUseCase.execute(params);
        return ConfirmOrderMapper.toSerializable(result);
    } catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('Đã có lỗi xảy ra khi xác nhận đơn hàng');
    }
});

const confirmOrderSlice = createSlice({
    name: 'confirmOrder',
    initialState,
    reducers: {
        clearConfirmOrderError: (state) => {
            state.error = null;
        },
        clearConfirmedOrder: (state) => {
            state.confirmedOrder = null;
            state.error = null;
        },
        setConfirmedOrder: (state, action: PayloadAction<SerializableConfirmOrder>) => {
            state.confirmedOrder = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(confirmOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(confirmOrder.fulfilled, (state, action: PayloadAction<SerializableConfirmOrder>) => {
                state.isLoading = false;
                state.confirmedOrder = action.payload;
            })
            .addCase(confirmOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Đã có lỗi xảy ra';
            });
    },
});

export const { clearConfirmOrderError, clearConfirmedOrder, setConfirmedOrder } = confirmOrderSlice.actions;
export default confirmOrderSlice.reducer;
export type { SerializableConfirmOrder, SerializableConfirmOrderItem };

export const selectIsLoading = (state: { confirmOrder: ConfirmOrderState }) => state.confirmOrder.isLoading;
export const selectError = (state: { confirmOrder: ConfirmOrderState }) => state.confirmOrder.error;
export const selectConfirmedOrder = (state: { confirmOrder: ConfirmOrderState }) => state.confirmOrder.confirmedOrder;
