// screens/journeys/SuccessScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  SuccessScreen: undefined;
  Expenses: undefined;
  Dashboard: undefined;
  ExpenseForm: undefined; // 👈 added this route
};

type Props = NativeStackScreenProps<RootStackParamList, "SuccessScreen">;

export default function SuccessScreen({ navigation }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Image
        source={{ uri: "https://img.icons8.com/color/452/ok--v2.png" }}
        style={{ width: 120, height: 120, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
        Congratulations!
      </Text>
      <Text style={{ marginBottom: 30 }}>Journey Successfully Completed</Text>

      {/* ✅ Fixed: Navigate to ExpenseForm using React Navigation */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ExpenseForm")}
        style={{ backgroundColor: "black", padding: 14, borderRadius: 6, marginBottom: 10 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Add Expenses</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Dashboard")}
        style={{ backgroundColor: "gray", padding: 14, borderRadius: 6 }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Back To Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}
