import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar } from 'react-native';

export default function App() {
  return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<Text style={styles.title}>Welcome to React Native</Text>
				<Text style={styles.subtitle}>Built with Expo</Text>

				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.button}
					onPress={() => {
						alert('Hello from your new RN app!');
					}}
				>
					<Text style={styles.buttonText}>Tap me</Text>
				</TouchableOpacity>

				<View style={styles.actionsRow}>
					<TouchableOpacity
						activeOpacity={0.85}
						style={[styles.actionButton, styles.actionPrimary]}
						onPress={() => alert('Primary action')}
					>
						<Text style={styles.actionText}>Primary</Text>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.85}
						style={[styles.actionButton, styles.actionSecondary]}
						onPress={() => alert('Secondary action')}
					>
						<Text style={[styles.actionText, styles.actionSecondaryText]}>Secondary</Text>
					</TouchableOpacity>
				</View>

				<Text style={styles.helperText}>
					Edit rn-app/App.js to customize this screen.
				</Text>
			</View>
			<StatusBar style="auto" />
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
		paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
	card: {
		backgroundColor: '#111827',
		padding: 24,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#1f2937',
		width: '88%',
		maxWidth: 420,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 8,
	},
	title: {
		color: 'white',
		fontSize: 24,
		fontWeight: '700',
		marginBottom: 6,
		textAlign: 'center',
	},
	subtitle: {
		color: '#9ca3af',
		fontSize: 14,
		marginBottom: 20,
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#2563eb',
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 16,
		letterSpacing: 0.3,
	},
	actionsRow: {
		flexDirection: 'row',
		gap: 12,
		marginTop: 16,
	},
	actionButton: {
		flex: 1,
		paddingVertical: 10,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	actionPrimary: {
		backgroundColor: '#10b981',
	},
	actionSecondary: {
		backgroundColor: 'transparent',
		borderWidth: 1,
		borderColor: '#334155',
	},
	actionText: {
		color: 'white',
		fontWeight: '600',
		fontSize: 15,
	},
	actionSecondaryText: {
		color: '#cbd5e1',
	},
	helperText: {
		marginTop: 16,
		color: '#94a3b8',
		textAlign: 'center',
		fontSize: 12,
	},
});
