import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useTheme } from "../theme/ThemeProvider";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "SavedAddresses">;

interface Address {
  _id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function SavedAddressesScreen({
  navigation,
}: Props): React.ReactElement {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!user) return;

    try {
      setRefreshing(true);
      const response = await api.get<any>(`/addresses/${user.id}`);
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load addresses");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete(
                `/addresses/${user?.id}/${addressId}`
              );
              if (response.success) {
                Alert.alert("Success", "Address deleted successfully");
                fetchAddresses();
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete address");
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await api.put(
        `/addresses/${user?.id}/${addressId}/default`,
        {}
      );
      if (response.success) {
        Alert.alert("Success", "Default address updated");
        fetchAddresses();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update default address");
    }
  };

  const renderAddress = (address: Address) => (
    <View
      key={address._id}
      style={[
        styles.addressCard,
        {
          backgroundColor: theme.card,
          borderColor: address.isDefault ? theme.accent : theme.border,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.addressHeader}>
        <View style={styles.addressHeaderLeft}>
          <View
            style={[
              styles.labelBadge,
              { backgroundColor: theme.accent + "20" },
            ]}
          >
            <Ionicons
              name={
                address.label === "home"
                  ? "home"
                  : address.label === "work"
                  ? "briefcase"
                  : "location"
              }
              size={14}
              color={theme.accent}
            />
            <Text style={[styles.labelText, { color: theme.accent }]}>
              {address.label.toUpperCase()}
            </Text>
          </View>
          {address.isDefault && (
            <View
              style={[styles.defaultBadge, { backgroundColor: theme.accent }]}
            >
              <Text style={styles.defaultText}>DEFAULT</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddEditAddress", { address, userId: user?.id })
          }
        >
          <Ionicons name="pencil" size={20} color={theme.accent} />
        </TouchableOpacity>
      </View>

      {/* Address Details */}
      <View style={styles.addressBody}>
        <Text style={[styles.fullName, { color: theme.text }]}>
          {address.fullName}
        </Text>
        <Text style={[styles.addressText, { color: theme.muted }]}>
          {address.addressLine1}
        </Text>
        {address.addressLine2 && (
          <Text style={[styles.addressText, { color: theme.muted }]}>
            {address.addressLine2}
          </Text>
        )}
        <Text style={[styles.addressText, { color: theme.muted }]}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={[styles.addressText, { color: theme.muted }]}>
          {address.country}
        </Text>
        <Text style={[styles.phoneText, { color: theme.muted }]}>
          📞 {address.phoneNumber}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.addressActions}>
        {!address.isDefault && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.bg, borderColor: theme.border },
            ]}
            onPress={() => handleSetDefault(address._id)}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={18}
              color={theme.text}
            />
            <Text style={[styles.actionButtonText, { color: theme.text }]}>
              Set as Default
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.bg, borderColor: theme.border },
          ]}
          onPress={() => handleDelete(address._id)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color={theme.muted} />
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No Saved Addresses
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.muted }]}>
              Add your first address to make checkout faster
            </Text>
          </View>
        ) : (
          addresses.map(renderAddress)
        )}
      </ScrollView>

      {/* Add Address Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.accent }]}
        onPress={() =>
          navigation.navigate("AddEditAddress", { userId: user?.id })
        }
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  addressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
  },
  addressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addressHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "700",
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  addressBody: {
    marginBottom: 16,
  },
  fullName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    marginTop: 8,
  },
  addressActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.3,
    elevation: 8,
    gap: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
