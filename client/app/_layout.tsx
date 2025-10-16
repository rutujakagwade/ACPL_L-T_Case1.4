import { Stack } from 'expo-router'
import "../global.css"

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShown: false,
          title: 'Home'
        }}
      />
      <Stack.Screen
        name='Admin'
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name='User'
        options={{
          headerShown: false
        }}
      />
    </Stack>
  )
}

export default _layout