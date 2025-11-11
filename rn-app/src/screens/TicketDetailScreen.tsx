import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View, Share, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { MY_TICKETS } from '../data/tickets';
import { EVENTS } from '../data/events';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { TouchableOpacity } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

export default function TicketDetailScreen({ route, navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	const ticket = MY_TICKETS.find(t => t.id === route.params.ticketId);
	
	if (!ticket) {
		return (
			<View style={[styles.container, { backgroundColor: theme.bg }]}>
				<Text style={[styles.error, { color: theme.text }]}>Ticket not found</Text>
			</View>
		);
	}

	const event = EVENTS.find(e => e.id === ticket.eventId)!;
	const purchaseDate = new Date(ticket.purchasedAt);

	const handleShare = async () => {
		try {
			await Share.share({
				message: `My ticket for ${event.name} on ${event.date} at ${event.venue}. Seats: ${ticket.seatIds.join(', ')}`,
			});
		} catch (error) {
			Alert.alert('Error', 'Could not share ticket');
		}
	};

	return (
		<ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={styles.container}>
			{/* Event Image */}
			<Image source={{ uri: event.image }} style={styles.hero} />

			{/* Ticket Card */}
			<View style={[styles.ticketCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
				{/* Header */}
				<View style={styles.header}>
					<View style={{ flex: 1 }}>
						<Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
						<Text style={[styles.venue, { color: theme.muted }]}>{event.venue}</Text>
					</View>
					{event.isLive && (
						<View style={[styles.liveBadge, { backgroundColor: '#16a34a' }]}>
							<Text style={styles.liveText}>LIVE</Text>
						</View>
					)}
				</View>

				{/* QR Code */}
				<View style={[styles.qrContainer, { backgroundColor: theme.bg, borderColor: theme.border }]}>
					<QRCode 
						value={ticket.qrData} 
						size={180} 
						backgroundColor="transparent" 
						color={theme.isDark ? '#f3f4f6' : '#111827'} 
					/>
					<Text style={[styles.qrLabel, { color: theme.muted }]}>Scan at venue entrance</Text>
				</View>

				{/* Divider */}
				<View style={[styles.divider, { backgroundColor: theme.border }]} />

				{/* Details Grid */}
				<View style={styles.detailsGrid}>
					<View style={styles.detailItem}>
						<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
							<Ionicons name="calendar-outline" size={20} color={theme.accent} />
						</View>
						<View>
							<Text style={[styles.detailLabel, { color: theme.muted }]}>Date</Text>
							<Text style={[styles.detailValue, { color: theme.text }]}>{event.date}</Text>
						</View>
					</View>

					<View style={styles.detailItem}>
						<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
							<Ionicons name="time-outline" size={20} color={theme.accent} />
						</View>
						<View>
							<Text style={[styles.detailLabel, { color: theme.muted }]}>Time</Text>
							<Text style={[styles.detailValue, { color: theme.text }]}>{event.time}</Text>
						</View>
					</View>

					<View style={styles.detailItem}>
						<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
							<Ionicons name="location-outline" size={20} color={theme.accent} />
						</View>
						<View>
							<Text style={[styles.detailLabel, { color: theme.muted }]}>Venue</Text>
							<Text style={[styles.detailValue, { color: theme.text }]} numberOfLines={2}>
								{event.venue}
							</Text>
						</View>
					</View>

					<View style={styles.detailItem}>
						<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
							<Ionicons name="ticket-outline" size={20} color={theme.accent} />
						</View>
						<View>
							<Text style={[styles.detailLabel, { color: theme.muted }]}>Seats</Text>
							<Text style={[styles.detailValue, { color: theme.text }]}>
								{ticket.seatIds.join(', ')}
							</Text>
						</View>
					</View>
				</View>

				{/* Divider */}
				<View style={[styles.divider, { backgroundColor: theme.border }]} />

				{/* Purchase Info */}
				<View style={styles.purchaseInfo}>
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: theme.muted }]}>Ticket ID</Text>
						<Text style={[styles.infoValue, { color: theme.text, fontFamily: 'monospace' }]}>
							{ticket.id.toUpperCase()}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: theme.muted }]}>Email</Text>
						<Text style={[styles.infoValue, { color: theme.text }]}>{ticket.email}</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: theme.muted }]}>Total Paid</Text>
						<Text style={[styles.infoValue, { color: theme.accent, fontWeight: '700' }]}>
							${ticket.total.toFixed(2)}
						</Text>
					</View>
					<View style={styles.infoRow}>
						<Text style={[styles.infoLabel, { color: theme.muted }]}>Purchased</Text>
						<Text style={[styles.infoValue, { color: theme.text }]}>
							{purchaseDate.toLocaleDateString('en-US', { 
								month: 'short', 
								day: 'numeric', 
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</Text>
					</View>
				</View>
			</View>

			{/* Action Buttons */}
			<View style={styles.actions}>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleShare}
					style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
				>
					<Ionicons name="share-social-outline" size={20} color={theme.text} />
					<Text style={[styles.actionText, { color: theme.text }]}>Share</Text>
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => Alert.alert('Download', 'Ticket downloaded to your device')}
					style={[styles.actionButton, { backgroundColor: theme.card, borderColor: theme.border }]}
				>
					<Ionicons name="download-outline" size={20} color={theme.text} />
					<Text style={[styles.actionText, { color: theme.text }]}>Download</Text>
				</TouchableOpacity>
			</View>

			{/* Transfer Ticket Button */}
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => navigation.navigate('TransferTicket', { ticketId: ticket.id })}
				style={[styles.transferButton, { backgroundColor: theme.accent }]}
			>
				<Ionicons name="swap-horizontal" size={20} color="#ffffff" />
				<Text style={styles.transferButtonText}>Transfer or Sell Ticket</Text>
			</TouchableOpacity>

			{/* Info Box */}
			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Ionicons name="information-circle-outline" size={20} color={theme.accent} />
				<Text style={[styles.infoBoxText, { color: theme.muted }]}>
					Show this QR code at the venue entrance. Screenshots are not accepted.
				</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { paddingBottom: 24 },
	hero: { width: '100%', height: 200 },
	ticketCard: {
		margin: 16,
		borderRadius: 20,
		padding: 20,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 16,
		shadowOpacity: 0.1,
		elevation: 5,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	eventName: {
		fontSize: 24,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		marginBottom: 4,
	},
	venue: {
		fontSize: 14,
		fontFamily: 'Inter_400Regular',
	},
	liveBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 12,
	},
	liveText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: '700',
	},
	qrContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		padding: 20,
		borderRadius: 16,
		borderWidth: 1,
		marginBottom: 20,
	},
	qrLabel: {
		marginTop: 12,
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
	},
	divider: {
		height: 1,
		marginVertical: 20,
	},
	detailsGrid: {
		gap: 16,
	},
	detailItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	detailLabel: {
		fontSize: 12,
		marginBottom: 2,
	},
	detailValue: {
		fontSize: 16,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	purchaseInfo: {
		gap: 12,
	},
	infoRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	infoLabel: {
		fontSize: 14,
	},
	infoValue: {
		fontSize: 14,
		fontWeight: '600',
	},
	actions: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		gap: 12,
		marginBottom: 16,
	},
	actionButton: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		paddingVertical: 14,
		borderRadius: 14,
		borderWidth: 1,
	},
	actionText: {
		fontSize: 16,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	transferButton: {
		marginHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		paddingVertical: 16,
		borderRadius: 14,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 4,
	},
	transferButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	infoBox: {
		marginHorizontal: 16,
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 10,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	infoBoxText: {
		fontSize: 13,
		flex: 1,
		lineHeight: 18,
	},
	error: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 40,
	},
});

