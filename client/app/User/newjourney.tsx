import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, UrlTile, LatLng } from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { createJourney, updateJourney } from "../../lib/api";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  NewJourney: undefined;
  JourneyTracking: { journey: any };
};

type Props = NativeStackScreenProps<RootStackParamList, "NewJourney">;

export default function NewJourney({ navigation }: Props) {
  const router = useRouter();
  const [startLocation, setStartLocation] = useState<LatLng | null>(null);
  const [currentJourneyId, setCurrentJourneyId] = useState<string | null>(null);
  const [endLocation, setEndLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [userPath, setUserPath] = useState<LatLng[]>([]); // ✅ track actual user path
  const [totalDistance, setTotalDistance] = useState(0); // ✅ actual traveled distance
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [region, setRegion] = useState<any>(null);
  const [journeyStartedAt, setJourneyStartedAt] = useState<number | null>(null);

  const mapRef = useRef<MapView>(null);

  const OPENROUTE_API_KEY =
    "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjBlYzA3MmE5N2RkYjQ2OWQ4YzZjYjE5ZDdjMjY2OWM1IiwiaCI6Im11cm11cjY0In0=";

  // Get user location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Allow location access to pick journey locations"
          );
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setStartLocation(coords);
        setRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      } catch {
        Alert.alert("Error", "Failed to get current location");
      }
    })();
  }, []);

  // Fetch route from OpenRouteService
  const fetchRoute = async (start: LatLng, end: LatLng) => {
    try {
      const res = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [start.longitude, start.latitude],
              [end.longitude, end.latitude],
            ],
          }),
        }
      );

      const data = await res.json();
      if (!data.features || !data.features[0]) {
        Alert.alert("Route Error", "Could not get route");
        return;
      }

      const line: LatLng[] = data.features[0].geometry.coordinates.map(
        (c: number[]) => ({ longitude: c[0], latitude: c[1] })
      );
      setRouteCoords(line);

      if (mapRef.current) {
        mapRef.current.fitToCoordinates(line, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch route");
    }
  };

  useEffect(() => {
    if (startLocation && endLocation) fetchRoute(startLocation, endLocation);
  }, [startLocation, endLocation]);

  // Calculate distance between two points
  const getDistanceFromLatLonInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Format distance and time
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    const km = Math.floor(meters / 1000);
    const m = Math.round(meters % 1000);
    return m > 0 ? `${km} km ${m} m` : `${km} km`;
  };

  const formatTime = (start: number, end: number) => {
    const totalSeconds = Math.floor((end - start) / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs} sec`;
  };

  // Journey completion handler
  const handleEndJourney = useCallback(
    async (distance: number) => {
      const endTime = Date.now();
      const timeTakenStr =
        journeyStartedAt !== null ? formatTime(journeyStartedAt, endTime) : "N/A";

      Alert.alert(
        "Journey Completed!",
        `Distance: ${formatDistance(distance)}\nTime Taken: ${timeTakenStr}`
      );

      if (!currentJourneyId) return;

      try {
        await updateJourney(currentJourneyId, {
          status: "completed",
          distance: Math.round(distance),
          timeTaken: Math.floor((endTime - (journeyStartedAt || endTime)) / 1000),
          endTime: new Date().toISOString(),
        });
       console.log("✅ Journey marked as completed:", currentJourneyId);

      // ✅ Navigate to success screen and pass data
      router.push({
        pathname: "/User/SuccessScreen",
        params: {
          distance: formatDistance(distance),
          timeTaken: timeTakenStr,
        },
      });
    } catch (err) {
      console.error("Error updating journey:", err);
    }
  },
  [journeyStartedAt, currentJourneyId]
);

  // ✅ Track actual user movement
  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;

    if (journeyStartedAt !== null) {
      const startWatcher = async () => {
        watcher = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Highest, distanceInterval: 1 },
          (loc) => {
            const newPoint = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            };

            setUserPath((prev) => {
              if (prev.length > 0) {
                const lastPoint = prev[prev.length - 1];
                const dist = getDistanceFromLatLonInMeters(
                  lastPoint.latitude,
                  lastPoint.longitude,
                  newPoint.latitude,
                  newPoint.longitude
                );
                setTotalDistance((prevDist) => prevDist + dist); // ✅ cumulative actual distance
              }
              return [...prev, newPoint];
            });

            // check if near end location
            if (endLocation) {
              const distanceToEnd = getDistanceFromLatLonInMeters(
                newPoint.latitude,
                newPoint.longitude,
                endLocation.latitude,
                endLocation.longitude
              );
              if (distanceToEnd < 20) {
                watcher?.remove();
                handleEndJourney(totalDistance + distanceToEnd);
              }
            }
          }
        );
      };
      startWatcher();
    }

    return () => {
      watcher?.remove();
    };
  }, [journeyStartedAt, endLocation, handleEndJourney, totalDistance]);

  const handleStartJourney = async () => {
    if (!startLocation || !endLocation || !purpose) {
      return Alert.alert("Please select end location and add purpose");
    }

    setJourneyStartedAt(Date.now());
    setUserPath([startLocation]); // start path
    setTotalDistance(0); // reset distance

    try {
      const res = await createJourney({
        title: `Journey: ${startLocation.latitude},${startLocation.longitude} → ${endLocation.latitude},${endLocation.longitude}`,
        description: notes,
        status: "ongoing",
        startLocation,
        endLocation,
        route: routeCoords,
        purpose,
        startTime: new Date().toISOString(),
      });

      if (res.error) return Alert.alert(res.error);
      setCurrentJourneyId(res._id);

      const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation.latitude},${startLocation.longitude}&destination=${endLocation.latitude},${endLocation.longitude}&travelmode=driving`;
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to start journey");
    }
  };
    // 🆕 Cancel button → Go to User Dashboard
  const handleCancel = () => {
    router.replace("/User/(tabs)/home");
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        
        <View style={{ height: 470, marginTop: 30, marginVertical: 10,borderColor:'black',borderWidth:1 }}>
          {region ? (
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={region}
              showsUserLocation
              showsMyLocationButton
              onPress={(e) => {
                setEndLocation(e.nativeEvent.coordinate);
                Alert.alert("End Location Set");
              }}
            >
              <UrlTile
                urlTemplate={`https://api.openrouteservice.org/mapsurfer/{z}/{x}/{y}.png?api_key=${OPENROUTE_API_KEY}`}
                maximumZ={19}
                flipY={false}
              />
              {startLocation && (
                <Marker coordinate={startLocation} title="Start" pinColor="green" />
              )}
              {endLocation && (
                <Marker coordinate={endLocation} title="End" pinColor="red" />
              )}
              {routeCoords.length > 0 && (
                <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={4} />
              )}
              {userPath.length > 1 && (
                <Polyline coordinates={userPath} strokeColor="red" strokeWidth={3} /> // ✅ show actual traveled path
              )}
            </MapView>
          ) : (
            <Text>Loading map...</Text>
          )}
        </View>

        <Text>
          Start:{" "}
          {startLocation
            ? `${startLocation.latitude}, ${startLocation.longitude}`
            : "Loading"}
        </Text>
        <Text>
          End:{" "}
          {endLocation
            ? `${endLocation.latitude}, ${endLocation.longitude}`
            : "Tap map"}
        </Text>

        <TextInput
          placeholder="Purpose"
          value={purpose}
          onChangeText={setPurpose}
          style={styles.input}
        />
        <TextInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleStartJourney} style={styles.buttonBlack}>
          <Text style={styles.buttonText}>Start Journey</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/User/(tabs)/home")} style={styles.buttonGray}>
  <Text style={styles.buttonText}>Cancel</Text>
</TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5 },
  buttonBlack: { backgroundColor: "black", padding: 14, borderRadius: 6, marginVertical: 5 },
  buttonGray: { backgroundColor: "gray", padding: 14, borderRadius: 6, marginVertical: 5 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});