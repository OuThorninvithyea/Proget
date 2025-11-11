import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { MY_TICKETS } from '../data/tickets';

export default function AccountScreen(): React.ReactElement {
	const { theme, themeMode, setThemeMode, actualScheme } = useTheme();
	const insets = useSafeAreaInsets();
	const [showThemeModal, setShowThemeModal] = useState(false);
	const [user] = useState({
		name: 'Alex Johnson',
		email: 'alex.johnson@example.com',
		phone: '+1 (555) 123-4567',
		memberSince: '2023',
		avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
	});

	const stats = [
		{ label: 'Tickets', value: MY_TICKETS.length.toString(), icon: 'ticket-outline' },
		{ label: 'Events', value: MY_TICKETS.length.toString(), icon: 'calendar-outline' },
		{ label: 'Member', value: user.memberSince, icon: 'star-outline' },
	];

	const accountSections = [
		{
			title: 'Account',
			items: [
				{ label: 'Profile Information', icon: 'person-outline', onPress: () => Alert.alert('Profile', 'Edit your profile information') },
				{ label: 'Payment Methods', icon: 'card-outline', onPress: () => Alert.alert('Payment', 'Manage payment methods') },
				{ label: 'Order History', icon: 'receipt-outline', onPress: () => Alert.alert('Orders', 'View your order history') },
				{ label: 'Saved Addresses', icon: 'location-outline', onPress: () => Alert.alert('Addresses', 'Manage saved addresses') },
			],
		},
		{
			title: 'Preferences',
			items: [
				{ 
					label: 'Appearance', 
					icon: actualScheme === 'dark' ? 'moon-outline' : 'sunny-outline', 
					value: themeMode === 'system' ? `System (${actualScheme === 'dark' ? 'Dark' : 'Light'})` : themeMode.charAt(0).toUpperCase() + themeMode.slice(1),
					onPress: () => setShowThemeModal(true)
				},
				{ label: 'Notifications', icon: 'notifications-outline', onPress: () => Alert.alert('Notifications', 'Manage notification settings') },
				{ label: 'Language', icon: 'language-outline', value: 'English', onPress: () => Alert.alert('Language', 'Select your language') },
				{ label: 'Privacy', icon: 'shield-checkmark-outline', onPress: () => Alert.alert('Privacy', 'Privacy settings') },
			],
		},
		{
			title: 'Support',
			items: [
				{ label: 'Help Center', icon: 'help-circle-outline', onPress: () => Alert.alert('Help', 'Visit our help center') },
				{ label: 'Contact Support', icon: 'chatbubble-outline', onPress: () => Alert.alert('Support', 'Contact our support team') },
				{ label: 'Terms & Conditions', icon: 'document-text-outline', onPress: () => Alert.alert('Terms', 'View terms and conditions') },
				{ label: 'About', icon: 'information-circle-outline', onPress: () => Alert.alert('About', 'Concert Tickets App v1.0.0') },
			],
		},
	];

	return (
		<ScrollView style={{ flex: 1, backgroundColor: theme.bg }} contentContainerStyle={[styles.container, { paddingTop: insets.top }]}>
			{/* Profile Header */}
			<View style={[styles.profileHeader, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Image source={{ uri: user.avatar }} style={styles.avatar} />
				<View style={styles.profileInfo}>
					<Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
					<Text style={[styles.email, { color: theme.muted }]}>{user.email}</Text>
					<Text style={[styles.phone, { color: theme.muted }]}>{user.phone}</Text>
				</View>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => Alert.alert('Edit Profile', 'Edit your profile information')}
					style={[styles.editButton, { backgroundColor: theme.accent }]}
				>
					<Ionicons name="pencil" size={16} color="#ffffff" />
				</TouchableOpacity>
			</View>

			{/* Stats */}
			<View style={styles.statsContainer}>
				{stats.map((stat, index) => (
					<View
						key={index}
						style={[
							styles.statCard,
							{
								backgroundColor: theme.card,
								borderColor: theme.border,
							},
						]}
					>
						<View style={[styles.statIconCircle, { backgroundColor: theme.accent + '20' }]}>
							<Ionicons name={stat.icon as any} size={20} color={theme.accent} />
						</View>
						<Text style={[styles.statValue, { color: theme.text }]}>{stat.value}</Text>
						<Text style={[styles.statLabel, { color: theme.muted }]}>{stat.label}</Text>
					</View>
				))}
			</View>

			{/* Account Sections */}
			{accountSections.map((section, sectionIndex) => (
				<View key={sectionIndex} style={styles.section}>
					<Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
					<View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
						{section.items.map((item, itemIndex) => (
							<TouchableOpacity
								key={itemIndex}
								activeOpacity={0.7}
								onPress={item.onPress}
								style={[
									styles.listItem,
									itemIndex < section.items.length - 1 && styles.listItemBorder,
									{ borderColor: theme.border },
								]}
							>
								<View style={styles.listItemLeft}>
									<View style={[styles.iconCircle, { backgroundColor: theme.border }]}>
										<Ionicons name={item.icon as any} size={20} color={theme.text} />
									</View>
									<Text style={[styles.listItemLabel, { color: theme.text }]}>{item.label}</Text>
								</View>
								<View style={styles.listItemRight}>
									{item.value && (
										<Text style={[styles.listItemValue, { color: theme.muted }]}>{item.value}</Text>
									)}
									<Ionicons name="chevron-forward" size={18} color={theme.muted} />
								</View>
							</TouchableOpacity>
						))}
					</View>
				</View>
			))}

			{/* Logout Button */}
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => {
					Alert.alert(
						'Logout',
						'Are you sure you want to logout?',
						[
							{ text: 'Cancel', style: 'cancel' },
							{ text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged Out', 'You have been logged out') },
						]
					);
				}}
				style={[styles.logoutButton, { backgroundColor: theme.card, borderColor: '#ef4444' }]}
			>
				<Ionicons name="log-out-outline" size={20} color="#ef4444" />
				<Text style={[styles.logoutText, { color: '#ef4444' }]}>Logout</Text>
			</TouchableOpacity>

			<View style={{ height: 24 }} />

			{/* Theme Selection Modal */}
			<Modal
				visible={showThemeModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowThemeModal(false)}
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => setShowThemeModal(false)}
					style={styles.modalOverlay}
				>
					<TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
						<View style={[styles.modalContent, { backgroundColor: theme.bg, borderColor: theme.border }]}>
							<View style={styles.modalHeader}>
								<Text style={[styles.modalTitle, { color: theme.text }]}>Appearance</Text>
								<TouchableOpacity onPress={() => setShowThemeModal(false)}>
									<Ionicons name="close" size={24} color={theme.muted} />
								</TouchableOpacity>
							</View>

							<Text style={[styles.modalDescription, { color: theme.muted }]}>
								Choose how the app looks. System will sync with your phone's theme.
							</Text>

							<View style={styles.themeOptions}>
								{[
									{ mode: 'light' as const, label: 'Light', icon: 'sunny-outline', description: 'Always use light theme' },
									{ mode: 'dark' as const, label: 'Dark', icon: 'moon-outline', description: 'Always use dark theme' },
									{ mode: 'system' as const, label: 'System', icon: 'phone-portrait-outline', description: 'Sync with phone settings' },
								].map((option) => {
									const isActive = themeMode === option.mode;
									return (
										<TouchableOpacity
											key={option.mode}
											activeOpacity={0.7}
											onPress={() => {
												setThemeMode(option.mode);
												setTimeout(() => setShowThemeModal(false), 300);
											}}
											style={[
												styles.themeOption,
												{
													backgroundColor: theme.card,
													borderColor: isActive ? theme.accent : theme.border,
													borderWidth: isActive ? 2 : 1,
												},
											]}
										>
											<View style={styles.themeOptionLeft}>
												<View style={[styles.themeIconCircle, { backgroundColor: isActive ? theme.accent : theme.border }]}>
													<Ionicons name={option.icon} size={20} color={isActive ? '#ffffff' : theme.text} />
												</View>
												<View style={styles.themeOptionText}>
													<Text style={[styles.themeOptionLabel, { color: theme.text }]}>
														{option.label}
														{option.mode === 'system' && (
															<Text style={{ color: theme.muted, fontSize: 12 }}>
																{' '}({actualScheme === 'dark' ? 'Dark' : 'Light'})
															</Text>
														)}
													</Text>
													<Text style={[styles.themeOptionDescription, { color: theme.muted }]}>
														{option.description}
													</Text>
												</View>
											</View>
											{isActive && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
										</TouchableOpacity>
									);
								})}
							</View>
						</View>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		gap: 20,
	},
	profileHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 20,
		borderRadius: 20,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 12,
		shadowOpacity: 0.08,
		elevation: 3,
	},
	avatar: {
		width: 70,
		height: 70,
		borderRadius: 35,
		marginRight: 16,
	},
	profileInfo: {
		flex: 1,
		gap: 4,
	},
	name: {
		fontSize: 20,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	email: {
		fontSize: 13,
		fontFamily: 'Inter_400Regular',
	},
	phone: {
		fontSize: 13,
		fontFamily: 'Inter_400Regular',
	},
	editButton: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statsContainer: {
		flexDirection: 'row',
		gap: 12,
	},
	statCard: {
		flex: 1,
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		alignItems: 'center',
		gap: 8,
	},
	statIconCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	statValue: {
		fontSize: 20,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	statLabel: {
		fontSize: 12,
		fontFamily: 'Inter_400Regular',
	},
	section: {
		gap: 12,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
		paddingHorizontal: 4,
	},
	sectionCard: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: 'hidden',
	},
	listItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
	},
	listItemBorder: {
		borderBottomWidth: 1,
	},
	listItemLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	iconCircle: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
	listItemLabel: {
		fontSize: 15,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	listItemRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	listItemValue: {
		fontSize: 14,
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		padding: 16,
		borderRadius: 16,
		borderWidth: 2,
	},
	logoutText: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		borderWidth: 1,
		gap: 16,
	},
	modalHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	modalTitle: {
		fontSize: 22,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	modalDescription: {
		fontSize: 14,
		lineHeight: 20,
	},
	themeOptions: {
		gap: 12,
		marginTop: 8,
		marginBottom: 8,
	},
	themeOption: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderRadius: 14,
		padding: 16,
	},
	themeOptionLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	themeIconCircle: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
	},
	themeOptionText: {
		flex: 1,
		gap: 2,
	},
	themeOptionLabel: {
		fontSize: 16,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	themeOptionDescription: {
		fontSize: 12,
	},
});

