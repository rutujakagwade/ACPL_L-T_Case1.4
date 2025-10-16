import { Tabs } from 'expo-router';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const Tabroot = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,       // 🔹 Hides default header
        tabBarShowLabel: false,   // 🔹 Hides titles under icons
        tabBarStyle: {
          backgroundColor: 'transparent', // 🔹 Removes white bg
          borderTopWidth: 0, // 🔹 Removes border line
          elevation: 0,      // 🔹 Removes shadow on Android
          shadowOpacity: 0,  // 🔹 Removes shadow on iOS
        },
        tabBarActiveTintColor: '#2563eb', // Active icon color
        tabBarInactiveTintColor: 'gray',  // Inactive icon color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="memberList"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="pendingApproval"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pending-actions" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="adminProfile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Tabroot;
