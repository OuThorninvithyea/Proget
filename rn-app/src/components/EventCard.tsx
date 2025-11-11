import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
	image: string;
	title: string;
	subtitle: string;
	onPress: () => void;
	badges?: { label: string; color?: string }[];
};

export default function EventCard({ image, title, subtitle, onPress, badges }: Props): React.ReactElement {
	const { theme } = useTheme();
	return (
		<TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card, shadowOpacity: theme.shadowOpacity }]}>
			<View style={{ position: 'relative' }}>
				<Image source={{ uri: image }} style={styles.image} />
				{badges && badges.length > 0 && (
					<View style={styles.badgesRow}>
						{badges.map((b, i) => (
							<View key={`${b.label}-${i}`} style={[styles.badge, { backgroundColor: b.color ?? '#111827cc', borderColor: theme.border }]}>
								<Text style={styles.badgeText}>{b.label}</Text>
							</View>
						))}
					</View>
				)}
			</View>
			<View style={styles.meta}>
				<Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
					{title}
				</Text>
				<Text style={[styles.subtitle, { color: theme.muted }]} numberOfLines={1}>
					{subtitle}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		borderWidth: 1,
		borderRadius: 16,
		overflow: 'hidden',
		width: 280,
		marginRight: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowRadius: 16,
		elevation: 4,
	},
	image: { width: '100%', height: 160 },
	badgesRow: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', gap: 6 },
	badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
	badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
	meta: { padding: 12, gap: 4 },
	title: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
	subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});


