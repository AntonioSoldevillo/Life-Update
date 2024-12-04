import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TutorsPage = ({ route, navigation }) => {
  const { subjectTitle } = route.params; // Get the subject from navigation params

  const tutors = [
    { 
      name: 'Oliver Smith', 
      availableTime: 'MON~THUR\n01:00PM ~ 05:00PM', 
      rate: '₱ 100/Hour', 
      image: require('../assets/oliver.png'), // Image for Oliver Smith
      id: 2
    },
    { 
      name: 'Maria G.', 
      availableTime: 'MON~THUR\n01:00PM ~ 05:00PM', 
      rate: '₱ 100/Hour', 
      image: require('../assets/maria.jpg'), // Image for Maria G.
      id: 3
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tutors for {subjectTitle}</Text>
      </View>

      {/* Scrollable list of tutors */}
      <ScrollView>
        {tutors.map((tutor, index) => (
          <View key={index} style={styles.tutorCard}>
            <View style={styles.cardContent}>
              <Image source={tutor.image} style={styles.tutorImage} />
              <Text style={styles.tutorName}>{tutor.name}</Text>
              <Text style={styles.tutorAvailable}>Available time: {tutor.availableTime}</Text>
              <Text style={styles.tutorRate}>{tutor.rate}</Text>
            </View>

            {/* Book Button */}
            <TouchableOpacity 
              style={styles.bookButton}
              onPress={() => 
                navigation.navigate('Booking', { 
                  tutorId: tutor.id,  // Pass tutor ID
                  tutorName: tutor.name, 
                  subjectTitle
                })
              }
            >
              <Text style={styles.buttonText}>Book Tutor</Text>
            </TouchableOpacity>

            {/* View Tutor Details Button */}
            <TouchableOpacity 
              style={styles.viewDetailsButton} 
              onPress={() => navigation.navigate('TutorDetails', { tutorName: tutor.name })}
            >
              <Text style={styles.buttonText}>View Tutor Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
          <Ionicons name="home-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="book-outline" size={24} color="#003366" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="chatbubble-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#808080" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginLeft: 10,
  },
  tutorCard: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#003366',
    alignItems: 'center', // Center everything inside the card
  },
  cardContent: {
    alignItems: 'center', // Center the image and text horizontally
    justifyContent: 'center', // Center them vertically
  },
  tutorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
  },
  tutorAvailable: {
    color: '#808080',
    textAlign: 'center', // Center align text
  },
  tutorRate: {
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center', // Center align text
  },
  bookButton: {
    marginTop: 10,
    backgroundColor: '#003366',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 5,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
});

export default TutorsPage;
