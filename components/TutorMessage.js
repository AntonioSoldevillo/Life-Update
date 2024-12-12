import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TutorMessage = ({ navigation }) => {
  // Dummy message data
  const messages = [
    { id: '1', sender: 'Bobby John', message: 'Hi, I need help with calculus.', time: '10:00 AM' },
    { id: '2', sender: 'Maria Ganohay', message: 'Can you explain the last lesson?', time: '11:30 AM' },
    { id: '3', sender: 'Rex Lumantao', message: 'I have a question about the project.', time: '2:15 PM' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageCard}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />

      {/* Bottom Navigation Bar */}
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
                <Ionicons name="settings-outline" size={24} color="#808080" />
              </TouchableOpacity>
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, marginTop:30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 10,
  },
  messageList: {
    paddingBottom: 60, // To avoid overlap with bottom nav
  },
  messageCard: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  sender: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  message: {
    fontSize: 14,
    color: '#003366',
    marginVertical: 5,
  },
  time: {
    fontSize: 12,
    color: '#808080',
    textAlign: 'right',
  },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: '#f1f1f1' },
});

export default TutorMessage;
