import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeniedApprovals } from '../../lib/api'; 

// ✅ Define TypeScript interface for Approval
interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Approval {
  _id: string;
  member: Member;
  purpose: string;
  amount: number;
  status: string;
  submittedAt: string;
}

const RejectedExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDenied = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const denied = await getDeniedApprovals(token);
        setExpenses(denied);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDenied();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (expenses.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No rejected expenses found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-yellow-200 p-4 flex-row items-center">
        <TouchableOpacity>
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold ml-4">Rejected Expenses</Text>
      </View>

      {/* Expense List */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {expenses.map((expense) => (
          <View
            key={expense._id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <Text className="text-yellow-500 text-xs mb-1">Expense Type</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-base">{expense.purpose}</Text>
              <Text className="font-bold text-base">Rs. {expense.amount}</Text>
            </View>
            <Text className="text-gray-500 text-sm">
              {new Date(expense.submittedAt).toLocaleDateString()}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              Submitted By: {expense.member?.name || expense.member?.email}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default RejectedExpenses;
