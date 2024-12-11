import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient'; // Import supabase client

const TutorSettings = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    // Show confirmation alert
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel", // If the user presses Cancel, do nothing
          style: "cancel"
        },
        {
          text: "OK", // If the user presses OK, log them out
          onPress: async () => {
            // Log the user out from Supabase
            await supabase.auth.signOut();

            // Navigate to the LoginPage
            navigation.navigate('Login');
          }
        }
      ]
    );
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // You can add logic here to apply the dark mode theme globally
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      {/* Header with Back Arrow and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Language Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Language</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Profile Picture Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Profile Picture</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Account Settings Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Account Settings</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Security Settings Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Security</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Privacy Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Feedback Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Feedback</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Notifications Section */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Schedule Management Section (Specific for Tutors) */}
        <View style={styles.settingSection}>
          <Text style={styles.optionText}>Manage Schedule</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </View>

        {/* Logout Section */}
        <TouchableOpacity style={styles.settingSection} onPress={handleLogout}>
          <Text style={styles.optionText}>Log Out</Text>
          <Ionicons name="chevron-forward" size={20} color="#003366" />
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => navigation.navigate('TutorDashboard')}>
          <Ionicons name="home-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TutorProfile')}>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TutorSchedule')}>
          <Ionicons name="calendar-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TutorSub')}>
          <Ionicons name="book-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TutorSettings')}>
          <Ionicons name="settings-outline" size={24} color="#003366" />
        </TouchableOpacity>
        {/* New Subject Icon */}
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 100, // Ensure space for the bottom nav
  },
  settingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#003366',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#003366',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 19,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
});

export default TutorSettings;
