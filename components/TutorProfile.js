import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // To use the back arrow icon

const TutorProfile = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileContainer}>
          <Image source={require('../assets/oliver.png')} style={styles.profileImage} />
          <Text style={styles.name}>Oliver Smith</Text>
          <Text style={styles.subject}>Math Tutor</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <View style={styles.box}>
            <Text style={styles.text}>
              I have been teaching math for over 5 years, specializing in algebra and calculus. I enjoy helping students
              develop a strong foundation in mathematics and building their confidence.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Contact</Text>
          <View style={styles.box}>
            <Text style={styles.text}>Email: oliver@tutorlink.com</Text>
            <Text style={styles.text}>Phone: +63 912 345 6789</Text>
          </View>

          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.box}>
            <Text style={styles.text}>Monday - Friday: 10:00 AM - 4:00 PM</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('TutorDashboard')}>
          <Ionicons name="home-outline" size={24} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#003366" />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 100, 
    marginTop:30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color:'#003366',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f4f4f4',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#003366',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'#003366',
  },
  subject: {
    fontSize: 18,
    color: 'gray',
  },
  detailsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#003366',
  },
  box: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: 'gray',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TutorProfile;
