import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { EVENTS } from '../data/events';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Listing = {
	id: string;
	sellerId: string;
	sellerName: string;
	sellerAvatar: string;
	eventId: string;
	seatIds: string[];
	listingType: 'trade' | 'sell' | 'combo';
	askingPrice?: number;
	wantedEvent?: string;
	wantedSeats?: string;
	description: string;
	rating: number;
	postedTime: string;
};

const MARKETPLACE_LISTINGS: Listing[] = [
	{
		id: 'ml1',
		sellerId: 'u1',
		sellerName: 'Sarah Johnson',
		sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
		eventId: 'ev1',
		seatIds: ['A1', 'A2'],
		listingType: 'trade',
		wantedEvent: 'Mono Noir',
		wantedSeats: 'Any VIP seats',
		description: 'Looking to trade Aurora Live tickets for Mono Noir. Flexible on seats!',
		rating: 4.8,
		postedTime: '2 hours ago',
	},
	{
		id: 'ml2',
		sellerId: 'u2',
		sellerName: 'Mike Chen',
		sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
		eventId: 'ev2',
		seatIds: ['B3', 'B4'],
		listingType: 'combo',
		askingPrice: 50,
		wantedEvent: 'Aurora Live',
		description: 'Trading Mono Noir + $50 for Aurora Live tickets',
		rating: 4.9,
		postedTime: '5 hours ago',
	},
	{
		id: 'ml3',
		sellerId: 'u3',
		sellerName: 'Emma Wilson',
		sellerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
		eventId: 'ev3',
		seatIds: ['C5', 'C6'],
		listingType: 'sell',
		askingPrice: 120,
		description: 'Selling Soft Echo tickets, great seats!',
		rating: 5.0,
		postedTime: '1 day ago',
	},
];

