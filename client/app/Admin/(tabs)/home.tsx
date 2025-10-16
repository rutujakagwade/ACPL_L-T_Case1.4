import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function AdminDashboard() {
  const router = useRouter();
  const [totalExpenses, setTotalExpenses] = useState("0");

  useEffect(() => {
    const fetchTotalExpenses = async () => {
      try {
        // Get stored admin token
        const token = await AsyncStorage.getItem("adminToken");
        if (!token) {
          console.error("No admin token found");
          return;
        }

        const res = await axios.get(
          "http://168.231.123.241:5000/api/expenses/admin-total", // your backend API
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("Admin total expenses API response:", res.data);
        setTotalExpenses(res.data.totalAmount?.toString() || "0");
      } catch (error) {
        console.error("Error fetching total expenses:", error);
      }
    };

    fetchTotalExpenses();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header */}
        <View className="bg-yellow-400 p-5 rounded-b-xl h-52">
          <View className="flex-row justify-between items-center pt-16">
            <Text className="text-2xl font-bold text-black">Welcome Admin!</Text>
          </View>
          <View className="flex-1 justify-end items-end">
            <TouchableOpacity className="bg-gray-800 px-3 py-3 rounded-md">
              <Text className="text-white text-xs">This Month ▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row flex-wrap justify-between px-4 mt-4">
          {[
            {
              value: totalExpenses,
              label: "Total Pending Expenses",
              icon: "checkmark-circle",
              color: "green"
            },
            {
              value: "1226",
              label: "Total Distance",
              icon: "checkmark-circle",
              color: "green"
            },
            {
              value: "09",
              label: "Efficiency Rate",
              icon: "checkmark-circle",
              color: "green"
            },
            {
              value: "11",
              label: "Compliance Rate",
              icon: "close-circle",
              color: "red"
            }
          ].map((item, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-5 shadow-md mb-3 w-[48%]"
            >
              <Text className="text-2xl font-bold text-black">{item.value}</Text>
              <Text className="text-gray-500 text-xs mt-1">{item.label}</Text>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-4 mt-3">
          <Text className="text-base font-bold mb-3">Quick Actions</Text>
          <View className="flex-row gap-5">
            <Link href="/Admin/AddMember" asChild>
              <TouchableOpacity className="bg-yellow-400 flex-row items-center justify-center py-6 px-3 rounded-2xl shadow-md flex-1">
                <Ionicons name="add-circle" size={26} color="black" />
                <Text className="ml-2 text-black font-semibold">Add A Member</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity
              className="bg-yellow-400 flex-row items-center justify-center py-6 px-3 rounded-2xl shadow-md flex-1"
              onPress={() => router.push("/Admin/BulkApproval")}
            >
              <MaterialIcons name="description" size={26} color="black" />
              <MaterialIcons
                name="done"
                size={18}
                color="black"
                style={{ marginLeft: -10, marginTop: -10 }}
              />
              <Text className="ml-2 text-black font-semibold">Bulk Approval</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mt-6 mb-16">
          <Text className="text-base font-bold mb-3">Recent Activity</Text>

          <View className="flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm mb-2">
            <View className="flex-row items-center">
              <MaterialIcons name="description" size={26} color="black" />
              <Text className="ml-2 text-black">4 Expenses Approved</Text>
            </View>
            <Text className="text-gray-400 text-xs">1 hour ago</Text>
          </View>

          <View className="flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm">
            <View className="flex-row items-center">
              <MaterialIcons name="description" size={26} color="black" />
              <Text className="ml-2 text-black">10 New Expense Submissions</Text>
            </View>
            <Text className="text-gray-400 text-xs">1 hour ago</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
