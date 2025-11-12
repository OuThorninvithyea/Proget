import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

const PAYMENT_METHODS = [
	{
		id: 'pm1',
		type: 'card',
		brand: 'Visa',
		last4: '4242',
		expiry: '12/25',
		isDefault: true,
	},
	{
		id: 'pm2',
		type: 'card',
		brand: 'Mastercard',
		last4: '5555',
		expiry: '08/26',
		isDefault: false,
	},
];

export default function PaymentMethodsScreen(): React.ReactElement {
	const { theme } = useTheme();

	const getCardIcon = (brand: string) => {
		return brand === 'Visa' ? 'card' : 'card-outline';
	};

	const handleAddPayment = () => {
		Alert.alert('Add Payment Method', 'Payment form would open here');
	};

	const handleRemove = (id: string) => {
		Alert.alert(
			'Remove Payment Method',
			'Are you sure you want to remove this payment method?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{ text: 'Remove', style: 'destructive', onPress: () => Alert.alert('Removed', 'Payment method removed') }
			]
		);
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			<ScrollView contentContainerStyle={styles.content}>
				{PAYMENT_METHODS.map(method => (
					<View key={method.id} style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
						<View style={styles.cardHeader}>
							<View style={styles.cardInfo}>
								<View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
									<Ionicons name={getCardIcon(method.brand) as any} size={24} color={theme.accent} />
								</View>
								<View>
									<Text style={[styles.cardBrand, { color: theme.text }]}>{method.brand}</Text>
									<Text style={[styles.cardNumber, { color: theme.muted }]}>•••• {method.last4}</Text>
								</View>
							</View>
							{method.isDefault && (
								<View style={[styles.defaultBadge, { backgroundColor: theme.accent }]}>
									<Text style={styles.defaultText}>Default</Text>
								</View>
							)}
						</View>

						<View style={styles.cardFooter}>
							<Text style={[styles.expiry, { color: theme.muted }]}>Expires {method.expiry}</Text>
							<TouchableOpacity
								activeOpacity={0.7}
								onPress={() => handleRemove(method.id)}
								style={styles.removeButton}
							>
								<Text style={[styles.removeText, { color: '#ef4444' }]}>Remove</Text>
							</TouchableOpacity>
						</View>
					</View>
				))}

				{/* Add New */}
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={handleAddPayment}
					style={[styles.addButton, { backgroundColor: theme.card, borderColor: theme.border }]}
				>
					<Ionicons name="add-circle-outline" size={24} color={theme.accent} />
					<Text style={[styles.addText, { color: theme.accent }]}>Add Payment Method</Text>
				</TouchableOpacity>

				{/* Info */}
				<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Ionicons name="shield-checkmark" size={20} color={theme.accent} />
					<Text style={[styles.infoText, { color: theme.muted }]}>
						Your payment information is encrypted and stored securely. We never share your data.
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
	card: {
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	cardInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	iconCircle: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	cardBrand: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	cardNumber: {
		fontSize: 13,
		marginTop: 2,
	},
	defaultBadge: {
		paddingVertical: 4,
		paddingHorizontal: 10,
		borderRadius: 12,
	},
	defaultText: {
		color: '#ffffff',
		fontSize: 11,
		fontWeight: '700',
	},
	cardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.05)',
	},
	expiry: {
		fontSize: 13,
	},
	removeButton: {
		paddingVertical: 4,
		paddingHorizontal: 8,
	},
	removeText: {
		fontSize: 13,
		fontWeight: '600',
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		padding: 20,
		borderRadius: 16,
		borderWidth: 2,
		borderStyle: 'dashed',
	},
	addText: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
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

