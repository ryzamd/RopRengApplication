import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PreOrderMapper } from '../../application/mappers/PreOrderMapper';
import { CreatePreOrderUseCase } from '../../application/usecases/CreatePreOrderUseCase';
import { CreatePreOrderParams } from '../../domain/repositories/PreOrderRepository';
import { preOrderRepository } from '../../infrastructure/repositories/PreOrderRepositoryImpl';

const createPreOrderUseCase = new CreatePreOrderUseCase(preOrderRepository);

interface SerializablePreOrder {
  preorderId: number;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  finalAmount: number;
  createdAt: string;
}

interface PreOrderState {
  isLoading: boolean;
  error: string | null;
  lastOrder: SerializablePreOrder | null;
}

const initialState: PreOrderState = {
  isLoading: false,
  error: null,
  lastOrder: null,
};

export const createPreOrder = createAsyncThunk<SerializablePreOrder, CreatePreOrderParams, { rejectValue: string }>('preOrder/create',
  async (params: CreatePreOrderParams, { rejectWithValue }) => {
    try {
      const result = await createPreOrderUseCase.execute(params);
      return PreOrderMapper.toSerializable(result);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã có lỗi xảy ra khi tạo đơn hàng');
    }
  }
);

const preOrderSlice = createSlice({
  name: 'preOrder',
  initialState,
  reducers: {
    clearPreOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPreOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPreOrder.fulfilled, (state, action: PayloadAction<SerializablePreOrder>) => {
        state.isLoading = false;
        state.lastOrder = action.payload;
      })
      .addCase(createPreOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Đã có lỗi xảy ra';
      });
  },
});

export const { clearPreOrderError } = preOrderSlice.actions;
export default preOrderSlice.reducer;