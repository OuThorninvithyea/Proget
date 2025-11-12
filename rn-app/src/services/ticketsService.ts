import api from './api';
import { Ticket } from '../data/types';

export interface TicketsResponse {
  success: boolean;
  count: number;
  data: Ticket[];
}

export interface TicketResponse {
  success: boolean;
  data: Ticket;
}

export interface TicketQuery {
  userId?: string;
  eventId?: string;
  status?: string;
}

export const ticketsService = {
  // Get all tickets
  getTickets: async (query?: TicketQuery): Promise<Ticket[]> => {
    const params = new URLSearchParams();
    if (query?.userId) params.append('userId', query.userId);
    if (query?.eventId) params.append('eventId', query.eventId);
    if (query?.status) params.append('status', query.status);

    const queryString = params.toString();
    const endpoint = queryString ? `/tickets?${queryString}` : '/tickets';
    
    const response = await api.get<TicketsResponse>(endpoint);
    return response.data;
  },

  // Get single ticket
  getTicket: async (ticketId: string): Promise<Ticket> => {
    const response = await api.get<TicketResponse>(`/tickets/${ticketId}`);
    return response.data;
  },

  // Get user's tickets
  getUserTickets: async (userId: string): Promise<Ticket[]> => {
    return ticketsService.getTickets({ userId, status: 'active' });
  },

  // Transfer ticket
  transferTicket: async (ticketId: string, transferredTo: string): Promise<Ticket> => {
    const response = await api.put<TicketResponse>(
      `/tickets/${ticketId}/transfer`,
      { transferredTo }
    );
    return response.data;
  },

  // Mark ticket as used
  useTicket: async (ticketId: string): Promise<Ticket> => {
    const response = await api.put<TicketResponse>(
      `/tickets/${ticketId}/use`,
      {}
    );
    return response.data;
  },
};

export default ticketsService;

