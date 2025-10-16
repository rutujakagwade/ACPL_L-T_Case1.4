import { Stack } from 'expo-router';

const AdminLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 🔹 Hides default header
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addMember"
        options={{
          headerTitle: 'Add New Member',
          headerBackTitle: 'Back'
        }} 
      />
      <Stack.Screen
        name="admineditprofile"
        options={{
          headerTitle: 'Edit Profile',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="expensedetails"
        options={{
          headerTitle: 'Expense Details',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="memberprofile"
        options={{
          headerTitle: 'Member Profile',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="bulkapproval"
        options={{
          headerTitle: 'Bulk Approval',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen
        name="rejectedexpense"
        options={{
          headerTitle: 'Rejected Expenses',
          headerBackTitle: 'Back'
        }}
      />
    </Stack>
  );
};

export default AdminLayout;
