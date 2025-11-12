import api from './api';

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  eventId: any;
  seatIds: string[];
  quantity: number;
  subtotal: number;
  fees: {
    serviceFee: number;
    processingFee: number;
  };
  total: number;
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
  };
  paymentStatus: string;
  status: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  data: {
    order: Order;
    ticket: any;
  };
}

export interface CreateOrderData {
  userId: string;
  eventId: string;
  seatIds: string[];
  paymentMethod: {
    type: string;
    brand?: string;
    last4?: string;
  };
}

export const ordersService = {
  // Get all orders
  getOrders: async (userId?: string, status?: string): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (status) params.append('status', status);

    const queryString = params.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    const response = await api.get<OrdersResponse>(endpoint);
    return response.data;
  },

  // Get single order
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<{ success: boolean; data: Order }>(`/orders/${orderId}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: CreateOrderData): Promise<{ order: Order; ticket: any }> => {
    const response = await api.post<OrderResponse>('/orders', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.put<{ success: boolean; data: Order }>(
      `/orders/${orderId}/cancel`,
      {}
    );
    return response.data;
  },

  // Get user's order history
  getUserOrders: async (userId: string): Promise<Order[]> => {
    return ordersService.getOrders(userId);
  },
};

export default ordersService;

