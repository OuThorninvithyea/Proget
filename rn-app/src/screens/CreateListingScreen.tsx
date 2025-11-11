import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { MY_TICKETS } from '../data/tickets';
import { EVENTS } from '../data/events';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateListing'>;

export default function CreateListingScreen({ navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
	const [listingType, setListingType] = useState<'trade' | 'sell' | 'combo'>('trade');
	const [askingPrice, setAskingPrice] = useState('');
	const [wantedEvent, setWantedEvent] = useState('');
	const [description, setDescription] = useState('');

	const handleCreateListing = () => {
		if (!selectedTicket) {
			Alert.alert('Select Ticket', 'Please select a ticket to list');
			return;
		}

		if (listingType === 'trade' && !wantedEvent) {
			Alert.alert('Missing Information', 'Please specify what event you want to trade for');
			return;
		}

		if ((listingType === 'sell' || listingType === 'combo') && !askingPrice) {
			Alert.alert('Missing Price', 'Please enter an asking price');
			return;
		}

		if (!description) {
			Alert.alert('Missing Description', 'Please add a description for your listing');
			return;
		}

		Alert.alert(
			'Listing Created!',
			'Your ticket has been listed on the marketplace',
			[{ text: 'OK', onPress: () => navigation.goBack() }]
		);
	};

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
			{/* Select Ticket */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Select Ticket to List</Text>
				{MY_TICKETS.map(ticket => {
					const event = EVENTS.find(e => e.id === ticket.eventId);
					if (!event) return null;
					const isSelected = selectedTicket === ticket.id;

					return (
						<TouchableOpacity
							key={ticket.id}
							activeOpacity={0.7}
							onPress={() => setSelectedTicket(ticket.id)}
							style={[
								styles.ticketOption,
								{
									backgroundColor: isSelected ? theme.accent + '20' : theme.bg,
									borderColor: isSelected ? theme.accent : theme.border,
								}
							]}
						>
							<View style={styles.ticketInfo}>
								<Text style={[styles.ticketEvent, { color: theme.text }]}>{event.name}</Text>
								<Text style={[styles.ticketMeta, { color: theme.muted }]}>
									{event.date} • Seats: {ticket.seatIds.join(', ')}
								</Text>
							</View>
							{isSelected && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
						</TouchableOpacity>
					);
				})}
			</View>

			{/* Listing Type */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Listing Type</Text>
				
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setListingType('trade')}
					style={[
						styles.typeOption,
						{
							backgroundColor: listingType === 'trade' ? theme.accent + '20' : theme.bg,
							borderColor: listingType === 'trade' ? theme.accent : theme.border,
						}
					]}
				>
					<View style={styles.typeLeft}>
						<View style={[styles.typeIcon, { backgroundColor: '#10b981' }]}>
							<Ionicons name="swap-horizontal" size={24} color="#ffffff" />
						</View>
						<View>
							<Text style={[styles.typeTitle, { color: theme.text }]}>Ticket Trade</Text>
							<Text style={[styles.typeDesc, { color: theme.muted }]}>
								Swap your ticket for another event
							</Text>
						</View>
					</View>
					{listingType === 'trade' && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setListingType('sell')}
					style={[
						styles.typeOption,
						{
							backgroundColor: listingType === 'sell' ? theme.accent + '20' : theme.bg,
							borderColor: listingType === 'sell' ? theme.accent : theme.border,
						}
					]}
				>
					<View style={styles.typeLeft}>
						<View style={[styles.typeIcon, { backgroundColor: '#3b82f6' }]}>
							<Ionicons name="cash" size={24} color="#ffffff" />
						</View>
						<View>
							<Text style={[styles.typeTitle, { color: theme.text }]}>Sell for Money</Text>
							<Text style={[styles.typeDesc, { color: theme.muted }]}>
								Sell your ticket for cash payment
							</Text>
						</View>
					</View>
					{listingType === 'sell' && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
				</TouchableOpacity>

				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => setListingType('combo')}
					style={[
						styles.typeOption,
						{
							backgroundColor: listingType === 'combo' ? theme.accent + '20' : theme.bg,
							borderColor: listingType === 'combo' ? theme.accent : theme.border,
						}
					]}
				>
					<View style={styles.typeLeft}>
						<View style={[styles.typeIcon, { backgroundColor: '#f59e0b' }]}>
							<Ionicons name="trending-up" size={24} color="#ffffff" />
						</View>
						<View>
							<Text style={[styles.typeTitle, { color: theme.text }]}>Combo Deal</Text>
							<Text style={[styles.typeDesc, { color: theme.muted }]}>
								Trade ticket + money for better seats
							</Text>
						</View>
					</View>
					{listingType === 'combo' && <Ionicons name="checkmark-circle" size={24} color={theme.accent} />}
				</TouchableOpacity>
			</View>

			{/* Price (if sell or combo) */}
			{(listingType === 'sell' || listingType === 'combo') && (
				<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Text style={[styles.cardTitle, { color: theme.text }]}>
						{listingType === 'sell' ? 'Asking Price' : 'Additional Money'}
					</Text>
					<Text style={[styles.inputLabel, { color: theme.muted }]}>
						{listingType === 'sell' 
							? 'How much do you want for your ticket?' 
							: 'How much money + your ticket for the trade?'}
					</Text>
					<View style={styles.priceInputContainer}>
						<Text style={[styles.currencySymbol, { color: theme.text }]}>$</Text>
						<TextInput
							value={askingPrice}
							onChangeText={setAskingPrice}
							placeholder="0.00"
							placeholderTextColor={theme.muted}
							keyboardType="decimal-pad"
							style={[styles.priceInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.bg }]}
						/>
					</View>
				</View>
			)}

			{/* Wanted Event (if trade or combo) */}
			{(listingType === 'trade' || listingType === 'combo') && (
				<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
					<Text style={[styles.cardTitle, { color: theme.text }]}>Wanted Event</Text>
					<Text style={[styles.inputLabel, { color: theme.muted }]}>
						Which event are you looking for?
					</Text>
					<TextInput
						value={wantedEvent}
						onChangeText={setWantedEvent}
						placeholder="e.g., Mono Noir, Any VIP seats"
						placeholderTextColor={theme.muted}
						style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
					/>
				</View>
			)}

			{/* Description */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.cardTitle, { color: theme.text }]}>Description</Text>
				<Text style={[styles.inputLabel, { color: theme.muted }]}>
					Tell potential traders about your listing
				</Text>
				<TextInput
					value={description}
					onChangeText={setDescription}
					placeholder="e.g., Great seats, can't make it, flexible on trades..."
					placeholderTextColor={theme.muted}
					multiline
					numberOfLines={4}
					textAlignVertical="top"
					style={[styles.textArea, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>
			</View>

			{/* Info Box */}
			<View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.accent }]}>
				<Ionicons name="shield-checkmark" size={20} color={theme.accent} />
				<Text style={[styles.infoText, { color: theme.muted }]}>
					All trades are protected with dual verification and escrow payment system for your safety.
				</Text>
			</View>

			{/* Create Button */}
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={handleCreateListing}
				style={[styles.createButton, { backgroundColor: theme.accent }]}
			>
				<Text style={styles.createButtonText}>Create Listing</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		padding: 16,
		gap: 16,
		paddingBottom: 32,
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
	ticketOption: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 14,
		borderRadius: 12,
		borderWidth: 2,
	},
	ticketInfo: {
		flex: 1,
		gap: 4,
	},
	ticketEvent: {
		fontSize: 16,
		fontWeight: '600',
		fontFamily: 'Inter_600SemiBold',
	},
	ticketMeta: {
		fontSize: 12,
	},
	typeOption: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 14,
		borderRadius: 12,
		borderWidth: 2,
	},
	typeLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		flex: 1,
	},
	typeIcon: {
		width: 48,
		height: 48,
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
	},
	typeTitle: {
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
	typeDesc: {
		fontSize: 12,
	},
	inputLabel: {
		fontSize: 13,
		marginBottom: 4,
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
	input: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 15,
	},
	textArea: {
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		borderWidth: 1,
		fontSize: 15,
		minHeight: 100,
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
	createButton: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 4,
	},
	createButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
});

