import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import PayButton from '../components/PayButton';
import { EVENTS } from '../data/events';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export default function CheckoutScreen({ route, navigation }: Props): JSX.Element {
	const { theme } = useTheme();
	const [email, setEmail] = useState('you@example.com');
	const event = EVENTS.find(e => e.id === route.params.eventId)!;

	const total = useMemo(() => {
		// Simplified; price based on row letter
		let sum = 0;
		for (const id of route.params.seatIds) {
			const row = id.charAt(0);
			const tier = row === 'A' || row === 'B' ? 'A' : row === 'C' || row === 'D' ? 'B' : 'C';
			const price = event.pricing.find(p => p.tier === (tier as 'A' | 'B' | 'C'))!.price;
			sum += price;
		}
		return sum;
	}, [route.params.seatIds, event]);

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card, shadowOpacity: theme.shadowOpacity }]}>
				<Text style={[styles.title, { color: theme.text }]}>{event.name}</Text>
				<Text style={[styles.meta, { color: theme.muted }]}>{event.date} • {event.venue}</Text>
				<Text style={[styles.line, { color: theme.text }]}>Seats: {route.params.seatIds.join(', ')}</Text>
				<Text style={[styles.total, { color: theme.text }]}>Total: ${total.toFixed(2)}</Text>

				<Text style={[styles.label, { color: theme.muted }]}>Email for tickets</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="your@email"
					placeholderTextColor={theme.muted}
					style={[styles.input, { borderColor: theme.border, color: theme.text }]}
					inputMode="email"
					autoCapitalize="none"
				/>
			</View>

			<PayButton
				onPress={() => {
					Alert.alert('Payment', 'Simulated payment complete', [
						{ text: 'OK', onPress: () => navigation.navigate('HomeTabs') },
					]);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 16 },
	card: {
		borderWidth: 1,
		borderRadius: 16,
		padding: 16,
		gap: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowRadius: 14,
		elevation: 3,
	},
	title: { fontSize: 18, fontWeight: '700' },
	meta: { fontSize: 12 },
	line: { marginTop: 4 },
	total: { marginTop: 8, fontSize: 16, fontWeight: '700' },
	label: { marginTop: 12, fontSize: 12 },
	input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
});


