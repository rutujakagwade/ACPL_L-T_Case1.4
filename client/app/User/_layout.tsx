import { Stack } from 'expo-router';

const UserLayout = () => {
  return (
    <Stack>

      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />

           {/* Hide header for New Journey screen */}
      <Stack.Screen 
        name="newjourney" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
};




export default UserLayout;