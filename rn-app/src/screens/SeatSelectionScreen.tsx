import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import SeatGrid, { Seat } from '../components/SeatGrid';
import { EVENTS } from '../data/events';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

export default function SeatSelectionScreen({ route, navigation }: Props): JSX.Element {
	const { theme } = useTheme();
	const event = EVENTS.find(e => e.id === route.params.eventId)!;
	const [selected, setSelected] = useState<Set<string>>(new Set());

	const seats: Seat[] = useMemo(() => {
		// Generate rows A-F, 10 seats each; some taken
		const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
		const taken = new Set(['A3', 'A4', 'B5', 'C1', 'D9', 'E2']);
		return rows.flatMap(row =>
			Array.from({ length: 10 }, (_, i) => {
				const id = `${row}${i + 1}`;
				const tier = row === 'A' || row === 'B' ? 'A' : row === 'C' || row === 'D' ? 'B' : 'C';
				const price = event.pricing.find(p => p.tier === (tier as 'A' | 'B' | 'C'))!.price;
				return { id, state: taken.has(id) ? 'taken' : 'available', price } as Seat;
			}),
		);
	}, [event]);

	const total = useMemo(() => {
		let sum = 0;
		for (const id of selected) {
			const seat = seats.find(s => s.id === id);
			if (seat) sum += seat.price;
		}
		return sum;
	}, [selected, seats]);

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<Text style={[styles.title, { color: theme.text }]}>{event.name}</Text>
			<Text style={[styles.meta, { color: theme.muted }]}>{event.date} • {event.venue}</Text>

			{/* Legend */}
			<View style={[styles.legend, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<View style={styles.legendItem}>
					<View style={[styles.legendBox, { backgroundColor: theme.isDark ? '#1f2937' : '#ffffff', borderColor: theme.isDark ? '#374151' : theme.border }]} />
					<Text style={[styles.legendText, { color: theme.text }]}>Available</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={[styles.legendBox, { backgroundColor: theme.accent, borderColor: theme.accent }]} />
					<Text style={[styles.legendText, { color: theme.text }]}>Selected</Text>
				</View>
				<View style={styles.legendItem}>
					<View style={[styles.legendBox, { backgroundColor: theme.isDark ? '#374151' : '#d1d5db', borderColor: theme.isDark ? '#4b5563' : '#9ca3af', opacity: 0.5 }]} />
					<Text style={[styles.legendText, { color: theme.text }]}>Taken</Text>
				</View>
			</View>

			<SeatGrid
				seats={seats}
				selected={selected}
				onToggle={(id) => {
					const next = new Set(selected);
					if (next.has(id)) next.delete(id);
					else next.add(id);
					setSelected(next);
				}}
			/>

			{/* Selection Summary */}
			{selected.size > 0 && (
				<View style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<View style={styles.summaryRow}>
						<Ionicons name="ticket-outline" size={18} color={theme.accent} />
						<Text style={[styles.summaryText, { color: theme.text }]}>
							{selected.size} seat{selected.size > 1 ? 's' : ''} selected
						</Text>
					</View>
					<Text style={[styles.summarySeats, { color: theme.muted }]}>
						{Array.from(selected).sort().join(', ')}
					</Text>
				</View>
			)}

			<View style={[styles.footer]}>
				<View style={styles.totalContainer}>
					<Text style={[styles.totalLabel, { color: theme.muted }]}>Total</Text>
					<Text style={[styles.total, { color: theme.text }]}>${total.toFixed(2)}</Text>
				</View>
				<TouchableOpacity
					activeOpacity={0.9}
					disabled={selected.size === 0}
					onPress={() => navigation.navigate('Checkout', { eventId: event.id, seatIds: Array.from(selected) })}
					style={[styles.cta, { backgroundColor: selected.size ? theme.accent : theme.border }]}
				>
					<Text style={[styles.ctaText, { opacity: selected.size ? 1 : 0.5 }]}>Continue</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 14 },
	title: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
	meta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
	legend: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 12,
		borderRadius: 12,
		borderWidth: 1,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	legendBox: {
		width: 20,
		height: 20,
		borderRadius: 6,
		borderWidth: 1,
	},
	legendText: {
		fontSize: 11,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	summary: {
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
		gap: 8,
	},
	summaryRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	summaryText: {
		fontSize: 15,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	summarySeats: {
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
	},
	footer: {
		marginTop: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 12,
	},
	totalContainer: {
		gap: 2,
	},
	totalLabel: {
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
	},
	total: {
		fontSize: 20,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	cta: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 24,
		borderRadius: 12,
		alignItems: 'center',
	},
	ctaText: {
		color: 'white',
		fontWeight: '700',
		fontSize: 16,
		fontFamily: 'Inter_700Bold',
	},
});


