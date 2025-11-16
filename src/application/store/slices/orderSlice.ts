/**
 * Order Slice
 * Redux slice for orders state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order } from '../../../domain/entities/order/Order';
import { OrderStatus } from '../../../domain/entities/order/OrderStatus';
import { IOrderRepository } from '../../../domain/repositories/IOrderRepository';
import { IProductRepository } from '../../../domain/repositories/IProductRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { CreateOrderUseCase, CreateOrderInput } from '../../usecases/order/CreateOrderUseCase';
import { GetOrdersUseCase } from '../../usecases/order/GetOrdersUseCase';
import { ServiceContainer } from '../../../core/di/ServiceContainer';
import { TYPES } from '../../../core/di/types';

// State interface
export interface OrderState {
  orders: Order[];
  activeOrders: Order[];
  currentOrder: Order | null;
  paymentUrl: string | null;
  isLoading: boolean;
  isCreating: boolean;
  isRefreshing: boolean;
  error: string | null;
}

// Initial state
const initialState: OrderState = {
  orders: [],
  activeOrders: [],
  currentOrder: null,
  paymentUrl: null,
  isLoading: false,
  isCreating: false,
  isRefreshing: false,
  error: null,
};

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (input: CreateOrderInput, { rejectWithValue }) => {
    try {
      const orderRepository = ServiceContainer.getInstance().resolve<IOrderRepository>(
        TYPES.OrderRepository
      );
      const productRepository = ServiceContainer.getInstance().resolve<IProductRepository>(
        TYPES.ProductRepository
      );
      const userRepository = ServiceContainer.getInstance().resolve<IUserRepository>(
        TYPES.UserRepository
      );

      const useCase = new CreateOrderUseCase(
        orderRepository,
        productRepository,
        userRepository
      );
      const result = await useCase.execute(input);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (
    { status, forceRefresh }: { status?: OrderStatus; forceRefresh?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const orderRepository = ServiceContainer.getInstance().resolve<IOrderRepository>(
        TYPES.OrderRepository
      );
      const userRepository = ServiceContainer.getInstance().resolve<IUserRepository>(
        TYPES.UserRepository
      );

      const useCase = new GetOrdersUseCase(orderRepository, userRepository);
      const result = await useCase.execute({ status, forceRefresh });
      return result.orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshOrders = createAsyncThunk(
  'order/refreshOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orderRepository = ServiceContainer.getInstance().resolve<IOrderRepository>(
        TYPES.OrderRepository
      );
      const userRepository = ServiceContainer.getInstance().resolve<IUserRepository>(
        TYPES.UserRepository
      );

      const useCase = new GetOrdersUseCase(orderRepository, userRepository);
      const result = await useCase.execute({ forceRefresh: true });
      return result.orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
      state.paymentUrl = null;
    },
    setCurrentOrder(state, action) {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrder.pending, (state) => {
      state.isCreating = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isCreating = false;
      state.currentOrder = action.payload.order;
      state.paymentUrl = action.payload.paymentUrl || null;
      state.orders.unshift(action.payload.order);

      // Update active orders
      const orderStatus = action.payload.order.toObject().status;
      if (
        orderStatus !== OrderStatus.COMPLETED &&
        orderStatus !== OrderStatus.CANCELLED
      ) {
        state.activeOrders.unshift(action.payload.order);
      }
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isCreating = false;
      state.error = action.payload as string;
    });

    // Fetch orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;

      // Filter active orders
      state.activeOrders = action.payload.filter((order) => {
        const status = order.toObject().status;
        return (
          status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED
        );
      });
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Refresh orders
    builder.addCase(refreshOrders.pending, (state) => {
      state.isRefreshing = true;
      state.error = null;
    });
    builder.addCase(refreshOrders.fulfilled, (state, action) => {
      state.isRefreshing = false;
      state.orders = action.payload;

      // Filter active orders
      state.activeOrders = action.payload.filter((order) => {
        const status = order.toObject().status;
        return (
          status !== OrderStatus.COMPLETED && status !== OrderStatus.CANCELLED
        );
      });
    });
    builder.addCase(refreshOrders.rejected, (state, action) => {
      state.isRefreshing = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearOrderError, clearCurrentOrder, setCurrentOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
