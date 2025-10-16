// ExpenseDetails.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Entypo } from "@expo/vector-icons";

export default function ExpenseDetails() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Pending");

  const tabs = ["All", "Pending", "Approved", "Rejected"];

  return (
    <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="bg-[#FBD971] flex-row items-center px-4 py-3">
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 font-bold text-lg text-black">Expenses</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row justify-between px-4 py-3 bg-white">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            className={`px-4 py-1 rounded-full ${
              selectedTab === tab
                ? "bg-[#FBD971]"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                selectedTab === tab ? "text-black" : "text-gray-600"
              }`}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expense List */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-4 pt-4"
      >
        {/* Expense Card */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-white rounded-lg shadow-md shadow-black/20 p-4 mb-5"
        >
          <Text className="font-bold text-base text-black">Purpose</Text>
          <Text className="text-gray-500 text-sm">4th September 2025</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="navigate-circle-outline" size={18} color="black" />
            <Text className="ml-2 text-black">Start Location</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={18} color="black" />
            <Text className="ml-2 text-black">End Location</Text>
          </View>
          <Text className="mt-2 text-right font-bold text-black">Rs. 30</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Expense Modal */}
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

            <Text className="font-bold text-base text-black mb-1">Purpose</Text>
            <Text className="text-gray-500 text-sm mb-3">
              4th September 2025
            </Text>

            <Text className="font-semibold text-black mb-3">20 km</Text>

            {/* Start / End Location */}
            <View className="mb-3">
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

            {/* Expense Info */}
            <View className="mb-3">
              <Text className="text-black">
                Total Expense: <Text className="font-bold">$20</Text>
              </Text>
              <Text className="text-black">
                Expense Type: <Text className="text-gray-700">Food</Text>
              </Text>
              <Text className="text-black">Description:</Text>
              <Text className="text-black mt-2">Receipts:</Text>
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