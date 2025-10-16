// import React, { useEffect, useState } from "react";
// import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getMyExpenses } from "../../../lib/api";
// import { Ionicons, Entypo } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const MyExpenses: React.FC = () => {
//   const [expenses, setExpenses] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");
  

//   const router = useRouter();

//   const fetchExpenses = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized");

//       const data = await getMyExpenses(token);
//       setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Failed to fetch expenses");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   if (loading)
//     return (
//       <ActivityIndicator
//         size="large"
//         color="#FFD700"
//         style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
//       />
//     );

//   const filteredExpenses =
//     filterStatus === "all" ? expenses : expenses.filter((exp) => exp.status === filterStatus);

//   return (
//     <View className="flex-1 bg-gray-100">
//       {/* Header */}
//       <View className="bg-yellow-300 flex-row items-center pt-16 p-4">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="text-black font-bold text-2xl ml-4">Expenses</Text>
//       </View>

//       {/* Filter Buttons */}
//       <View className="flex-row justify-around my-4 px-2 p-3">
//         {["all", "pending", "approved", "rejected"].map((status) => (
//           <TouchableOpacity
//             key={status}
//             onPress={() => setFilterStatus(status as any)}
//             style={{
//               backgroundColor: filterStatus === status ? "#FFD700" : "#fff",
//               paddingVertical: 6,
//               paddingHorizontal: 16,
//               borderRadius: 20,
//               borderWidth: 1,
//               borderColor: filterStatus === status ? "#FFD700" : "#ccc",
//             }}
//           >
//             <Text
//               style={{
//                 color: filterStatus === status ? "black" : "#555",
//                 fontWeight: "bold",
//                 textTransform: "capitalize",
//               }}
//             >
//               {status}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Expenses List */}
//       <ScrollView className="px-4">
//         {filteredExpenses.length === 0 && (
//           <Text className="text-center mt-8 text-gray-500">No expenses found</Text>
//         )}

//         {filteredExpenses.map((exp) => (
//        <View key={exp._id} className="bg-white p-4 mb-3 rounded-lg shadow">
  
//   {/* Top Row: Expense Type + Amount */}
//   <View className="flex-row justify-between items-center">
//     <Text className="font-bold text-lg">
//       {Array.isArray(exp.type) ? exp.type.join(", ") : exp.type}
//     </Text>
//     <Text className="font-bold text-lg">Rs. {exp.amount}</Text>
//   </View>

//   {/* Purpose */}
//   <View className="flex-row justify-between items-center mt-2">
//   <Text className="font-bold text-lg">Purpose</Text>
//  <TouchableOpacity
//   style={{ padding: 4 }}
//   onPress={() => router.push("/User/ExpenseForm")} // navigate to Add Expense page
// >
//   <Entypo name="edit" size={18} color="gray" />
// </TouchableOpacity>
// </View>

// {/* Date */}
// <Text className="mt-1 text-gray-500 text-sm">
//   {new Date(exp.createdAt).toLocaleDateString()}
// </Text>


//   {/* Locations */}
//   <View className="mt-2">
//     <Text className="text-gray-600 text-sm flex-row items-center">
//       <Entypo name="location-pin" size={16} color="gray" /> Start Location
//     </Text>
//     <Text className="text-gray-600 text-sm flex-row items-center">
//       <Entypo name="location-pin" size={16} color="gray" /> End Location
//     </Text>
//   </View>

// </View>

//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// export default MyExpenses;


import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMyExpenses } from "../../../lib/api";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const MyExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const router = useRouter();

  const fetchExpenses = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const data = await getMyExpenses(token);
      // data.expenses should now have journey populated
      setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#FFD700"
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    );

  const filteredExpenses =
    filterStatus === "all" ? expenses : expenses.filter((exp) => exp.status === filterStatus);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-300 flex-row items-center pt-16 p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-black font-bold text-2xl ml-4">Expenses</Text>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row justify-around my-4 px-2 p-3">
        {["all", "pending", "approved", "rejected"].map((status) => (
          <TouchableOpacity
            key={status}
            onPress={() => setFilterStatus(status as any)}
            style={{
              backgroundColor: filterStatus === status ? "#FFD700" : "#fff",
              paddingVertical: 6,
              paddingHorizontal: 16,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: filterStatus === status ? "#FFD700" : "#ccc",
            }}
          >
            <Text
              style={{
                color: filterStatus === status ? "black" : "#555",
                fontWeight: "bold",
                textTransform: "capitalize",
              }}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Expenses List */}
      <ScrollView className="px-4">
        {filteredExpenses.length === 0 && (
          <Text className="text-center mt-8 text-gray-500">No expenses found</Text>
        )}

        {filteredExpenses.map((exp) => (
          <View key={exp._id} className="bg-white p-4 mb-3 rounded-lg shadow">
            {/* Top Row: Expense Type + Amount */}
            <View className="flex-row justify-between items-center">
              <Text className="font-bold text-lg">
                {Array.isArray(exp.type) ? exp.type.join(", ") : exp.type}
              </Text>
              <Text className="font-bold text-lg">Rs. {exp.amount}</Text>
            </View>

            {/* Purpose */}
            <View className="flex-row justify-between items-center mt-2">
              <Text className="font-bold text-lg">
                Purpose: {exp.journey?.purpose || "N/A"}
              </Text>
              <TouchableOpacity
                style={{ padding: 4 }}
                onPress={() => router.push("/User/ExpenseForm")}
              >
                <Entypo name="edit" size={18} color="gray" />
              </TouchableOpacity>
            </View>

            {/* Date */}
            <Text className="mt-1 text-gray-500 text-sm">
              {new Date(exp.createdAt).toLocaleDateString()}
            </Text>

            {/* Locations */}
            <View className="mt-2">
              <Text className="text-gray-600 text-sm flex-row items-center">
                <Entypo name="location-pin" size={16} color="gray" />{" "}
                {exp.journey?.startLocation
                  ? `${exp.journey.startLocation.latitude}, ${exp.journey.startLocation.longitude}`
                  : "N/A"}
              </Text>
              <Text className="text-gray-600 text-sm flex-row items-center">
                <Entypo name="location-pin" size={16} color="gray" />{" "}
                {exp.journey?.endLocation
                  ? `${exp.journey.endLocation.latitude}, ${exp.journey.endLocation.longitude}`
                  : "N/A"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default MyExpenses;

