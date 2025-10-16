// PendingScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PendingScreen = () => {
  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 px-4 py-5 flex-row items-center shadow-md rounded-b-3xl">
        <Ionicons name="arrow-back-outline" size={24} color="black" />
        <Text className="ml-3 text-lg font-bold">Add Expense Details</Text>
      </View>

      <ScrollView className="flex-1">
        {/* White Card Modal */}
        <View className="bg-white rounded-t-3xl shadow-lg mt-[-20px] p-6 items-center">
          {/* Drag Handle */}
          <View className="w-14 h-1.5 bg-gray-300 rounded-full mb-6" />

          {/* Success Message */}
          <Text className="text-lg font-bold text-center mb-6">
            Expense Submitted!
          </Text>

          {/* Illustration */}
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/7486/7486740.png",
            }}
            className="w-60 h-40 mb-6"
            resizeMode="contain"
          />

          {/* Status Info */}
          <View className="items-start space-y-3">
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full bg-yellow-400 mr-2" />
              <Text className="text-gray-800">
                Request for Rs. 20 submitted
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-4 h-4 rounded-full border-2 border-yellow-500 mr-2" />
              <Text className="text-gray-800">Pending Approval</Text>
            </View>
          </View>

          {/* Back to Dashboard Button */}
          <TouchableOpacity className="mt-8 border border-gray-500 py-3 px-6 rounded-xl w-full shadow-sm">
            <Link href="/User/(tabs)/home">
            <Text className="text-center text-base font-bold text-gray-900">
              Back To Dashboard
            </Text>
            </Link>
          </TouchableOpacity>
        </View>
      </ScrollView>

     
    </View>
  );
};

export default PendingScreen;