
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addExpense } from "../../lib/api";

const ExpenseForm = () => {
  const [selectedJourney, setSelectedJourney] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptFile, setReceiptFile] = useState<{ uri: string; name: string; type: string } | null>(null);

  const journeys = [
    "Business Trip - Office to Client Site",
    "Client Visit - Project Discussion",
    "Training - React Native Workshop",
    "Personal - Travel",
  ];

  const expenseTypes = ["fuel", "accommodation", "food", "parking", "miscellaneous"];
  const router = useRouter();

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setReceiptFile({ uri: file.uri, name: file.name ?? "receipt", type: file.mimeType ?? "application/octet-stream" });
      }
    } catch {
      Alert.alert("Error", "File picker failed");
    }
  };

  const toggleTypeSelection = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    if (!amount || selectedTypes.length === 0 || !receiptFile || !selectedJourney) {
      return Alert.alert("Error", "Fill all fields, select journey, types & upload receipt");
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Unauthorized");

      const formData = new FormData();
      selectedTypes.forEach(t => formData.append("type[]", t)); // Multi type
      formData.append("journey", selectedJourney); // Journey
      formData.append("amount", amount);
      formData.append("description", description || "");
      formData.append("receipt", {
        uri: receiptFile.uri,
        name: receiptFile.name,
        type: receiptFile.type,
      } as any);

      const res = await addExpense(formData, token);
      Alert.alert("Success", res.message || "Expense submitted!");
      router.push("/User/Expenses");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add expense");
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-4">

        {/* Journey Dropdown */}
        <Text>Journey</Text>
        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          className="border p-2 rounded mb-4 flex-row justify-between items-center"
        >
          <Text>{selectedJourney || "Select Journey"}</Text>
          <Text style={{ fontSize: 18 }}>{dropdownOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View className="border rounded mb-4 bg-white">
            {journeys.map((journey, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedJourney(journey);
                  setDropdownOpen(false);
                }}
                className="p-2 border-b border-gray-200"
              >
                <Text>{journey}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Expense Type Multi-select */}
        <Text>Expense Types</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {expenseTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => toggleTypeSelection(type)}
              className={`px-4 py-2 rounded-lg border ${selectedTypes.includes(type) ? "bg-yellow-300" : "bg-white"}`}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text>Amount</Text>
        <TextInput
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          className="border p-2 rounded mb-4"
        />

        <Text>Description</Text>
        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          className="border p-2 rounded mb-4"
        />

        <Text>Receipt</Text>
        <TouchableOpacity onPress={pickFile} className="border p-4 rounded items-center mb-4">
          <Text>{receiptFile ? receiptFile.name : "Pick file"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} className="bg-yellow-300 py-3 rounded mb-2">
          <Text className="text-center font-bold">Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ExpenseForm;
