import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import supabase from '../src/supabaseClient'; // Ensure the correct path

const DashboardPage = ({ navigation }) => {
  const [userData, setUserData] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the logged-in user's ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const userId = user.id;

        // Fetch tutor's details (name and email)
        const { data: tutorData, error: tutorError } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', userId)
          .single(); // Assuming the user ID is unique
        
        if (tutorError) throw tutorError;

        // Set the user's data (name and email)
        setUserData({ name: tutorData.full_name, email: tutorData.email });
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>Tutor</Text>
          <Text style={styles.logoSecondary}>Link</Text>
        </Text>
        <Ionicons name="notifications-outline" size={28} color="#003366" />
      </View>

      {/* User Info Section */}
      <View style={styles.userInfo}>
        <Image
          source={require('../assets/oliver.png')}  // Add your profile image here
          style={styles.profileImage}
        />
        {/* Display the logged-in tutor's name and email */}
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      {/* Tutor Sessions Section */}
      <Text style={styles.sectionTitle}>Tutor Sessions</Text>
      
      {/* Swap Messages and My Subjects */}
      <View style={styles.cardsRow}>
        {/* My Subjects Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MySubjectsDashboard')}>
          <Ionicons name="book" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>My Subjects</Text>
          </View>
        </TouchableOpacity>

        {/* Messages Card */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TutorMessage')}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Messages</Text>
            <Text style={styles.cardCount}>3</Text> {/* Adjust the count dynamically */}
          </View>
        </TouchableOpacity>
      </View>

      {/* Booking Request Card in the same row */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pending')}>
          <MaterialIcons name="pending-actions" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Booking Request</Text>
            <Text style={styles.cardCount}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#003366" />
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
          <Ionicons name="settings-outline" size={24} color="#808080" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -10, marginTop: 50 },
  logoText: { fontSize: 24, fontWeight: 'bold' },
  logoPrimary: { color: '#003366' },
  logoSecondary: { color: '#FFCC00' },
  userInfo: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 100, marginBottom: 10, borderWidth: 1, borderColor: '#003366' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  userEmail: { fontSize: 16, color: '#003366' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  card: { 
    flex: 1, 
    backgroundColor: '#f1f1f1', 
    borderRadius: 10, 
    padding: 20, 
    alignItems: 'center', 
    marginHorizontal: 5,
    marginTop: -30
  },
  cardText: { marginTop: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  cardCount: { fontSize: 16, color: '#003366' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
});

export default DashboardPage;
