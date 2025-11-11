import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../theme/ThemeProvider';

type Props = {
	title: string;
	subtitle: string;
	qrData: string;
};

export default function TicketItem({ title, subtitle, qrData }: Props): JSX.Element {
	const { theme } = useTheme();
	return (
		<View style={[styles.card, { borderColor: theme.border, backgroundColor: theme.card, shadowOpacity: theme.shadowOpacity }]}>
			<View style={styles.meta}>
				<Text style={[styles.title, { color: theme.text }]}>{title}</Text>
				<Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
			</View>
			<QRCode value={qrData} size={88} backgroundColor="transparent" color={theme.isDark ? '#f3f4f6' : '#111827'} />
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderWidth: 1,
		borderRadius: 16,
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 6 },
		shadowRadius: 14,
		elevation: 3,
	},
	meta: { gap: 6, flex: 1, marginRight: 12 },
	title: { fontSize: 16, fontWeight: '700' },
	subtitle: { fontSize: 12 },
});


