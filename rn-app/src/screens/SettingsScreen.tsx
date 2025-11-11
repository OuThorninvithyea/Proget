import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen(): React.ReactElement {
	const { theme, themeMode, setThemeMode, actualScheme } = useTheme();
	const insets = useSafeAreaInsets();

	const options: Array<{ mode: 'light' | 'dark' | 'system'; label: string; icon: any; description: string }> = [
		{ mode: 'light', label: 'Light', icon: 'sunny-outline', description: 'Always use light theme' },
		{ mode: 'dark', label: 'Dark', icon: 'moon-outline', description: 'Always use dark theme' },
		{ mode: 'system', label: 'System', icon: 'phone-portrait-outline', description: 'Sync with phone settings' },
	];

	return (
		<View style={[styles.container, { backgroundColor: theme.bg, paddingTop: insets.top }]}>
			<Text style={[styles.header, { color: theme.text }]}>Appearance</Text>
			<Text style={[styles.subheader, { color: theme.muted }]}>
				Choose how the app looks. System will sync with your phone's theme.
			</Text>
			
			<View style={styles.optionsContainer}>
				{options.map((option) => {
					const isActive = themeMode === option.mode;
					const showingDark = option.mode === 'system' ? actualScheme === 'dark' : option.mode === 'dark';
					
					return (
						<TouchableOpacity
							key={option.mode}
							activeOpacity={0.7}
							onPress={() => setThemeMode(option.mode)}
							style={[
								styles.option,
								{
									backgroundColor: theme.card,
									borderColor: isActive ? theme.accent : theme.border,
									borderWidth: isActive ? 2 : 1,
								},
							]}
						>
							<View style={styles.optionLeft}>
								<View style={[styles.iconCircle, { backgroundColor: isActive ? theme.accent : theme.border }]}>
									<Ionicons 
										name={option.icon} 
										size={20} 
										color={isActive ? '#ffffff' : theme.text} 
									/>
								</View>
								<View style={styles.optionText}>
									<Text style={[styles.optionLabel, { color: theme.text }]}>
										{option.label}
										{option.mode === 'system' && (
											<Text style={{ color: theme.muted, fontSize: 12 }}>
												{' '}({actualScheme === 'dark' ? 'Dark' : 'Light'})
											</Text>
										)}
									</Text>
									<Text style={[styles.optionDescription, { color: theme.muted }]}>
										{option.description}
									</Text>
								</View>
							</View>
							{isActive && (
								<Ionicons name="checkmark-circle" size={24} color={theme.accent} />
							)}
						</TouchableOpacity>
					);
				})}
			</View>

			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Ionicons name="information-circle-outline" size={20} color={theme.accent} />
				<Text style={[styles.infoText, { color: theme.muted }]}>
					Current theme: <Text style={{ color: theme.text, fontWeight: '600' }}>
						{actualScheme === 'dark' ? 'Dark' : 'Light'}
					</Text>
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16, gap: 8 },
	header: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold', marginTop: 8 },
	subheader: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
	optionsContainer: { gap: 12, marginTop: 8 },
	option: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 14,
		padding: 16,
	},
	optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
	iconCircle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
	},
	optionText: { flex: 1, gap: 2 },
	optionLabel: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
	optionDescription: { fontSize: 12 },
	infoBox: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
		marginTop: 16,
	},
	infoText: { fontSize: 13, flex: 1 },
});


