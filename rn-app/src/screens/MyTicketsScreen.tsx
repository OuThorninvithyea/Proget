import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MY_TICKETS } from "../data/tickets";
import TicketItem from "../components/TicketItem";
import { useTheme } from "../theme/ThemeProvider";
import { EVENTS } from "../data/events";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MyTicketsScreen(): React.ReactElement {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.bg, paddingTop: insets.top },
      ]}
    >
      {MY_TICKETS.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.muted }]}>
            No tickets yet. Book your first event!
          </Text>
        </View>
      ) : (
        <FlatList
          data={MY_TICKETS}
          keyExtractor={(t) => t.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const ev = EVENTS.find((e) => e.id === item.eventId)!;
            return (
              <TicketItem
                title={ev.name}
                subtitle={`${ev.date} • Seats ${item.seatIds.join(", ")}`}
                qrData={item.qrData}
                onPress={() =>
                  navigation.navigate("TicketDetail", { ticketId: item.id })
                }
              />
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: { fontSize: 16, textAlign: "center" },
});
