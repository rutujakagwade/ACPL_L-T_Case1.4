import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const UserTabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,       // 🔹 Hides header
        tabBarShowLabel: false,   // 🔹 Hides tab titles
        tabBarStyle: {
          backgroundColor: 'transparent', // 🔹 Transparent background
          borderTopWidth: 0,              // 🔹 Removes top border
          elevation: 0,                   // 🔹 Removes Android shadow
          shadowOpacity: 0,               // 🔹 Removes iOS shadow
        },
        tabBarActiveTintColor: '#2563eb', // Active icon color
        tabBarInactiveTintColor: 'gray',  // Inactive icon color
      }}
    >
      {/* Home */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Journey History */}
      <Tabs.Screen
        name="JourneyHistory"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Expenses */}
      <Tabs.Screen
        name="Expenses"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default UserTabLayout;
