import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function AddMember() {
  const router = useRouter();
  const [role, setRole] = useState(""); // "admin" or "user"
  const [showDropdown, setShowDropdown] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const roleOptions = ["admin", "user"]; // dropdown options

  const handleAddMember = async () => {
    console.log("👉 Add Member pressed");

    if (!role || !email || !password || !name) {
      console.log("⚠️ Missing fields:", { role, name, email, password });
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      const token = await AsyncStorage.getItem("token");
      console.log("🔑 Retrieved token:", token);

      if (!token) {
        return Alert.alert("Error", "Admin not logged in (no token found)");
      }

      const payload = { name, email, password, role };
      console.log("📨 Sending request:", payload);

      const res = await fetch(
        "http://168.231.123.241:5000/api/admin/members/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("📦 Response:", data, "Status:", res.status);

      if (res.ok) {
        Alert.alert(
          "✅ Success",
          `Member invited!\nEmail: ${email}\nRole: ${role}`
        );
        setEmail("");
        setPassword("");
        setRole("");
        setName("");
      } else {
        Alert.alert("❌ Error", data.message || "Failed to add member");
      }
    } catch (err) {
      console.log("❌ Add member error:", err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <ScrollView>
      {/* Header */}
      <View className="bg-yellow-400 p-5 flex-row items-center shadow-md">
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => router.push("/Admin/(tabs)/memberList")}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 text-2xl font-bold pt-16 text-black">
          Add New Member
        </Text>
      </View>

      <View className="p-6 space-y-5">
        {/* Role Dropdown */}
        <TouchableOpacity
          onPress={() => setShowDropdown(true)}
          className="mt-5 border-gray-300 rounded-2xl px-4 py-3 flex-row justify-between items-center bg-white"
        >
          <Text className={`text-black ${role ? "" : "text-gray-400"}`}>
            {role ? role : "Role *"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="black" />
        </TouchableOpacity>

        {/* Dropdown Modal */}
        <Modal visible={showDropdown} transparent animationType="fade">
          <TouchableOpacity
            className="flex-1 bg-black/30 justify-center"
            onPress={() => setShowDropdown(false)}
          >
            <View className="bg-white mx-8 rounded-2xl p-4 shadow-lg">
              <FlatList
                data={roleOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="py-3 border-b border-gray-200"
                    onPress={() => {
                      setRole(item);
                      setShowDropdown(false);
                    }}
                  >
                    <Text className="text-black text-center font-medium">
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Name */}
        <TextInput
          placeholder="Name *"
          className="mt-5 border-gray-300 rounded-2xl px-4 py-3 text-black bg-white"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <TextInput
          placeholder="Email *"
          className="mt-5 border-gray-300 rounded-2xl px-4 py-3 text-black bg-white"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <TextInput
          placeholder="Password *"
          className="mt-5 border-gray-300 rounded-2xl px-4 py-3 text-black bg-white"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Add Member Button */}
        <TouchableOpacity
          onPress={handleAddMember}
          className="bg-gray-900 mt-5 py-4 rounded-2xl shadow-md"
        >
          <Text className="text-center text-white font-bold text-lg">
            Add Member
          </Text>
        </TouchableOpacity>

        {/* Cancel Button */}
    <TouchableOpacity
      onPress={() => {
        setEmail("");
        setPassword("");
        setRole("");
        setName("");
        router.push("/Admin/(tabs)/home"); // navigate to dashboard
      }}
      className="border mt-5 border-gray-400 py-4 rounded-2xl"
    >
      <Text className="text-center text-black font-bold text-lg">Cancel</Text>
    </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
