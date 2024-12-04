import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';

const DashboardPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          <Text style={styles.logoPrimary}>Tutor</Text>
          <Text style={styles.logoSecondary}>Link</Text>
        </Text>
        <Ionicons name="notifications-outline" size={28} color="#003366" />
      </View>

      <View style={styles.userInfo}>
        <Image
          source={require('../assets/profile.jpg')}
          style={styles.profileImage}
        />
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hi!</Text>
          <Text style={styles.userName}>Antonio C. Soldevillo</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <TextInput placeholder="Search Subjects" style={styles.searchInput} />
        <Ionicons name="search" size={20} color="#808080" style={styles.searchIcon} />
      </View>

      <Text style={styles.sectionTitle}>Tutor Sessions</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pending')}>
          <MaterialIcons name="pending-actions" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Pending Sessions</Text>
            <Text style={styles.cardCount}>2</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <FontAwesome name="line-chart" size={32} color="#003366" />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Top Tutors</Text>
            <Text style={styles.cardCount}>10+</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Subjects')}>
          <Ionicons name="book-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
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
  userInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 100, marginRight: 10, borderWidth: 1, borderColor: '#003366' },
  greeting: { backgroundColor: '#FFCC00', borderRadius: 10, padding: 10 },
  greetingText: { fontSize: 16, color: '#003366' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#003366' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f1f1', borderRadius: 10, paddingHorizontal: 10, marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 16 },
  searchIcon: { marginLeft: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  card: { flex: 1, backgroundColor: '#f1f1f1', borderRadius: 10, padding: 20, alignItems: 'center', marginHorizontal: 5 },
  cardText: { marginTop: 10, alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  cardCount: { fontSize: 16, color: '#003366' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
});

export default DashboardPage;
