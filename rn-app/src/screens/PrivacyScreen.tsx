import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyScreen(): React.ReactElement {
	const { theme } = useTheme();
	
	const [settings, setSettings] = useState({
		dataCollection: true,
		analytics: true,
		personalization: true,
		locationTracking: false,
		shareWithPartners: false,
		marketingEmails: false,
		profileVisibility: true,
		purchaseHistory: false,
	});

	const toggleSetting = (key: keyof typeof settings) => {
		setSettings(prev => ({ ...prev, [key]: !prev[key] }));
	};

	const handleDeleteData = () => {
		Alert.alert(
			'Delete My Data',
			'Are you sure you want to delete all your personal data? This action cannot be undone.',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ 
					text: 'Delete', 
					style: 'destructive', 
					onPress: () => Alert.alert('Data Deleted', 'Your personal data has been deleted')
				}
			]
		);
	};

	const handleDownloadData = () => {
		Alert.alert(
			'Download My Data',
			'We will prepare your data and send a download link to your email within 24 hours.',
			[{ text: 'OK' }]
		);
	};

	const privacyGroups = [
		{
			title: 'Data Collection',
			items: [
				{ 
					key: 'dataCollection' as const, 
					label: 'Allow Data Collection', 
					icon: 'server', 
					desc: 'Help us improve by collecting usage data',
					required: false,
				},
				{ 
					key: 'analytics' as const, 
					label: 'Analytics', 
					icon: 'analytics', 
					desc: 'Anonymous analytics to improve app performance',
					required: false,
				},
				{ 
					key: 'personalization' as const, 
					label: 'Personalization', 
					icon: 'sparkles', 
					desc: 'Personalized recommendations based on your preferences',
					required: false,
				},
			],
		},
		{
			title: 'Location & Tracking',
			items: [
				{ 
					key: 'locationTracking' as const, 
					label: 'Location Services', 
					icon: 'location', 
					desc: 'Use your location to show nearby events',
					required: false,
				},
			],
		},
		{
			title: 'Sharing & Marketing',
			items: [
				{ 
					key: 'shareWithPartners' as const, 
					label: 'Share with Partners', 
					icon: 'people', 
					desc: 'Share data with event organizers and partners',
					required: false,
				},
				{ 
					key: 'marketingEmails' as const, 
					label: 'Marketing Communications', 
					icon: 'mail-open', 
					desc: 'Receive promotional emails and offers',
					required: false,
				},
			],
		},
		{
			title: 'Profile Visibility',
			items: [
				{ 
					key: 'profileVisibility' as const, 
					label: 'Public Profile', 
					icon: 'eye', 
					desc: 'Allow other users to see your profile',
					required: false,
				},
				{ 
					key: 'purchaseHistory' as const, 
					label: 'Show Purchase History', 
					icon: 'time', 
					desc: 'Display your purchase history on your profile',
					required: false,
				},
			],
		},
	];

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<ScrollView contentContainerStyle={styles.content}>
				{/* Header Info */}
				<View style={[styles.headerBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
					<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
						<Ionicons name="shield-checkmark" size={28} color={theme.accent} />
					</View>
					<Text style={[styles.headerTitle, { color: theme.text }]}>Your Privacy Matters</Text>
					<Text style={[styles.headerDesc, { color: theme.muted }]}>
						Control how your data is collected, used, and shared. You have complete control over your privacy settings.
					</Text>
				</View>

				{/* Privacy Settings */}
				{privacyGroups.map((group, groupIndex) => (
					<View key={groupIndex} style={styles.group}>
						<Text style={[styles.groupTitle, { color: theme.text }]}>{group.title}</Text>
						<View style={[styles.groupCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
							{group.items.map((item, itemIndex) => (
								<View
									key={item.key}
									style={[
										styles.settingItem,
										itemIndex < group.items.length - 1 && styles.settingItemBorder,
										{ borderBottomColor: theme.border },
									]}
								>
									<View style={styles.settingLeft}>
										<View style={[styles.iconCircleSmall, { backgroundColor: theme.accent + '20' }]}>
											<Ionicons name={item.icon as any} size={20} color={theme.accent} />
										</View>
										<View style={styles.settingInfo}>
											<Text style={[styles.settingLabel, { color: theme.text }]}>
												{item.label}
											</Text>
											<Text style={[styles.settingDesc, { color: theme.muted }]}>
												{item.desc}
											</Text>
										</View>
									</View>
									<Switch
										value={settings[item.key]}
										onValueChange={() => toggleSetting(item.key)}
										trackColor={{ false: theme.border, true: theme.accent }}
										thumbColor={settings[item.key] ? '#ffffff' : '#f4f3f4'}
									/>
								</View>
							))}
						</View>
					</View>
				))}

				{/* Data Management */}
				<View style={styles.group}>
					<Text style={[styles.groupTitle, { color: theme.text }]}>Data Management</Text>
					<View style={[styles.groupCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
						<TouchableOpacity
							activeOpacity={0.7}
							onPress={handleDownloadData}
							style={styles.actionItem}
						>
							<View style={styles.actionLeft}>
								<View style={[styles.iconCircleSmall, { backgroundColor: theme.accent + '20' }]}>
									<Ionicons name="download-outline" size={20} color={theme.accent} />
								</View>
								<View style={styles.actionInfo}>
									<Text style={[styles.actionLabel, { color: theme.text }]}>Download My Data</Text>
									<Text style={[styles.actionDesc, { color: theme.muted }]}>
										Get a copy of all your personal data
									</Text>
								</View>
							</View>
							<Ionicons name="chevron-forward" size={20} color={theme.muted} />
						</TouchableOpacity>

						<View style={[styles.divider, { backgroundColor: theme.border }]} />

						<TouchableOpacity
							activeOpacity={0.7}
							onPress={handleDeleteData}
							style={styles.actionItem}
						>
							<View style={styles.actionLeft}>
								<View style={[styles.iconCircleSmall, { backgroundColor: '#ef4444' + '20' }]}>
									<Ionicons name="trash-outline" size={20} color="#ef4444" />
								</View>
								<View style={styles.actionInfo}>
									<Text style={[styles.actionLabel, { color: '#ef4444' }]}>Delete My Data</Text>
									<Text style={[styles.actionDesc, { color: theme.muted }]}>
										Permanently delete all your personal data
									</Text>
								</View>
							</View>
							<Ionicons name="chevron-forward" size={20} color={theme.muted} />
						</TouchableOpacity>
					</View>
				</View>

				{/* Legal Links */}
				<View style={[styles.legalBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Text style={[styles.legalTitle, { color: theme.text }]}>Legal Documents</Text>
					<TouchableOpacity 
						style={styles.legalLink}
						onPress={() => Alert.alert('Privacy Policy', 'View at proget.com/privacy')}
					>
						<Text style={[styles.legalLinkText, { color: theme.accent }]}>Privacy Policy</Text>
						<Ionicons name="open-outline" size={16} color={theme.accent} />
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.legalLink}
						onPress={() => Alert.alert('Terms of Service', 'View at proget.com/terms')}
					>
						<Text style={[styles.legalLinkText, { color: theme.accent }]}>Terms of Service</Text>
						<Ionicons name="open-outline" size={16} color={theme.accent} />
					</TouchableOpacity>
					<TouchableOpacity 
						style={styles.legalLink}
						onPress={() => Alert.alert('Cookie Policy', 'View at proget.com/cookies')}
					>
						<Text style={[styles.legalLinkText, { color: theme.accent }]}>Cookie Policy</Text>
						<Ionicons name="open-outline" size={16} color={theme.accent} />
					</TouchableOpacity>
				</View>

				{/* Footer Note */}
				<View style={[styles.footerNote, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Ionicons name="information-circle-outline" size={18} color={theme.muted} />
					<Text style={[styles.footerText, { color: theme.muted }]}>
						These settings help you control your privacy. Some features may not work properly if certain permissions are disabled.
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
		gap: 20,
		paddingBottom: 32,
	},
	headerBox: {
		padding: 20,
		borderRadius: 16,
		borderWidth: 2,
		alignItems: 'center',
		gap: 12,
	},
	iconCircle: {
		width: 64,
		height: 64,
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'center',
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		textAlign: 'center',
	},
	headerDesc: {
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
	},
	group: {
		gap: 12,
	},
	groupTitle: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		paddingHorizontal: 4,
	},
	groupCard: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: 'hidden',
	},
	settingItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	settingItemBorder: {
		borderBottomWidth: 1,
	},
	settingLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
		marginRight: 12,
	},
	iconCircleSmall: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	settingInfo: {
		flex: 1,
		gap: 2,
	},
	settingLabel: {
		fontSize: 15,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	settingDesc: {
		fontSize: 12,
		lineHeight: 16,
	},
	actionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	actionLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	actionInfo: {
		flex: 1,
		gap: 2,
	},
	actionLabel: {
		fontSize: 15,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	actionDesc: {
		fontSize: 12,
		lineHeight: 16,
	},
	divider: {
		height: 1,
	},
	legalBox: {
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
	},
	legalTitle: {
		fontSize: 15,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		marginBottom: 4,
	},
	legalLink: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingVertical: 4,
	},
	legalLinkText: {
		fontSize: 14,
		fontWeight: '600',
	},
	footerNote: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: 10,
		padding: 14,
		borderRadius: 12,
		borderWidth: 1,
	},
	footerText: {
		flex: 1,
		fontSize: 12,
		lineHeight: 16,
	},
});

