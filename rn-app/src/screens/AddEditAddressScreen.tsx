import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";
import { useTheme } from "../theme/ThemeProvider";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "AddEditAddress">;

export default function AddEditAddressScreen({
  navigation,
  route,
}: Props): React.ReactElement {
  const { theme } = useTheme();
  const { address, userId } = route.params;
  const isEditing = !!address;

  const [label, setLabel] = useState(address?.label || "home");
  const [fullName, setFullName] = useState(address?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(address?.phoneNumber || "");
  const [addressLine1, setAddressLine1] = useState(address?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(address?.addressLine2 || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [zipCode, setZipCode] = useState(address?.zipCode || "");
  const [country, setCountry] = useState(address?.country || "USA");
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);
  const [loading, setLoading] = useState(false);

  const labels = [
    { value: "home", label: "Home", icon: "home" },
    { value: "work", label: "Work", icon: "briefcase" },
    { value: "other", label: "Other", icon: "location" },
  ];

  const handleSave = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter full name");
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }
    if (!addressLine1.trim()) {
      Alert.alert("Error", "Please enter address");
      return;
    }
    if (!city.trim()) {
      Alert.alert("Error", "Please enter city");
      return;
    }
    if (!state.trim()) {
      Alert.alert("Error", "Please enter state");
      return;
    }
    if (!zipCode.trim()) {
      Alert.alert("Error", "Please enter zip code");
      return;
    }

    setLoading(true);

    try {
      const addressData = {
        label,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        country,
        isDefault,
      };

      let response;
      if (isEditing) {
        response = await api.put(
          `/addresses/${userId}/${address._id}`,
          addressData
        );
      } else {
        response = await api.post(`/addresses/${userId}`, addressData);
      }

      if (response.success) {
        Alert.alert(
          "Success",
          `Address ${isEditing ? "updated" : "added"} successfully`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || `Failed to ${isEditing ? "update" : "add"} address`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Address Label */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Address Type
          </Text>
          <View style={styles.labelButtons}>
            {labels.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.labelButton,
                  {
                    backgroundColor:
                      label === item.value ? theme.accent : theme.card,
                    borderColor:
                      label === item.value ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => setLabel(item.value)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={label === item.value ? "#ffffff" : theme.text}
                />
                <Text
                  style={[
                    styles.labelButtonText,
                    {
                      color: label === item.value ? "#ffffff" : theme.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Contact Information
          </Text>

          <Text style={[styles.label, { color: theme.muted }]}>
            Full Name *
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons name="person-outline" size={20} color={theme.muted} />
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.text }]}
            />
          </View>

          <Text style={[styles.label, { color: theme.muted }]}>
            Phone Number *
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons name="call-outline" size={20} color={theme.muted} />
            <TextInput
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor={theme.muted}
              keyboardType="phone-pad"
              style={[styles.input, { color: theme.text }]}
            />
          </View>
        </View>

        {/* Address Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Address Details
          </Text>

          <Text style={[styles.label, { color: theme.muted }]}>
            Address Line 1 *
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons name="home-outline" size={20} color={theme.muted} />
            <TextInput
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholder="123 Main Street"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.text }]}
            />
          </View>

          <Text style={[styles.label, { color: theme.muted }]}>
            Address Line 2 (Optional)
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Ionicons name="home-outline" size={20} color={theme.muted} />
            <TextInput
              value={addressLine2}
              onChangeText={setAddressLine2}
              placeholder="Apt, Suite, Unit"
              placeholderTextColor={theme.muted}
              style={[styles.input, { color: theme.text }]}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.muted }]}>City *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="New York"
                  placeholderTextColor={theme.muted}
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>

            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.muted }]}>
                State *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TextInput
                  value={state}
                  onChangeText={setState}
                  placeholder="NY"
                  placeholderTextColor={theme.muted}
                  style={[styles.input, { color: theme.text }]}
                  autoCapitalize="characters"
                  maxLength={2}
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.muted }]}>
                ZIP Code *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TextInput
                  value={zipCode}
                  onChangeText={setZipCode}
                  placeholder="10001"
                  placeholderTextColor={theme.muted}
                  keyboardType="numeric"
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>

            <View style={styles.halfWidth}>
              <Text style={[styles.label, { color: theme.muted }]}>
                Country *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TextInput
                  value={country}
                  onChangeText={setCountry}
                  placeholder="USA"
                  placeholderTextColor={theme.muted}
                  style={[styles.input, { color: theme.text }]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Default Address */}
        <TouchableOpacity
          style={[
            styles.defaultOption,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
          onPress={() => setIsDefault(!isDefault)}
          activeOpacity={0.7}
        >
          <View style={styles.defaultOptionLeft}>
            <Ionicons
              name="checkmark-circle"
              size={24}
              color={isDefault ? theme.accent : theme.muted}
            />
            <View>
              <Text style={[styles.defaultTitle, { color: theme.text }]}>
                Set as Default Address
              </Text>
              <Text style={[styles.defaultSubtitle, { color: theme.muted }]}>
                Use this address for checkouts
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.accent }]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>
                {isEditing ? "Update Address" : "Save Address"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  labelButtons: {
    flexDirection: "row",
    gap: 12,
  },
  labelButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  labelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  defaultOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  defaultOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  defaultTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  defaultSubtitle: {
    fontSize: 13,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    gap: 8,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
