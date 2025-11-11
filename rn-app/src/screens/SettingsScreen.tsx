import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export default function SettingsScreen(): React.ReactElement {
	const { theme, colorScheme, setScheme } = useTheme();
	const insets = useSafeAreaInsets();
	const isDark = colorScheme === 'dark';
	return (
		<View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
			<View style={[styles.row, { borderColor: theme.border }]}>
				<Text style={[styles.label, { color: theme.text }]}>Dark mode</Text>
				<Switch
					value={isDark}
					onValueChange={(v) => setScheme(v ? 'dark' : 'light')}
					thumbColor={isDark ? '#ffffff' : '#111827'}
					trackColor={{ false: '#d1d5db', true: theme.accent }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 14, padding: 14 },
	label: { fontSize: 16, fontWeight: '600' },
});


