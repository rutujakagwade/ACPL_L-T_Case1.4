// app/Admin/MemberProfile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMemberProfile, addBalance } from "../../lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

type Member = {
  _id: string;
  name: string;
  email: string;
  status: string;
  role?: string;
  balance?: number;
};

export default function MemberProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch member profile on mount or id change
  useEffect(() => {
    const fetchData = async () => {
      console.log("🔄 fetchData triggered, id:", id);
      if (!id) return;

      try {
        // Get role and token from AsyncStorage
        const role = await AsyncStorage.getItem("role");
        const token =
          role === "admin"
            ? await AsyncStorage.getItem("adminToken")
            : await AsyncStorage.getItem("userToken");

        console.log("🚀 Role from AsyncStorage:", role);
        console.log("🚀 Token from AsyncStorage:", token);

        if (!token) {
          Alert.alert("Error", "Token missing or expired");
          return;
        }

        // Fetch member data from backend
        const memberData: Member = await getMemberProfile(id, token);
        console.log("✅ Member data received:", memberData);

        setMember(memberData);
        setBalance(memberData.balance ?? 0);
      } catch (err: any) {
        console.error("❌ Failed to fetch member profile:", err);
        Alert.alert("Error", err.message || "Failed to fetch member profile");
      }
    };

    fetchData();
  }, [id]);

  // Add balance
  const handleAddBalance = async () => {
    if (!amount) return Alert.alert("Error", "Enter an amount");

    try {
      setLoading(true);

      const role = await AsyncStorage.getItem("role");
      const token =
        role === "admin"
          ? await AsyncStorage.getItem("adminToken")
          : await AsyncStorage.getItem("userToken");

      if (!token) return Alert.alert("Error", "Token missing");

      const res = await addBalance(id!, Number(amount), token);

      if (res.balanceAmount !== undefined) {
        setBalance(res.balanceAmount);
        Alert.alert("✅ Success", `Balance updated: Rs. ${res.balanceAmount}`);
        if (member) setMember({ ...member, balance: res.balanceAmount });
      } else {
        Alert.alert("❌ Error", res.message || "Failed to update balance");
      }

      setAmount("");
      setModalVisible(false);
    } catch (err) {
      console.error("❌ addBalance error:", err);
      Alert.alert("❌ Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!member)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading member profile...</Text>
      </View>
    );

  return (
    <ScrollView className="flex-1 bg-white ">
      {/* Header */}

      <View className="flex-row items-center pt-16 bg-yellow-300 py-4 px-3 rounded-b-xl">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={20} color="black" />
          <Text className="text-2xl p-3 font-bold">{member.name}</Text>
        </TouchableOpacity>

      </View>
      <View >
         <View className="pt-5 p-5">
          
          <Text className="text-gray-600">{member.email}</Text>
          <Text
            className={`font-semibold ${
              member.status === "active"
                ? "text-green-600"
                : member.status === "pending"
                ? "text-orange-600"
                : "text-red-600"
            } capitalize`}
          >
            {member.status}
          </Text>
        </View>
      </View>

      {/* Balance + Add */}
      <View className="flex-row justify-between mx-4 mt-4">
        <View className="flex-1 bg-white rounded-lg shadow p-3 mr-2">
          <Text className="text-gray-600">Current Balance:</Text>
          <Text className="font-bold mt-1">Rs. {balance}</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-yellow-300 rounded-lg px-5 justify-center items-center"
        >
          <Text className="font-semibold">+ Add Balance</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-4/5 p-6 shadow-lg">
            <Text className="text-lg font-bold mb-4 text-center">Enter Amount</Text>
            <TextInput
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddBalance}
                disabled={loading}
                className="bg-yellow-300 rounded-lg px-4 py-2"
              >
                <Text className="font-semibold">{loading ? "..." : "Add"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}