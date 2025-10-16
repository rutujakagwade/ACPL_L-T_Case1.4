import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const CustomTabBar = () => {
  return (
    <View style={styles.container}>
      <Link href="/Admin/(tabs)/home" asChild>
        <TouchableOpacity style={styles.tab}>
          <FontAwesome name="home" size={24} />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/Admin/(tabs)/memberList" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="people" size={24}  />
          <Text style={styles.tabText}>Members</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/Admin/(tabs)/pendingApproval" asChild>
        <TouchableOpacity style={styles.tab}>
          <MaterialIcons name="pending-actions" size={24}  />
          <Text style={styles.tabText}>Approval</Text>
        </TouchableOpacity>
      </Link>
      
      <Link href="/Admin/(tabs)/adminProfile" asChild>
        <TouchableOpacity style={styles.tab}>
          <Ionicons name="person-circle" size={24}  />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;