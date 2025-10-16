import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateAdminProfile, getAdminProfile } from "../../../lib/api";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const AVATAR_STYLES = ["identicon", "adventurer", "bottts", "pixel-art", "thumbs"];

const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("identicon");
  const [seed, setSeed] = useState<string>("admin123");
  const [avatar, setAvatar] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // fetch profile from backend
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;

        const data = await getAdminProfile(token);
        const profile = (data as any)?.admin || data || {};

        const style = profile.style || "identicon";
        const seedVal = profile.seed || "admin123";

        setName(profile.name || "");
        setEmail(profile.email || "");
        setSelectedStyle(style);
        setSeed(seedVal);

        setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);
      } catch (err) {
        console.error("Failed to load profile:", err);
        Alert.alert("Error", "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // update avatar when style/seed changes
  useEffect(() => {
    setAvatar(`https://api.dicebear.com/7.x/${selectedStyle}/png?seed=${encodeURIComponent(seed)}`);
  }, [selectedStyle, seed]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Please login again.");
        return;
      }

      await updateAdminProfile({ name, avatar, seed, style: selectedStyle }, token);

      // re-fetch (to stay in sync with backend)
      const updatedData = await getAdminProfile(token);
      const profile = (updatedData as any)?.admin || updatedData || {};

      const style = profile.style || selectedStyle;
      const seedVal = profile.seed || seed;

      setName(profile.name || "");
      setEmail(profile.email || "");
      setSelectedStyle(style);
      setSeed(seedVal);
      setAvatar(profile.avatar || `https://api.dicebear.com/7.x/${style}/png?seed=${encodeURIComponent(seedVal)}`);

      Alert.alert("Success", "Profile updated successfully!");
      setShowModal(false);
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }
   const handleLogout = async () => {
    await AsyncStorage.removeItem("token"); // remove auth token
    router.replace("/login"); // navigate to login
  };


  return (
    <ScrollView className="flex-1 bg-yellow-200 pt-24">
      <View className="p-4 items-center">
        {/* Avatar */}
        {avatar ? (
          <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full bg-gray-400" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-400 justify-center items-center">
            <Text className="text-white text-2xl">👤</Text>
          </View>
        )}

        {/* Name + Edit Icon */}
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold mr-2">{name}</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <Ionicons name="create-outline" size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text className="text-sm text-gray-600">{email}</Text>
         <TouchableOpacity
          onPress={handleLogout}
          className="mt-6 bg-red-500 px-6 py-2 rounded-lg"
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white w-full rounded-2xl p-6 shadow-lg">
            {/* Avatar Preview */}
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-24 h-24 rounded-full self-center mb-4" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-400 self-center justify-center items-center mb-4">
                <Text className="text-white text-2xl">👤</Text>
              </View>
            )}

            {/* Avatar Style Picker */}
            <Text className="mt-2 font-semibold text-gray-700">Select Avatar Style</Text>
            <View className="border border-gray-300 rounded-lg mt-2 mb-4 overflow-hidden">
              <Picker selectedValue={selectedStyle} onValueChange={(value) => setSelectedStyle(value as string)}>
                {AVATAR_STYLES.map((style) => (
                  <Picker.Item key={style} label={style} value={style} />
                ))}
              </Picker>
            </View>

            {/* Seed Input */}
            <Text className="font-semibold text-gray-700">Avatar Seed</Text>
            <TextInput
              value={seed}
              onChangeText={setSeed}
              placeholder="Enter seed"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-4"
            />

            {/* Name Input */}
            <Text className="font-semibold text-gray-700">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              className="border border-gray-300 rounded-lg px-3 py-2 mt-2 mb-6"
            />

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg">
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveProfile} className="px-6 py-2 bg-black rounded-lg" disabled={saving}>
                <Text className="text-white font-bold">{saving ? "Saving..." : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;