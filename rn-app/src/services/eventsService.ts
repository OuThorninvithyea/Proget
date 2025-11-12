import api from './api';
import { EventItem } from '../data/types';

export interface EventsResponse {
  success: boolean;
  count: number;
  data: EventItem[];
}

export interface EventResponse {
  success: boolean;
  data: EventItem;
}

export interface EventQuery {
  status?: string;
  category?: string;
  search?: string;
  featured?: boolean;
}

export const eventsService = {
  // Get all events
  getEvents: async (query?: EventQuery): Promise<EventItem[]> => {
    const params = new URLSearchParams();
    if (query?.status) params.append('status', query.status);
    if (query?.category) params.append('category', query.category);
    if (query?.search) params.append('search', query.search);
    if (query?.featured !== undefined) params.append('featured', query.featured.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    
    const response = await api.get<EventsResponse>(endpoint);
    return response.data;
  },

  // Get single event
  getEvent: async (eventId: string): Promise<EventItem> => {
    const response = await api.get<EventResponse>(`/events/${eventId}`);
    return response.data;
  },

  // Book seats for an event
  bookSeats: async (eventId: string, seatIds: string[]): Promise<EventItem> => {
    const response = await api.post<EventResponse>(
      `/events/${eventId}/book-seats`,
      { seatIds }
    );
    return response.data;
  },

  // Get featured events
  getFeaturedEvents: async (): Promise<EventItem[]> => {
    return eventsService.getEvents({ featured: true });
  },

  // Search events
  searchEvents: async (searchTerm: string): Promise<EventItem[]> => {
    return eventsService.getEvents({ search: searchTerm });
  },
};

export default eventsService;

