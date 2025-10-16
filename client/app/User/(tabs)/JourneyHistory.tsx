// JourneyHistory.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { Ionicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const JourneyHistory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<any>(null);

  const journeys = [
    {
      id: 1,
      purpose: "Client Meeting",
      date: "4th September 2025",
      distance: "20 km",
      start: "Office",
      end: "Client Site",
    },
    {
      id: 2,
      purpose: "Product Delivery",
      date: "5th September 2025",
      distance: "15 km",
      start: "Warehouse",
      end: "Retail Store",
    },
    {
      id: 3,
      purpose: "Site Visit",
      date: "6th September 2025",
      distance: "30 km",
      start: "Office",
      end: "Construction Site",
    },
    {
      id: 4,
      purpose: "Training Session",
      date: "7th September 2025",
      distance: "10 km",
      start: "Home",
      end: "Training Center",
    },
  ];

  const router = useRouter();

  const openModal = (journey: any) => {
    setSelectedJourney(journey);
    setModalVisible(true);
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 pt-16 flex-row items-center justify-between shadow-md">
        <Text className="text-lg font-bold">Your Journeys</Text>
        <TouchableOpacity onPress={() => router.push("/User/newjourney")}>
          <Ionicons name="add-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Journey Cards */}
      <ScrollView className="p-4">
        {journeys.map((journey) => (
          <View
            key={journey.id}
            className="bg-white p-4 mb-4 rounded-2xl shadow-md"
          >
            {/* Card Header */}
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-base">{journey.purpose}</Text>
              <TouchableOpacity
                className="bg-black px-3 py-1 rounded-lg"
                onPress={() => openModal(journey)}
              >
                <Text className="text-white text-xs font-medium">View Details</Text>
              </TouchableOpacity>
            </View>

            {/* Date & Distance */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-sm text-gray-600">{journey.date}</Text>
              <Text className="text-sm text-gray-600">{journey.distance}</Text>
            </View>

            {/* Locations */}
            <View className="mt-3 space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#3b82f6" />
                <Text className="ml-2 text-sm font-medium">{journey.start}</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#ef4444" />
                <Text className="ml-2 text-sm font-medium">{journey.end}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      {selectedJourney && (
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
                {selectedJourney.purpose}
              </Text>
              <Text className="text-gray-500 text-sm mb-3">
                {selectedJourney.date}
              </Text>

              <Text className="font-semibold text-black mb-3">
                {selectedJourney.distance}
              </Text>

              {/* Start / End Location */}
              <View className="mb-2">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="navigate-circle-outline" size={18} color="black" />
                  <Text className="ml-2 text-black">Start: {selectedJourney.start}</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={18} color="black" />
                  <Text className="ml-2 text-black">End: {selectedJourney.end}</Text>
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
                  Total Expense: <Text className="font-bold">Rs. 20</Text>
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
      )}
    </View>
  );
};

export default JourneyHistory;
