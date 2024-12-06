import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const DashboardPage = ({ navigation }) => {
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
        <Text style={styles.userEmail}>oliversmith@gmail.com</Text>
      </View>

      {/* Icon Row Inside a Box */}
      <View style={styles.iconBox}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="time-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="play-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="card-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="close-circle-outline" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      {/* Tutor Sessions Section */}
      <Text style={styles.sectionTitle}>Tutor Sessions</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pending')}>
          <MaterialIcons name="pending-actions" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Pending Sessions</Text>
            <Text style={styles.cardCount}>2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ViewTutees')}>
          <Ionicons name="people-outline" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>View Tutees</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
          <Ionicons name="calendar-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TutorSub')}>
          <Ionicons name="book-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#808080" />
        </TouchableOpacity>
        {/* New Subject Icon */}
        
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
  userEmail: { fontSize: 16, color: '#003366', fontWeight: 'bold' },
  iconBox: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: '#f1f1f1', 
    padding: 10, 
    borderRadius: 10, 
    marginBottom: 20 
  },
  iconButton: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 10, padding: 20, alignItems: 'center', marginHorizontal: 5 },
  cardText: { marginTop: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  cardCount: { fontSize: 16, color: '#003366' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#f1f1f1', },
});

export default DashboardPage;
