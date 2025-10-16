// screens/MemberList.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getMembers } from "../../../lib/api";
import AddMember from "../AddMember";

export default function MemberList() {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  // Fetch members
const fetchMembers = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    console.log("Token from storage:", token);
    if (!token) throw new Error("Unauthorized");

    const data = await getMembers(token);
    console.log("Members:", data);

    // data is expected as array of members
    setMembers(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Failed to fetch members:", err);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    console.log("🚀 MemberList mounted, fetching members...");
    fetchMembers();
  }, []);

  // Filter members
  const filteredMembers = members.filter((m) => {
    const matchRole =
      filter === "All" ? true : m.role?.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  // Render each member
  const renderMember = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
      }}
      onPress={() =>
        item._id
          ? router.push(`/Admin/MemberProfile?id=${item._id}`)
          : console.log("⚠️ Member ID missing")
      }
    >
      <Ionicons name="person-circle-outline" size={36} color="#444" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {item.name || "Unnamed"}
        </Text>
        <Text style={{ fontSize: 13, color: "#666" }}>{item.email}</Text>
      </View>
      <Text
        style={{
          color:
            item.status?.toLowerCase() === "active"
              ? "green"
              : item.status?.toLowerCase() === "pending"
              ? "orange"
              : "red",
          fontWeight: "600",
        }}
      >
        {item.status || "N/A"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9F9F9" }}>
      {/* Header */}
      <View>
        <Text className="bg-yellow-400 pt-16 p-4 text-2xl font-bold text-black h-32">Member List</Text>
      </View>

   <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    margin: 12,
  }}
>
  {/* Search Bar */}
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      borderRadius: 10,
      paddingHorizontal: 10,
      elevation: 2,
      height: 40,
    }}
  >
    <Ionicons name="search" size={20} color="#888" />
    <TextInput
      placeholder="Search"
      value={search}
      onChangeText={(text) => {
        console.log("🔍 Search input changed:", text);
        setSearch(text);
      }}
      style={{ flex: 1, marginLeft: 8 }}
    />
  </View>

  {/* Plus Icon */}
   <TouchableOpacity
      style={{ marginLeft: 10 }}
      onPress={() => router.push("/Admin/AddMember")}
    >
      <Ionicons name="add-circle-outline" size={30} color="black" />
    </TouchableOpacity>
</View>



      {/* Filter Buttons */}
      <View
        style={{ flexDirection: "row", marginHorizontal: 12, marginBottom: 12 }}
      >
        {["All", "admin", "user"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => {
              console.log("🎯 Filter selected:", f);
              setFilter(f);
            }}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
              backgroundColor: filter === f ? "#F7D774" : "#EAEAEA",
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {f === "All" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Member List */}
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
              No members found.
            </Text>
          }
        />
      )}
    </View>
  );
}
