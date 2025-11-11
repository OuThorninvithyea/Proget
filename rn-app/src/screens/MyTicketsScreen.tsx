import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MY_TICKETS } from '../data/tickets';
import TicketItem from '../components/TicketItem';
import { useTheme } from '../theme/ThemeProvider';
import { EVENTS } from '../data/events';

export default function MyTicketsScreen(): React.ReactElement {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	return (
		<View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
			<FlatList
				data={MY_TICKETS}
				keyExtractor={(t) => t.id}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
				renderItem={({ item }) => {
					const ev = EVENTS.find(e => e.id === item.eventId)!;
					return (
						<TicketItem
							title={ev.name}
							subtitle={`${ev.date} • Seats ${item.seatIds.join(', ')}`}
							qrData={item.qrData}
						/>
					);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
});


