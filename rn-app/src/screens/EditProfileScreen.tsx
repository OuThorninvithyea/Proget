import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen({ navigation }: Props): React.ReactElement {
	const { theme } = useTheme();
	const [name, setName] = useState('Alex Johnson');
	const [email, setEmail] = useState('alex.johnson@example.com');
	const [phone, setPhone] = useState('+1 (555) 123-4567');
	const [bio, setBio] = useState('Concert enthusiast and music lover 🎵');
	const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop';

	const handleSave = () => {
		if (!name || !email || !phone) {
			Alert.alert('Missing Information', 'Please fill in all required fields');
			return;
		}

		Alert.alert(
			'Profile Updated',
			'Your profile has been successfully updated',
			[{ text: 'OK', onPress: () => navigation.goBack() }]
		);
	};

	return (
		<ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
			{/* Avatar */}
			<View style={styles.avatarSection}>
				<Image source={{ uri: avatar }} style={styles.avatar} />
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => Alert.alert('Change Photo', 'Photo picker would open here')}
					style={[styles.changePhotoButton, { backgroundColor: theme.accent }]}
				>
					<Ionicons name="camera" size={16} color="#ffffff" />
				</TouchableOpacity>
			</View>

			{/* Form */}
			<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
				<Text style={[styles.label, { color: theme.muted }]}>Full Name *</Text>
				<TextInput
					value={name}
					onChangeText={setName}
					placeholder="Enter your name"
					placeholderTextColor={theme.muted}
					style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>

				<Text style={[styles.label, { color: theme.muted }]}>Email Address *</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					placeholder="your@email.com"
					placeholderTextColor={theme.muted}
					keyboardType="email-address"
					autoCapitalize="none"
					style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>

				<Text style={[styles.label, { color: theme.muted }]}>Phone Number *</Text>
				<TextInput
					value={phone}
					onChangeText={setPhone}
					placeholder="+1 (555) 000-0000"
					placeholderTextColor={theme.muted}
					keyboardType="phone-pad"
					style={[styles.input, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>

				<Text style={[styles.label, { color: theme.muted }]}>Bio</Text>
				<TextInput
					value={bio}
					onChangeText={setBio}
					placeholder="Tell us about yourself"
					placeholderTextColor={theme.muted}
					multiline
					numberOfLines={3}
					textAlignVertical="top"
					style={[styles.textArea, { color: theme.text, backgroundColor: theme.bg, borderColor: theme.border }]}
				/>
			</View>

			{/* Save Button */}
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={handleSave}
				style={[styles.saveButton, { backgroundColor: theme.accent }]}
			>
				<Text style={styles.saveButtonText}>Save Changes</Text>
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
		gap: 20,
		paddingBottom: 32,
	},
	avatarSection: {
		alignItems: 'center',
		paddingVertical: 20,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},
	changePhotoButton: {
		position: 'absolute',
		bottom: 20,
		right: '35%',
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 3,
		borderColor: '#ffffff',
	},
	card: {
		padding: 16,
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
	},
	label: {
		fontSize: 13,
		fontWeight: '600',
		marginTop: 4,
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
		minHeight: 80,
	},
	saveButton: {
		paddingVertical: 16,
		borderRadius: 12,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 8,
		shadowOpacity: 0.2,
		elevation: 4,
	},
	saveButtonText: {
		color: '#ffffff',
		fontSize: 16,
		fontWeight: '700',
		fontFamily: 'Inter_700Bold',
	},
});