export default function TicketMarketplaceScreen(): React.ReactElement {
	const { theme } = useTheme();
	const navigation = useNavigation<NavigationProp>();
	const [filter, setFilter] = useState<'all' | 'trade' | 'sell' | 'combo'>('all');
	const [searchQuery, setSearchQuery] = useState('');

	const filteredListings = MARKETPLACE_LISTINGS.filter(listing => {
		const matchesFilter = filter === 'all' || listing.listingType === filter;
		const event = EVENTS.find(e => e.id === listing.eventId);
		const matchesSearch = searchQuery === '' || 
			event?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			listing.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesFilter && matchesSearch;
	});

	const getListingTypeIcon = (type: string) => {
		switch (type) {
			case 'trade': return 'swap-horizontal';
			case 'sell': return 'cash';
			case 'combo': return 'trending-up';
			default: return 'ticket';
		}
	};

	const getListingTypeColor = (type: string) => {
		switch (type) {
			case 'trade': return '#10b981';
			case 'sell': return '#3b82f6';
			case 'combo': return '#f59e0b';
			default: return theme.accent;
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			{/* Header */}
			<View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
				<View style={styles.headerTop}>
					<View>
						<Text style={[styles.headerTitle, { color: theme.text }]}>Ticket Marketplace</Text>
						<Text style={[styles.headerSubtitle, { color: theme.muted }]}>Trade, swap, or buy tickets</Text>
					</View>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => navigation.navigate('CreateListing')}
						style={[styles.createButton, { backgroundColor: theme.accent }]}
					>
						<Ionicons name="add" size={20} color="#ffffff" />
						<Text style={styles.createButtonText}>List</Text>
					</TouchableOpacity>
				</View>

				{/* Search */}
				<View style={[styles.searchBar, { backgroundColor: theme.bg, borderColor: theme.border }]}>
					<Ionicons name="search" size={18} color={theme.muted} />
					<TextInput
						value={searchQuery}
						onChangeText={setSearchQuery}
						placeholder="Search events or listings..."
						placeholderTextColor={theme.muted}
						style={[styles.searchInput, { color: theme.text }]}
					/>
				</View>

				{/* Filters */}
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
					{(['all', 'trade', 'sell', 'combo'] as const).map(f => (
						<TouchableOpacity
							key={f}
							activeOpacity={0.7}
							onPress={() => setFilter(f)}
							style={[
								styles.filterChip,
								{
									backgroundColor: filter === f ? theme.accent : theme.bg,
									borderColor: filter === f ? theme.accent : theme.border,
								}
							]}
						>
							<Text style={[styles.filterText, { color: filter === f ? '#ffffff' : theme.text }]}>
								{f.charAt(0).toUpperCase() + f.slice(1)}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Listings */}
			<ScrollView contentContainerStyle={styles.listingsContainer}>
				{filteredListings.map(listing => {
					const event = EVENTS.find(e => e.id === listing.eventId);
					if (!event) return null;

					return (
						<TouchableOpacity
							key={listing.id}
							activeOpacity={0.9}
							onPress={() => navigation.navigate('ListingDetail', { listingId: listing.id })}
							style={[styles.listingCard, { backgroundColor: theme.card, borderColor: theme.border }]}
						>
							{/* Event Image */}
							<Image source={{ uri: event.image }} style={styles.eventImage} />

							{/* Listing Type Badge */}
							<View style={[styles.typeBadge, { backgroundColor: getListingTypeColor(listing.listingType) }]}>
								<Ionicons name={getListingTypeIcon(listing.listingType) as any} size={12} color="#ffffff" />
								<Text style={styles.typeBadgeText}>
									{listing.listingType.toUpperCase()}
								</Text>
							</View>

							<View style={styles.listingContent}>
								{/* Event Info */}
								<Text style={[styles.eventName, { color: theme.text }]} numberOfLines={1}>
									{event.name}
								</Text>
								<Text style={[styles.eventMeta, { color: theme.muted }]} numberOfLines={1}>
									{event.date} • Seats: {listing.seatIds.join(', ')}
								</Text>

								{/* Trade/Sell Details */}
								<View style={styles.dealInfo}>
									{listing.listingType === 'trade' && (
										<View style={styles.tradeInfo}>
											<Ionicons name="swap-horizontal" size={16} color={theme.accent} />
											<Text style={[styles.tradeText, { color: theme.text }]}>
												For: {listing.wantedEvent}
											</Text>
										</View>
									)}
									{listing.listingType === 'sell' && (
										<View style={styles.priceInfo}>
											<Text style={[styles.price, { color: theme.accent }]}>
												${listing.askingPrice}
											</Text>
										</View>
									)}
									{listing.listingType === 'combo' && (
										<View style={styles.comboInfo}>
											<Text style={[styles.comboText, { color: theme.text }]}>
												+ ${listing.askingPrice}
											</Text>
											<Ionicons name="arrow-forward" size={14} color={theme.muted} />
											<Text style={[styles.comboText, { color: theme.muted }]}>
												{listing.wantedEvent}
											</Text>
										</View>
									)}
								</View>

								{/* Description */}
								<Text style={[styles.description, { color: theme.muted }]} numberOfLines={2}>
									{listing.description}
								</Text>

								{/* Seller Info */}
								<View style={styles.sellerInfo}>
									<Image source={{ uri: listing.sellerAvatar }} style={styles.sellerAvatar} />
									<View style={styles.sellerDetails}>
										<Text style={[styles.sellerName, { color: theme.text }]}>
											{listing.sellerName}
										</Text>
										<View style={styles.ratingRow}>
											<Ionicons name="star" size={12} color="#fbbf24" />
											<Text style={[styles.rating, { color: theme.muted }]}>
												{listing.rating}
											</Text>
											<Text style={[styles.postedTime, { color: theme.muted }]}>
												• {listing.postedTime}
											</Text>
										</View>
									</View>
									<TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.accent }]}>
										<Ionicons name="chatbubble-outline" size={16} color="#ffffff" />
									</TouchableOpacity>
								</View>
							</View>
						</TouchableOpacity>
					);
				})}

				{filteredListings.length === 0 && (
					<View style={styles.emptyState}>
						<Ionicons name="search-outline" size={48} color={theme.muted} />
						<Text style={[styles.emptyText, { color: theme.text }]}>No listings found</Text>
						<Text style={[styles.emptySubtext, { color: theme.muted }]}>
							Try adjusting your search or filters
						</Text>
					</View>
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	header: {
		padding: 16,
		paddingTop: 60,
		borderBottomWidth: 1,
		gap: 12,
	},
	headerTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	headerSubtitle: {
		fontSize: 13,
		marginTop: 2,
	},
	createButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 8,
		paddingHorizontal: 14,
		borderRadius: 20,
	},
	createButtonText: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: '700',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 12,
		borderWidth: 1,
	},
	searchInput: {
		flex: 1,
		fontSize: 15,
	},
	filters: {
		flexDirection: 'row',
		gap: 8,
	},
	filterChip: {
		paddingVertical: 6,
		paddingHorizontal: 14,
		borderRadius: 20,
		borderWidth: 1,
	},
	filterText: {
		fontSize: 13,
		fontWeight: '600',
	},
	listingsContainer: {
		padding: 16,
		gap: 16,
	},
	listingCard: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: 'hidden',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 12,
		shadowOpacity: 0.08,
		elevation: 3,
	},
	eventImage: {
		width: '100%',
		height: 160,
	},
	typeBadge: {
		position: 'absolute',
		top: 12,
		right: 12,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 12,
	},
	typeBadgeText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: '700',
	},
	listingContent: {
		padding: 14,
		gap: 10,
	},
	eventName: {
		fontSize: 18,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	eventMeta: {
		fontSize: 12,
	},
	dealInfo: {
		marginTop: 4,
	},
	tradeInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	tradeText: {
		fontSize: 14,
		fontWeight: '600',
	},
	priceInfo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	price: {
		fontSize: 24,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	comboInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	comboText: {
		fontSize: 14,
		fontWeight: '600',
	},
	description: {
		fontSize: 13,
		lineHeight: 18,
	},
	sellerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.05)',
	},
	sellerAvatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
	},
	sellerDetails: {
		flex: 1,
		gap: 2,
	},
	sellerName: {
		fontSize: 13,
		fontWeight: '600',
	},
	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	rating: {
		fontSize: 11,
		fontWeight: '600',
	},
	postedTime: {
		fontSize: 11,
	},
	contactButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	emptyState: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 60,
		gap: 12,
	},
	emptyText: {
		fontSize: 18,
		fontWeight: '700',
	},
	emptySubtext: {
		fontSize: 14,
	},
});

