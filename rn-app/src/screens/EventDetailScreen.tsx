import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { EVENTS } from '../data/events';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetail'>;

export default function EventDetailScreen({ route, navigation }: Props): JSX.Element {
	const { theme } = useTheme();
	const event = EVENTS.find(e => e.id === route.params.eventId)!;
	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
			<Image source={{ uri: event.image }} style={styles.hero} />
			<View style={[styles.body, { backgroundColor: theme.bg }]}>
				<Text style={[styles.title, { color: theme.text }]}>{event.name}</Text>
				<Text style={[styles.meta, { color: theme.muted }]}>{event.date} • {event.time} • {event.venue}</Text>
				<View style={[styles.pin, { borderColor: theme.border, backgroundColor: theme.card }]}>
					<Ionicons name="location-outline" size={14} color={theme.muted} />
					<Text style={{ color: theme.muted, fontSize: 12 }}>View venue on map</Text>
				</View>
				<Text style={[styles.desc, { color: theme.muted }]}>{event.description}</Text>

				<TouchableOpacity
					activeOpacity={0.9}
					style={[styles.cta, { backgroundColor: theme.accent }]}
					onPress={() => navigation.navigate('SeatSelection', { eventId: event.id })}
				>
					<Text style={styles.ctaText}>Select Tickets</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	hero: { width: '100%', height: 220 },
	body: { padding: 16, gap: 12 },
	title: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold' },
	meta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
	pin: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderWidth: 1, borderRadius: 12, alignSelf: 'flex-start' },
	desc: { fontSize: 14, lineHeight: 20 },
	cta: { marginTop: 8, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
	ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
});


