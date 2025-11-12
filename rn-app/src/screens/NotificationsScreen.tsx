import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen(): React.ReactElement {
	const { theme } = useTheme();
	
	const [settings, setSettings] = useState({
		pushNotifications: true,
		emailNotifications: true,
		smsNotifications: false,
		eventReminders: true,
		ticketUpdates: true,
		marketplaceOffers: true,
		promotions: false,
		newsUpdates: false,
	});

	const toggleSetting = (key: keyof typeof settings) => {
		setSettings(prev => ({ ...prev, [key]: !prev[key] }));
	};

	const notificationGroups = [
		{
			title: 'Channels',
			items: [
				{ key: 'pushNotifications' as const, label: 'Push Notifications', icon: 'notifications', desc: 'Receive notifications on your device' },
				{ key: 'emailNotifications' as const, label: 'Email Notifications', icon: 'mail', desc: 'Receive updates via email' },
				{ key: 'smsNotifications' as const, label: 'SMS Notifications', icon: 'chatbubble', desc: 'Receive text messages for important updates' },
			],
		},
		{
			title: 'Events & Tickets',
			items: [
				{ key: 'eventReminders' as const, label: 'Event Reminders', icon: 'alarm', desc: 'Reminders before your events' },
				{ key: 'ticketUpdates' as const, label: 'Ticket Updates', icon: 'ticket', desc: 'Changes to your tickets' },
			],
		},
		{
			title: 'Marketplace',
			items: [
				{ key: 'marketplaceOffers' as const, label: 'Trade Offers', icon: 'swap-horizontal', desc: 'When someone wants to trade with you' },
			],
		},
		{
			title: 'Marketing',
			items: [
				{ key: 'promotions' as const, label: 'Promotions & Deals', icon: 'pricetag', desc: 'Special offers and discounts' },
				{ key: 'newsUpdates' as const, label: 'News & Updates', icon: 'newspaper', desc: 'Platform updates and new features' },
			],
		},
	];

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<ScrollView contentContainerStyle={styles.content}>
				{notificationGroups.map((group, groupIndex) => (
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
										<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
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

				{/* Info */}
				<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
					<Ionicons name="information-circle" size={20} color={theme.accent} />
					<Text style={[styles.infoText, { color: theme.muted }]}>
						You can change these settings anytime. Important security alerts will always be sent.
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
		gap: 24,
		paddingBottom: 32,
	},
	group: {
		gap: 12,
	},
	groupTitle: {
		fontSize: 18,
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
	iconCircle: {
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
});

