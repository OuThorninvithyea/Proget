import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type SeatState = 'available' | 'taken' | 'selected';

export type Seat = {
	id: string; // e.g. A1
	state: SeatState;
	price: number;
};

type Props = {
	seats: Seat[]; // linear list containing A1..A10, B1.. etc
	selected: Set<string>;
	onToggle: (seatId: string) => void;
};

export default function SeatGrid({ seats, selected, onToggle }: Props): JSX.Element {
	const { theme } = useTheme();
	const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
	const cols = Array.from({ length: 10 }, (_, i) => String(i + 1));
	const seatMap = new Map(seats.map(s => [s.id, s]));

	return (
		<View style={[styles.wrapper, { borderColor: theme.border }]}>
			{rows.map(row => (
				<View key={row} style={styles.row}>
					<Text style={[styles.rowLabel, { color: theme.muted }]}>{row}</Text>
					{cols.map(col => {
						const id = `${row}${col}`;
						const seat = seatMap.get(id);
						const isSelected = selected.has(id);
						const state: SeatState = isSelected ? 'selected' : seat?.state ?? 'available';
						const style =
							state === 'taken'
								? { backgroundColor: '#e5e7eb', borderColor: '#d1d5db' }
								: state === 'selected'
								? { backgroundColor: theme.accent, borderColor: theme.accent }
								: { backgroundColor: theme.card, borderColor: theme.border };
						return (
							<TouchableOpacity
								key={id}
								activeOpacity={0.8}
								disabled={state === 'taken'}
								onPress={() => onToggle(id)}
								style={[styles.seat, style]}
							>
								<Text style={[styles.seatText, { color: state === 'selected' ? 'white' : theme.text }]}>{col}</Text>
							</TouchableOpacity>
						);
					})}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		borderWidth: 1,
		borderRadius: 16,
		padding: 12,
		gap: 10,
	},
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	rowLabel: { width: 18, textAlign: 'center', fontSize: 12 },
	seat: {
		width: 28,
		height: 28,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	seatText: { fontSize: 10, fontWeight: '600' },
});


