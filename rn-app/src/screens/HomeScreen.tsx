import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { EVENTS } from '../data/events';
import Carousel from '../components/Carousel';
import EventCard from '../components/EventCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getItem, setItem } from '../utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeTabs'>;

export default function HomeScreen({ navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [query, setQuery] = useState('');
	const [tab, setTab] = useState<'all' | 'live' | 'nearby' | 'free'>('all');
	const [loading, setLoading] = useState(true);
	const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		setTimeout(() => setRefreshing(false), 750);
	}, []);
	const insets = useSafeAreaInsets();

	const filteredEvents = useMemo(() => {
		const q = query.trim().toLowerCase();
		let list = EVENTS;
		if (tab === 'live') list = EVENTS.filter(e => e.isLive);
		if (tab === 'nearby') list = [...EVENTS].sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)).slice(0, 5);
		if (tab === 'free') list = EVENTS.filter(e => e.isFree);
		if (!q) return list;
		return list.filter(e =>
			e.name.toLowerCase().includes(q) ||
			e.venue.toLowerCase().includes(q) ||
			e.date.toLowerCase().includes(q)
		);
	}, [query, tab]);

	// Load persisted state
	useEffect(() => {
		let mounted = true;
		(async () => {
			const [q, t] = await Promise.all([getItem('home:query'), getItem('home:tab')]);
			if (!mounted) return;
			if (q) setQuery(q);
			if (t === 'all' || t === 'live' || t === 'nearby' || t === 'free') setTab(t);
			// Simulate initial load
			setTimeout(() => mounted && setLoading(false), 400);
		})();
		return () => {
			mounted = false;
			if (saveTimer.current) clearTimeout(saveTimer.current);
		};
	}, []);

	// Persist state (debounced)
	useEffect(() => {
		if (saveTimer.current) clearTimeout(saveTimer.current);
		saveTimer.current = setTimeout(() => {
			setItem('home:query', query);
			setItem('home:tab', tab);
		}, 250);
	}, [query, tab]);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.bg }}
			refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			contentContainerStyle={[styles.container, { paddingTop: insets.top + 8 }]}
		>
			<View style={[styles.searchWrap, { paddingHorizontal: 16 }]}>
				<TextInput
					value={query}
					onChangeText={setQuery}
					placeholder="Search live concerts or tickets"
					placeholderTextColor={theme.muted}
					style={[
						styles.searchInput,
						{ backgroundColor: theme.card, color: theme.text, borderColor: theme.border }
					]}
					returnKeyType="search"
					clearButtonMode="while-editing"
				/>
				<View style={styles.searchIcon}>
					<Ionicons name="search" size={18} color={theme.muted} />
				</View>
			</View>
			{/* Tabs / Chips */}
			<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.chipsRowContent, { paddingHorizontal: 16 }]}>
				{(['all','live','nearby','free'] as const).map(k => {
					const active = tab === k;
					return (
						<TouchableOpacity
							key={k}
							onPress={() => setTab(k)}
							activeOpacity={0.8}
							style={[
								styles.chip,
								{
									backgroundColor: active ? theme.accent : 'transparent',
									borderColor: active ? theme.accent : theme.border
								}
							]}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
								{ k === 'all' && <Ionicons name="grid-outline" size={14} color={active ? '#ffffff' : theme.text} /> }
								{ k === 'live' && <Ionicons name="flash-outline" size={14} color={active ? '#ffffff' : theme.text} /> }
								{ k === 'nearby' && <Ionicons name="navigate-outline" size={14} color={active ? '#ffffff' : theme.text} /> }
								{ k === 'free' && <Ionicons name="pricetag-outline" size={14} color={active ? '#ffffff' : theme.text} /> }
								<Text style={{ color: active ? '#ffffff' : theme.text, fontWeight: '600', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
									{k.toUpperCase()}
								</Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</ScrollView>

			{/* Banner */}
			<View style={[styles.banner, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={{ color: theme.text, fontWeight: '700' }}>Live Ticket Concerts</Text>
				<Text style={{ color: theme.muted, fontSize: 12 }}>Find shows near you and book in seconds.</Text>
			</View>

			<Text style={[styles.header, { color: theme.text }]}>
				Upcoming concerts {tab !== 'all' ? `• ${tab}` : ''}
			</Text>
			{(loading || refreshing) ? (
				<Carousel>
					{Array.from({ length: 3 }).map((_, i) => (
						<View key={`sk-${i}`} style={[styles.skelCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
							<View style={[styles.skelImage, { backgroundColor: theme.border }]} />
							<View style={styles.skelMeta}>
								<View style={[styles.skelLine, { width: '70%', backgroundColor: theme.border }]} />
								<View style={[styles.skelLine, { width: '40%', backgroundColor: theme.border }]} />
							</View>
						</View>
					))}
				</Carousel>
			) : filteredEvents.length > 0 ? (
				<Carousel>
					{filteredEvents.map(e => (
						<EventCard
							key={e.id}
							image={e.image}
							title={e.name}
							subtitle={`${e.date} • ${e.venue}`}
							badges={[
								e.isLive ? { label: 'LIVE', color: '#16a34a' } : undefined,
								e.isFree ? { label: 'FREE', color: '#2563eb' } : undefined,
								(() => {
									if (!e.pricing?.length) return undefined;
									const prices = e.pricing.map(p => p.price).sort((a,b)=>a-b);
									const min = prices[0], max = prices[prices.length-1];
									return { label: min === max ? `$${min}` : `$${min}-$${max}`, color: '#0f172acc' };
								})(),
								typeof e.distanceKm === 'number' ? { label: `${e.distanceKm} km` } : undefined,
							].filter(Boolean) as {label:string;color?:string}[]}
							onPress={() => navigation.navigate('EventDetail', { eventId: e.id })}
						/>
					))}
				</Carousel>
			) : (
				<View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
					<Text style={{ color: theme.muted }}>No concerts match your search.</Text>
				</View>
			)}

			{/* Recommended section */}
			<Text style={[styles.subheader, { color: theme.text }]}>Recommended for you</Text>
			<View style={styles.recoGrid}>
				{EVENTS.slice(0, 2).map(e => (
					<View key={`reco-${e.id}`} style={[styles.recoCard, { borderColor: theme.border, backgroundColor: theme.card }]}>
						<EventCard
							image={e.image}
							title={e.name}
							subtitle={`${e.date} • ${e.venue}`}
							onPress={() => navigation.navigate('EventDetail', { eventId: e.id })}
						/>
					</View>
				))}
			</View>

			{/* Trending */}
			<Text style={[styles.subheader, { color: theme.text }]}>Trending</Text>
			<View style={{ paddingHorizontal: 16, paddingTop: 8, gap: 10 }}>
				{[...EVENTS].sort((a,b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)).slice(0, 3).map(e => (
					<TouchableOpacity
						key={`tr-${e.id}`}
						activeOpacity={0.85}
						onPress={() => navigation.navigate('EventDetail', { eventId: e.id })}
						style={[styles.trItem, { borderColor: theme.border, backgroundColor: theme.card }]}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
							<Ionicons name="musical-notes-outline" size={18} color={theme.text} />
							<View style={{ flex: 1 }}>
								<Text style={{ color: theme.text, fontWeight: '600' }}>{e.name}</Text>
								<Text style={{ color: theme.muted, fontSize: 12 }}>{e.date} • {e.venue}</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
							<Ionicons name="navigate-outline" size={14} color={theme.muted} />
							<Text style={{ color: theme.muted, fontSize: 12 }}>{e.distanceKm ?? '—'} km</Text>
						</View>
					</TouchableOpacity>
				))}
			</View>

			{/* Nearby */}
			<Text style={[styles.subheader, { color: theme.text }]}>Nearby</Text>
			{(loading || refreshing) ? (
				<Carousel>
					{Array.from({ length: 3 }).map((_, i) => (
						<View key={`sk2-${i}`} style={[styles.skelCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
							<View style={[styles.skelImage, { backgroundColor: theme.border }]} />
							<View style={styles.skelMeta}>
								<View style={[styles.skelLine, { width: '60%', backgroundColor: theme.border }]} />
								<View style={[styles.skelLine, { width: '35%', backgroundColor: theme.border }]} />
							</View>
						</View>
					))}
				</Carousel>
			) : (
				<Carousel>
					{[...EVENTS].sort((a,b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)).slice(0, 5).map(e => (
						<EventCard
							key={`near-${e.id}`}
							image={e.image}
							title={e.name}
							subtitle={`${e.date} • ${e.venue}`}
							badges={[
								typeof e.distanceKm === 'number' ? { label: `${e.distanceKm} km` } : undefined,
								e.isLive ? { label: 'LIVE', color: '#16a34a' } : undefined,
								(() => {
									if (!e.pricing?.length) return undefined;
									const prices = e.pricing.map(p => p.price).sort((a,b)=>a-b);
									const min = prices[0], max = prices[prices.length-1];
									return { label: min === max ? `$${min}` : `$${min}-$${max}`, color: '#0f172acc' };
								})(),
							].filter(Boolean) as {label:string;color?:string}[]}
							onPress={() => navigation.navigate('EventDetail', { eventId: e.id })}
						/>
					))}
				</Carousel>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { paddingTop: 8, paddingBottom: 24, gap: 16 },
	searchWrap: { paddingTop: 4, position: 'relative' },
	searchInput: {
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
		paddingRight: 36,
		fontSize: 15,
	},
	searchIcon: { position: 'absolute', right: 26, top: 14 },
	chipsRow: { flexDirection: 'row', gap: 8, paddingTop: 8 },
	chipsRowContent: { flexDirection: 'row', gap: 8, paddingTop: 8 },
	chip: { borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
	header: { fontSize: 22, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8, fontFamily: 'Inter_700Bold' },
	subheader: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, paddingTop: 8, fontFamily: 'Inter_700Bold' },
	banner: { marginHorizontal: 16, marginTop: 6, borderRadius: 12, borderWidth: 1, padding: 12, gap: 2 },
	recoGrid: { paddingHorizontal: 16, paddingTop: 8, gap: 12 },
	recoCard: { borderWidth: 1, borderRadius: 16, overflow: 'hidden' },
	trItem: { borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
	skelCard: { width: 280, borderWidth: 1, borderRadius: 16, marginRight: 16, overflow: 'hidden' },
	skelImage: { width: '100%', height: 160, opacity: 0.6 },
	skelMeta: { padding: 12, gap: 8 },
	skelLine: { height: 10, borderRadius: 6, opacity: 0.6 },
});


