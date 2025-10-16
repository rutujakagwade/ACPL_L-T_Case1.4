import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { login } from "../lib/api";
import { storeTokens, clearTokens } from "../lib/session";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 🧹 Clear any old login tokens when login screen is opened
  useEffect(() => {
    const clearOldSessions = async () => {
      try {
        await clearTokens(); // from SecureStore
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("role");
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("adminToken");
        console.log("🧹 Cleared old tokens — user must log in again");
      } catch (err) {
        console.log("Error clearing tokens:", err);
      }
    };
    clearOldSessions();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      const data = await login(email, password);
      console.log("🔹 Login response:", data);

      if (data.token) {
        // Store token
        await storeTokens(data.token, data.token, data.role, data.name);

        // Keep AsyncStorage compatibility
        await AsyncStorage.setItem("token", data.token);
        if (data.role) await AsyncStorage.setItem("role", data.role);

        if (data.role === "admin") {
          await AsyncStorage.setItem("adminToken", data.token);
          router.replace("/Admin/(tabs)/home");
        } else {
          await AsyncStorage.setItem("userToken", data.token);
          router.replace("/User/(tabs)/home");
        }

        Alert.alert("Login Successful", `Welcome ${data.name || "User"}!`);
      } else {
        Alert.alert("Login Failed", "Invalid credentials.");
      }
    } catch (error) {
      console.log("❌ Login error:", error);
      Alert.alert(
        "Login Failed",
        "Could not connect to server. Make sure your backend is running and your IP is correct."
      );
    }
  };

  return (
    <View className="flex-1 bg-white p-6">
      <View className="items-center mt-8">
        <Image
          source={require("../assets/images/1fbef6d60f27e33dbc6815848528bc306351b952.png")}
          className="w-40 h-20"
          resizeMode="contain"
        />
      </View>

      <Text className="text-2xl font-bold text-center mt-6 text-black">
        Login With Us!
      </Text>

      <View className="mt-8">
        <TextInput
          placeholder="Email *"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />
        <TextInput
          placeholder="Password *"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-3 rounded-2xl mt-6"
      >
        <Text className="text-white text-center font-semibold">Login</Text>
      </TouchableOpacity>

      <Text className="text-center text-gray-600 mt-4">
        Don’t Have An Account?{" "}
        <Link href="/register" className="font-semibold text-black">
          Register
        </Link>
      </Text>
    </View>
  );
}