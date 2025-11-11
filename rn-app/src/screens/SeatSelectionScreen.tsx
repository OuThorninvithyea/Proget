import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import SeatGrid, { Seat } from '../components/SeatGrid';
import { EVENTS } from '../data/events';

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

			<View style={[styles.footer]}>
				<Text style={[styles.total, { color: theme.text }]}>Total: ${total.toFixed(2)}</Text>
				<TouchableOpacity
					activeOpacity={0.9}
					disabled={selected.size === 0}
					onPress={() => navigation.navigate('Checkout', { eventId: event.id, seatIds: Array.from(selected) })}
					style={[styles.cta, { backgroundColor: selected.size ? theme.accent : '#c7c7c7' }]}
				>
					<Text style={styles.ctaText}>Continue</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 14 },
	title: { fontSize: 18, fontWeight: '700' },
	meta: { fontSize: 12 },
	footer: { marginTop: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
	total: { fontSize: 16, fontWeight: '700' },
	cta: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 },
	ctaText: { color: 'white', fontWeight: '700' },
});


