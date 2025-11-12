import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import SeatSelectionScreen from "../screens/SeatSelectionScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import MyTicketsScreen from "../screens/MyTicketsScreen";
import AccountScreen from "../screens/AccountScreen";
import TicketDetailScreen from "../screens/TicketDetailScreen";
import TransferTicketScreen from "../screens/TransferTicketScreen";
import TicketMarketplaceScreen from "../screens/TicketMarketplaceScreen";
import CreateListingScreen from "../screens/CreateListingScreen";
import ListingDetailScreen from "../screens/ListingDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import LanguageScreen from "../screens/LanguageScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  HomeTabs: undefined;
  EventDetail: { eventId: string };
  SeatSelection: { eventId: string };
  Checkout: { eventId: string; seatIds: string[] };
  TicketDetail: { ticketId: string };
  TransferTicket: { ticketId: string };
  TicketMarketplace: undefined;
  CreateListing: undefined;
  ListingDetail: { listingId: string };
  ProposeTrade: { listingId: string };
  EditProfile: undefined;
  PaymentMethods: undefined;
  OrderHistory: undefined;
  Notifications: undefined;
  Language: undefined;
  Privacy: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function Tabs(): React.ReactElement {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="musical-notes-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Tickets"
        component={MyTicketsScreen}
        options={{
          tabBarIcon: ({ color, size}) => (
            <Ionicons name="ticket-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={TicketMarketplaceScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator(): React.ReactElement {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.text,
        headerStyle: { backgroundColor: theme.card },
        contentStyle: { backgroundColor: theme.bg },
      }}
    >
      {!isAuthenticated ? (
        // Auth Stack - Show Login/Register screens when not authenticated
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        // App Stack - Show main app when authenticated
        <>
          <Stack.Screen
            name="HomeTabs"
            component={Tabs}
            options={{ headerShown: false }}
          />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: "Event" }}
      />
      <Stack.Screen
        name="SeatSelection"
        component={SeatSelectionScreen}
        options={{ title: "Select Seats" }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />
      <Stack.Screen
        name="TicketDetail"
        component={TicketDetailScreen}
        options={{ title: "My Ticket" }}
      />
      <Stack.Screen
        name="TransferTicket"
        component={TransferTicketScreen}
        options={{ title: "Transfer Ticket" }}
      />
      <Stack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{ title: "Create Listing" }}
      />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: "Listing Details" }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: "Edit Profile" }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ title: "Payment Methods" }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{ title: "Order History" }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notifications" }}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{ title: "Language" }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: "Privacy & Security" }}
      />
        </>
      )}
    </Stack.Navigator>
  );
}
