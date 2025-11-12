import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function LanguageScreen(): React.ReactElement {
	const { theme } = useTheme();
	const { language, setLanguage } = useLanguage();

	const languages: Array<{ code: Language; label: string; nativeName: string; flag: string }> = [
		{ code: 'en', label: 'English', nativeName: 'English', flag: '🇺🇸' },
		{ code: 'km', label: 'Khmer', nativeName: 'ភាសាខ្មែរ', flag: '🇰🇭' },
	];

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<ScrollView contentContainerStyle={styles.content}>
				{/* Info */}
				<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Ionicons name="information-circle" size={20} color={theme.accent} />
					<Text style={[styles.infoText, { color: theme.muted }]}>
						Select your preferred language. The app will restart to apply changes.
					</Text>
				</View>

				{/* Language Options */}
				<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
					{languages.map((lang, index) => (
						<TouchableOpacity
							key={lang.code}
							activeOpacity={0.7}
							onPress={() => setLanguage(lang.code)}
							style={[
								styles.languageItem,
								index < languages.length - 1 && styles.languageItemBorder,
								{ borderBottomColor: theme.border },
								language === lang.code && { backgroundColor: theme.accent + '10' },
							]}
						>
							<View style={styles.languageLeft}>
								<Text style={styles.flag}>{lang.flag}</Text>
								<View style={styles.languageInfo}>
									<Text style={[styles.languageLabel, { color: theme.text }]}>
										{lang.label}
									</Text>
									<Text style={[styles.languageNative, { color: theme.muted }]}>
										{lang.nativeName}
									</Text>
								</View>
							</View>
							{language === lang.code && (
								<Ionicons name="checkmark-circle" size={24} color={theme.accent} />
							)}
						</TouchableOpacity>
					))}
				</View>

				{/* Current Language Display */}
				<View style={[styles.currentBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
					<View style={styles.currentHeader}>
						<Ionicons name="globe-outline" size={20} color={theme.accent} />
						<Text style={[styles.currentTitle, { color: theme.text }]}>Current Language</Text>
					</View>
					<Text style={[styles.currentValue, { color: theme.accent }]}>
						{languages.find(l => l.code === language)?.nativeName}
					</Text>
				</View>

				{/* Additional Info */}
				<View style={[styles.helpBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Text style={[styles.helpTitle, { color: theme.text }]}>About Language Settings</Text>
					<Text style={[styles.helpText, { color: theme.muted }]}>
						• The app interface will be translated to your selected language
					</Text>
					<Text style={[styles.helpText, { color: theme.muted }]}>
						• Event names and descriptions may remain in their original language
					</Text>
					<Text style={[styles.helpText, { color: theme.muted }]}>
						• You can change this anytime from Settings
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 16,
	},
	infoBox: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 12,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	infoText: {
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
	card: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: 'hidden',
	},
	languageItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	languageItemBorder: {
		borderBottomWidth: 1,
	},
	languageLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
		flex: 1,
	},
	flag: {
		fontSize: 36,
	},
	languageInfo: {
		flex: 1,
		gap: 2,
	},
	languageLabel: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	languageNative: {
		fontSize: 14,
		lineHeight: 18,
	},
	currentBox: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		gap: 8,
	},
	currentHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	currentTitle: {
		fontSize: 14,
		fontWeight: '600',
	},
	currentValue: {
		fontSize: 18,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	helpBox: {
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 12,
	},
	helpTitle: {
		fontSize: 15,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		marginBottom: 4,
	},
	helpText: {
		fontSize: 13,
		lineHeight: 20,
	},
});

