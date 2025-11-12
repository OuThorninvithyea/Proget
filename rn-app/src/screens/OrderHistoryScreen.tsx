import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { EVENTS } from '../data/events';
import { MY_TICKETS } from '../data/tickets';

export default function OrderHistoryScreen(): React.ReactElement {
	const { theme } = useTheme();

	const orders = MY_TICKETS.map(ticket => {
		const event = EVENTS.find(e => e.id === ticket.eventId)!;
		return {
			id: ticket.id,
			event,
			seatIds: ticket.seatIds,
			total: ticket.total,
			purchasedAt: new Date(ticket.purchasedAt),
			status: 'completed' as const,
		};
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return '#10b981';
			case 'pending': return '#f59e0b';
			case 'refunded': return '#ef4444';
			default: return theme.muted;
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<ScrollView contentContainerStyle={styles.content}>
				{orders.length === 0 ? (
					<View style={styles.emptyState}>
						<Ionicons name="receipt-outline" size={48} color={theme.muted} />
						<Text style={[styles.emptyText, { color: theme.text }]}>No orders yet</Text>
						<Text style={[styles.emptySubtext, { color: theme.muted }]}>
							Your purchase history will appear here
						</Text>
					</View>
				) : (
					orders.map(order => (
						<TouchableOpacity
							key={order.id}
							activeOpacity={0.9}
							style={[styles.orderCard, { backgroundColor: theme.card, borderColor: theme.border }]}
						>
							<View style={styles.orderHeader}>
								<View style={styles.orderInfo}>
									<Text style={[styles.orderId, { color: theme.muted }]}>
										Order #{order.id.toUpperCase()}
									</Text>
									<Text style={[styles.orderDate, { color: theme.muted }]}>
										{order.purchasedAt.toLocaleDateString('en-US', { 
											month: 'short',
											day: 'numeric',
											year: 'numeric'
										})}
									</Text>
								</View>
								<View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
									<Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
								</View>
							</View>

							<View style={styles.eventInfo}>
								<Image source={{ uri: order.event.image }} style={styles.eventImage} />
								<View style={styles.eventDetails}>
									<Text style={[styles.eventName, { color: theme.text }]} numberOfLines={1}>
										{order.event.name}
									</Text>
									<Text style={[styles.eventMeta, { color: theme.muted }]}>
										{order.event.date} • {order.event.venue}
									</Text>
									<Text style={[styles.seats, { color: theme.muted }]}>
										Seats: {order.seatIds.join(', ')}
									</Text>
								</View>
							</View>

							<View style={[styles.orderFooter, { borderTopColor: theme.border }]}>
								<Text style={[styles.totalLabel, { color: theme.muted }]}>Total Paid</Text>
								<Text style={[styles.totalValue, { color: theme.text }]}>
									${order.total.toFixed(2)}
								</Text>
							</View>
						</TouchableOpacity>
					))
				)}

				{/* Summary */}
				{orders.length > 0 && (
					<View style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
						<Text style={[styles.summaryTitle, { color: theme.text }]}>Order Summary</Text>
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: theme.muted }]}>Total Orders</Text>
							<Text style={[styles.summaryValue, { color: theme.text }]}>{orders.length}</Text>
						</View>
						<View style={styles.summaryRow}>
							<Text style={[styles.summaryLabel, { color: theme.muted }]}>Total Spent</Text>
							<Text style={[styles.summaryValue, { color: theme.accent }]}>
								${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
							</Text>
						</View>
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
	content: {
		padding: 16,
		gap: 16,
	},
	orderCard: {
		borderRadius: 16,
		borderWidth: 1,
		padding: 16,
		gap: 14,
	},
	orderHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	orderInfo: {
		gap: 2,
	},
	orderId: {
		fontSize: 12,
		fontWeight: '600',
	},
	orderDate: {
		fontSize: 11,
	},
	statusBadge: {
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 12,
	},
	statusText: {
		color: '#ffffff',
		fontSize: 10,
		fontWeight: '700',
	},
	eventInfo: {
		flexDirection: 'row',
		gap: 12,
	},
	eventImage: {
		width: 80,
		height: 80,
		borderRadius: 12,
	},
	eventDetails: {
		flex: 1,
		gap: 4,
	},
	eventName: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	eventMeta: {
		fontSize: 12,
	},
	seats: {
		fontSize: 12,
		marginTop: 2,
	},
	orderFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 12,
		borderTopWidth: 1,
	},
	totalLabel: {
		fontSize: 13,
	},
	totalValue: {
		fontSize: 18,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
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
	summary: {
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
		marginTop: 8,
	},
	summaryTitle: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		marginBottom: 4,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	summaryLabel: {
		fontSize: 14,
	},
	summaryValue: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
});

