import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

type Props = { onPress: () => void; label?: string };

export default function PayButton({ onPress, label = 'Apple Pay / Google Pay' }: Props): JSX.Element {
	const { theme } = useTheme();
	return (
		<TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.button, { backgroundColor: theme.text }]}>
			<View style={styles.row}>
				<Text style={[styles.text, { color: theme.bg }]}>{label}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		paddingVertical: 14,
		borderRadius: 14,
		alignItems: 'center',
		justifyContent: 'center',
	},
	row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
	text: { fontWeight: '700', fontSize: 16 },
});


