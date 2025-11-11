import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { MY_TICKETS } from '../data/tickets';
import { EVENTS } from '../data/events';

type Props = NativeStackScreenProps<RootStackParamList, 'TransferTicket'>;

export default function TransferTicketScreen({ route, navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	const ticket = MY_TICKETS.find(t => t.id === route.params.ticketId);
	const event = ticket ? EVENTS.find(e => e.id === ticket.eventId) : undefined;
	
	const [recipientEmail, setRecipientEmail] = useState('');
	const [recipientPhone, setRecipientPhone] = useState('');
	const [transferPrice, setTransferPrice] = useState('');
	const [transferMethod, setTransferMethod] = useState<'gift' | 'sell'>('gift');
	const [paymentMethod, setPaymentMethod] = useState<'escrow' | 'direct'>('escrow');
	const [verificationCode, setVerificationCode] = useState('');
	const [step, setStep] = useState<'details' | 'payment' | 'verify' | 'complete'>('details');

	if (!ticket || !event) {
		return (
			<View style={[styles.container, { backgroundColor: theme.bg }]}>
				<Text style={[styles.error, { color: theme.text }]}>Ticket not found</Text>
			</View>
		);
	}

	const handleInitiateTransfer = () => {
		if (!recipientEmail || !recipientPhone) {
			Alert.alert('Missing Information', 'Please enter recipient email and phone number');
			return;
		}

		if (transferMethod === 'sell' && (!transferPrice || parseFloat(transferPrice) <= 0)) {
			Alert.alert('Invalid Price', 'Please enter a valid transfer price');
			return;
		}

		if (transferMethod === 'sell') {
			setStep('payment');
		} else {
			setStep('verify');
		}
	};

	const handlePaymentSetup = () => {
		// Simulate payment escrow setup
		Alert.alert(
			'Payment Escrow',
			`${paymentMethod === 'escrow' ? 'Escrow' : 'Direct'} payment of $${transferPrice} will be held securely until transfer is verified by both parties.`,
			[{ text: 'Confirm', onPress: () => setStep('verify') }]
		);
	};

	const handleVerifyTransfer = () => {
		if (!verificationCode || verificationCode.length !== 6) {
			Alert.alert('Invalid Code', 'Please enter the 6-digit verification code');
			return;
		}

		// Simulate verification
		setStep('complete');
	};

	const renderDetailsStep = () => (
		<ScrollView contentContainerStyle={styles.stepContainer}>
			{/* Ticket Info */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Ticket Details</Text>
				<View style={styles.ticketInfo}>
					<Text style={[styles.eventName, { color: theme.text }]}>{event.name}</Text>
					<Text style={[styles.eventMeta, { color: theme.muted }]}>{event.date} • {event.venue}</Text>
					<Text style={[styles.seatInfo, { color: theme.accent }]}>Seats: {ticket.seatIds.join(', ')}</Text>
				</View>
			</View>

			{/* Transfer Method */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Transfer Method</Text>
				<View style={styles.methodButtons}>
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => setTransferMethod('gift')}
						style={[
							styles.methodButton,
							{
								backgroundColor: transferMethod === 'gift' ? theme.accent : theme.bg,
								borderColor: transferMethod === 'gift' ? theme.accent : theme.border,
							}
						]}
					>
						<Ionicons name="gift-outline" size={24} color={transferMethod === 'gift' ? '#ffffff' : theme.text} />
						<Text style={[styles.methodText, { color: transferMethod === 'gift' ? '#ffffff' : theme.text }]}>
							Gift
						</Text>
						<Text style={[styles.methodDesc, { color: transferMethod === 'gift' ? '#ffffff' : theme.muted }]}>
							Free transfer
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => setTransferMethod('sell')}
						style={[
							styles.methodButton,
							{
								backgroundColor: transferMethod === 'sell' ? theme.accent : theme.bg,
								borderColor: transferMethod === 'sell' ? theme.accent : theme.border,
							}
						]}
					>
						<Ionicons name="cash-outline" size={24} color={transferMethod === 'sell' ? '#ffffff' : theme.text} />
						<Text style={[styles.methodText, { color: transferMethod === 'sell' ? '#ffffff' : theme.text }]}>
							Sell
						</Text>
						<Text style={[styles.methodDesc, { color: transferMethod === 'sell' ? '#ffffff' : theme.muted }]}>
							With payment
						</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Price Input (if selling) */}
			{transferMethod === 'sell' && (
				<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Text style={[styles.cardTitle, { color: theme.text }]}>Transfer Price</Text>
					<Text style={[styles.inputLabel, { color: theme.muted }]}>Amount (USD)</Text>
					<View style={styles.priceInputContainer}>
						<Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
						<TextInput
							value={transferPrice}
							onChangeText={setTransferPrice}
							placeholder="0.00"
							placeholderTextColor={theme.muted}
							keyboardType="decimal-pad"
							style={[styles.priceInput, { color: theme.text, borderColor: theme.border }]}
						/>
					</View>
					<Text style={[styles.helperText, { color: theme.muted }]}>
						Original price: ${ticket.total.toFixed(2)}
					</Text>
				</View>
			)}

			{/* Recipient Info */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Recipient Information</Text>
				
				<Text style={[styles.inputLabel, { color: theme.muted }]}>Email Address</Text>
				<TextInput
					value={recipientEmail}
					onChangeText={setRecipientEmail}
					placeholder="recipient@example.com"
					placeholderTextColor={theme.muted}
					keyboardType="email-address"
					autoCapitalize="none"
					style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>

				<Text style={[styles.inputLabel, { color: theme.muted }]}>Phone Number</Text>
				<TextInput
					value={recipientPhone}
					onChangeText={setRecipientPhone}
					placeholder="+1 (555) 000-0000"
					placeholderTextColor={theme.muted}
					keyboardType="phone-pad"
					style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>
			</View>

			{/* Security Notice */}
			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
				<Ionicons name="shield-checkmark" size={20} color={theme.accent} />
				<Text style={[styles.infoText, { color: theme.muted }]}>
					Both parties will receive verification codes via email and SMS for secure transfer confirmation.
				</Text>
			</View>

			<TouchableOpacity
				activeOpacity={0.8}
				onPress={handleInitiateTransfer}
				style={[styles.button, { backgroundColor: theme.accent }]}
			>
				<Text style={styles.buttonText}>Continue</Text>
			</TouchableOpacity>
		</ScrollView>
	);

	const renderPaymentStep = () => (
		<ScrollView contentContainerStyle={styles.stepContainer}>
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Payment Method</Text>
				
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setPaymentMethod('escrow')}
					style={[
						styles.paymentOption,
						{
							backgroundColor: paymentMethod === 'escrow' ? theme.accent + '20' : theme.bg,
							borderColor: paymentMethod === 'escrow' ? theme.accent : theme.border,
						}
					]}
				>
					<View style={styles.paymentOptionLeft}>
						<Ionicons name="lock-closed" size={24} color={theme.accent} />
						<View>
							<Text style={[styles.paymentTitle, { color: theme.text }]}>Escrow Payment</Text>
							<Text style={[styles.paymentDesc, { color: theme.muted }]}>
								Most secure - Payment held until verified
							</Text>
						</View>
					</View>
					{paymentMethod === 'escrow' && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setPaymentMethod('direct')}
					style={[
						styles.paymentOption,
						{
							backgroundColor: paymentMethod === 'direct' ? theme.accent + '20' : theme.bg,
							borderColor: paymentMethod === 'direct' ? theme.accent : theme.border,
						}
					]}
				>
					<View style={styles.paymentOptionLeft}>
						<Ionicons name="flash" size={24} color={theme.accent} />
						<View>
							<Text style={[styles.paymentTitle, { color: theme.text }]}>Direct Transfer</Text>
							<Text style={[styles.paymentDesc, { color: theme.muted }]}>
								Faster - Immediate payment
							</Text>
						</View>
					</View>
					{paymentMethod === 'direct' && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
				</TouchableOpacity>
			</View>

			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Payment Summary</Text>
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryLabel, { color: theme.muted }]}>Transfer Price</Text>
					<Text style={[styles.summaryValue, { color: theme.text }]}>${transferPrice}</Text>
				</View>
				<View style={styles.summaryRow}>
					<Text style={[styles.summaryLabel, { color: theme.muted }]}>Platform Fee (3%)</Text>
					<Text style={[styles.summaryValue, { color: theme.text }]}>
						${(parseFloat(transferPrice) * 0.03).toFixed(2)}
					</Text>
				</View>
				<View style={[styles.divider, { backgroundColor: theme.border }]} />
				<View style={styles.summaryRow}>
					<Text style={[styles.totalLabel, { color: theme.text }]}>You Receive</Text>
					<Text style={[styles.totalValue, { color: theme.accent }]}>
						${(parseFloat(transferPrice) * 0.97).toFixed(2)}
					</Text>
				</View>
			</View>

			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
				<Ionicons name="information-circle" size={20} color={theme.accent} />
				<Text style={[styles.infoText, { color: theme.muted }]}>
					{paymentMethod === 'escrow' 
						? 'Payment will be held in escrow until both parties confirm the transfer. This typically takes 1-2 hours.'
						: 'Payment will be processed immediately after recipient verification.'}
				</Text>
			</View>

			<TouchableOpacity
				activeOpacity={0.8}
				onPress={handlePaymentSetup}
				style={[styles.button, { backgroundColor: theme.accent }]}
			>
				<Text style={styles.buttonText}>Setup Payment</Text>
			</TouchableOpacity>
		</ScrollView>
	);

	const renderVerifyStep = () => (
		<ScrollView contentContainerStyle={styles.stepContainer}>
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<View style={styles.iconCircle}>
					<Ionicons name="mail-outline" size={32} color={theme.accent} />
				</View>
				<Text style={[styles.verifyTitle, { color: theme.text }]}>Verification Sent</Text>
				<Text style={[styles.verifyDesc, { color: theme.muted }]}>
					We've sent a 6-digit verification code to both your email and {recipientEmail}
				</Text>
			</View>

			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.inputLabel, { color: theme.muted }]}>Enter Verification Code</Text>
				<TextInput
					value={verificationCode}
					onChangeText={setVerificationCode}
					placeholder="000000"
					placeholderTextColor={theme.muted}
					keyboardType="number-pad"
					maxLength={6}
					style={[styles.codeInput, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>
				<TouchableOpacity style={styles.resendButton}>
					<Text style={[styles.resendText, { color: theme.accent }]}>Resend Code</Text>
				</TouchableOpacity>
			</View>

			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
				<Ionicons name="shield-checkmark" size={20} color={theme.accent} />
				<Text style={[styles.infoText, { color: theme.muted }]}>
					The recipient must also verify their code. Once both parties verify, the ticket will be transferred and {transferMethod === 'sell' ? 'payment will be released' : 'transfer will complete'}.
				</Text>
			</View>

			<TouchableOpacity
				activeOpacity={0.8}
				onPress={handleVerifyTransfer}
				style={[styles.button, { backgroundColor: theme.accent }]}
			>
				<Text style={styles.buttonText}>Verify & Complete</Text>
			</TouchableOpacity>
		</ScrollView>
	);

	const renderCompleteStep = () => (
		<View style={[styles.container, { backgroundColor: theme.bg, justifyContent: 'center' }]}>
			<View style={[styles.successCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<View style={[styles.successIconCircle, { backgroundColor: theme.accent + '20' }]}>
					<Ionicons name="checkmark-circle" size={64} color={theme.accent} />
				</View>
				<Text style={[styles.successTitle, { color: theme.text }]}>Transfer Complete!</Text>
				<Text style={[styles.successDesc, { color: theme.muted }]}>
					{transferMethod === 'sell' 
						? `Your ticket has been transferred to ${recipientEmail}. Payment of $${(parseFloat(transferPrice) * 0.97).toFixed(2)} will be deposited to your account within 1-2 business days.`
						: `Your ticket has been successfully gifted to ${recipientEmail}.`}
				</Text>

				<View style={[styles.transferDetails, { backgroundColor: theme.bg, borderColor: theme.border }]}>
					<View style={styles.detailRow}>
						<Text style={[styles.detailLabel, { color: theme.muted }]}>Ticket ID</Text>
						<Text style={[styles.detailValue, { color: theme.text }]}>{ticket.id.toUpperCase()}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={[styles.detailLabel, { color: theme.muted }]}>Transferred To</Text>
						<Text style={[styles.detailValue, { color: theme.text }]}>{recipientEmail}</Text>
					</View>
					<View style={styles.detailRow}>
						<Text style={[styles.detailLabel, { color: theme.muted }]}>Date</Text>
						<Text style={[styles.detailValue, { color: theme.text }]}>
							{new Date().toLocaleDateString()}
						</Text>
					</View>
				</View>

				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => navigation.navigate('HomeTabs')}
					style={[styles.button, { backgroundColor: theme.accent }]}
				>
					<Text style={styles.buttonText}>Back to Home</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View style={[styles.container, { backgroundColor: theme.bg }]}>
			{/* Progress Indicator */}
			{step !== 'complete' && (
				<View style={[styles.progressBar, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
					<View style={styles.progressSteps}>
						{['details', 'payment', 'verify'].map((s, index) => {
							const isActive = s === step;
							const isPast = ['details', 'payment', 'verify'].indexOf(step) > index;
							if (transferMethod === 'gift' && s === 'payment') return null;
							
							return (
								<View key={s} style={styles.progressStep}>
									<View style={[
										styles.progressDot,
										{
											backgroundColor: isPast || isActive ? theme.accent : theme.border,
										}
									]}>
										{isPast ? (
											<Ionicons name="checkmark" size={12} color="#ffffff" />
										) : (
											<Text style={[styles.progressNumber, { color: isActive ? '#ffffff' : theme.muted }]}>
												{index + 1}
											</Text>
										)}
									</View>
									<Text style={[styles.progressLabel, { color: isActive ? theme.text : theme.muted }]}>
										{s.charAt(0).toUpperCase() + s.slice(1)}
									</Text>
								</View>
							);
						})}
					</View>
				</View>
			)}

			{/* Step Content */}
			{step === 'details' && renderDetailsStep()}
			{step === 'payment' && renderPaymentStep()}
			{step === 'verify' && renderVerifyStep()}
			{step === 'complete' && renderCompleteStep()}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	stepContainer: {
		padding: 16,
		gap: 16,
		paddingBottom: 32,
	},
	progressBar: {
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
	},
	progressSteps: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	progressStep: {
		alignItems: 'center',
		gap: 8,
	},
	progressDot: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	progressNumber: {
		fontSize: 14,
		fontWeight: '700',
	},
	progressLabel: {
		fontSize: 11,
		fontWeight: '600',
	},
	card: {
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	ticketInfo: {
		gap: 4,
	},
	eventName: {
		fontSize: 16,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	eventMeta: {
		fontSize: 13,
	},
	seatInfo: {
		fontSize: 14,
		fontWeight: '600',
		marginTop: 4,
	},
	methodButtons: {
		flexDirection: 'row',
		gap: 12,
	},
	methodButton: {
		flex: 1,
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
		alignItems: 'center',
		gap: 8,
	},
	methodText: {
		fontSize: 16,
		fontWeight: '700',
	},
	methodDesc: {
		fontSize: 12,
	},
	priceInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	currencySymbol: {
		fontSize: 24,
		fontWeight: '700',
	},
	priceInput: {
		flex: 1,
		fontSize: 24,
		fontWeight: '700',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
	},
	inputLabel: {
		fontSize: 13,
		fontWeight: '600',
		marginTop: 4,
		marginBottom: 4,
	},
	input: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 15,
	},
	codeInput: {
		paddingVertical: 16,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 32,
		fontWeight: '700',
		textAlign: 'center',
		letterSpacing: 8,
	},
	helperText: {
		fontSize: 12,
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
	paymentOption: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: 12,
		borderWidth: 2,
	},
	paymentOptionLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	paymentTitle: {
		fontSize: 16,
		fontWeight: '700',
	},
	paymentDesc: {
		fontSize: 12,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
	},
	summaryLabel: {
		fontSize: 14,
	},
	summaryValue: {
		fontSize: 14,
		fontWeight: '600',
	},
	divider: {
		height: 1,
		marginVertical: 8,
	},
	totalLabel: {
		fontSize: 16,
		fontWeight: '700',
	},
	totalValue: {
		fontSize: 20,
		fontWeight: '700',
	},
	iconCircle: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#6C5CE720',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	verifyTitle: {
		fontSize: 22,
		fontWeight: '700',
		textAlign: 'center',
	},
	verifyDesc: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20,
	},
	resendButton: {
		alignSelf: 'center',
		marginTop: 8,
	},
	resendText: {
		fontSize: 14,
		fontWeight: '600',
	},
	successCard: {
		margin: 24,
		padding: 24,
		borderRadius: 20,
		borderWidth: 1,
		alignItems: 'center',
		gap: 16,
	},
	successIconCircle: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	successTitle: {
		fontSize: 24,
		fontWeight: '700',
		textAlign: 'center',
	},
	successDesc: {
		fontSize: 14,
		textAlign: 'center',
		lineHeight: 20,
	},
	transferDetails: {
		width: '100%',
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		gap: 12,
		marginTop: 8,
	},
	detailRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	detailLabel: {
		fontSize: 13,
	},
	detailValue: {
		fontSize: 13,
		fontWeight: '600',
	},
	button: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		marginTop: 8,
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	error: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 40,
	},
});

