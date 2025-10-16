// // BulkApproval.tsx
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Checkbox from "expo-checkbox";
// import { Link, useRouter } from "expo-router";

// export default function BulkApproval() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const [selected, setSelected] = useState<number[]>([]);

//   const approvals = [
//     { id: 1, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
//     { id: 2, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
//     { id: 3, purpose: "Purpose", date: "4th September 2025", submittedBy: "User", amount: "Rs. 30" },
//   ];

//   const toggleSelect = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   return (
//     <View className="flex-1 bg-gray-100" style={{ paddingTop: insets.top }}>
//       {/* Header */}
//       <View className="bg-[#FCD96F] px-4 py-3 flex-row items-center justify-between">
//         <View className="flex-row items-center">
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={22} color="black" />
//           </TouchableOpacity>
//           <Text className="ml-3 font-bold text-lg text-black">Pending Approvals</Text>
//         </View>
//         <TouchableOpacity>
//           <Ionicons name="filter-outline" size={22} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Scrollable List */}
//       <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
//         {approvals.map((item) => (
//           <View
//             key={item.id}
//             className="bg-white rounded-xl shadow-sm p-4 mx-4 mt-4 flex-row"
//           >
//             {/* Checkbox */}
//             <TouchableOpacity
//               onPress={() => toggleSelect(item.id)}
//               className="justify-center mr-3"
//             >
//               <Checkbox
//                 value={selected.includes(item.id)}
//                 onValueChange={() => toggleSelect(item.id)}
//                 color={selected.includes(item.id) ? "#000" : undefined}
//               />
//             </TouchableOpacity>

//             {/* Approval Card */}
//             <View className="flex-1">
//               <View className="flex-row justify-between">
//                 <View>
//                   <Text className="text-yellow-600 font-medium">Expense Type</Text>
//                   {/* Navigate to details on tap */}
//                   <Link href="/Admin/ExpenseDetails" asChild>
//                     <TouchableOpacity>
//                       <Text className="text-black font-bold underline">{item.purpose}</Text>
//                     </TouchableOpacity>
//                   </Link>
//                   <Text className="text-gray-600 text-sm mt-1">{item.date}</Text>
//                   <Text className="text-gray-600 text-sm mt-1">
//                     Submitted By: {item.submittedBy}
//                   </Text>
//                 </View>
//                 <Text className="font-bold text-black">{item.amount}</Text>
//               </View>

//               {/* Approve / Deny */}
//               <View className="flex-row mt-3 space-x-3">
//                 <TouchableOpacity className="flex-row items-center bg-black px-4 py-2 rounded-lg flex-1 justify-center">
//                   <Ionicons name="checkmark" size={16} color="white" />
//                   <Text className="text-white font-semibold text-sm ml-2">Approve</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity className="flex-row items-center border border-gray-400 px-4 py-2 rounded-lg flex-1 justify-center">
//                   <Ionicons name="close" size={16} color="black" />
//                   <Text className="text-black font-semibold text-sm ml-2">Deny</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Approve All / Deny All */}
//       <View
//         className="absolute left-0 right-0 flex-row px-4 space-x-3 bg-white pt-3"
//         style={{ bottom: insets.bottom + 10 }}
//       >
//         <TouchableOpacity className="flex-1 bg-black py-3 rounded-lg items-center">
//           <Text className="text-white font-semibold">Approve All</Text>
//         </TouchableOpacity>
//         <TouchableOpacity className="flex-1 border border-gray-400 py-3 rounded-lg items-center">
//           <Text className="text-black font-semibold">Deny All</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAllExpenses,
  bulkUpdateExpenses,
} from "../../lib/api";

type Expense = {
  _id: string;
  member: {
    _id: string;
    name: string;
    email: string;
  };
  type: "fuel" | "food" | "accommodation" | "parking" | "miscellaneous";
  amount: number;
  description?: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "rejected";
};

const BulkApproval: React.FC = () => {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized");

      const data = await getAllExpenses(token, "pending");
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
      setSelectedIds([]); // start with none selected
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleBulkUpdate = async (status: "approved" | "rejected") => {
    if (selectedIds.length === 0)
      return Alert.alert("Please select at least one expense");

    try {
      const token = await AsyncStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized");

      await bulkUpdateExpenses(selectedIds, status, token);
      Alert.alert("Success", "Expenses updated successfully");
      fetchExpenses();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update status");
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#FFD700"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );
  }

  return (
    <ScrollView>
      {/* Header */}
      <View className="bg-yellow-400 p-5 flex-row items-center shadow-md">
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => router.push("/Admin/(tabs)/home")}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text className="ml-3 text-2xl font-bold pt-16 text-black">
          Bulk Approval
        </Text>
      </View>

      {/* Bulk Actions */}
      {expenses.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 16 }}>
          <TouchableOpacity
            onPress={() => handleBulkUpdate("approved")}
            style={{
              backgroundColor: "black",
              padding: 12,
              borderRadius: 4,
              marginRight: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Approve Selected
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBulkUpdate("rejected")}
            style={{
              backgroundColor: "grey",
              padding: 12,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Reject Selected
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expenses list */}
      {expenses.map((exp) => (
        <View
          key={exp._id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            padding: 12,
            marginBottom: 8,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "#ccc",
          }}
        >
          {/* Checkbox with checkmark icon */}
          <TouchableOpacity
            onPress={() => toggleSelect(exp._id)}
            style={{
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              borderWidth: 1,
              borderColor: "#000",
              borderRadius: 4,
            }}
          >
            {selectedIds.includes(exp._id) && (
              <Ionicons name="checkmark" size={18} color="black" />
            )}
          </TouchableOpacity>

          {/* Expense details */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {exp.type}
            </Text>
            <Text>Amount: ₹{exp.amount}</Text>
            <Text>Description: {exp.description || "-"}</Text>
            <Text>
              Submitted by: {exp.member.name} ({exp.member.email})
            </Text>
            <Text>Status: {exp.status}</Text>
          </View>
        </View>
      ))}

      {expenses.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 32, color: "#666" }}>
          No pending expenses
        </Text>
      )}
    </ScrollView>
  );
};

export default BulkApproval;
