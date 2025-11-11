import { Ticket } from './types';

export const MY_TICKETS: Ticket[] = [
	{
		id: 't1',
		eventId: 'ev1',
		seatIds: ['A1', 'A2'],
		email: 'you@example.com',
		qrData: 'TICKET:t1|EV:ev1|SEATS:A1,A2',
		total: 240,
		purchasedAt: new Date().toISOString(),
	},
];


