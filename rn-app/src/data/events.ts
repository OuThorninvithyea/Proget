import { EventItem } from './types';

export const EVENTS: EventItem[] = [
	{
		id: 'ev1',
		name: 'Aurora Live',
		date: '2025-12-05',
		time: '19:30',
		venue: 'Skyline Arena',
		image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1600&auto=format&fit=crop',
		description:
			'A serene electronic night with atmospheric sounds and immersive visuals. Ultra-minimal stage design.',
		pricing: [
			{ tier: 'A', price: 120 },
			{ tier: 'B', price: 85 },
			{ tier: 'C', price: 55 },
		],
		isLive: true,
		isFree: false,
		distanceKm: 3.2,
	},
	{
		id: 'ev2',
		name: 'Mono Noir',
		date: '2026-01-12',
		time: '20:00',
		venue: 'Harbor Hall',
		image: 'https://images.unsplash.com/photo-1516283440484-52942e0b9f3b?q=80&w=1600&auto=format&fit=crop',
		description:
			'Dark ambient and minimal techno set with a monochrome palette. Expect deep bass and subtle textures.',
		pricing: [
			{ tier: 'A', price: 140 },
			{ tier: 'B', price: 95 },
			{ tier: 'C', price: 60 },
		],
		isLive: false,
		isFree: true,
		distanceKm: 8.6,
	},
	{
		id: 'ev3',
		name: 'Soft Echo',
		date: '2026-02-21',
		time: '18:45',
		venue: 'Garden Pavilion',
		image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=1600&auto=format&fit=crop',
		description:
			'An intimate acoustic session focusing on space and silence. Thoughtful arrangements in a calm setting.',
		pricing: [
			{ tier: 'A', price: 90 },
			{ tier: 'B', price: 70 },
			{ tier: 'C', price: 45 },
		],
		isLive: true,
		isFree: false,
		distanceKm: 1.1,
	},
];


