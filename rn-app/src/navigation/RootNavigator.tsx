import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

export type RootStackParamList = {
	HomeTabs: undefined;
	EventDetail: { eventId: string };
	SeatSelection: { eventId: string };
	Checkout: { eventId: string; seatIds: string[] };
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs(): JSX.Element {
	const { theme } = useTheme();
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: theme.accent,
				tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					tabBarIcon: ({ color, size }) => <Ionicons name="musical-notes-outline" color={color} size={size} />,
				}}
			/>
			<Tab.Screen
				name="My Tickets"
				component={MyTicketsScreen}
				options={{
					tabBarIcon: ({ color, size }) => <Ionicons name="ticket-outline" color={color} size={size} />,
				}}
			/>
			<Tab.Screen
				name="Settings"
				component={SettingsScreen}
				options={{
					tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
				}}
			/>
		</Tab.Navigator>
	);
}

export default function RootNavigator(): JSX.Element {
	const { theme } = useTheme();
	return (
		<Stack.Navigator
			screenOptions={{
				headerTintColor: theme.text,
				headerStyle: { backgroundColor: theme.card },
				contentStyle: { backgroundColor: theme.bg },
			}}
		>
			<Stack.Screen name="HomeTabs" component={Tabs} options={{ headerShown: false }} />
			<Stack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Event' }} />
			<Stack.Screen name="SeatSelection" component={SeatSelectionScreen} options={{ title: 'Select Seats' }} />
			<Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
		</Stack.Navigator>
	);
}


