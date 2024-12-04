import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import the Ionicons library

const Pending = ({ navigation }) => {
  // Sample data for pending sessions
  const pendingSessions = [
    {
      id: '1',
      tutor: 'Oliver Smith',
      subject: 'Introduction To Computing',
      time: '10:00 AM - 11:00 AM, Dec 5, 2024',
    },
    {
      id: '2',
      tutor: 'Maria G.',
      subject: 'Computer Programming',
      time: '2:00 PM - 3:00 PM, Dec 6, 2024',
    },
  ];

  const renderSession = ({ item }) => (
    <View style={styles.sessionCard}>
      <Text style={styles.tutorName}>{item.tutor}</Text>
      <Text style={styles.subject}>{item.subject}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Sessions</Text>
      </View>

      {/* List of Pending Sessions */}
      <FlatList
        data={pendingSessions}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.noSessions}>No pending sessions</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
  },
  listContainer: {
    paddingBottom: 20,
  },
  sessionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  subject: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  time: {
    fontSize: 14,
    color: '#777',
  },
  noSessions: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default Pending;
