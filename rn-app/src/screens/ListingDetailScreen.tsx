import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { EVENTS } from '../data/events';

type Props = NativeStackScreenProps<RootStackParamList, 'ListingDetail'>;

export default function ListingDetailScreen({ route, navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	
	// Mock listing data - would come from API in production
	const listing = {
		id: route.params.listingId,
		sellerId: 'u1',
		sellerName: 'Sarah Johnson',
		sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
		eventId: 'ev1',
		seatIds: ['A1', 'A2'],
		listingType: 'trade' as const,
		wantedEvent: 'Mono Noir',
		wantedSeats: 'Any VIP seats',
		description: 'Looking to trade Aurora Live tickets for Mono Noir. Flexible on seats! Can throw in some extra if needed.',
		rating: 4.8,
		totalTrades: 12,
		postedTime: '2 hours ago',
		verified: true,
	};

	const event = EVENTS.find(e => e.id === listing.eventId);

	const handleProposeTrade = () => {
		Alert.alert(
			'Propose Trade',
			'Select your tickets to offer for this trade',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Select Tickets', onPress: () => navigation.navigate('ProposeTrade', { listingId: listing.id }) }
			]
		);
	};

	const handleMessage = () => {
		Alert.alert('Message Seller', 'Chat feature would open here');
	};

	if (!event) {
		return (
			<View style={[styles.container, { backgroundColor: theme.bg }]}>
				<Text style={[styles.error, { color: theme.text }]}>Listing not found</Text>
			</View>
		);
	}

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
			{/* Event Image */}
			<Image source={{ uri: event.image }} style={styles.eventImage} />

			{/* Listing Type Badge */}
			<View style={[styles.badge, { backgroundColor: '#10b981' }]}>
				<Ionicons name="swap-horizontal" size={16} color="#ffffff" />
				<Text style={styles.badgeText}>TRADE</Text>
			</View>

			{/* Event Info */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
				<View style={styles.eventDetails}>
					<View style={styles.detailItem}>
						<Ionicons name="calendar-outline" size={16} color={theme.muted} />
						<Text style={[styles.detailText, { color: theme.muted }]}>{event.date}</Text>
					</View>
					<View style={styles.detailItem}>
						<Ionicons name="location-outline" size={16} color={theme.muted} />
						<Text style={[styles.detailText, { color: theme.muted }]}>{event.venue}</Text>
					</View>
					<View style={styles.detailItem}>
						<Ionicons name="ticket-outline" size={16} color={theme.muted} />
						<Text style={[styles.detailText, { color: theme.muted }]}>
							Seats: {listing.seatIds.join(', ')}
						</Text>
					</View>
				</View>
			</View>

			{/* Trade Details */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Looking For</Text>
				<View style={styles.tradeInfo}>
					<View style={[styles.tradeIcon, { backgroundColor: theme.accent + '20' }]}>
						<Ionicons name="swap-horizontal" size={24} color={theme.accent} />
					</View>
					<View style={styles.tradeDetails}>
						<Text style={[styles.wantedEvent, { color: theme.text }]}>{listing.wantedEvent}</Text>
						{listing.wantedSeats && (
							<Text style={[styles.wantedSeats, { color: theme.muted }]}>{listing.wantedSeats}</Text>
						)}
					</View>
				</View>
			</View>

			{/* Description */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
				<Text style={[styles.description, { color: theme.muted }]}>{listing.description}</Text>
			</View>

			{/* Seller Info */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>Seller Information</Text>
				<View style={styles.sellerInfo}>
					<Image source={{ uri: listing.sellerAvatar }} style={styles.sellerAvatar} />
					<View style={styles.sellerDetails}>
						<View style={styles.sellerNameRow}>
							<Text style={[styles.sellerName, { color: theme.text }]}>{listing.sellerName}</Text>
							{listing.verified && (
								<Ionicons name="checkmark-circle" size={18} color="#10b981" />
							)}
						</View>
						<View style={styles.sellerStats}>
							<Ionicons name="star" size={14} color="#fbbf24" />
							<Text style={[styles.rating, { color: theme.text }]}>{listing.rating}</Text>
							<Text style={[styles.statsText, { color: theme.muted }]}>
								• {listing.totalTrades} trades
							</Text>
						</View>
					</View>
				</View>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleMessage}
					style={[styles.messageButton, { backgroundColor: theme.bg, borderColor: theme.border }]}
				>
					<Ionicons name="chatbubble-outline" size={20} color={theme.text} />
					<Text style={[styles.messageButtonText, { color: theme.text }]}>Message Seller</Text>
				</TouchableOpacity>
			</View>

			{/* Safety Tips */}
			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
				<Ionicons name="shield-checkmark" size={20} color={theme.accent} />
				<View style={styles.infoContent}>
					<Text style={[styles.infoTitle, { color: theme.text }]}>Safe Trading</Text>
					<Text style={[styles.infoText, { color: theme.muted }]}>
						All trades are protected with escrow and dual verification. Never pay outside the platform.
					</Text>
				</View>
			</View>

			{/* Action Buttons */}
			<View style={styles.actions}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => Alert.alert('Saved', 'Listing saved to your favorites')}
					style={[styles.secondaryButton, { backgroundColor: theme.card, borderColor: theme.border }]}
				>
					<Ionicons name="bookmark-outline" size={20} color={theme.text} />
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleProposeTrade}
					style={[styles.primaryButton, { backgroundColor: theme.accent }]}
				>
					<Text style={styles.primaryButtonText}>Propose Trade</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		paddingBottom: 32,
	},
	eventImage: {
		width: '100%',
		height: 220,
	},
	badge: {
		position: 'absolute',
		top: 180,
		left: 16,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 20,
	},
	badgeText: {
		color: '#ffffff',
		fontSize: 12,
		fontWeight: '700',
	},
	card: {
		margin: 16,
		marginTop: 8,
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
	},
	eventName: {
		fontSize: 22,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	eventDetails: {
		gap: 8,
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	detailText: {
		fontSize: 14,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	tradeInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	tradeIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tradeDetails: {
		flex: 1,
		gap: 2,
	},
	wantedEvent: {
		fontSize: 18,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	wantedSeats: {
		fontSize: 13,
	},
	description: {
		fontSize: 14,
		lineHeight: 20,
	},
	sellerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	sellerAvatar: {
		width: 56,
		height: 56,
		borderRadius: 28,
	},
	sellerDetails: {
		flex: 1,
		gap: 4,
	},
	sellerNameRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	sellerName: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	sellerStats: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	rating: {
		fontSize: 14,
		fontWeight: '600',
	},
	statsText: {
		fontSize: 12,
	},
	messageButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 12,
		borderRadius: 12,
		borderWidth: 1,
	},
	messageButtonText: {
		fontSize: 15,
		fontWeight: '600',
	},
	infoBox: {
		marginHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	infoContent: {
		flex: 1,
		gap: 4,
	},
	infoTitle: {
		fontSize: 14,
		fontWeight: '700',
	},
	infoText: {
		fontSize: 12,
		lineHeight: 16,
	},
	actions: {
		flexDirection: 'row',
		marginHorizontal: 16,
		marginTop: 8,
		gap: 12,
	},
	secondaryButton: {
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
	primaryButton: {
		flex: 1,
		height: 56,
		borderRadius: 28,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 4,
	},
	primaryButtonText: {
		color: '#ffffff',
		fontSize: 17,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	error: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 40,
	},
});

