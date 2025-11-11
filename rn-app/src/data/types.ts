export type EventItem = {
	id: string;
	name: string;
	date: string; // ISO
	time: string; // e.g. '19:30'
	venue: string;
	image: string;
	description: string;
	pricing: { tier: 'A' | 'B' | 'C'; price: number }[];
	// New flags/metadata for filtering and display
	isLive?: boolean;
	isFree?: boolean;
	distanceKm?: number; // approximate distance for "nearby" sort/filter
};

export type Ticket = {
	id: string;
	eventId: string;
	seatIds: string[];
	email: string;
	qrData: string;
	total: number;
	purchasedAt: string;
};


