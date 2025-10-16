import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline, LatLng } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateJourney } from "../../lib/api";
import { useRouter, useLocalSearchParams } from "expo-router"; // ✅ useLocalSearchParams

export default function JourneyTracking() {
  const router = useRouter();
  const params = useLocalSearchParams(); // ✅ get params safely
  const journey = params.journey ? JSON.parse(params.journey as string) : null;

  const [currentLocation, setCurrentLocation] = useState<LatLng>(
    journey?.startLocation || { latitude: 18.5204, longitude: 73.8567 }
  );
  const [distance, setDistance] = useState("0 km");
  const [duration, setDuration] = useState("0 min");
  const [currentIndex, setCurrentIndex] = useState(0);

  const mapRef = useRef<MapView>(null);
  const routeCoords: LatLng[] = journey?.routeCoords || [];

  // Animate marker along the route
  useEffect(() => {
    if (!routeCoords || routeCoords.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= routeCoords.length - 1) {
          clearInterval(interval);
          return prev;
        }
        setCurrentLocation(routeCoords[prev]);
        setDistance(`${Math.round((prev / routeCoords.length) * 20)} km`);
        setDuration(`${Math.round((prev / routeCoords.length) * 30)} min`);
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [routeCoords]);

  const handleEndJourney = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await updateJourney(
        journey._id,
        { status: "completed", success: true, endDate: new Date() }
      );
      if (res.error) return Alert.alert(res.error);
      router.replace({
        pathname: "/User/SuccessScreen",
        params: { journey: JSON.stringify(res) },
      });
    } catch {
      Alert.alert("Error", "Failed to end journey");
    }
  };

  if (!journey) return <Text>Journey data not found</Text>;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        followsUserLocation
      >
        <Marker coordinate={currentLocation} title="You" pinColor="blue" />
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />}
        {journey.startLocation && <Marker coordinate={journey.startLocation} title="Start" pinColor="green" />}
        {journey.endLocation && <Marker coordinate={journey.endLocation} title="End" pinColor="red" />}
      </MapView>

      <View style={{ padding: 20, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{duration} • {distance}</Text>

        <TouchableOpacity onPress={handleEndJourney} style={{ backgroundColor: "red", padding: 14, borderRadius: 6, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>End Journey</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ backgroundColor: "gray", padding: 14, borderRadius: 6, marginTop: 10 }}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
