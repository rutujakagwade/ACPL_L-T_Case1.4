// JourneyDetails.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function JourneyDetails() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  return (
    <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="bg-[#FBD971] flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={22} color="black" />
          </TouchableOpacity>
          <Text className="ml-3 font-bold text-lg text-black">
            Your Journeys
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/User/newjourney")}>
          <Ionicons name="add-circle-outline" size={26} color="black" />
        </TouchableOpacity>
      </View>

      {/* Journeys List */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4 pt-5"
      >
        {/* Journey Card */}
        <View className="bg-white rounded-lg shadow-md shadow-black/20 p-4 mb-5">
          <Text className="font-bold text-base text-black">Purpose</Text>
          <Text className="text-gray-500 text-sm">4th September 2025</Text>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="self-end mt-2 bg-gray-900 px-4 py-1 rounded-full"
          >
            <Text className="text-white font-semibold text-sm">
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Journey Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white w-full rounded-xl p-5 shadow-lg">
            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-3 right-3"
            >
              <Entypo name="cross" size={22} color="black" />
            </TouchableOpacity>

            <Text className="font-bold text-base text-black mb-1">
              Purpose
            </Text>
            <Text className="text-gray-500 text-sm mb-3">
              4th September 2025
            </Text>

            <Text className="font-semibold text-black mb-3">20 km</Text>

            {/* Start / End Location */}
            <View className="mb-2">
              <View className="flex-row items-center mb-1">
                <Ionicons
                  name="navigate-circle-outline"
                  size={18}
                  color="black"
                />
                <Text className="ml-2 text-black">Start Location</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={18} color="black" />
                <Text className="ml-2 text-black">End Location</Text>
              </View>
            </View>

            {/* Edit Expenses Button */}
            <TouchableOpacity className="border border-gray-400 rounded-full px-3 py-1 mb-3 self-start flex-row items-center">
              <MaterialIcons name="edit" size={16} color="black" />
              <Text className="ml-1 text-black text-sm">Edit Expenses</Text>
            </TouchableOpacity>

            {/* Expense Info */}
            <View className="mb-3">
              <Text className="text-black">
                Total Expense:{" "}
                <Text className="font-bold">Rs. 20</Text>
              </Text>
              <Text className="text-black">
                Expense Type: <Text className="text-gray-700">Food</Text>
              </Text>
              <Text className="text-black">Description:</Text>
              <Text className="text-black mt-2">Bills:</Text>
              <View className="flex-row mt-2">
                <View className="w-14 h-14 bg-[#FBD971] rounded-md mr-3" />
                <View className="w-14 h-14 bg-[#FBD971] rounded-md" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}