import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle: string;
  qrData: string;
  onPress: () => void;
};

export default function TicketItem({
  title,
  subtitle,
  qrData,
  onPress,
}: Props): React.ReactElement {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          borderColor: theme.border,
          backgroundColor: theme.card,
          shadowOpacity: theme.shadowOpacity,
        },
      ]}
    >
      <View style={styles.meta}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.muted }]}
          numberOfLines={1}
        >
          {subtitle}
        </Text>
        <View style={styles.tapHint}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={theme.accent}
          />
          <Text style={[styles.tapText, { color: theme.accent }]}>
            Tap for details
          </Text>
        </View>
      </View>
      <View style={styles.qrWrapper}>
        <QRCode
          value={qrData}
          size={72}
          backgroundColor="transparent"
          color={theme.isDark ? "#f3f4f6" : "#111827"}
        />
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.muted}
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 3,
  },
  meta: { gap: 6, flex: 1, marginRight: 12 },
  title: { fontSize: 16, fontWeight: "700" },
  subtitle: { fontSize: 12 },
  tapHint: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  tapText: { fontSize: 11, fontWeight: "600" },
  qrWrapper: { flexDirection: "row", alignItems: "center", gap: 8 },
  chevron: { marginLeft: -4 },
});
